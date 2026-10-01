import React, { useState, useEffect } from "react";

import { FaUser, FaStar, FaShieldAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAppState } from "../store/AppContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ProfileData } from "../store/AppContext";
import { getCompatibilityLabel } from "../lib/std-parser";
import VerificationModal from "../components/VerificationModal";
import KindSelectModal from "../components/KindSelectModal";
import PhotoView from "../components/PhotoView";
import InfoProposalIcons from "../components/InfoProposalIcons";
import { useAccount, useReadContract } from "wagmi";
import { TrustScoreABI } from "../lib/abi/TrustScoreABI";
import { TRUST_SCORE_ADDRESS } from "../lib/addresses";
import {
  getWhoSearchOptions,
  matchesWhoSearch,
  WhatSearchPurpose,
  WhoSearchOption,
} from "../lib/looking-for";
import { isLaboratoryProfile, kindToGender } from "../lib/profile-kind";
import { matchesCanTravel } from "../lib/can-travel";
import { LANGUAGES, languageName } from "../lib/languages";
import { useLocations, withLegacyOption } from "../lib/locations";

const levelOrder = { normal: 1, "pregnancy-bond": 2, "cryptic-choice": 3 };

/** "Що шукаєте" — first Home filter. First three map to search modes,
 * the last one switches to the laboratory search (legacy searchTarget). */
const WHAT_OPTIONS = [
  { id: "dating", mode: "normal" as const, labelKey: "home.filters.modeNormal" },
  {
    id: "conception",
    mode: "pregnancy-bond" as const,
    labelKey: "home.filters.modePregnancyBond",
  },
  {
    id: "polyandrous",
    mode: "cryptic-choice" as const,
    labelKey: "home.filters.modeCrypticChoice",
  },
  { id: "std-tests", labelKey: "filters.stdTests" },
];
type WhatSearchId = (typeof WHAT_OPTIONS)[number]["id"];

/** Lab directory entry from GET /api/companion/labs. */
interface LabDirectoryEntry {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
}

// Option lists for the extended search filters (keys are i18n suffix values).
const skinColorOptions = ["fair", "light", "medium", "tan", "dark", "deep"];
const eyeColorOptions = ["brown", "blue", "green", "hazel", "gray", "black"];
const hairColorOptions = ["black", "brown", "blonde", "red", "gray", "white", "bald"];
const bodyTypeOptions = ["slim", "athletic", "average", "curvy", "muscular", "large"];

function canSeeProfile(viewerMode: string, target: ProfileData): boolean {
  if (!target.hideProfileFromLowerLevels) return true;
  const viewerLevel = levelOrder[viewerMode as keyof typeof levelOrder] || 1;
  const targetLevel = levelOrder[target.authMode as keyof typeof levelOrder] || 1;
  return viewerLevel >= targetLevel;
}

interface SelectFilterProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  anyLabel: string;
  onChange: (value: string) => void;
  helpTerm?: string;
}

