import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { addProposal } from "../lib/proposals-store";
import { HelpTerm, getHelpTerm, isKnownHelpTerm } from "../lib/help-dictionary";

interface InfoProposalIconsProps {
  term: string; // help-term id
  align?: "left" | "right"; // default "left"
}

export default function InfoProposalIcons({ term, align = "left" }: InfoProposalIconsProps) {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestText, setSuggestText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const infoRef = useRef<HTMLButtonElement>(null);
  const suggestRef = useRef<HTMLButtonElement>(null);

  const helpTerm = isKnownHelpTerm(term) ? getHelpTerm(term) : null;
  const ariaInfoLabel = helpTerm
    ? t("help.aria.info", { title: helpTerm.titleKey })
    : t("help.aria.info");
  const ariaSuggestLabel = t("help.aria.suggest");

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoRef.current &&
        !infoRef.current.contains(event.target as Node) &&
        suggestRef.current &&
        !suggestRef.current.contains(event.target as Node)
      ) {
        setShowInfo(false);
        setShowSuggest(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close suggest modal on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowInfo(false);
        setShowSuggest(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
    setShowSuggest(false);
  };

  const handleSuggestClick = () => {
    setShowSuggest(true);
    setShowInfo(false);
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestText.trim()) return;
    setIsSubmitting(true);
    try {
      const titleKey = helpTerm?.titleKey || "suggestions.defaultTitle";
      const defaultTitle = t(titleKey, { term: helpTerm?.term || term });
      await addProposal({
        title: suggestText.trim() || defaultTitle,
        description: suggestText.trim(),
        source: term,
      });
      setSubmitSuccess(true);
      setSuggestText("");
      setTimeout(() => {
        setShowSuggest(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to submit suggestion", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInfoPopover = () => (
    <div
      className="absolute z-50 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        left: align === "left" ? "0" : "auto",
        right: align === "right" ? "0" : "auto",
        top: "100%",
        marginTop: "4px",
      }}
    >
      {helpTerm ? (
        <>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{t(helpTerm.titleKey)}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{t(helpTerm.bodyKey)}</p>
        </>
      ) : (
        <p className="text-xs text-gray-600">{t("help.unknownTerm")}</p>
      )}
    </div>
  );

  const renderSuggestDialog = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("suggestions.title")}</h3>
        <form onSubmit={handleSuggestSubmit} className="space-y-4">
          <textarea
            value={suggestText}
            onChange={(e) => setSuggestText(e.target.value)}
            placeholder={t("suggestions.placeholder")}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="button" // cancel
              onClick={() => {
                setShowSuggest(false);
                setSuggestText("");
              }}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t("suggestions.cancel")}
            </button>
            <button
              type="submit"
              disabled={!suggestText.trim() || isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors"
            >
              {isSubmitting ? t("suggestions.submitting") : t("suggestions.submit")}
            </button>
          </div>
        </form>
        {submitSuccess && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {t("suggestions.saved")}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <button
        ref={infoRef}
        onClick={handleInfoClick}
        onMouseEnter={handleInfoClick}
        onMouseLeave={() => setShowInfo(false)}
        className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label={ariaInfoLabel}
        title={ariaInfoLabel}
      >
        ℹ️
      </button>
      <button
        ref={suggestRef}
        onClick={handleSuggestClick}
        className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
        aria-label={ariaSuggestLabel}
        title={ariaSuggestLabel}
      >
        !
      </button>
      {showInfo && renderInfoPopover()}
      {showSuggest && renderSuggestDialog()}
    </div>
  );
}
