import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { DriverEarningRecord } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface EarningsViewProps {
  earnings: DriverEarningRecord[];
  onWithdraw: (amount: number) => void;
}

export const EarningsView: React.FC<EarningsViewProps> = ({
  earnings,
  onWithdraw
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const { rate, isUpdating, refreshRate, lastUpdated } = useExchangeRate();

  const totalUsd = earnings.reduce((acc, curr) => acc + curr.amountUsd, 0);
  const totalVes = totalUsd * rate;

  const handleConfirmWithdraw = () => {
    soundEngine.playCompleteDelivery();
    soundEngine.vibrate([40, 60, 40]);
    onWithdraw(totalUsd);
    setShowWithdrawModal(false);
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 5000);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Wallet & Quick Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                  Billetera Go
                </span>
              </div>

              <button
                type="button"
                onClick={refreshRate}
                title={`Precio actual: ${rate.toFixed(2)} Bs/$ (${lastUpdated}). Clic para actualizar.`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold tabular-nums bg-transparent hover:bg-emerald-500/10 border border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 transition active:scale-95 shrink-0 cursor-pointer"
              >
                <span>{rate.toFixed(2)} Bs/$</span>
                <RefreshCw className={`w-3 h-3 shrink-0 ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-0.5 tabular-nums">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight block">
                ${totalUsd.toFixed(2)}{' '}
                <span className="text-base font-bold text-slate-400">USD</span>
              </span>
              <p className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                ≈ {totalVes.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.D
              </p>
            </div>

            {/* Daily Goal Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold tabular-nums">
                <span className="text-slate-500 dark:text-slate-400">Meta del turno ($50)</span>
                <span className="text-orange-600 dark:text-orange-400 font-mono font-bold">
                  {Math.min(100, Math.round((totalUsd / 50) * 100))}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFAE00] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(4, (totalUsd / 50) * 100))}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.vibrate(15);
                setShowWithdrawModal(true);
              }}
              disabled={totalUsd <= 0}
              className={`w-full h-11 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                totalUsd > 0
                  ? 'bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFAE00] hover:brightness-105 text-white shadow-sm active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Retirar a Pago Móvil / Zelle</span>
            </button>

            {withdrawSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Solicitud de retiro procesada exitosamente.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 tabular-nums">
            <div className="glass-card p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                Viajes
              </span>
              <span className="text-xl font-black font-mono text-slate-900 dark:text-white block">
                {earnings.length}
              </span>
            </div>
            <div className="glass-card p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                Promedio
              </span>
              <span className="text-xl font-black font-mono text-slate-900 dark:text-white block">
                ${earnings.length > 0 ? (totalUsd / earnings.length).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Los fondos generados se transfieren a tu cuenta registrada al confirmar el retiro.
            </p>
          </div>
        </div>

        {/* Right Column: Earnings History */}
        <div className="lg:col-span-7 glass-card p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 dark:border-white/8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5 min-w-0 truncate">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Historial del Turno</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono font-semibold shrink-0 tabular-nums">
              {earnings.length} reg.
            </span>
          </div>

          {earnings.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Aún no has completado carreras en este turno.
            </div>
          ) : (
            <div className="divide-y divide-slate-200/60 dark:divide-white/8">
              {earnings.map((record) => (
                <div key={record.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {record.orderId}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        · Acreditado
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                      {record.routeSummary}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {record.timestamp}
                    </p>
                  </div>

                  <div className="text-right shrink-0 tabular-nums">
                    <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                      +${record.amountUsd.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      +{record.amountVes.toFixed(0)} Bs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="glass-panel max-w-sm w-full p-5 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Retirar Ganancias
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Se transferirá el saldo disponible de tu billetera:
            </p>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-center space-y-1 tabular-nums">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                ${totalUsd.toFixed(2)} USD
              </span>
              <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                ≈ {totalVes.toFixed(2)} Bs
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition hover:bg-slate-200 dark:hover:bg-white/15 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-sm hover:brightness-105 transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
