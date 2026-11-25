import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Clock,
  Bike,
  Send,
  Lock,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { DeliveryOrder } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { BrandLogo } from './BrandLogo';

interface TrackingViewProps {
  order: DeliveryOrder | null;
  onAdvanceOrderStatus: (orderId: string) => void;
  onSendMessage: (orderId: string, text: string) => void;
  onNewOrderClick: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  order,
  onAdvanceOrderStatus,
  onSendMessage,
  onNewOrderClick
}) => {
  const [inputText, setInputText] = useState('');
  const [showCallAlert, setShowCallAlert] = useState(false);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);

  if (!order) {
    return (
      <div className="p-10 text-center rounded-3xl glass-card border border-white/10 shadow-2xl space-y-4 max-w-lg mx-auto my-10 text-white">
        <div className="flex justify-center">
          <BrandLogo variant="emblem" size="lg" />
        </div>
        <h3 className="text-lg font-black text-white mt-4">
          No tienes ningún envío activo en Guayana
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Solicita un envío punto a punto entre Puerto Ordaz y San Félix para ver el mapa real interactivo con calles, seguir la ruta y validar tu entrega.
        </p>
        <button
          onClick={onNewOrderClick}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition active:scale-95 inline-flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Pedir Nuevo Envío Ahora
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'searching_driver', label: 'Buscando repartidor' },
    { id: 'driver_assigned', label: 'Repartidor asignado' },
    { id: 'heading_to_pickup', label: 'En camino a Punto A' },
    { id: 'package_collected', label: 'Paquete en custodia' },
    { id: 'in_transit_delivery', label: 'En ruta a Punto B' },
    { id: 'delivered', label: 'Entregado con éxito' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'searching_driver': return 0;
      case 'driver_assigned': return 1;
      case 'heading_to_pickup': return 2;
      case 'package_collected': return 3;
      case 'in_transit_delivery': return 4;
      case 'delivered': return 5;
      default: return 4;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(order.id, inputText.trim());
    setInputText('');
  };

  const simulateCall = () => {
    setShowCallAlert(true);
    setTimeout(() => setShowCallAlert(false), 3500);
  };

  return (
    <div className="space-y-5 pb-28 text-white">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/15 bg-zinc-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/15 px-2.5 py-1 rounded-lg border border-orange-500/30">
              #{order.id}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Creado {order.createdAt}
            </span>
            {order.status === 'delivered' ? (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Entregado
              </span>
            ) : (
              <span className="text-xs font-bold text-orange-300 bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                En Tránsito
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-black text-white mt-1.5 flex items-center gap-2">
            <span>{order.pickup.title.split('/')[0]}</span>
            <span className="text-orange-500">➔</span>
            <span>{order.dropoff.title.split('/')[0]}</span>
          </h2>
          <p className="text-xs text-zinc-400">{order.packageDescription}</p>
        </div>

        {/* Security PIN Code Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
              PIN de entrega al recibir
            </span>
            <span className="text-xl font-black text-orange-400 font-mono tracking-widest">
              {order.securityPin}
            </span>
          </div>
        </div>
      </div>

      {/* REAL LEAFLET MAP (With 2-finger gesture navigation, OpenStreetMap real streets and floating status) */}
      <div className="relative">
        <InteractiveMap
          pickup={order.pickup}
          dropoff={order.dropoff}
          driver={order.driver}
          status={order.status}
          estimatedMinutes={order.estimatedMinutes}
          distanceKm={order.distanceKm}
        />
      </div>

      {/* Collapsible Timeline Status Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/15 bg-zinc-900/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Progreso del Despacho en Guayana
            </h3>
            <button
              onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 ml-2 underline"
            >
              {isTimelineCollapsed ? 'Mostrar pasos' : 'Minimizar'}
            </button>
          </div>

          {/* Test simulation step advancement */}
          {order.status !== 'delivered' && (
            <button
              onClick={() => onAdvanceOrderStatus(order.id)}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-xl border border-orange-500/30 transition flex items-center gap-1 active:scale-95"
            >
              <span>Avanzar Estado</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!isTimelineCollapsed && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 animate-in fade-in duration-200">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-2xl border transition text-center flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-orange-500/20 border-orange-500 text-orange-200 shadow-md font-semibold'
                      : isCompleted
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-zinc-500'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold leading-tight mt-1">{step.label}</p>
                  <span className="text-[9px] text-zinc-400 mt-1 font-mono">Paso {idx + 1}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Driver Information & Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Driver Profile Card */}
        {order.driver ? (
          <div className="p-5 rounded-3xl glass-card border border-white/10 bg-zinc-900/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BrandLogo variant="emblem" size="sm" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Repartidor Asignado
                </h3>
              </div>
              <span className="text-xs text-emerald-300 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                Verificado
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={order.driver.avatar}
                alt={order.driver.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/50 shadow-md"
              />
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">{order.driver.name}</h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-amber-400 font-bold font-mono">★ {order.driver.rating}</span>
                  <span>·</span>
                  <span>{order.driver.tripsCount} viajes en Guayana</span>
                </div>
                <p className="text-xs text-zinc-300 font-medium">
                  {order.driver.vehicleModel} · <span className="text-orange-400 font-mono font-bold">{order.driver.vehiclePlate}</span>
                </p>
              </div>
            </div>

            {/* Direct Communication Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <a
                href={`tel:${order.driver.phone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Llamar</span>
              </a>
              <a
                href={`https://wa.me/${order.driver.phone.replace(/[^\d+]/g, '').replace(/^0/, '58')}?text=${encodeURIComponent(
                  `¡Hola ${order.driver.name}! Soy el cliente de la orden #${order.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  const input = document.getElementById('chat-input');
                  input?.focus();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-bold border border-orange-500/30 transition active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                <span>Chat</span>
              </button>
            </div>

            {showCallAlert && (
              <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/40 text-xs text-orange-200 flex items-center gap-2 animate-in fade-in">
                <Phone className="w-4 h-4 animate-bounce text-orange-400" />
                <span>Llamando a {order.driver.name} ({order.driver.phone})...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-3xl glass-card border border-white/10 bg-zinc-900/50 shadow-xl flex items-center justify-center text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Buscando repartidor en Puerto Ordaz / San Félix...</p>
              <p className="text-xs text-zinc-400">Radio de cobertura: Alta Vista, Unare, Castillito, El Roble</p>
            </div>
          </div>
        )}

        {/* Live Chat with Driver */}
        <div className="p-5 rounded-3xl glass-card border border-white/10 bg-zinc-900/50 shadow-xl flex flex-col justify-between h-[360px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              Chat del Envío
            </h3>
            <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full font-medium border border-white/10">
              Canal directo
            </span>
          </div>

          {/* Messages list */}
          <div className="my-3 space-y-2.5 overflow-y-auto pr-1 text-xs no-scrollbar flex-1">
            {order.chat.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block text-[10px] bg-white/5 text-zinc-400 px-2.5 py-1 rounded-full border border-white/10">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-br-none shadow-md'
                        : 'bg-white/10 text-zinc-200 rounded-bl-none border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-0.5 px-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick presets & Input form */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {['Ya estoy esperando', 'Estoy en Alta Vista', '¿Vas cruzando el puente?', 'Toca timbre'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSendMessage(order.id, preset)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] whitespace-nowrap transition border border-white/10 active:scale-95"
                >
                  {preset}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              <input
                id="chat-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un mensaje al repartidor..."
                className="w-full text-xs bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition shrink-0 font-bold shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
