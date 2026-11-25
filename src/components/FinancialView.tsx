import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
  History,
  Receipt,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  Percent,
  X,
  Banknote
} from 'lucide-react';
import { WalletTransaction } from '../types';
import { USD_TO_VES_RATE } from '../data/mockData';
import { BrandLogo } from './BrandLogo';

interface FinancialViewProps {
  balance: number;
  transactions: WalletTransaction[];
  onRecharge: (amount: number, method: string) => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  balance,
  transactions,
  onRecharge
}) => {
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('20');
  const [selectedMethod, setSelectedMethod] = useState('pago_movil');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recharges' | 'payments'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<WalletTransaction | null>(null);

  const handleDoRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(rechargeAmount);
    if (!val || val <= 0) return;
    onRecharge(val, selectedMethod);
    setShowRechargeModal(false);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === 'recharges') return tx.type === 'recharge' || tx.type === 'cashback';
    if (activeFilter === 'payments') return tx.type === 'order_payment';
    return true;
  });

  const totalSpent = transactions
    .filter((t) => t.type === 'order_payment')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalRecharged = transactions
    .filter((t) => t.type === 'recharge')
    .reduce((acc, t) => acc + t.amount, 0);

  const balanceInBs = Number((balance * USD_TO_VES_RATE).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Wallet Balance Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Go emblem watermark */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <BrandLogo variant="emblem" size="xl" className="w-48 h-48 text-white" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/80 px-3 py-1 rounded-full border border-orange-800">
                <Wallet className="w-3.5 h-3.5 text-orange-400" />
                Billetera Go Delivery Guayana
              </span>
              <p className="text-xs text-zinc-400 mt-2.5 font-medium">Saldo disponible para envíos</p>
              <div className="flex items-baseline gap-3 mt-1">
                <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  ${balance.toFixed(2)} <span className="text-sm font-sans text-zinc-400 font-bold">USD</span>
                </h2>
                <span className="text-sm font-mono text-zinc-400 font-semibold">
                  ≈ {balanceInBs.toLocaleString()} Bs
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowRechargeModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Recargar Saldo</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Respaldado para pagos en Puerto Ordaz y San Félix</span>
            </div>
            <span className="font-mono text-zinc-400">Tasa: {USD_TO_VES_RATE.toFixed(2)} Bs/$</span>
          </div>
        </div>

        {/* Quick Stats Widget */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Resumen de Actividad
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-white">Total Envíos</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Gastado en Guayana</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
                ${totalSpent.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-white">Recargas</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Pago Móvil / Tarjeta</p>
                </div>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                +${totalRecharged.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-orange-500" />
            <span>Recibes bonificaciones en recargas superiores a $30</span>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-white/10">
          <div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-orange-500" />
              Historial de Transacciones en Guayana
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Movimientos de envíos, recargas y comprobantes</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'all'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('payments')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'payments'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Envíos
            </button>
            <button
              onClick={() => setActiveFilter('recharges')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeFilter === 'recharges'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Recargas
            </button>
          </div>
        </div>

        {/* Transactions list */}
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => {
            const isNegative = tx.amount < 0;
            return (
              <div
                key={tx.id}
                onClick={() => setSelectedReceipt(tx)}
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100/80 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'order_payment'
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    }`}
                  >
                    {tx.type === 'order_payment' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{tx.title}</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{tx.subtitle}</p>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{tx.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono ${
                      isNegative ? 'text-zinc-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isNegative ? '' : '+'}
                    ${Math.abs(tx.amount).toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 justify-end mt-0.5 font-medium">
                    <Receipt className="w-3 h-3" />
                    Ver recibo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-white/10 p-6 shadow-2xl text-zinc-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/10">
              <h3 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Recargar Saldo en Guayana
              </h3>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDoRecharge} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold block mb-1">
                  Monto a recargar (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full text-sm font-bold font-mono bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['10', '20', '50', '100'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRechargeAmount(preset)}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 font-bold"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold block mb-1">
                  Método de pago local
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setSelectedMethod('pago_movil')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      selectedMethod === 'pago_movil'
                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-zinc-900 dark:text-white'
                        : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">Pago Móvil Interbancario (Bs)</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Banesco, Mercantil, Venezuela a tasa del día</p>
                      </div>
                    </div>
                    {selectedMethod === 'pago_movil' && <CheckCircle className="w-4 h-4 text-orange-500" />}
                  </div>

                  <div
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                      selectedMethod === 'card'
                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-zinc-900 dark:text-white'
                        : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">Tarjeta de Débito / Crédito</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Débito bancario o internacional</p>
                      </div>
                    </div>
                    {selectedMethod === 'card' && <CheckCircle className="w-4 h-4 text-orange-500" />}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 transition active:scale-95"
                >
                  Confirmar Recarga de ${rechargeAmount} USD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal featuring authentic Slogan Logo */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-zinc-200 dark:border-white/10 p-6 shadow-2xl text-zinc-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <BrandLogo variant="bag" size="sm" />
                <h3 className="text-sm font-black text-zinc-900 dark:text-white">Comprobante Oficial Guayana</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slogan seal */}
            <div className="flex justify-center py-1">
              <BrandLogo variant="slogan" size="sm" />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Referencia:</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Concepto:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedReceipt.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Ruta:</span>
                <span className="text-zinc-700 dark:text-zinc-300">{selectedReceipt.subtitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Fecha y Hora:</span>
                <span className="text-zinc-700 dark:text-zinc-300">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Estado:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">Completado ✓</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-white/10 flex justify-between items-center">
                <span className="text-zinc-800 dark:text-zinc-200 font-bold">Total:</span>
                <span className="text-lg font-black font-mono text-orange-600 dark:text-orange-400">
                  ${Math.abs(selectedReceipt.amount).toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-3 rounded-2xl bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition active:scale-95"
            >
              Cerrar Comprobante
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
