import React, { useState, useEffect } from 'react';

export type BrandLogoVariant = 'full' | 'slogan' | 'emblem' | 'bag' | 'compact';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  withStickerOutline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'emblem',
  className = '',
  size = 'md',
  showSubtitle = false,
  withStickerOutline = true
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const checkCustomLogo = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('gd_custom_logo');
        setCustomLogo(saved);
      }
    };

    checkCustomLogo();
    window.addEventListener('storage', checkCustomLogo);
    return () => window.removeEventListener('storage', checkCustomLogo);
  }, []);

  const sizeMap = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  // If a custom original image was uploaded directly by the user, display it
  if (customLogo) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={customLogo}
          alt="Go Delivery Logo Original"
          className={`${sizeMap[size]} w-auto object-contain select-none`}
        />
        {showSubtitle && (
          <div className="hidden sm:flex flex-col border-l border-zinc-300 dark:border-zinc-800 pl-2.5 ml-2.5">
            <span className="text-[11px] font-black text-zinc-950 dark:text-white tracking-wider">GUAYANA</span>
            <span className="text-[9px] font-bold text-orange-500">Pto Ordaz ⇄ San Félix</span>
          </div>
        )}
      </div>
    );
  }

  // Primary & Only Official Logo: GO Emblem 89340.svg without shadow, crisp and elegant
  return (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      <img
        src="/89340.svg"
        alt="Go Delivery - GO"
        className={`${sizeMap[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105 select-none`}
      />
      {showSubtitle && (
        <div className="hidden sm:flex flex-col border-l border-zinc-300 dark:border-white/15 pl-2.5 ml-1">
          <span className="text-[11px] font-black text-zinc-900 dark:text-white tracking-wider">GUAYANA</span>
          <span className="text-[9px] font-bold text-orange-500">Pto Ordaz ⇄ San Félix</span>
        </div>
      )}
    </div>
  );
};
