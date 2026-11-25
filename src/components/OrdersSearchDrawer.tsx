import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Navigation,
  DollarSign,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  RefreshCw,
  Radio
} from 'lucide-react';
import { DriverOrder } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { soundEngine } from '../utils/soundEffects';

interface OrdersSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: DriverOrder[];
  onAcceptOrderWithTrafficLight: (order: DriverOrder) => void;
  onRefreshOrders?: () => void;
  onOpenGoComercios?: () => void;
}

export const OrdersSearchDrawer: React.FC<OrdersSearchDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onAcceptOrderWithTrafficLight,
  onRefreshOrders,
  onOpenGoComercios
}) => {
  const [countdown, setCountdown] = useState<number>(30);
  const [previewOrder, setPreviewOrder] = useState<DriverOrder | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const onRefreshOrdersRef = useRef(onRefreshOrders);
  useEffect(() => {
    onRefreshOrdersRef.current = onRefreshOrders;
  }, [onRefreshOrders]);

  // Safe 30s countdown interval without side effects inside state updaters
  useEffect(() => {
    if (!isOpen) {
      setCountdown(30);
      setIsRefreshing(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // When countdown cycles back to 30 while drawer is open, safely notify and refresh
  useEffect(() => {
    if (!isOpen || countdown !== 30) return;

    setIsRefreshing(true);
    try {
      soundEngine.vibrate([25, 35, 25]);
      soundEngine.playNewOrderAlert();
      if (onRefreshOrdersRef.current) {
        onRefreshOrdersRef.current();
      }
    } catch (e) {
      console.warn('Orders refresh warning:', e);
    }
    const endTimer = setTimeout(() => setIsRefreshing(false), 800);
    return () => clearTimeout(endTimer);
  }, [countdown, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sliding Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            maxHeight: 'calc(88dvh - env(safe-area-inset-top, 0px))',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
          }}
          className="relative z-10 w-full max-w-xl mx-auto bg-white dark:bg-[#0c101b] border-t border-slate-200 dark:border-white/15 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header Drag Handle & Title Bar */}
          <div className="pt-3 pb-2.5 px-4 sm:px-5 flex flex-col items-center border-b border-slate-100 dark:border-white/10 shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/20 mb-2.5" />

            <div className="w-full flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
                  Bolsa de Pedidos
                </span>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 shrink-0 tabular-nums">
                  · {orders.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/25 text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                  <RefreshCw className={`w-3 h-3 text-orange-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{countdown}s</span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar bolsa de pedidos"
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Orders Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Live Counter Widget with ONLY orange waves and ONLY numbers counting down */}
            <div className="p-4 rounded-3xl bg-gradient-to-b from-orange-500/12 via-amber-500/5 to-transparent border border-orange-500/25 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
              {/* Concentric Orange-Only Waves */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center my-1">
                <motion.div
                  animate={{ scale: [0.6, 2.1], opacity: [0.85, 0] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-orange-500/80 bg-orange-500/10 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [0.6, 2.1], opacity: [0.85, 0] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeOut', delay: 0.65 }}
                  className="absolute inset-0 rounded-full border-2 border-orange-500/80 bg-orange-500/10 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [0.6, 2.1], opacity: [0.85, 0] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeOut', delay: 1.3 }}
                  className="absolute inset-0 rounded-full border-2 border-orange-500/80 bg-orange-500/10 pointer-events-none"
                />
                
                {/* Center Circle with ONLY numbers counting down */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(249,115,22,0.7)] border-2 border-orange-200 z-10 select-none">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight leading-none drop-shadow">
                    {countdown}
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
                  <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  <span>Búsqueda de Pedidos Entrantes · Guayana</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Generación constante de nuevos despachos cada 30 segundos
                </p>
              </div>
            </div>

            {/* Go Comercios Quick Link Banner */}
            {onOpenGoComercios && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/5 border border-orange-500/25 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-md">
                    🏪
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight truncate">
                      Go Comercios · Red Aliados
                    </span>
                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block leading-tight">
                      Donde los negocios envían pedidos a Go Delivery
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGoComercios();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shrink-0 active:scale-95 transition cursor-pointer shadow-xs"
                >
                  Abrir App
                </button>
              </div>
            )}

            {/* If no orders */}
            {orders.length === 0 ? (
              <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Buscando nuevas rutas en tu zona...
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Escaneando comercios en Puerto Ordaz y San Félix. Siguiente lote en {countdown}s.
                  </p>
                </div>
              </div>
            ) : (
              /* Available Orders List */
              orders.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundEngine.unlock();
                    soundEngine.playNotification();
                    setPreviewOrder(item);
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-sm relative group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Destino:</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.dropoff.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.dropoff.address}
                      </p>
                    </div>

                    {/* Value Badge */}
                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ${item.payoutUsd.toFixed(2)}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400">
                        {item.payoutVes.toLocaleString()} Bs
                      </span>
                    </div>
                  </div>

                  {/* Route Quick Metrics */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-orange-500" />
                        <strong>{item.distanceKm} km</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <strong>~{item.estimatedMinutes} min</strong>
                      </span>
                    </div>

                    <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Ver ruta <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Instantaneous Order Route Preview Modal with Map */}
        <AnimatePresence>
          {previewOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
            >
              <div className="w-full max-w-lg bg-white dark:bg-[#0c101b] rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Top Bar with Map Route */}
                <div className="relative h-48 sm:h-56 w-full bg-slate-200 dark:bg-zinc-900 overflow-hidden">
                  <InteractiveMap
                    pickup={previewOrder.pickup}
                    dropoff={previewOrder.dropoff}
                    pickupCoords={previewOrder.pickup?.coords}
                    dropoffCoords={previewOrder.dropoff?.coords}
                    pickupTitle={previewOrder.pickup?.title}
                    dropoffTitle={previewOrder.dropoff?.title}
                    isTracking={false}
                  />

                  {/* Close Preview */}
                  <button
                    onClick={() => setPreviewOrder(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black transition z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-2 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 z-10">
                    <span>{previewOrder.distanceKm} km</span>
                    <span>•</span>
                    <span>~{previewOrder.estimatedMinutes} min</span>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
                  {/* Payout Banner */}
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                        Ganancia Neta Estimada
                      </span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        ${previewOrder.payoutUsd.toFixed(2)} USD
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      ≈ {previewOrder.payoutVes.toLocaleString()} Bs
                    </span>
                  </div>

                  {/* Route Points */}
                  <div className="space-y-3">
                    {/* Origin / Recogida */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        1
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Punto de Recogida (Comercio)
                        </span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {previewOrder.pickup.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {previewOrder.pickup.address}
                        </p>
                      </div>
                    </div>

                    {/* Destination / Entrega */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        2
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Punto de Entrega (Destino)
                        </span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {previewOrder.dropoff.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {previewOrder.dropoff.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Package Notes */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Tipo de paquete: </span>
                    {previewOrder.packageType}
                  </div>
                </div>

                {/* Bottom Action Buttons: Rechazar vs Aceptar */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#0c101b] shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playNotification();
                      setPreviewOrder(null);
                    }}
                    className="w-full py-3 rounded-2xl border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition"
                  >
                    Rechazar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const selected = previewOrder;
                      setPreviewOrder(null);
                      onClose();
                      onAcceptOrderWithTrafficLight(selected);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Aceptar</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
