import React from "react";

export interface ProfileCardProps {
  name: string;
  age?: number;
  location?: string;
  bio?: string;
  avatar?: string;
  onConnect?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

export function ProfileCard({
  name,
  age,
  location,
  bio,
  avatar,
  onConnect,
  onViewProfile,
  className = "",
}: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 max-w-sm ${className}`}>
      <div className="flex flex-col items-center">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-500 font-semibold">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {name}
          {age !== undefined && (
            <span className="text-gray-500 font-normal ml-1">{age}</span>
          )}
        </h3>
        {location && (
          <p className="text-sm text-gray-500 mb-2">📍 {location}</p>
        )}
        {bio && <p className="text-sm text-gray-600 text-center mb-4">{bio}</p>}
        <div className="flex gap-2 w-full">
          {onConnect && (
            <button
              onClick={onConnect}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              Connect
            </button>
          )}
          {onViewProfile && (
            <button
              onClick={onViewProfile}
              className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
            >
              View Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
