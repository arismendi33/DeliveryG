import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  ExternalLink,
  CheckCircle,
  Navigation,
  Clock,
  ChevronLeft,
  User,
  Home,
  Volume2
} from 'lucide-react';
import { DriverOrder } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { soundEngine } from '../utils/soundEffects';

interface Phase3OnRouteScreenProps {
  order: DriverOrder;
  onAdvanceToPhase4: () => void;
  onBackToPhase2: () => void;
  hideMap?: boolean;
}

export const Phase3OnRouteScreen: React.FC<Phase3OnRouteScreenProps> = ({
  order,
  onAdvanceToPhase4,
  onBackToPhase2,
  hideMap = false
}) => {
  const dropoffLat = order.dropoff?.coords?.lat ?? 8.2835;
  const dropoffLng = order.dropoff?.coords?.lng ?? -62.7225;

  useEffect(() => {
    soundEngine.unlock();
    const t = setTimeout(() => {
      soundEngine.speakPhase3();
    }, 350);
    return () => clearTimeout(t);
  }, [order.id]);

  const handleReplayVoice = () => {
    soundEngine.unlock();
    soundEngine.speakPhase3();
  };

  return (
    <div className={`relative ${hideMap ? 'w-full' : 'min-h-[100dvh]'} w-full bg-slate-900 text-white flex flex-col justify-between overflow-x-hidden select-none`}>
      {/* Top Bar */}
      <header className="z-20 px-3 sm:px-4 py-3 flex items-center justify-between gap-2 bg-black/85 backdrop-blur-xl border-b border-white/10 shrink-0 min-w-0">
        <button
          type="button"
          onClick={onBackToPhase2}
          className="h-9 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white transition flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span>Fase 2</span>
        </button>

        <div className="flex flex-col items-center min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Fase 3 de 4
          </span>
          <span className="text-xs font-black tracking-tight text-white truncate max-w-full">
            En Ruta al Destino
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReplayVoice}
            title="Escuchar indicaciones con voz venezolana"
            className="w-9 h-9 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 active:scale-95 transition flex items-center justify-center cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 rounded-xl text-[11px] font-mono font-bold bg-white/10 text-blue-400 border border-white/10 tabular-nums">
            {order.distanceKm} km
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 max-w-lg mx-auto w-full">
        {/* Navigation Map - only if not already displayed in persistent parent */}
        {!hideMap && (
          <div className="relative h-60 sm:h-72 w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900">
            <InteractiveMap
              pickup={order.pickup}
              dropoff={order.dropoff}
              pickupCoords={order.pickup?.coords}
              dropoffCoords={order.dropoff?.coords}
              pickupTitle={order.pickup?.title}
              dropoffTitle={order.dropoff?.title}
              status="in_transit_delivery"
              isTracking={true}
              deliveryPhase={3}
            />

            {/* Floating Route Metrics on Map */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 text-xs font-bold z-10">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Navigation className="w-3.5 h-3.5" />
                <span>{order.distanceKm} km restantes</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>~{order.estimatedMinutes} min</span>
              </span>
            </div>
          </div>
        )}

        {/* GPS Route Destination Recommendation Banner & Quick Action Buttons */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600/15 via-sky-600/15 to-indigo-600/15 border border-blue-500/30 backdrop-blur-md space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Navegación Asistida GPS
              </h4>
              <p className="text-xs text-blue-200 leading-snug">
                Puedes usar <b className="text-white font-bold">Google Maps</b> o <b className="text-sky-300 font-bold">Waze</b> para guiarte en tu ruta de destino paso a paso con tráfico en tiempo real.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${dropoffLat},${dropoffLng}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playAdvanceChime()}
              className="py-3 px-3.5 rounded-2xl bg-[#00E5FF] hover:bg-[#00cce6] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#00E5FF]/20 active:scale-95 transition cursor-pointer"
            >
              <span>Abrir Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://waze.com/ul?ll=${dropoffLat},${dropoffLng}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playAdvanceChime()}
              className="py-3 px-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition cursor-pointer"
            >
              <span>Abrir Waze</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Destination Details Card */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Punto de Entrega
              </span>
              <h3 className="text-sm font-black text-white leading-tight">
                {order.dropoff.title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {order.dropoff.address}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-amber-400 text-xs font-black">
                <Home className="w-3.5 h-3.5" />
                <span>{order.houseApartmentNumber || 'Casa #18 / Apto 4'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Action Footer */}
      <footer className="p-4 sm:p-5 bg-black/90 backdrop-blur-xl border-t border-white/10 max-w-lg mx-auto w-full shrink-0">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            soundEngine.playAdvanceChime();
            onAdvanceToPhase4();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>He llegado al Destino / Llegada</span>
          <CheckCircle className="w-4 h-4 stroke-[3]" />
        </button>
      </footer>
    </div>
  );
};
