import React from 'react';

interface MokolaLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

/**
 * Original, distinctive Mokola AI logo mark:
 * An interconnected dimensional 'M' synthesized with an intelligence prism and energy nexus.
 * Completely original design, no imitation.
 */
export function MokolaLogo({ className = 'text-[#7C3AED]', size = 28, animated = false }: MokolaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'animate-pulse' : ''}`}
    >
      <defs>
        {/* Gradient for left wing of M */}
        <linearGradient id="mokola-left" x1="4" y1="4" x2="18" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Gradient for right wing of M */}
        <linearGradient id="mokola-right" x1="18" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Gradient for central intelligent nexus apex */}
        <linearGradient id="mokola-core" x1="18" y1="6" x2="18" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Left Pillar */}
      <path
        d="M6 30V10.5C6 8.5 7.6 6.8 9.6 7L16 7.8V29L9.5 30H6Z"
        fill="url(#mokola-left)"
      />

      {/* Right Pillar */}
      <path
        d="M30 30V10.5C30 8.5 28.4 6.8 26.4 7L20 7.8V29L26.5 30H30Z"
        fill="url(#mokola-right)"
      />

      {/* Central Intersecting Geometric Chevron */}
      <path
        d="M10 9L18 22.5L26 9L21.5 8.5L18 15L14.5 8.5L10 9Z"
        fill="url(#mokola-core)"
      />

      {/* Luminous Quantum Energy Core in center */}
      <circle cx="18" cy="24" r="2.8" fill="#FFFFFF" />
      <circle cx="18" cy="24" r="4.5" fill="#8B5CF6" opacity="0.35" />
    </svg>
  );
}
