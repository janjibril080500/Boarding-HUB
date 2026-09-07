import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometric House + Bed + Management Icon */}
      <div
        id="app-brand-logo"
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 p-[1.5px] shadow-lg shadow-teal-500/20 shrink-0`}
      >
        <div className="w-full h-full bg-[#0B171B] rounded-[10px] flex items-center justify-center relative overflow-hidden group">
          {/* Subtle gradient glow inside */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-transparent to-cyan-500/20 opacity-80" />
          
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5/6 h-5/6 text-teal-400 relative z-10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Modern House Roof */}
            <path d="M3 10.5L12 3l9 7.5" stroke="url(#teal-cyan-grad)" strokeWidth="2.2" />
            {/* House Body / Door structure */}
            <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            {/* Bed concept frame inside */}
            <path d="M8 15h8" stroke="url(#teal-cyan-grad)" strokeWidth="2" />
            <path d="M8 13v4" />
            <path d="M16 13v4" />
            <circle cx="10" cy="13" r="1" fill="#2DD4BF" />
            
            <defs>
              <linearGradient id="teal-cyan-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-bold tracking-tight text-slate-100 font-['Space_Grotesk'] ${textSizes[size]}`}>
              Boarding<span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Hub</span>
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 tracking-wider">
              PH
            </span>
          </div>
          {showTagline && (
            <span className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide">
              Your Boarding House, Simplified.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
