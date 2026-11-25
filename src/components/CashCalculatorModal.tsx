import React, { useState } from 'react';
import {
  Banknote,
  Calculator,
  X,
  ArrowRight,
  CreditCard,
  QrCode,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { USD_TO_VES_RATE } from '../data/driverData';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface CashCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotalUsd?: number;
  orderTotalVes?: number;
  paymentType?: string;
  orderId: string;
}

export const CashCalculatorModal: React.FC<CashCalculatorModalProps> = ({
  isOpen,
  onClose,
  orderTotalUsd = 12.50,
  orderTotalVes,
  paymentType = 'Efectivo USD',
  orderId
}) => {
  const { rate, lastUpdated } = useExchangeRate();
  const totalUsd = orderTotalUsd;
  const totalVes = orderTotalVes || +(totalUsd * rate).toFixed(2);

  const [receivedUsd, setReceivedUsd] = useState<number>(20);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const changeUsd = Math.max(0, receivedUsd - totalUsd);
  const changeVes = +(changeUsd * rate).toFixed(2);

  const quickBills = [5, 10, 20, 50, 100];

  const copyPagoMovilData = () => {
    const text = `Pago Móvil Go Delivery\nBanco: Banesco (0134)\nTeléfono: 0414-8899221\nRIF/Cédula: J-504928110\nMonto exacto: ${totalVes} Bs`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    soundEngine.vibrate(30);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Cobro y Vuelto
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                Orden #{orderId}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total to Collect Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Monto a Cobrar ({paymentType})
            </span>
            <div className="text-xl font-black font-mono text-emerald-400">
              ${totalUsd.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              En Bolívares
            </span>
            <div className="text-sm font-bold font-mono text-white">
              {totalVes.toLocaleString('es-VE')} Bs
            </div>
            <span className="text-[9px] text-slate-400">Tasa: {rate.toFixed(2)} Bs/$</span>
          </div>
        </div>

        {/* Quick Bills for Change */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Billete que entrega el cliente
            </span>
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              Recibido: ${receivedUsd}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {quickBills.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setReceivedUsd(b);
                  soundEngine.vibrate(25);
                }}
                className={`py-2 rounded-xl text-xs font-mono font-black transition-all ${
                  receivedUsd === b
                    ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30 scale-105'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                ${b}
              </button>
            ))}
          </div>
        </div>

        {/* Change Breakdown Card */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              Vuelto exacto al cliente:
            </span>
            <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${changeUsd.toFixed(2)}
            </span>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span>Equivalente en Bolívares:</span>
            <span className="font-mono font-black">{changeVes.toLocaleString('es-VE')} Bs</span>
          </div>
        </div>

        {/* Pago Móvil Quick Helper */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-orange-500" />
            <div className="text-[11px]">
              <span className="font-bold text-slate-800 dark:text-white block">
                ¿Cliente paga por Pago Móvil?
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Banesco · J-504928110 · 0414-8899221
              </span>
            </div>
          </div>

          <button
            onClick={copyPagoMovilData}
            className="px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs active:scale-98 transition"
        >
          Entendido / Cerrar
        </button>
      </div>
    </div>
  );
};
