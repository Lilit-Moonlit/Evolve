import React from "react";
import { Link } from "react-router-dom";

export interface HeaderProps {
  logo?: string;
  title?: string;
  className?: string;
}

export function Header({
  logo,
  title = "Evolve",
  className = "",
}: HeaderProps) {
  return (
    <header className={`bg-white shadow-md ${className}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {logo ? (
            <img src={logo} alt="Logo" className="w-8 h-8" />
          ) : (
            <span className="text-2xl">💕</span>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </Link>
      </div>
    </header>
  );
}

export default Header;
