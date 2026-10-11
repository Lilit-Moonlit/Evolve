import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocations, withLegacyOption } from "../lib/locations";
import {
  DEFAULT_LOCAL_CHAT_GROUP_LABEL_KEYS,
  DEFAULT_LOCAL_CHAT_GROUPS,
  type LocalChatMessage,
  type StoredLocalChatGroup,
  canAccessGroup,
  cityKeyOf,
  hasRequestedJoin,
  isGroupAdmin,
  mergeLocalChatMessages,
  sortLocalChatMessages,
  validateGroupName,
  validateLocalChatMessage,
} from "../lib/local-chat";
import { localChatNostr } from "../lib/local-chat-nostr";

/** Selection state is owned by the Chat page (it also renders the sidebar
 *  hint) and persisted there — LocalChat is controlled for selection. */
export interface LocalChatSelection {
  country: string;
  city: string;
  groupId: string;
}

/** Minimal structural shape LocalChat needs (AppContext's myProfile is a
 *  narrower type than ProfileData, so we depend only on what we use). */
interface LocalChatMe {
  id: string;
  name: string;
}

interface LocalChatPeer {
  id: string;
  name: string;
}

interface LocalChatProps {
  myProfile: LocalChatMe;
  profiles: LocalChatPeer[];
  selection: LocalChatSelection;
  onSelectionChange: (selection: LocalChatSelection) => void;
}

interface WsChatFrame {
  type: "message" | "history" | "typing" | "joined" | "user_joined" | "user_left";
  id?: string;
  senderId?: string;
  senderName?: string;
  text?: string;
  timestamp?: string;
  messages?: Array<
    Omit<LocalChatMessage, "createdAt"> & { createdAt?: string; timestamp?: string }
  >;
  username?: string;
  userId?: string;
}

const selectClass =
  "px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none max-w-[11rem]";

/** City-scoped "Місцевий чат" — Nostr relay is primary, with the existing
 *  HTTP/WS channel retained as a fallback when no city relay is reachable. */
