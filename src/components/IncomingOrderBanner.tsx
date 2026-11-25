import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BellRing,
  MapPin,
  DollarSign,
  ArrowRight,
  X,
  Zap,
  Sparkles,
  Store,
  ChevronRight
} from 'lucide-react';
import { DriverOrder } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface IncomingOrderBannerProps {
  order: DriverOrder | null;
  onAccept: (order: DriverOrder) => void;
  onViewList: () => void;
  onDismiss: () => void;
  exchangeRate: number;
}

export const IncomingOrderBanner: React.FC<IncomingOrderBannerProps> = ({
  order,
  onAccept,
  onViewList,
  onDismiss,
  exchangeRate
}) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -80, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-[420px] z-50 pointer-events-auto"
        style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white rounded-3xl p-4 shadow-2xl border-2 border-emerald-500/80 backdrop-blur-xl ring-4 ring-emerald-500/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                ¡Nuevo Pedido de App Externa!
              </span>
            </div>
            <button
              onClick={() => {
                soundEngine.vibrate(20);
                onDismiss();
              }}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-white font-black text-sm truncate">
                <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{order.pickup.title}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{order.dropoff.address}</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Cliente: <span className="text-white font-medium">{order.clientName}</span> • {order.packageType}
              </div>
            </div>

            <div className="text-right shrink-0 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl px-3 py-1.5">
              <div className="text-base font-black text-emerald-400">
                +${order.payoutUsd.toFixed(2)}
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-300">
                ≈ {(order.payoutUsd * exchangeRate).toFixed(2)} Bs
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                soundEngine.vibrate(25);
                onViewList();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors text-center"
            >
              Ver en Cola ({order.id})
            </button>
            <button
              onClick={() => {
                soundEngine.vibrate([40, 60, 40]);
                onAccept(order);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Aceptar Ahora</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
