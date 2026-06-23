import React from "react";
import { NavLink } from "react-router-dom";

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function Navigation({ items, className = "" }: NavigationProps) {
  return (
    <nav className={`bg-white shadow-md ${className}`}>
      <ul className="flex space-x-4 px-4 py-2">
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
