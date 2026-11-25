import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  ShieldAlert,
  Headphones,
  CheckCircle2,
  ChevronLeft,
  User,
  Sparkles,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { DriverOrder } from '../types';
import { RouteSuccessModal } from './RouteSuccessModal';
import { soundEngine } from '../utils/soundEffects';

interface Phase4PinScreenProps {
  order: DriverOrder;
  onFinishDelivery: (orderId: string, pin: string) => void;
  onBackToPhase3: () => void;
  onOpenSupport?: () => void;
}

export const Phase4PinScreen: React.FC<Phase4PinScreenProps> = ({
  order,
  onFinishDelivery,
  onBackToPhase3,
  onOpenSupport
}) => {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [pinError, setPinError] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.unlock();
    const t = setTimeout(() => {
      soundEngine.speakPhase4();
    }, 350);
    return () => clearTimeout(t);
  }, [order.id]);

  const handleReplayVoice = () => {
    soundEngine.unlock();
    soundEngine.speakPhase4();
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = val.slice(-1);
    setPinDigits(newDigits);
    setPinError(false);

    // Auto advance focus
    if (val && index < 3) {
      const nextInput = document.getElementById(`phase4-pin-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto validate when 4 digits are entered
    const combined = newDigits.join('');
    if (combined.length === 4) {
      if (combined === order.securityPin) {
        soundEngine.unlock();
        soundEngine.speakOrderSuccess();
        setIsSuccessModalOpen(true);
      } else {
        soundEngine.vibrate([80, 50, 80]);
        setPinError(true);
      }
    }
  };

  const handleClearPin = () => {
    setPinDigits(['', '', '', '']);
    setPinError(false);
    const firstInput = document.getElementById('phase4-pin-input-0');
    if (firstInput) firstInput.focus();
  };

  const handleConfirmFinish = () => {
    setIsSuccessModalOpen(false);
    onFinishDelivery(order.id, order.securityPin);
  };

  return (
    <div className="relative w-full bg-slate-900 text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Bar */}
      <header className="z-20 px-3 sm:px-4 py-3 flex items-center justify-between gap-2 bg-black/85 backdrop-blur-xl border-b border-white/10 shrink-0 min-w-0">
        <button
          type="button"
          onClick={onBackToPhase3}
          className="h-9 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white transition flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span>Fase 3</span>
        </button>

        <div className="flex flex-col items-center min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
            Fase 4 de 4
          </span>
          <span className="text-xs font-black tracking-tight text-white truncate max-w-full">
            Validación de PIN
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReplayVoice}
            title="Escuchar indicaciones con voz venezolana"
            className="w-9 h-9 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 active:scale-95 transition flex items-center justify-center cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-white/10 text-rose-400 border border-white/10">
            PIN
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-lg mx-auto w-full flex flex-col justify-center">
        {/* Recipient summary */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Entrega a Destinatario
          </span>
          <h3 className="text-base font-black text-white truncate">{order.clientName}</h3>
          <p className="text-xs text-slate-300">{order.dropoff.address}</p>
        </div>

        {/* PIN Input Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4 shadow-xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">
              Pide el PIN al Cliente
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              El cliente tiene un código de 4 dígitos en su app para autorizar y cerrar esta entrega.
            </p>
          </div>

          {/* 4 Digit Boxes */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                id={`phase4-pin-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pinDigits[idx]}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-black rounded-2xl border-2 transition-all outline-none ${
                  pinError
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-shake'
                    : pinDigits[idx]
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-white/20 bg-white/5 text-white focus:border-orange-500'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold px-2">
              <span>PIN incorrecto. Vuelve a intentar.</span>
              <button
                type="button"
                onClick={handleClearPin}
                className="underline text-slate-400 hover:text-white"
              >
                Limpiar casillas
              </button>
            </div>
          )}

          {/* Sutil helper para pruebas */}
          <div className="text-[11px] font-mono text-slate-500 pt-2">
            (PIN de demostración: <span className="text-orange-400 font-bold">{order.securityPin}</span>)
          </div>
        </div>

        {/* Fallback Support & Emergency Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (onOpenSupport) onOpenSupport();
            }}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition"
          >
            <Headphones className="w-4 h-4 text-blue-400" />
            <span>Soporte Técnico</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenSupport) onOpenSupport();
            }}
            className="py-3 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30 active:scale-95 transition"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>SOS Emergencia</span>
          </button>
        </div>
      </main>

      {/* Instantaneous Success Modal: "¡Ruta Satisfactoria!" */}
      <RouteSuccessModal
        isOpen={isSuccessModalOpen}
        order={order}
        onConfirm={handleConfirmFinish}
      />
    </div>
  );
};
