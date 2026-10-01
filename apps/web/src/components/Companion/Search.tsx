import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  readLabPatients,
  mapLabPatientsToSearchable,
  mapCompanionRecordsToSearchable,
  SearchablePatient,
} from "./lib/companion-storage";
import { listCompanionPatients } from "./lib/companion-api";

export const Search: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStdCompatible, setFilterStdCompatible] = useState(false);
  const [users, setUsers] = useState<SearchablePatient[]>([]);
  const [myUserId, setMyUserId] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("companion_user_id") || "";
    setMyUserId(userId);

    // Показуємо реальних зареєстрованих пацієнтів: спершу з сервера
    // (крос-девайсно), потім fallback на локальний список лабораторії.
    let cancelled = false;
    listCompanionPatients()
      .then((records) => {
        if (cancelled) return;
        const fromServer = mapCompanionRecordsToSearchable(records);
        setUsers(
          fromServer.length > 0 ? fromServer : mapLabPatientsToSearchable(readLabPatients()),
        );
      })
      .catch(() => {
        if (!cancelled) setUsers(mapLabPatientsToSearchable(readLabPatients()));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    if (user.id === myUserId) return false;
    if (filterStdCompatible && !user.stdCompatible) return false;
    if (
      searchTerm &&
      user.location &&
      !user.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleChat = (userId: string) => {
    navigate(`/companion/chat/${userId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.profile.searchUsers")}</h1>
          <button
            onClick={() => navigate("/companion/profile")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("companion.profile.location")}
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filterStdCompatible}
              onChange={(e) => setFilterStdCompatible(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-white">{t("companion.profile.stdCompatible")}</span>
          </label>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  {user.location && <p className="text-xs text-slate-400">{user.location}</p>}
                  {user.stdCompatible && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {t("companion.profile.stdCompatible")}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleChat(user.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
              >
                {t("companion.profile.chat")}
              </button>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-slate-400">{t("companion.profile.noUsers")}</div>
        )}
      </div>
    </div>
  );
};

export default Search;
