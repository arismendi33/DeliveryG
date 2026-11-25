import React from 'react';
import {
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Building2,
  UserCheck,
  Radio,
  Network
} from 'lucide-react';
import { DriverOrder, DriverProfile } from '../types';

interface AvailableOrdersViewProps {
  orders: DriverOrder[];
  onAcceptOrder: (order: DriverOrder) => void;
  hasActiveDelivery: boolean;
  onOpenHowItWorks?: () => void;
  onOpenGoComercios?: () => void;
  onOpenIntegrationModal?: () => void;
  profile?: DriverProfile;
}

export const AvailableOrdersView: React.FC<AvailableOrdersViewProps> = ({
  orders,
  onAcceptOrder,
  hasActiveDelivery,
  onOpenIntegrationModal
}) => {
  return (
    <div className="space-y-4 pb-24">
      {/* Minimalist Integration Banner */}
      {onOpenIntegrationModal && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Network className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Conectar App de Pedidos · API
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Recibe órdenes generadas por comercios o clientes en tiempo real
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenIntegrationModal}
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition active:scale-95 whitespace-nowrap cursor-pointer self-start sm:self-center"
          >
            Conectar App
          </button>
        </div>
      )}

      {/* Clean Header */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-500 shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
              Pedidos Disponibles
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {orders.length} {orders.length === 1 ? 'despacho listo' : 'despachos listos'} · Puerto Ordaz y San Félix
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Radar Activo</span>
        </div>
      </div>

      {/* Active Delivery Warning */}
      {hasActiveDelivery && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200 font-medium">
          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Ya tienes una entrega en curso. Finalízala antes de aceptar otra carrera.
          </span>
        </div>
      )}

      {/* Adaptive Orders Grid (1 col mobile, 2 cols tablet/desktop) */}
      {orders.length === 0 ? (
        <div className="py-12 text-center glass-card p-6 rounded-2xl space-y-2">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            No hay pedidos pendientes en este momento.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Te notificaremos por voz y sonido cuando entre un nuevo despacho.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {orders.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3.5 hover:border-orange-500/35 transition"
            >
              {/* Top Row: ID + Priority Label vs Payout */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-black text-orange-600 dark:text-orange-400">
                      #{item.id}
                    </span>
                    {item.isPriority && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        · Prioritario
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {item.distanceKm} km · ~{item.estimatedMinutes} min
                  </div>
                </div>

                <div className="text-right shrink-0 tabular-nums">
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 block leading-tight">
                    +${item.payoutUsd.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                    ≈ {item.payoutVes.toFixed(0)} Bs
                  </span>
                </div>
              </div>

              {/* Route Points (clean min-w-0 truncation) */}
              <div className="space-y-2.5 pt-2.5 border-t border-slate-200/70 dark:border-white/8 text-xs">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Recoger
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {item.pickup.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.pickup.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Entregar
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {item.dropoff.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.dropoff.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Metadata & Action */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200/70 dark:border-white/8">
                <div className="min-w-0 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">
                    {item.packageType}
                    {item.paymentType ? ` · ${item.paymentType}` : ''}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAcceptOrder(item)}
                  disabled={hasActiveDelivery}
                  className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap transition ${
                    hasActiveDelivery
                      ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFAE00] hover:brightness-105 text-white shadow-sm active:scale-95 cursor-pointer'
                  }`}
                >
                  <span>Aceptar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
