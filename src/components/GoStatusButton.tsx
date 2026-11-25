import React from 'react';
import { soundEngine } from '../utils/soundEffects';

interface GoStatusButtonProps {
  isOnline: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const GoStatusButton: React.FC<GoStatusButtonProps> = ({
  isOnline,
  onToggle,
  size = 'md',
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.unlock();
    soundEngine.playAdvanceChime();
    soundEngine.vibrate(isOnline ? [30, 20] : [20, 50, 30]);
    // Sweet Venezuelan voice feedback
    soundEngine.speakOnlineStatus(!isOnline);
    onToggle();
  };

  const sizeClasses = {
    sm: 'h-8 px-2 text-[10px] gap-1.5',
    md: 'h-9 px-2.5 sm:px-3 text-[11px] gap-1.5 sm:gap-2',
    lg: 'h-11 px-3.5 text-xs gap-2.5'
  }[size];

  const logoHeight = {
    sm: 'h-4',
    md: 'h-[18px] sm:h-5',
    lg: 'h-6'
  }[size];

  return (
    <button
      type="button"
      onClick={handleClick}
      title={
        isOnline
          ? 'Turno CONECTADO / EN LÍNEA (Toca para pausar)'
          : 'Turno DESCONECTADO / EN PAUSA (Toca para conectar)'
      }
      aria-label={isOnline ? 'Desconectar turno' : 'Conectar turno'}
      className={`group relative inline-flex items-center justify-center rounded-2xl select-none transition-all duration-300 active:scale-95 cursor-pointer border shadow-sm ${sizeClasses} ${
        isOnline
          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          : 'bg-slate-200/80 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 border-slate-300 dark:border-white/15 text-slate-500 dark:text-slate-400'
      } ${className}`}
    >
      {/* SVG GO Logo Original 1:1 de Go Delivery (89340.svg) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="25 300 945 500"
        className={`${logoHeight} w-auto object-contain transition-transform duration-200 group-hover:scale-105 shrink-0`}
      >
        {/* Capa de contorno para modo oscuro y contraste */}
        <g
          stroke={isOnline ? '#22c55e' : '#94a3b8'}
          strokeWidth="32"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill={isOnline ? '#22c55e' : '#94a3b8'}
          opacity={isOnline ? '0.2' : '0.1'}
        >
          {/* Letra G Contorno */}
          <path
            fillRule="evenodd"
            d="
              M 54,332
              L 348,332
              A 218 218 0 0 1 554,478
              L 442,478
              A 118 118 0 0 0 348,432
              A 118 118 0 0 0 230,550
              A 118 118 0 0 0 348,668
              A 118 118 0 0 0 461,582
              L 364,582
              L 364,505
              L 570,505
              L 570,758
              L 496,758
              C 454,765 404,768 348,768
              A 218 218 0 0 1 130,550
              C 130,518 136,490 146,464
              L 54,424
              L 142,390
              Z
            "
          />

          {/* Letra o Contorno */}
          <path
            fillRule="evenodd"
            d="
              M 595,425
              L 768,425
              A 173 173 0 0 1 941,598
              A 173 173 0 0 1 768,771
              A 173 173 0 0 1 595,598
              L 595,425
              Z

              M 768,526
              A 72 72 0 1 0 768,670
              A 72 72 0 1 0 768,526
              Z
            "
          />
        </g>

        {/* Capa de relleno original exacto de 89340.svg */}
        <g fill={isOnline ? '#22c55e' : '#64748b'} className="transition-colors duration-200">
          {/* Letra G original */}
          <path
            fillRule="evenodd"
            d="
              M 54,332
              L 348,332
              A 218 218 0 0 1 554,478
              L 442,478
              A 118 118 0 0 0 348,432
              A 118 118 0 0 0 230,550
              A 118 118 0 0 0 348,668
              A 118 118 0 0 0 461,582
              L 364,582
              L 364,505
              L 570,505
              L 570,758
              L 496,758
              C 454,765 404,768 348,768
              A 218 218 0 0 1 130,550
              C 130,518 136,490 146,464
              L 54,424
              L 142,390
              Z
            "
          />

          {/* Letra o original */}
          <path
            fillRule="evenodd"
            d="
              M 595,425
              L 768,425
              A 173 173 0 0 1 941,598
              A 173 173 0 0 1 768,771
              A 173 173 0 0 1 595,598
              L 595,425
              Z

              M 768,526
              A 72 72 0 1 0 768,670
              A 72 72 0 1 0 768,526
              Z
            "
          />
        </g>
      </svg>

      {/* Pill Switch Badge: ON / OFF con indicador LED */}
      <div
        className={`flex items-center gap-1 font-mono font-black tracking-wider uppercase transition-colors duration-200 ${
          isOnline
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-slate-600 dark:text-slate-400'
        }`}
      >
        <span
          className={`relative flex h-2 w-2 rounded-full ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
          }`}
        >
          {isOnline && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
        </span>
        <span className="leading-none">{isOnline ? 'ON' : 'OFF'}</span>
      </div>
    </button>
  );
};
