
import React from 'react';

interface FittingRoomProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const FittingRoom = ({
  className = "",
  size = 24,
  strokeWidth = 2,
  color = "currentColor"
}: FittingRoomProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Curtain Rod */}
      <line x1="3" y1="4" x2="21" y2="4" />
      
      {/* Left Curtain */}
      <path d="M7 4C7 4 5 5 5 9C5 13 5 20 5 20" />
      <path d="M7 4C7 4 9 6 9 10C9 14 9 20 9 20" />
      
      {/* Right Curtain */}
      <path d="M17 4C17 4 19 5 19 9C19 13 19 20 19 20" />
      <path d="M17 4C17 4 15 6 15 10C15 14 15 20 15 20" />
      
      {/* Person Silhouette (simplified) */}
      <circle cx="12" cy="9" r="2" />
      <path d="M12 11C10.5 11 9 12 9 14C9 17 10 19.5 12 20C14 19.5 15 17 15 14C15 12 13.5 11 12 11Z" />
    </svg>
  );
};

export default FittingRoom;
