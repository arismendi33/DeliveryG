import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Package,
  Phone,
  Home,
  User,
  ChevronLeft,
  CheckCircle2,
  DollarSign,
  Volume2
} from 'lucide-react';
import { DriverOrder } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface Phase2PackageScreenProps {
  order: DriverOrder;
  onAdvanceToPhase3: () => void;
  onBackToPhase1: () => void;
}

export const Phase2PackageScreen: React.FC<Phase2PackageScreenProps> = ({
  order,
  onAdvanceToPhase3,
  onBackToPhase1
}) => {
  useEffect(() => {
    soundEngine.unlock();
    const t = setTimeout(() => {
      soundEngine.speakPhase2();
    }, 350);
    return () => clearTimeout(t);
  }, [order.id]);

  const handleReplayVoice = () => {
    soundEngine.unlock();
    soundEngine.speakPhase2();
  };

  return (
    <div className="relative w-full bg-slate-900 text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Bar */}
      <header className="z-20 px-3 sm:px-4 py-3 flex items-center justify-between gap-2 bg-black/85 backdrop-blur-xl border-b border-white/10 shrink-0 min-w-0">
        <button
          type="button"
          onClick={onBackToPhase1}
          className="h-9 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white transition flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span>Fase 1</span>
        </button>

        <div className="flex flex-col items-center min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Fase 2 de 4
          </span>
          <span className="text-xs font-black tracking-tight text-white truncate max-w-full">
            Verificación del Paquete
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReplayVoice}
            title="Escuchar indicaciones con voz venezolana"
            className="w-9 h-9 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 active:scale-95 transition flex items-center justify-center cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-white/10 text-emerald-400 border border-white/10">
            {order.id}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-lg mx-auto w-full">
        {/* Recipient Details Card */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Datos del Destinatario Revelados</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
              Desbloqueado
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-white truncate">
                {order.clientName}
              </h3>
              <p className="text-xs text-slate-300 truncate">
                Destinatario de la entrega
              </p>
            </div>
            {order.clientPhone && (
              <a
                href={`tel:${order.clientPhone}`}
                className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 active:scale-95 transition flex items-center justify-center"
                title="Llamar al cliente"
              >
                <Phone className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Destination Address */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sector / Dirección:</span>
                <p className="text-sm font-bold text-white leading-snug">{order.dropoff.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs bg-white/5 p-3 rounded-2xl border border-white/10">
              <Home className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Casa / Edificio / Apto:</span>
                <p className="text-sm font-black text-amber-400">{order.houseApartmentNumber || 'Torre C, Apto 4-B'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Package & Payment Summary */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-400" />
              <span>Contenido:</span>
            </span>
            <strong className="text-white font-bold">{order.packageType}</strong>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sello de seguridad:</span>
            </span>
            <strong className="text-emerald-400 font-bold">Sellado e intacto</strong>
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Tipo de cobro:</span>
            </span>
            <strong className="text-white font-bold">{order.paymentType || 'Prepagado'}</strong>
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
            onAdvanceToPhase3();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Confirmar Paquete e Iniciar Ruta</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </footer>
    </div>
  );
};
