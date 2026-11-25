import React, { useState, useRef, useEffect } from 'react';
import { ChevronsRight, Check } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  label: string;
  confirmedLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({
  onConfirm,
  label,
  confirmedLabel = '¡Confirmado!',
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number>(0);

  // Reset confirmed state when label changes (state advanced)
  useEffect(() => {
    setIsConfirmed(false);
    setDragProgress(0);
  }, [label]);

  const handleStart = (clientX: number) => {
    if (disabled || isConfirmed) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled || isConfirmed || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const thumbWidth = 56; // width of thumb button
    const maxDistance = containerWidth - thumbWidth;

    const deltaX = Math.max(0, clientX - startXRef.current);
    const progress = Math.min(1, Math.max(0, deltaX / maxDistance));
    setDragProgress(progress);

    if (progress >= 0.95) {
      // Threshold reached!
      setIsDragging(false);
      setIsConfirmed(true);
      soundEngine.vibrate([30, 40, 60]);
      onConfirm();
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragProgress < 0.95) {
      // Animate back to 0
      setDragProgress(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-14 rounded-2xl bg-slate-900 dark:bg-slate-950 p-1 select-none overflow-hidden shadow-lg border border-slate-700/60 dark:border-white/15 inner-recessed no-swipe ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={(e) => {
        e.stopPropagation();
        if (e.touches[0]) handleMove(e.touches[0].clientX);
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        handleEnd();
      }}
    >
      {/* Background progress fill with Intense-to-Yellow Orange Gradient */}
      <div
        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFBF00] rounded-2xl shadow-[0_0_15px_rgba(255,100,0,0.4)] transition-all"
        style={{
          width: isConfirmed ? '100%' : `${Math.max(12, dragProgress * 100)}%`,
          transition: isDragging ? 'none' : 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* Centered instruction label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
        <span
          className={`text-xs font-black tracking-wider text-white uppercase drop-shadow-xs transition-opacity duration-200 ${
            dragProgress > 0.4 ? 'opacity-30' : 'opacity-95'
          }`}
        >
          {isConfirmed ? confirmedLabel : label}
        </span>
      </div>

      {/* Draggable Thumb with 3D Embossed Relief */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          handleStart(e.clientX);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          if (e.touches[0]) handleStart(e.touches[0].clientX);
        }}
        className="relative z-10 w-12 h-12 rounded-xl bg-white dark:bg-slate-100 text-orange-600 flex items-center justify-center shadow-xl border border-white/80 active:scale-95 transition-transform cursor-grab active:cursor-grabbing shrink-0 no-swipe"
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px #ffffff',
          transform: isConfirmed
            ? `translateX(${
                containerRef.current ? containerRef.current.clientWidth - 56 : 0
              }px)`
            : `translateX(${
                dragProgress *
                ((containerRef.current ? containerRef.current.clientWidth : 280) - 56)
              }px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {isConfirmed ? (
          <Check className="w-5 h-5 text-emerald-600" />
        ) : (
          <ChevronsRight className="w-5 h-5 text-orange-600 animate-pulse" />
        )}
      </div>
    </div>
  );
};
