import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Package,
  Store,
  ChevronLeft,
  Info,
  Volume2
} from 'lucide-react';
import { DriverOrder } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { soundEngine } from '../utils/soundEffects';

interface Phase1PickupScreenProps {
  order: DriverOrder;
  onAdvanceToPhase2: () => void;
  onCancelOrBack: () => void;
  hideMap?: boolean;
}

export const Phase1PickupScreen: React.FC<Phase1PickupScreenProps> = ({
  order,
  onAdvanceToPhase2,
  onCancelOrBack,
  hideMap = false
}) => {
  useEffect(() => {
    soundEngine.unlock();
    const t = setTimeout(() => {
      soundEngine.speakPhase1();
    }, 350);
    return () => clearTimeout(t);
  }, [order.id]);

  const handleReplayVoice = () => {
    soundEngine.unlock();
    soundEngine.speakPhase1();
  };

  return (
    <div className={`relative ${hideMap ? 'w-full' : 'min-h-[100dvh]'} w-full bg-slate-900 text-white flex flex-col justify-between overflow-x-hidden select-none`}>
      {/* Top Navigation Bar */}
      <header className="z-20 px-3 sm:px-4 py-3 flex items-center justify-between gap-2 bg-black/85 backdrop-blur-xl border-b border-white/10 shrink-0 min-w-0">
        <button
          type="button"
          onClick={onCancelOrBack}
          className="h-9 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white transition flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">Mapa</span>
        </button>

        <div className="flex flex-col items-center min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
            Fase 1 de 4
          </span>
          <span className="text-xs font-black tracking-tight text-white truncate max-w-full">
            Recogida en Comercio
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReplayVoice}
            title="Escuchar indicaciones con voz venezolana"
            className="w-9 h-9 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 active:scale-95 transition flex items-center justify-center cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-white/10 text-orange-400 border border-white/10">
            {order.id}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 max-w-lg mx-auto w-full">
        {/* Map Preview of Merchant - only if not already displayed in persistent parent */}
        {!hideMap && (
          <div className="relative h-44 sm:h-52 w-full rounded-3xl overflow-hidden border border-white/15 shadow-xl bg-zinc-900">
            <InteractiveMap
              pickup={order.pickup}
              dropoff={order.dropoff}
              pickupCoords={order.pickup.coords}
              dropoffCoords={order.dropoff.coords}
              pickupTitle={order.pickup.title}
              dropoffTitle={order.dropoff.title}
              status="accepted"
              isTracking={false}
              deliveryPhase={1}
            />
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 z-10">
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span>Punto de Retiro</span>
            </div>
          </div>
        )}

        {/* Merchant Info Card */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-md">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Comercio Emisor
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                {order.pickup.title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {order.pickup.address}
              </p>
            </div>
          </div>
        </div>

        {/* Big Code Card to Show to Merchant */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 to-orange-500/5 border-2 border-amber-500/40 text-center space-y-2 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
            Número para el Comercio
          </span>

          <div className="text-5xl font-black font-mono tracking-widest text-amber-400 py-1 drop-shadow-md">
            {order.pickupMerchantCode || '#7492'}
          </div>

          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            Muestra este número al encargado del comercio para que te entregue el pedido asignado.
          </p>
        </div>

        {/* Package Specifications */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-orange-400" />
              <span>Tipo de paquete:</span>
            </span>
            <strong className="text-white font-bold">{order.packageType}</strong>
          </div>

          {order.notesForDriver && (
            <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-slate-400">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] italic">{order.notesForDriver}</p>
            </div>
          )}
        </div>
      </main>

      {/* Action Footer */}
      <footer className="p-4 sm:p-5 bg-black/90 backdrop-blur-xl border-t border-white/10 max-w-lg mx-auto w-full shrink-0">
        <button
          type="button"
          onClick={() => {
            soundEngine.unlock();
            soundEngine.playAdvanceChime();
            onAdvanceToPhase2();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Dar Salida / Recibir Datos</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </footer>
    </div>
  );
};
