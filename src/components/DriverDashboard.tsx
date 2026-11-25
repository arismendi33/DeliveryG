import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Check,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { DeliveryOrder } from '../types';
import { BrandLogo } from './BrandLogo';

interface DriverDashboardProps {
  order: DeliveryOrder | null;
  onAdvanceStatus: (orderId: string) => void;
  onCompleteDelivery: (orderId: string, enteredPin: string) => boolean;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  order,
  onAdvanceStatus,
  onCompleteDelivery
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleValidatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    const ok = onCompleteDelivery(order.id, pinInput);
    if (ok) {
      setPinSuccess(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="space-y-6 pb-28 text-white">
      {/* Top Driver Status & Daily Stats */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-white/15 bg-zinc-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandLogo variant="emblem" size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Panel Repartidor Oficial Go Delivery
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isOnline
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-white/10 text-zinc-400 border-white/10'
                }`}
              >
                {isOnline ? 'ACTIVO EN VÍA' : 'EN PAUSA'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Bera Socialista 150cc · Placa: <span className="text-white font-mono font-bold">AB-829K</span> (Puerto Ordaz / San Félix)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 block font-medium">Ganancias de Hoy</span>
            <span className="text-lg font-black font-mono text-orange-400">$38.50 USD</span>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border active:scale-95 ${
              isOnline
                ? 'bg-white/10 border-white/15 text-zinc-200 hover:bg-white/15'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-400 shadow-md shadow-orange-500/20'
            }`}
          >
            {isOnline ? 'Pausar Turno' : 'Conectarse'}
          </button>
        </div>
      </div>

      {/* Active Assignment or Idle state */}
      {order && order.status !== 'delivered' ? (
        <div className="p-6 rounded-3xl glass-card border border-white/10 bg-zinc-900/50 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-orange-300 bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30">
                Envío Asignado #{order.id}
              </span>
              <span className="text-xs text-zinc-300 font-semibold">
                Ganancia neta: ${(order.priceBreakdown.total * 0.82).toFixed(2)} USD
              </span>
            </div>

            <span className="text-xs text-orange-300 font-bold bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/30">
              ~{order.estimatedMinutes} min aprox
            </span>
          </div>

          {/* Route details for Driver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-300 flex items-center justify-center text-[10px] font-bold">A</span>
                Punto A (Recogida)
              </div>
              <p className="text-xs font-bold text-white">{order.pickup.title}</p>
              <p className="text-xs text-zinc-300">{order.pickup.address}</p>
              <p className="text-[11px] text-zinc-400">Detalles: {order.pickup.details}</p>
              <p className="text-xs text-orange-300 font-medium">
                Remitente: {order.pickup.contactName} ({order.pickup.contactPhone})
              </p>
            </div>

            {/* Dropoff */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">B</span>
                Punto B (Entrega)
              </div>
              <p className="text-xs font-bold text-white">{order.dropoff.title}</p>
              <p className="text-xs text-zinc-300">{order.dropoff.address}</p>
              <p className="text-[11px] text-zinc-400">Detalles: {order.dropoff.details}</p>
              <p className="text-xs text-zinc-300 font-medium">
                Destinatario: {order.dropoff.contactName} ({order.dropoff.contactPhone})
              </p>
            </div>
          </div>

          {/* Current Step Action Buttons */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Acción Operativa del Conductor
            </h4>

            {order.status === 'heading_to_pickup' && (
              <button
                onClick={() => onAdvanceStatus(order.id)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition active:scale-95"
              >
                1. Notificar "He llegado a Punto A (Recogida)"
              </button>
            )}

            {order.status === 'package_collected' && (
              <button
                onClick={() => onAdvanceStatus(order.id)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition active:scale-95"
              >
                2. Iniciar Ruta de Entrega hacia Punto B
              </button>
            )}

            {order.status === 'in_transit_delivery' && (
              <form onSubmit={handleValidatePin} className="space-y-3">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Para finalizar la entrega en Guayana, solicita al destinatario su <strong>PIN de 4 dígitos</strong> (puedes verlo en la pantalla de seguimiento):
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError(false);
                      }}
                      placeholder="Ingresa PIN (Ej: 4819)"
                      className="w-full text-xs font-mono font-bold bg-white/10 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md transition active:scale-95"
                  >
                    Confirmar Entrega
                  </button>
                </div>

                {pinError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    PIN incorrecto. Revisa el PIN en la pantalla de seguimiento.
                  </p>
                )}

                {pinSuccess && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    ¡Entrega finalizada con éxito! Saldo acreditado.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl glass-card border border-white/10 bg-zinc-900/50 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center mx-auto border border-white/10">
            <Navigation className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Buscando solicitudes en Puerto Ordaz y San Félix...</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Cuando un usuario genere un nuevo pedido punto a punto, se mostrará aquí para recoger y despachar.
          </p>
        </div>
      )}
    </div>
  );
};
