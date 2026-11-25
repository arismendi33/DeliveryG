import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import { DriverOrder } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface RouteSuccessModalProps {
  isOpen: boolean;
  order: DriverOrder | null;
  onConfirm: () => void;
}

export const RouteSuccessModal: React.FC<RouteSuccessModalProps> = ({
  isOpen,
  order,
  onConfirm
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.unlock();
      soundEngine.playCompleteDelivery();
      const t = setTimeout(() => {
        soundEngine.speakOrderSuccess();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.85, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative max-w-sm w-full bg-white dark:bg-[#0c101b] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center space-y-5"
        >
          {/* Animated Glow Circle */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-emerald-500/25 blur-md"
            />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-white">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              ¡Ruta Satisfactoria!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PIN validado con éxito. Entrega registrada y finalizada.
            </p>
          </div>

          {/* Earning Card */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">
              Abonado a tu Billetera
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1">
              +${order.payoutUsd.toFixed(2)} USD
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
              ≈ {order.payoutVes.toLocaleString()} Bs
            </span>
          </div>

          {/* Client & Destination Summary */}
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-white/5 p-3 rounded-xl text-left">
            <div>
              <strong className="text-slate-700 dark:text-slate-200">Cliente: </strong>
              <span>{order.clientName}</span>
            </div>
            <div>
              <strong className="text-slate-700 dark:text-slate-200">Destino: </strong>
              <span>{order.dropoff.title}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>Aceptar y Continuar</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