function SelectFilter({ label, value, options, anyLabel, onChange, helpTerm }: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {helpTerm && <InfoProposalIcons term={helpTerm} align="left" />}
      </span>
      <select
        className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{anyLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface BinaryFilterProps {
  label: string;
  value: boolean | undefined;
  anyLabel: string;
  yesLabel: string;
  noLabel: string;
  onChange: (value: boolean | undefined) => void;
}

function BinaryFilter({ label, value, anyLabel, yesLabel, noLabel, onChange }: BinaryFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <select
        className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
        value={value === undefined ? "" : value ? "yes" : "no"}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? undefined : v === "yes");
        }}
      >
        <option value="">{anyLabel}</option>
        <option value="yes">{yesLabel}</option>
        <option value="no">{noLabel}</option>
      </select>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const {
    profiles,
    filters,
    setFilters,
    searchMode,
    setSearchMode,
    checkCompatibility,
    myProfile,
    canViewTheirPhoto,
  } = useAppState();
  const navigate = useNavigate();
  const { address } = useAccount();

  // ─── On-chain TrustScore for connected user ───
  const { data: onChainScore } = useReadContract({
    address: TRUST_SCORE_ADDRESS,
    abi: TrustScoreABI,
    functionName: "getTotalScore",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Cascading Country → City dropdown data (lazy-loaded offline dataset).
  const locationIndex = useLocations();

  const labSearchActive = filters.searchTarget === "laboratory";

  // ─── "Що шукаєте" — derived from search mode + legacy laboratory target ───
  const myDetails = myProfile.searchDetails;
  const myGender = myDetails?.kind ? kindToGender(myDetails.kind) : myDetails?.gender;
  const whatSearch: WhatSearchPurpose | "std-tests" =
    filters.searchTarget === "laboratory"
      ? "std-tests"
      : searchMode === "pregnancy-bond"
        ? "conception"
        : searchMode === "cryptic-choice"
          ? "polyandrous"
          : "dating";
  const whoOptions: WhoSearchOption[] =
    whatSearch === "std-tests" ? [] : getWhoSearchOptions(whatSearch, myGender);

  const handleWhatChange = (id: WhatSearchId) => {
    if (id === "std-tests") {
      setFilters((prev) => ({ ...prev, searchTarget: "laboratory" }));
      return;
    }
    const mode = WHAT_OPTIONS.find((o) => o.id === id)?.mode;
    if (mode) setSearchMode(mode);
    setFilters((prev) => ({ ...prev, searchTarget: undefined }));
  };

  // Keep the Who selection consistent with the chosen What + user gender.
  // Single-option cases (e.g. Зачаття + жінка → Чоловіка) get auto-selected.
  useEffect(() => {
    if (whatSearch === "std-tests") return;
    const allowed = getWhoSearchOptions(whatSearch, myGender);
    const current = filters.searchWho as WhoSearchOption | undefined;
    if (current && allowed.includes(current)) return;
    if (allowed.length === 1) {
      setFilters((prev) => ({ ...prev, searchWho: allowed[0] }));
    } else if (current !== undefined) {
      setFilters((prev) => ({ ...prev, searchWho: undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatSearch, myGender]);

  const filteredProfiles = profiles.filter((profile) => {
    if (!canSeeProfile(searchMode, profile)) return false;

    const sd = profile.searchDetails || {};

    // Лабораторії — не учасники людей-пошуку (вони у вкладці "Здати ІПСШ тести").
    if (isLaboratoryProfile(sd)) return false;

    // 1. Кого шукаємо — умовний фільтр залежно від "Що шукаєте" та статі.
    if (
      !matchesWhoSearch(
        { gender: sd.gender, lookingFor: sd.lookingFor, kind: sd.kind },
        filters.searchWho,
      )
    )
      return false;

    // 2. ІПСШ сумісні — лише безпечні/сумісні анонімні вердикти.
    if (filters.stdCompatibleOnly && !checkCompatibility(profile).safe) return false;

    // 2.5. Може прибути до моєї країни — звірка списку країн профілю
    // (sd.canTravelCountries) з країною поточного користувача.
    if (filters.canTravelOnly && !matchesCanTravel(sd, myProfile.searchDetails?.country))
      return false;

    // ─── Мінімальний набір фільтрів (лише зі списку) ───
    if (filters.minAge != null && profile.age < filters.minAge) return false;
    if (filters.maxAge != null && profile.age > filters.maxAge) return false;
    if (filters.minHeight != null && (sd.height ?? 0) < filters.minHeight) return false;
    if (filters.maxHeight != null && (sd.height ?? 9999) > filters.maxHeight) return false;
    if (filters.minWeight != null && (sd.weight ?? 0) < filters.minWeight) return false;
    if (filters.maxWeight != null && (sd.weight ?? 9999) > filters.maxWeight) return false;
    if (filters.country && (sd.country || "").toLowerCase() !== filters.country.toLowerCase())
      return false;
    if (filters.city && (sd.city || "").toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.eyeColor && sd.eyeColor !== filters.eyeColor) return false;
    if (filters.hairColor && sd.hairColor !== filters.hairColor) return false;
    if (filters.skinColor && sd.skinColor !== filters.skinColor) return false;
    if (filters.bodyType && sd.bodyType !== filters.bodyType) return false;
    if (filters.smoking != null && (sd.smoking ?? false) !== filters.smoking) return false;
    if (filters.drinking != null && (sd.drinking ?? false) !== filters.drinking) return false;
    if (filters.languages && filters.languages.length > 0) {
      const profileLangs = profile.languages || [];
      const hasCommonLang = filters.languages.some((code) => profileLangs.includes(code));
      if (!hasCommonLang) return false;
    }
    return true;
  });

  // ─── Пошук лабораторій (server directory) ───
  const [labs, setLabs] = useState<LabDirectoryEntry[]>([]);
  useEffect(() => {
    if (!labSearchActive) return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (filters.country) params.set("country", filters.country.trim());
    if (filters.city) params.set("city", filters.city.trim());
    fetch(`/api/companion/labs?${params.toString()}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setLabs(Array.isArray(d.labs) ? d.labs : []);
      })
      .catch(() => {
        if (!cancelled) setLabs([]);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labSearchActive, filters.country, filters.city]);

  // Sort by reputation score (highest first).
  filteredProfiles.sort((a, b) => b.reputationScore - a.reputationScore);

  // ─── Лабораторії-профілі (kind="laboratory") + довідник лабораторій ───
  // Профілі-лабораторії фільтруємо за Країною/Містом так само, як довідник.
  const labProfileCards: LabDirectoryEntry[] = profiles
    .filter((p) => {
      if (!isLaboratoryProfile(p.searchDetails)) return false;
      const sd = p.searchDetails || {};
      if (filters.country && (sd.country || "").toLowerCase() !== filters.country.toLowerCase())
        return false;
      if (filters.city && (sd.city || "").toLowerCase() !== filters.city.toLowerCase())
        return false;
      return true;
    })
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.bio || null,
      country: p.searchDetails?.country ?? null,
      city: p.searchDetails?.city ?? null,
    }));
  const allLabs: LabDirectoryEntry[] = [...labProfileCards, ...labs];

  return (
    <div className="home">
      <div className="hero">
        {address && onChainScore != null && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2">
            <FaShieldAlt className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              {t("home.trustScore")}: {Number(onChainScore)}/100
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 justify-center items-center mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-900">
        {/* Filters toggle — visible on all screen sizes (panel collapses everywhere) */}
        <button
          type="button"
          onClick={() => setFiltersExpanded((prev) => !prev)}
          className="w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          aria-expanded={filtersExpanded}
          aria-controls="home-filters"
        >
          {filtersExpanded ? t("home.filters.hideFilters") : t("home.filters.showFilters")}
          {filtersExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div
          id="home-filters"
          className={`w-full space-y-4 ${filtersExpanded ? "block" : "hidden"}`}
        >
          {/* 1. Що шукаєте — мета пошуку (перші три — режими, четверта — лабораторія) */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">{t("filters.whatSearch")}:</span>
            {WHAT_OPTIONS.map((option) => {
              const active = whatSearch === option.id;
              return (
                <label
                  key={option.id}
                  className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="what-search"
                    value={option.id}
                    checked={active}
                    onChange={() => handleWhatChange(option.id)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  {t(option.labelKey)}
                </label>
              );
            })}
            {whatSearch !== "std-tests" && (
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                aria-label={t("verificationModal.title")}
                title={t("verificationModal.title")}
                className="ml-1 w-6 h-6 rounded-full border border-gray-300 text-gray-500 text-xs font-bold hover:bg-gray-100 flex items-center justify-center"
              >
                i
              </button>
            )}
          </div>

          {/* 2. Кого шукаєте — залежить від "Що шукаєте" та статі користувача.
              Единий варіант (наприклад Зачаття + жінка → Чоловіка) — вже відмічений і заблокований. */}
          {whatSearch !== "std-tests" && whoOptions.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">{t("filters.whoSearch")}:</span>
              {whoOptions.length > 1 && (
                <label className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer select-none">
                  <input
                    type="radio"
                    name="who-search"
                    value=""
                    checked={!filters.searchWho}
                    onChange={() => setFilters((prev) => ({ ...prev, searchWho: undefined }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  {t("filters.any")}
                </label>
              )}
              {whoOptions.map((who) => {
                const locked = whoOptions.length === 1;
                const active = locked || filters.searchWho === who;
                return (
                  <label
                    key={who}
                    className={`flex items-center gap-1.5 text-sm font-semibold select-none ${
                      locked ? "cursor-default text-gray-500" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="who-search"
                      value={who}
                      checked={active}
                      disabled={locked}
                      onChange={() => setFilters((prev) => ({ ...prev, searchWho: who }))}
                      className="w-4 h-4 accent-blue-600"
                    />
                    {t(`filters.lookingForOptions.${who}`)}
                  </label>
                );
              })}
            </div>
          )}

          {/* 3-4. Країна / Місто (для лабораторій — єдині доступні фільтри).
              Каскад: спочатку країна, місто звужується до обраної країни. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-700">{t("filters.country")}</span>
              <select
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                value={filters.country ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    country: e.target.value || undefined,
                    city: undefined,
                  }))
                }
              >
                <option value="">{t("filters.any")}</option>
                {withLegacyOption(locationIndex?.countries ?? [], filters.country ?? "").map(
                  (country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-700">{t("filters.city")}</span>
              <select
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-900 disabled:opacity-50"
                value={filters.city ?? ""}
                disabled={!filters.country}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, city: e.target.value || undefined }))
                }
              >
                <option value="">{t("filters.any")}</option>
                {filters.country &&
                  withLegacyOption(
                    locationIndex?.citiesFor(filters.country) ?? [],
                    filters.city ?? "",
                  ).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* ІПСШ сумісні + Може прибути до моєї країни — під країною/містом */}
          {!labSearchActive && (
            <>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.stdCompatibleOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, stdCompatibleOnly: e.target.checked }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t("filters.stdCompatible")}
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.canTravelOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, canTravelOnly: e.target.checked }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {t("filters.canTravelOnly")}
              </label>
            </>
          )}

          {/* ─── Розширені фільтри (лише для пошуку людей) ─── */}
          {!labSearchActive && filtersExpanded && (
            <div className="w-full mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Age range */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-700">{t("filters.ageRange")}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={18}
                    max={99}
                    placeholder={t("filters.min")}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    value={filters.minAge ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minAge: e.target.value === "" ? undefined : Number(e.target.value),
                      }))
                    }
                  />
                  <input
                    type="number"
                    min={18}
                    max={99}
                    placeholder={t("filters.max")}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    value={filters.maxAge ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxAge: e.target.value === "" ? undefined : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Height range (cm) */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-700">
                  {t("filters.heightRange")}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={120}
                    max={230}
                    placeholder={t("filters.min")}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    value={filters.minHeight ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minHeight: e.target.value === "" ? undefined : Number(e.target.value),
                      }))
                    }
                  />
                  <input
                    type="number"
                    min={120}
                    max={230}
                    placeholder={t("filters.max")}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    value={filters.maxHeight ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxHeight: e.target.value === "" ? undefined : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Weight range (kg) */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-700">
                  {t("filters.weightRange")}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={30}
                    max={250}
                    placeholder={t("filters.min")}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    value={filters.minWeight ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minWeight: e.target.value === "" ? undefined : Number(e.target.value),
                      }))
                    }
                  />
                  <input
                    type="number"
                    min={30}
                    max={250}
                    placeholder={t("filters.max")}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    value={filters.maxWeight ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxWeight: e.target.value === "" ? undefined : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Eye color */}
              <SelectFilter
                label={t("filters.eyeColor")}
                value={filters.eyeColor ?? ""}
                options={eyeColorOptions.map((o) => ({
                  value: o,
                  label: t(`filters.eyeColors.${o}`),
                }))}
                anyLabel={t("filters.any")}
                onChange={(v) => setFilters((prev) => ({ ...prev, eyeColor: v || undefined }))}
              />

              {/* Hair color */}
              <SelectFilter
                label={t("filters.hairColor")}
                value={filters.hairColor ?? ""}
                options={hairColorOptions.map((o) => ({
                  value: o,
                  label: t(`filters.hairColors.${o}`),
                }))}
                anyLabel={t("filters.any")}
                onChange={(v) => setFilters((prev) => ({ ...prev, hairColor: v || undefined }))}
              />

              {/* Skin color */}
              <SelectFilter
                label={t("filters.skinColor")}
                value={filters.skinColor ?? ""}
                options={skinColorOptions.map((o) => ({
                  value: o,
                  label: t(`filters.skinColors.${o}`),
                }))}
                anyLabel={t("filters.any")}
                helpTerm="home.filters.skinColor"
                onChange={(v) => setFilters((prev) => ({ ...prev, skinColor: v || undefined }))}
              />

              {/* Looking for — перенесено нагору як "Кого шукаєте" (умовний фільтр) */}

              {/* Body type */}
              <SelectFilter
                label={t("filters.bodyType")}
                value={filters.bodyType ?? ""}
                options={bodyTypeOptions.map((o) => ({
                  value: o,
                  label: t(`filters.bodyTypes.${o}`),
                }))}
                anyLabel={t("filters.any")}
                onChange={(v) => setFilters((prev) => ({ ...prev, bodyType: v || undefined }))}
              />

              {/* Smoking */}
              <BinaryFilter
                label={t("filters.smoking")}
                value={filters.smoking}
                anyLabel={t("filters.any")}
                yesLabel={t("filters.yes")}
                noLabel={t("filters.no")}
                onChange={(v) => setFilters((prev) => ({ ...prev, smoking: v }))}
              />

              {/* Drinking */}
              <BinaryFilter
                label={t("filters.drinking")}
                value={filters.drinking}
                anyLabel={t("filters.any")}
                yesLabel={t("filters.yes")}
                noLabel={t("filters.no")}
                onChange={(v) => setFilters((prev) => ({ ...prev, drinking: v }))}
              />

              {/* Languages — останній фільтр у списку */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-700">
                  {t("filters.languages")}
                </span>
                <select
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  value={filters.languages?.[0] ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      languages: e.target.value ? [e.target.value] : [],
                    }))
                  }
                >
                  <option value="">{t("filters.any")}</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {languageName(lang.code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* CTA "Відкрити панель Зачаття" (mode2) тимчасово сховано з Головної —
          код збережено, разом із mode3 панеллю ймовірно перенесемо у Профіль.
      {searchMode === "pregnancy-bond" && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => navigate("/mode2")}
            className="px-6 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all transform hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #4338ca, #6366f1)",
            }}
          >
            {t("home.dashboardCta.mode2")}
          </button>
        </div>
      )}
      */}
      {/* CTA "Відкрити панель Посткопуляції" (mode3) тимчасово сховано з Головної —
          код збережено, ймовірно повернемо пізніше. Опція "Поліандрічне зачаття"
          досі доступна у фільтрі "Що шукаєте".
      {searchMode === "cryptic-choice" && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => navigate("/mode3")}
            className="px-6 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all transform hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
            }}
          >
            {t("home.dashboardCta.mode3")}
          </button>
        </div>
      )}
      */}
      {labSearchActive ? (
        /* ─── Пошук лабораторій: профілі з kind="laboratory" + довідник ─── */
        <div className="w-full max-w-3xl mx-auto space-y-3">
          {allLabs.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">{t("filters.noLabs")}</p>
            </div>
          ) : (
            allLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{lab.name}</p>
                  {(lab.city || lab.country) && (
                    <p className="text-xs text-gray-500">
                      {[lab.city, lab.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {lab.address && <p className="text-xs text-gray-400 mt-1">{lab.address}</p>}
                  {lab.phone && <p className="text-xs text-gray-400">{lab.phone}</p>}
                </div>
                <button
                  onClick={() => navigate(`/companion/chat/${lab.id}`)}
                  className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {t("companion.lab.contact")}
                </button>
              </div>
            ))
          )}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">{t("home.filters.noProfiles")}</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => {
              const visible = canSeeProfile(searchMode, profile);
              const myGrant = profile.photoGrants?.[myProfile.id];
              const tempUntil = myGrant?.kind === "temporary" ? (myGrant.expiresAt ?? 0) : 0;
              return (
                <div
                  key={profile.id}
                  className="profile-card cursor-pointer"
                  onClick={() => navigate(`/profile/${profile.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/profile/${profile.id}`);
                    }
                  }}
                  aria-label={t("userProfile.openProfile", {
                    name: profile.name,
                  })}
                >
                  {visible ? (
                    <>
                      <div className="profile-image-container">
                        <PhotoView
                          imageUrl={profile.imageUrl}
                          alt={profile.name}
                          blurred={profile.photoBlurred || false}
                          visible={canViewTheirPhoto(profile)}
                          temporaryUntil={tempUntil}
                          className="w-full h-full"
                          imgClassName="profile-img"
                        />
                        <span className="profile-tag">{t("home.profile.newMatch")}</span>
                      </div>
                      <div className="profile-info">
                        <div>
                          <div className="profile-header">
                            <h3 className="profile-name">{profile.name}</h3>
                            <span className="profile-age">{profile.age}</span>
                          </div>
                          <p className="profile-bio">{profile.bio}</p>
                        </div>
                        <div className="profile-interests">
                          {(profile.interests || []).slice(0, 4).map((interest, index) => (
                            <span key={index} className="interest-tag">
                              {interest}
                            </span>
                          ))}
                        </div>
                        {profile.parsedStd &&
                          profile.parsedStd.pathogens.length > 0 &&
                          (() => {
                            const compat = checkCompatibility(profile);
                            const label = getCompatibilityLabel(compat);
                            return (
                              <div
                                className={`mt-3 p-2 rounded-lg ${
                                  label.color === "green"
                                    ? "bg-green-50 border border-green-200"
                                    : label.color === "blue"
                                      ? "bg-blue-50 border border-blue-200"
                                      : label.color === "yellow"
                                        ? "bg-yellow-50 border border-yellow-200"
                                        : "bg-red-50 border border-red-200"
                                }`}
                              >
                                <span className="text-sm">
                                  {label.icon}{" "}
                                  <span
                                    className={`font-semibold ${
                                      label.color === "green"
                                        ? "text-green-800"
                                        : label.color === "blue"
                                          ? "text-blue-800"
                                          : label.color === "yellow"
                                            ? "text-yellow-800"
                                            : "text-red-800"
                                    }`}
                                  >
                                    {label.label}
                                  </span>
                                </span>
                              </div>
                            );
                          })()}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <FaUser className="text-gray-400 text-2xl" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">•••</h3>
                      <div className="flex items-center gap-1 mt-2 text-yellow-500">
                        <FaStar />
                        <span className="font-semibold text-gray-700">
                          {profile.reputationScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{t("chat.hiddenProfile")}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      <KindSelectModal />
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        mode={searchMode}
      />
    </div>
  );
}
