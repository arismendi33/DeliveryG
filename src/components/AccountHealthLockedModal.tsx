import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Headphones,
  RotateCcw,
  CheckCircle2,
  X,
  HeartPulse,
  Info,
  PhoneCall
} from 'lucide-react';
import { DriverProfile } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface AccountHealthLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverProfile;
  onRestoreHealth: () => void;
  onOpenSupport?: () => void;
}

export const AccountHealthLockedModal: React.FC<AccountHealthLockedModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRestoreHealth,
  onOpenSupport
}) => {
  if (!isOpen) return null;

  const score = profile.healthScore ?? 100;
  const isLocked = profile.isLocked || score <= 0;
  const unfulfilledCount = profile.unfulfilledOrdersCount ?? 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white flex flex-col"
        >
          {/* Header Banner */}
          <div className={`p-6 text-center relative overflow-hidden ${
            isLocked
              ? 'bg-gradient-to-b from-red-500/25 via-rose-500/15 to-transparent border-b border-red-500/25'
              : 'bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent border-b border-amber-500/25'
          }`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition cursor-pointer text-slate-500 dark:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon */}
            <div className="relative inline-flex items-center justify-center my-2">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 ${
                isLocked
                  ? 'bg-red-600/20 border-red-500 text-red-500 shadow-red-500/40 animate-pulse'
                  : 'bg-amber-600/20 border-amber-500 text-amber-500 shadow-amber-500/40'
              }`}>
                {isLocked ? (
                  <Lock className="w-9 h-9 stroke-[2.4]" />
                ) : (
                  <HeartPulse className="w-9 h-9 stroke-[2.4]" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-black mt-2 tracking-tight">
              {isLocked ? 'Cuenta Bloqueada por Score' : 'Estado de Salud de la Cuenta'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {isLocked
                ? 'Tu cuenta ha sido suspendida automáticamente al llegar a 0 puntos de salud.'
                : 'Monitoreo de cumplimiento y calidad de servicio Go Delivery.'}
            </p>
          </div>

          {/* Body Info */}
          <div className="p-6 space-y-4">
            {/* Score Metric Card */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isLocked
                ? 'bg-red-500/10 border-red-500/30'
                : score < 50
                ? 'bg-orange-500/10 border-orange-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Puntuación de Salud
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-3xl font-black font-mono ${
                    isLocked ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {score}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/ 100 pts</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                  isLocked
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                    : score < 50
                    ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isLocked ? 'Suspendida' : score < 50 ? 'Riesgo Alto' : 'Óptima'}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {unfulfilledCount} pedidos no entregados
                </span>
              </div>
            </div>

            {/* Explanation Warning */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200 font-bold">
                    Regla de Despacho y Penalización:
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Cada pedido aceptado y no entregado descuenta <strong>25 puntos</strong> del Score de salud. Al llegar a <strong>0 puntos</strong>, la cuenta queda inhabilitada para conectarse a turnos o aceptar carreras.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Para solicitar una reactivación manual de tu cuenta oficial o apelar un pedido cancelado, comunícate con el equipo central de soporte de Guayana.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-2.5">
            {onOpenSupport && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSupport();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
              >
                <Headphones className="w-4 h-4" />
                <span>Contactar Soporte</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundEngine.unlock();
                soundEngine.playAdvanceChime();
                onRestoreHealth();
                onClose();
              }}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restablecer a 100 Pts</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
