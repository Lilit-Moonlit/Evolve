import React from "react";

export type VerificationType = "std" | "genetic";

export interface VerificationBadgeProps {
  type: VerificationType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const iconSizeMap: Record<string, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};

const labelSizeMap: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}

function DnaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 2C16.33 2 17 2.67 17 3.5S16.33 5 15.5 5 14 4.33 14 3.5 14.67 2 15.5 2zm-7 14c.83 0 1.5.67 1.5 1.5S9.33 19 8.5 19 7 18.33 7 17.5 7.67 16 8.5 16zm4.5-2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-2-7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-4-5c-.83 0-1.5-.67-1.5-1.5S7.67 10 8.5 10s1.5.67 1.5 1.5S9.33 13 8.5 13z" />
    </svg>
  );
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  size = "md",
  showLabel = false,
  className = "",
}) => {
  const isStd = type === "std";
  const gradientClass = isStd
    ? "bg-gradient-to-br from-green-400 to-emerald-600"
    : "bg-gradient-to-br from-blue-400 to-purple-600";
  const glowClass = isStd ? "bg-green-400" : "bg-purple-400";
  const labelColor = isStd ? "text-green-600" : "text-purple-600";
  const labelText = isStd ? "STD Verified" : "DNA Verified";

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className={`relative ${sizeMap[size]} rounded-full ${gradientClass} flex items-center justify-center shadow-md`}
      >
        <div
          className={`absolute inset-0 rounded-full animate-pulse ${glowClass} opacity-30`}
        />
        {isStd ? (
          <ShieldIcon
            className={`${iconSizeMap[size]} text-white relative z-10`}
          />
        ) : (
          <DnaIcon
            className={`${iconSizeMap[size]} text-white relative z-10`}
          />
        )}
      </div>
      {showLabel && (
        <span className={`${labelSizeMap[size]} font-semibold ${labelColor}`}>
          {labelText}
        </span>
      )}
    </div>
  );
};

export default VerificationBadge;
