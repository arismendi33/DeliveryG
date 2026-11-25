import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/soundEffects';

interface TrafficLightGoModalProps {
  isOpen: boolean;
  onComplete: () => void;
  orderDestination?: string;
}

export const TrafficLightGoModal: React.FC<TrafficLightGoModalProps> = ({
  isOpen,
  onComplete,
  orderDestination
}) => {
  const [step, setStep] = useState<'idle' | 'red' | 'yellow' | 'green' | 'done'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setStep('idle');
      return;
    }

    soundEngine.unlock();
    let isCancelled = false;

    // Clear previous speech queue cleanly once at modal startup
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    // Phase 1: RED ("en sus marcas")
    setStep('red');
    soundEngine.speakFemaleVoice('en sus marcas');

    // Phase 2: YELLOW ("listo?")
    const timer1 = setTimeout(() => {
      if (isCancelled) return;
      setStep('yellow');
      soundEngine.speakFemaleVoice('listo?');
    }, 1250);

    // Phase 3: GREEN ("Go")
    const timer2 = setTimeout(() => {
      if (isCancelled) return;
      setStep('green');
      soundEngine.speakFemaleVoice('Go');
    }, 2500);

    // Phase 4: Complete transition back to home map
    const timer3 = setTimeout(() => {
      if (isCancelled) return;
      setStep('done');
      onComplete();
    }, 3700);

    return () => {
      isCancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none"
      >
        <div className="relative flex flex-col items-center justify-center max-w-sm w-full mx-auto text-center space-y-6">
          {/* Traffic Light Housing */}
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-4 border-zinc-700/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center gap-4"
          >
            {/* Top mounting hook */}
            <div className="w-10 h-3 -mt-6 rounded-t-md bg-zinc-700 border-t border-zinc-500" />

            {/* 🔴 RED LIGHT */}
            <div className="relative">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                  step === 'red'
                    ? 'bg-rose-500 border-rose-300 shadow-[0_0_40px_rgba(244,63,94,1),0_0_80px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-zinc-950/90 border-zinc-800 opacity-30'
                }`}
              >
                {step === 'red' && (
                  <div className="w-8 h-8 rounded-full bg-white/70 blur-xs" />
                )}
              </div>
            </div>

            {/* 🟡 YELLOW LIGHT */}
            <div className="relative">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                  step === 'yellow'
                    ? 'bg-amber-400 border-amber-200 shadow-[0_0_40px_rgba(251,191,36,1),0_0_80px_rgba(251,191,36,0.6)] animate-pulse'
                    : 'bg-zinc-950/90 border-zinc-800 opacity-30'
                }`}
              >
                {step === 'yellow' && (
                  <div className="w-8 h-8 rounded-full bg-white/70 blur-xs" />
                )}
              </div>
            </div>

            {/* 🟢 GREEN LIGHT */}
            <div className="relative">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
                  step === 'green' || step === 'done'
                    ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_50px_rgba(16,185,129,1),0_0_100px_rgba(16,185,129,0.8)] scale-110'
                    : 'bg-zinc-950/90 border-zinc-800 opacity-30'
                }`}
              >
                {(step === 'green' || step === 'done') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="w-10 h-10 rounded-full bg-white blur-xs"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Voice Prompt Text and Subtitle */}
          <div className="h-16 flex flex-col items-center justify-center">
            {step === 'red' && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-black text-rose-500 tracking-wider lowercase drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]"
              >
                en sus marcas...
              </motion.span>
            )}

            {step === 'yellow' && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider lowercase drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
              >
                listo?...
              </motion.span>
            )}

            {(step === 'green' || step === 'done') && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-widest uppercase drop-shadow-[0_0_25px_rgba(16,185,129,1)]">
                  Go
                </span>
              </motion.div>
            )}
          </div>

          {orderDestination && (
            <p className="text-xs text-zinc-400 truncate max-w-xs">
              Rumbo a: <span className="text-white font-bold">{orderDestination}</span>
            </p>
          )}

          {/* Skip button if user wants to start instantly */}
          <button
            onClick={() => {
              setStep('done');
              onComplete();
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline pt-2"
          >
            Saltar animación
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
