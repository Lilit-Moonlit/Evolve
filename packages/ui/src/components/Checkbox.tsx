import React from "react";

export interface CheckboxProps {
  label?: string;
  error?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  error,
  checked = false,
  onChange,
  disabled = false,
  className = "",
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        />
        {label && (
          <label className="font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Checkbox;
