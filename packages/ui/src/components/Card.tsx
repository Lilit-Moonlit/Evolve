import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className = "", onClick, style }: CardProps) {
  const baseClasses = "bg-white rounded-lg shadow-md p-6";
  const interactiveClasses = onClick
    ? "cursor-pointer hover:shadow-lg transition-shadow"
    : "";

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export default Card;
