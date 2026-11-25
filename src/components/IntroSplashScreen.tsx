import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import splashHeroImg from '../assets/images/splash_hero_delivery_1795404941634.jpg';

interface IntroSplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({
  onComplete,
  durationMs = 2900
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    try {
      soundEngine.unlock();
      soundEngine.playAdvanceChime();
      soundEngine.vibrate([15, 25]);
    } catch {
      // Ignored if browser blocks audio before first gesture
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 420);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 220);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="intro-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleSkip}
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-gradient-to-br from-[#FF3700] via-[#FF6A00] to-[#FFAE00] text-white select-none overflow-hidden cursor-pointer"
        >
          {/* Original Studio 3D Hero Artwork Matching App Menu Palette */}
          <motion.img
            src={splashHeroImg}
            alt="Go Delivery Express"
            initial={{ scale: 1.08, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Measured Contrast Scrims (Menu Obsidian #0b0f19 + Brand Sunset Glow) */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b0f19]/95 via-[#0b0f19]/25 to-[#0b0f19]/40"
            aria-hidden="true"
          />

          {/* Top Editorial Header */}
          <div className="relative z-10 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] px-6 sm:px-8 flex items-center justify-between max-w-2xl w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center p-1.5">
                <img
                  src="/89340.svg"
                  alt="GO"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold tracking-[0.18em] uppercase text-white/95 drop-shadow">
                Ciudad Guayana
              </span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.35 }}
              className="text-xs font-semibold tracking-wide text-white/90 hover:text-white px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/15"
            >
              Omitir
            </motion.span>
          </div>

          {/* Bottom Clean Editorial Lockup & Menu-Gradient Action */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ paddingBottom: 'calc(2.25rem + env(safe-area-inset-bottom, 0px))' }}
            className="relative z-10 px-6 sm:px-8 max-w-2xl w-full mx-auto flex items-end justify-between gap-4"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFAE00]">
                Entregas al instante
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                Go Delivery
              </h1>
              <p className="text-xs text-white/80 font-medium pt-0.5">
                Red profesional de repartidores y envíos locales
              </p>
            </div>

            <div className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#FF3700] via-[#FF6A00] to-[#FFAE00] text-white font-bold text-xs tracking-wide shadow-[0_10px_28px_rgba(255,55,0,0.4)] border border-white/25 flex items-center gap-1.5 shrink-0">
              <span>Entrar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