export default function LocalChat({
  myProfile,
  profiles,
  selection,
  onSelectionChange,
}: LocalChatProps) {
  const { t } = useTranslation();
  const locations = useLocations();

  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [groups, setGroups] = useState<StoredLocalChatGroup[]>([]);
  const [connected, setConnected] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupType, setNewGroupType] = useState<"public" | "closed">("public");
  const [createError, setCreateError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nostrActiveRef = useRef(false);
  const fallbackRef = useRef<(() => Promise<void>) | null>(null);

  const { country, city, groupId } = selection;
  const cityKey = cityKeyOf(country, city);
  const ready = country.trim().length > 0 && city.trim().length > 0;

  const selectedGroup = groups.find((g) => g.id === groupId) ?? null;
  const accessible = !selectedGroup || canAccessGroup(selectedGroup, myProfile.id);
  const joinPending = selectedGroup ? hasRequestedJoin(selectedGroup, myProfile.id) : false;
  const isAdmin = selectedGroup ? isGroupAdmin(selectedGroup, myProfile.id) : false;

  // --- Nostr is the primary room transport; the existing API/WS is fallback. ---
  useEffect(() => {
    if (!ready) {
      setMessages([]);
      setGroups([]);
      setConnected(false);
      nostrActiveRef.current = false;
      return;
    }
    let cancelled = false;
    let nostrUnsubscribe: (() => void) | null = null;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let fallbackStarted = false;

    setMessages([]);
    setGroups([]);
    setConnected(false);

    const loadFallback = async () => {
      try {
        const [msgRes, grpRes] = await Promise.all([
          fetch(
            `/api/localchat?city=${encodeURIComponent(cityKey)}&group=${encodeURIComponent(groupId)}`,
            {
              credentials: "include",
            },
          ),
          fetch(`/api/localchat/groups?city=${encodeURIComponent(cityKey)}`, {
            credentials: "include",
          }),
        ]);
        if (cancelled) return;
        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(sortLocalChatMessages(Array.isArray(data.messages) ? data.messages : []));
        }
        if (grpRes.ok) {
          const data = await grpRes.json();
          setGroups(Array.isArray(data.groups) ? data.groups : []);
        }
      } catch (e) {
        console.warn("local chat history fetch failed", e);
      }
    };

    const connectFallbackSocket = () => {
      if (cancelled) return;
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
      socket.onopen = () => {
        if (cancelled || !socket) return;
        setConnected(true);
        socket.send(
          JSON.stringify({
            type: "join_local",
            userId: myProfile.id,
            username: myProfile.name,
            city: cityKey,
            group: groupId,
          }),
        );
      };
      socket.onmessage = (event) => {
        if (cancelled) return;
        try {
          const data: WsChatFrame = JSON.parse(event.data as string);
          if (data.type === "history" && Array.isArray(data.messages)) {
            // History frames carry {timestamp}, not {createdAt} — normalize.
            setMessages(
              sortLocalChatMessages(
                data.messages.map((m) => ({
                  id: m.id ?? "",
                  cityKey,
                  groupId,
                  senderId: m.senderId ?? "",
                  senderName: m.senderName ?? "",
                  text: m.text ?? "",
                  createdAt: m.timestamp ?? m.createdAt ?? "",
                })),
              ),
            );
          } else if (data.type === "message" && data.id && data.senderId) {
            // Own broadcasts are ignored — the POST response already appended.
            if (data.senderId !== myProfile.id) {
              setMessages((prev) =>
                sortLocalChatMessages(
                  mergeLocalChatMessages(prev, [
                    {
                      id: data.id ?? "",
                      cityKey,
                      groupId,
                      senderId: data.senderId ?? "",
                      senderName: data.senderName ?? "",
                      text: data.text ?? "",
                      createdAt: data.timestamp ?? "",
                    },
                  ]),
                ),
              );
            }
          } else if (data.type === "typing" && data.userId !== myProfile.id) {
            setTypingUser(String(data.username || ""));
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => setTypingUser(null), 3000);
          }
        } catch (e) {
          console.warn("local chat ws parse error", e);
        }
      };
      socket.onclose = () => {
        setConnected(false);
        if (!cancelled) reconnectTimer = setTimeout(connectFallbackSocket, 3000);
      };
    };

    const activateFallback = async () => {
      if (fallbackStarted || cancelled) return;
      fallbackStarted = true;
      nostrActiveRef.current = false;
      nostrUnsubscribe?.();
      nostrUnsubscribe = null;
      await loadFallback();
      connectFallbackSocket();
    };
    fallbackRef.current = activateFallback;

    const startNostr = async () => {
      try {
        await localChatNostr.setProfileIdentity(myProfile.id).catch(() => undefined);
        nostrActiveRef.current = true;
        const stop = await localChatNostr.subscribe(cityKey, groupId, (event) => {
          void localChatNostr.messageFromEvent(event, cityKey, groupId).then((incoming) => {
            if (incoming) {
              setMessages((previous) =>
                sortLocalChatMessages(mergeLocalChatMessages(previous, [incoming])),
              );
            }
          });
          setGroups(localChatNostr.listGroups(cityKey, myProfile.id));
        });
        if (cancelled) {
          stop();
          return;
        }
        nostrUnsubscribe = stop;
        nostrActiveRef.current = true;
        setGroups(localChatNostr.listGroups(cityKey, myProfile.id));
        setConnected(true);
      } catch (e) {
        console.warn("local chat Nostr relay unavailable; using HTTP fallback", e);
        await activateFallback();
      }
    };

    void startNostr();
    return () => {
      cancelled = true;
      nostrActiveRef.current = false;
      if (fallbackRef.current === activateFallback) fallbackRef.current = null;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      nostrUnsubscribe?.();
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, [cityKey, groupId, ready, myProfile.id, myProfile.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const refreshGroups = async () => {
    if (nostrActiveRef.current) {
      setGroups(localChatNostr.listGroups(cityKey, myProfile.id));
      return;
    }
    try {
      const res = await fetch(`/api/localchat/groups?city=${encodeURIComponent(cityKey)}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(Array.isArray(data.groups) ? data.groups : []);
      }
    } catch (e) {
      console.warn("local chat groups refresh failed", e);
    }
  };

  const handleSend = async () => {
    if (!ready || !accessible || sending) return;
    const text = messageText.trim();
    if (validateLocalChatMessage(text)) return;
    setSending(true);
    try {
      if (nostrActiveRef.current) {
        const created = await localChatNostr.publish(cityKey, groupId, {
          senderId: myProfile.id,
          senderName: myProfile.name,
          text,
        });
        setMessages((prev) => sortLocalChatMessages(mergeLocalChatMessages(prev, [created])));
        setMessageText("");
        return;
      }
      const res = await fetch("/api/localchat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityKey,
          group: groupId,
          text,
          senderName: myProfile.name,
        }),
      });
      if (res.ok) {
        const created: LocalChatMessage = await res.json();
        setMessages((prev) => sortLocalChatMessages(mergeLocalChatMessages(prev, [created])));
        setMessageText("");
      }
    } catch (e) {
      console.warn("local chat send failed", e);
      if (nostrActiveRef.current) {
        await fallbackRef.current?.();
        try {
          const res = await fetch("/api/localchat", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              city: cityKey,
              group: groupId,
              text,
              senderName: myProfile.name,
            }),
          });
          if (res.ok) {
            const created: LocalChatMessage = await res.json();
            setMessages((prev) => sortLocalChatMessages(mergeLocalChatMessages(prev, [created])));
            setMessageText("");
          }
        } catch (fallbackError) {
          console.warn("local chat HTTP fallback send failed", fallbackError);
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleCreateGroup = async () => {
    if (!ready || busy) return;
    const name = newGroupName.trim();
    if (validateGroupName(name)) return;
    setBusy(true);
    try {
      if (nostrActiveRef.current) {
        const group = await localChatNostr.createGroup(cityKey, name, newGroupType, myProfile.id);
        setGroups((previous) => [...previous.filter((item) => item.id !== group.id), group]);
        onSelectionChange({ ...selection, groupId: group.id });
        setCreateOpen(false);
        setNewGroupName("");
        setCreateError(null);
        return;
      }
      const res = await fetch("/api/localchat/groups", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityKey, name, type: newGroupType }),
      });
      if (res.status === 409) {
        setCreateError(t("localChat.groupNameExists"));
        return;
      }
      if (res.ok) {
        const group: StoredLocalChatGroup = await res.json();
        await refreshGroups();
        onSelectionChange({ ...selection, groupId: group.id });
        setCreateOpen(false);
        setNewGroupName("");
        setCreateError(null);
      }
    } catch (e) {
      console.warn("local chat group create failed", e);
      if (nostrActiveRef.current) {
        await fallbackRef.current?.();
        try {
          const res = await fetch("/api/localchat/groups", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: cityKey, name, type: newGroupType }),
          });
          if (res.status === 409) {
            setCreateError(t("localChat.groupNameExists"));
            return;
          }
          if (res.ok) {
            const group: StoredLocalChatGroup = await res.json();
            await refreshGroups();
            onSelectionChange({ ...selection, groupId: group.id });
            setCreateOpen(false);
            setNewGroupName("");
            setCreateError(null);
          }
        } catch (fallbackError) {
          console.warn("local chat HTTP fallback group create failed", fallbackError);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRequestJoin = async () => {
    if (!selectedGroup || busy) return;
    setBusy(true);
    try {
      if (nostrActiveRef.current) {
        await localChatNostr.requestJoin(cityKey, selectedGroup.id, myProfile.id);
        await refreshGroups();
        return;
      }
      await fetch("/api/localchat/groups/join", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: selectedGroup.id }),
      });
      await refreshGroups();
    } catch (e) {
      console.warn("local chat join request failed", e);
      if (nostrActiveRef.current) {
        await fallbackRef.current?.();
        try {
          await fetch("/api/localchat/groups/join", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupId: selectedGroup.id }),
          });
          await refreshGroups();
        } catch (fallbackError) {
          console.warn("local chat HTTP fallback join request failed", fallbackError);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const handleResolveJoin = async (userId: string, approve: boolean) => {
    if (!selectedGroup || busy) return;
    setBusy(true);
    try {
      if (nostrActiveRef.current) {
        await localChatNostr.resolveJoin(cityKey, selectedGroup.id, userId, approve);
        await refreshGroups();
        return;
      }
      await fetch("/api/localchat/groups/resolve", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: selectedGroup.id, userId, approve }),
      });
      await refreshGroups();
    } catch (e) {
      console.warn("local chat join resolve failed", e);
      if (nostrActiveRef.current) {
        await fallbackRef.current?.();
        try {
          await fetch("/api/localchat/groups/resolve", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupId: selectedGroup.id, userId, approve }),
          });
          await refreshGroups();
        } catch (fallbackError) {
          console.warn("local chat HTTP fallback join resolve failed", fallbackError);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const countryOptions = locations
    ? locations.countries.map((c) => ({
        value: c,
        label: locations.isoFor(c) ? `${locations.isoFor(c)} — ${c}` : c,
      }))
    : country
      ? [{ value: country, label: country }]
      : [];

  const cityOptions = locations
    ? withLegacyOption(locations.citiesFor(country), city)
    : city
      ? [city]
      : [];

  const memberName = (userId: string) => profiles.find((p) => p.id === userId)?.name ?? userId;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Filters header — centered, like the language selector pattern */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <select
            aria-label={t("localChat.country")}
            value={country}
            onChange={(e) => onSelectionChange({ ...selection, country: e.target.value, city: "" })}
            className={selectClass}
            disabled={!locations}
          >
            {country && !countryOptions.some((o) => o.value === country) && (
              <option value={country}>{country}</option>
            )}
            {countryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            aria-label={t("localChat.city")}
            value={city}
            onChange={(e) => onSelectionChange({ ...selection, city: e.target.value })}
            className={selectClass}
            disabled={!country || !locations}
          >
            {!city && (
              <option value="">
                {locations ? t("localChat.selectCity") : t("localChat.loadingCities")}
              </option>
            )}
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            aria-label={t("localChat.group")}
            value={groupId}
            onChange={(e) => onSelectionChange({ ...selection, groupId: e.target.value })}
            className={selectClass}
          >
            {DEFAULT_LOCAL_CHAT_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {t(DEFAULT_LOCAL_CHAT_GROUP_LABEL_KEYS[g.id])}
              </option>
            ))}
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.type === "closed" ? "🔒 " : ""}
                {g.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCreateOpen((prev) => !prev)}
            title={t("localChat.createGroup")}
            aria-label={t("localChat.createGroup")}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-white transition-colors"
          >
            +
          </button>
          {isAdmin && (
            <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
              {t("localChat.admin")}
            </span>
          )}
        </div>

        {createOpen && (
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder={t("localChat.groupName")}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-56"
            />
            <label className="flex items-center gap-1 text-sm text-gray-600">
              <input
                type="radio"
                name="local-chat-group-type"
                checked={newGroupType === "public"}
                onChange={() => setNewGroupType("public")}
              />
              {t("localChat.groupType.public")}
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-600">
              <input
                type="radio"
                name="local-chat-group-type"
                checked={newGroupType === "closed"}
                onChange={() => setNewGroupType("closed")}
              />
              {t("localChat.groupType.closed")}
            </label>
            <button
              type="button"
              onClick={() => void handleCreateGroup()}
              disabled={busy || !ready}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              {t("localChat.create")}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreateOpen(false);
                setCreateError(null);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {t("localChat.cancel")}
            </button>
            {createError && <span className="text-xs text-red-600">{createError}</span>}
          </div>
        )}
      </div>

      {/* Admin: pending join requests */}
      {isAdmin && selectedGroup && selectedGroup.pending.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100 bg-amber-50">
          <p className="text-xs font-medium text-amber-800 mb-1">{t("localChat.pendingMembers")}</p>
          <div className="flex flex-col gap-1">
            {selectedGroup.pending.map((uid) => (
              <div key={uid} className="flex items-center gap-2 text-sm">
                <span className="text-gray-700 truncate">{memberName(uid)}</span>
                <button
                  type="button"
                  onClick={() => void handleResolveJoin(uid, true)}
                  disabled={busy}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  {t("localChat.approve")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleResolveJoin(uid, false)}
                  disabled={busy}
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  {t("localChat.decline")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!ready ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 h-full">
            <p>{t("localChat.selectCity")}</p>
          </div>
        ) : !accessible ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full gap-3">
            <p className="text-sm text-center">🔒 {t("localChat.closedGroup")}</p>
            {joinPending ? (
              <span className="text-xs text-gray-400">{t("localChat.pendingApproval")}</span>
            ) : (
              <button
                type="button"
                onClick={() => void handleRequestJoin()}
                disabled={busy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                {t("localChat.requestJoin")}
              </button>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 h-full">
            <p>{t("localChat.noMessages")}</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.senderId === myProfile.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 ${
                  m.senderId === myProfile.id
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {m.senderId !== myProfile.id && (
                  <p className="text-xs font-semibold text-gray-600 mb-0.5">{m.senderName}</p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                <div
                  className={`text-xs mt-1 ${m.senderId === myProfile.id ? "text-blue-200" : "text-gray-400"}`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Typing indicator + connection status */}
      <div className="px-4 py-1 text-xs h-5 flex items-center justify-between">
        <span className="text-gray-400 italic">
          {typingUser ? `${typingUser} ${t("localChat.typing")}` : ""}
        </span>
        <span className="inline-flex items-center gap-1 text-gray-400">
          <span
            className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}
          />
        </span>
      </div>

      {/* Input */}
      {ready && accessible && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("localChat.inputPlaceholder")}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!messageText.trim() || sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
            >
              {t("chat.send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
