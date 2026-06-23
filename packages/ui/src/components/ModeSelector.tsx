import React, { useState } from "react";

export type SearchMode = "normal" | "pregnancy-bond" | "cryptic-choice";

interface ModeSelectorProps {
  onModeChange?: (mode: SearchMode) => void;
  defaultMode?: SearchMode;
  className?: string;
}

const modeConfig: Record<
  SearchMode,
  { label: string; description: string; icon: string; color: string }
> = {
  normal: {
    label: "Normal",
    description: "Standard matching",
    icon: "💜",
    color: "#8b5cf6",
  },
  "pregnancy-bond": {
    label: "Pregnancy Bond",
    description: "Family-focused matching",
    icon: "🤰",
    color: "#ec4899",
  },
  "cryptic-choice": {
    label: "Cryptic Choice",
    description: "Anonymous matching",
    icon: "🎭",
    color: "#6366f1",
  },
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  onModeChange,
  defaultMode = "normal",
  className = "",
}) => {
  const [selectedMode, setSelectedMode] = useState<SearchMode>(defaultMode);

  const handleModeChange = (mode: SearchMode) => {
    setSelectedMode(mode);
    onModeChange?.(mode);
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Mode</h3>

      <div className="space-y-3">
        {(Object.keys(modeConfig) as SearchMode[]).map((mode) => {
          const config = modeConfig[mode];
          const isSelected = selectedMode === mode;

          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-transparent text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
              }`}
              style={isSelected ? { backgroundColor: config.color } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div className="text-left">
                  <div
                    className={`font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}
                  >
                    {config.label}
                  </div>
                  <div
                    className={`text-sm ${isSelected ? "text-white/80" : "text-gray-500"}`}
                  >
                    {config.description}
                  </div>
                </div>
              </div>
              {isSelected && (
                <span
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold"
                  style={{ color: config.color }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <span className="text-sm text-gray-500">
          Current mode:{" "}
          <span className="font-semibold text-gray-900">
            {modeConfig[selectedMode].label}
          </span>
        </span>
      </div>
    </div>
  );
};

export default ModeSelector;
