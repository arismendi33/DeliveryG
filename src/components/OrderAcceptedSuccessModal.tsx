import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  ArrowRight,
  Building2,
  UserCheck,
  CheckCircle2,
  X,
  Phone,
  MessageSquare
} from 'lucide-react';
import { DriverOrder } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface OrderAcceptedSuccessModalProps {
  order: DriverOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToActiveDelivery: () => void;
}

export const OrderAcceptedSuccessModal: React.FC<OrderAcceptedSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onNavigateToActiveDelivery
}) => {
  if (!isOpen || !order) return null;

  // Destination point for initial stage is Pickup (Punto A)
  const targetCoords = order?.pickup?.coords || { lat: 8.2965, lng: -62.7315 };
  const dropoffCoords = order?.dropoff?.coords || { lat: 8.2835, lng: -62.7225 };
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${targetCoords.lat},${targetCoords.lng}&travelmode=driving`;
  const dropoffMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${dropoffCoords.lat},${dropoffCoords.lng}&travelmode=driving`;

  const handleOpenGoogleMaps = () => {
    soundEngine.playAdvanceChime();
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="w-full max-w-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white"
        >
          {/* Header with Success Badge */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  ¡Corrida Aceptada con Éxito!
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  Información de la Dirección y Ruta
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Primary Action: Direct Google Maps & Waze Navigation Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Navegación GPS Externa (Google Maps o Waze)
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Trazar ruta inmediata a Punto A
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Puedes usar Google Maps o Waze con tráfico en tiempo real
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenGoogleMaps}
                  className="px-3.5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#00cce6] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/25 transition active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={`https://waze.com/ul?ll=${targetCoords.lat},${targetCoords.lng}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playAdvanceChime()}
                  className="px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/25 transition active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Waze</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Address Details: Punto A (Recogida) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    A
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Punto de Recogida / Búsqueda
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300">
                  Primer Destino
                </span>
              </div>

              <div className="pl-8 space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {order.pickup.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{order.pickup.address}</span>
                </p>
                {order.pickup.details && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-amber-500/5 p-2 rounded-xl border border-amber-500/15">
                    Nota: {order.pickup.details}
                  </p>
                )}

                {/* Contact row */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Contacto: <strong className="text-slate-800 dark:text-slate-200">{order.pickup.contactName}</strong>
                  </span>
                  <a
                    href={`tel:${order.pickup.contactPhone}`}
                    className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{order.pickup.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Address Details: Punto B (Entrega) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    B
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Punto de Entrega / Destino
                  </span>
                </div>
                <a
                  href={dropoffMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex items-center gap-1 transition"
                  title="Ver destino en Maps"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Maps Destino</span>
                </a>
              </div>

              <div className="pl-8 space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {order.dropoff.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{order.dropoff.address}</span>
                </p>
                {order.dropoff.details && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/15">
                    Nota: {order.dropoff.details}
                  </p>
                )}

                {/* Contact row */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Destinatario: <strong className="text-slate-800 dark:text-slate-200">{order.dropoff.contactName}</strong>
                  </span>
                  <a
                    href={`tel:${order.dropoff.contactPhone}`}
                    className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{order.dropoff.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Trip summary values */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Distancia</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{order.distanceKm} km</span>
              </div>
              <div className="w-px h-6 bg-slate-300 dark:bg-white/10" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tiempo Est.</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">~{order.estimatedMinutes} min</span>
              </div>
              <div className="w-px h-6 bg-slate-300 dark:bg-white/10" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">${order.payoutUsd.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenGoogleMaps}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#00E5FF]" />
              <span>Abrir Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={onNavigateToActiveDelivery}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <span>Ver en el Mapa de la App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
