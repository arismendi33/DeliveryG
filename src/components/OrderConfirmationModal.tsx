import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  DollarSign,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  Shield,
  AlertCircle,
  Footprints,
  Bike,
  PackageCheck
} from 'lucide-react';
import { DriverOrder } from '../types';

interface OrderConfirmationModalProps {
  order: DriverOrder | null;
  isOpen: boolean;
  onConfirm: (order: DriverOrder) => void;
  onDecline: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onConfirm,
  onDecline
}) => {
  if (!isOpen || !order) return null;

  const isWalking = order.distanceKm <= 1.0 || order.isWalkingFriendly;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white"
        >
          {/* Header */}
          <div className="px-6 py-4.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-[#00E5FF]">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide uppercase text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Confirmar Corrida</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 dark:bg-[#00E5FF]/20 text-orange-600 dark:text-[#00E5FF] font-mono font-bold">
                    #{order.id.slice(-4)}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Revisa los detalles antes de aceptar el despacho
                </p>
              </div>
            </div>

            <button
              onClick={onDecline}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Value & Distance Hero Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {/* Valor / Pago */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-gradient-to-br dark:from-emerald-500/15 dark:via-emerald-500/5 dark:to-transparent border border-emerald-500/30 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Ganancia Estimada
                </span>
                <div className="mt-1">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    ${order.payoutUsd.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300/80 font-mono font-bold">
                    ≈ {order.payoutVes.toFixed(2)} VES
                  </div>
                </div>
              </div>

              {/* Kilómetros y Tiempo */}
              <div className="p-4 rounded-2xl bg-orange-500/10 dark:bg-gradient-to-br dark:from-[#00E5FF]/15 dark:via-[#00E5FF]/5 dark:to-transparent border border-orange-500/30 dark:border-[#00E5FF]/30 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 dark:text-[#00E5FF] flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> Distancia Total
                </span>
                <div className="mt-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                    {order.distanceKm.toFixed(1)} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">km</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-500 dark:text-[#00E5FF]" /> {order.estimatedMinutes} mins est.
                  </div>
                </div>
              </div>
            </div>

            {/* Ruta: Búsqueda (Punto A) y Entrega (Punto B) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-4 relative">
              {/* Vertical connector line */}
              <div className="absolute left-[29px] top-[38px] bottom-[38px] w-0.5 bg-gradient-to-b from-orange-500 via-amber-400 to-emerald-500 opacity-50" />

              {/* Punto A: Lugar de Búsqueda / Recogida */}
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-7 h-7 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Punto de Búsqueda / Recogida
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold">
                      Origen
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {order.pickup.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {order.pickup.address}
                  </p>
                </div>
              </div>

              {/* Punto B: Lugar de Entrega / Destino */}
              <div className="flex items-start gap-3.5 relative z-10 pt-2 border-t border-slate-200/60 dark:border-white/5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Punto de Entrega / Destino
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold">
                      Destino
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {order.dropoff.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {order.dropoff.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles complementarios (Paquete, Método de pago, Modalidad) */}
            <div className="flex items-center justify-between text-xs px-2 py-1 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-500 dark:text-[#00E5FF]" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{order.packageType}</span>
              </div>
              <div className="flex items-center gap-2">
                {isWalking && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                    <Footprints className="w-3 h-3" /> A pie
                  </span>
                )}
                {order.paymentType && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-semibold text-[10px]">
                    {order.paymentType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Rechazar o Aceptar */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
            <button
              onClick={onDecline}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-200/80 hover:bg-rose-500/20 hover:text-rose-600 dark:bg-white/10 dark:hover:bg-rose-500/20 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-300/60 dark:border-white/10 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Rechazar</span>
            </button>

            <button
              onClick={() => onConfirm(order)}
              className="flex-[1.5] py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 dark:from-[#00E5FF] dark:to-emerald-400 hover:opacity-95 text-white dark:text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 dark:shadow-[#00E5FF]/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aceptar Corrida</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
