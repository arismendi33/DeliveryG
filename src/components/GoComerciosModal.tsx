import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  ExternalLink,
  Package,
  Send,
  Zap,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  ShoppingBag,
  BellRing
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import { DriverOrder } from '../types';

interface GoComerciosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchFromComercios?: (newOrder: DriverOrder) => void;
  exchangeRate?: number;
}

const SAMPLE_MERCHANTS = [
  {
    name: 'Arturos C.C. Alta Vista 2',
    sector: 'Alta Vista, Puerto Ordaz',
    category: 'Restaurante & Fast Food',
    pkg: 'Combo Familiar Pollo Crujiente'
  },
  {
    name: 'Farmatodo Paseo Caroní',
    sector: 'Unare / Paseo Caroní',
    category: 'Farmacia & Cuidado Personal',
    pkg: 'Medicinas y Fórmulas Térmicas'
  },
  {
    name: 'Supermercado Santa María',
    sector: 'San Félix Centro',
    category: 'Víveres y Alimentos',
    pkg: 'Bolsa de Víveres Sellada'
  },
  {
    name: 'Bodegón Castillito Gourmet',
    sector: 'Castillito, Puerto Ordaz',
    category: 'Bebidas y Delicatesses',
    pkg: 'Caja Regalo Precintada'
  }
];

export const GoComerciosModal: React.FC<GoComerciosModalProps> = ({
  isOpen,
  onClose,
  onDispatchFromComercios,
  exchangeRate = 65.50
}) => {
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(SAMPLE_MERCHANTS[0]);

  if (!isOpen) return null;

  const handleSimulateDispatch = () => {
    soundEngine.unlock();
    soundEngine.vibrate([40, 60, 40]);
    soundEngine.playNewOrderAlert();

    const randomId = `GD-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const payoutUsd = +(2.80 + Math.random() * 3.50).toFixed(2);
    const distanceKm = +(1.2 + Math.random() * 3.8).toFixed(1);

    const generatedOrder: DriverOrder = {
      id: randomId,
      createdAt: 'Hace 1 segundo (Vía Go Comercios)',
      status: 'available',
      pickup: {
        title: selectedMerchant.name,
        address: selectedMerchant.sector,
        contactName: 'Encargado Despacho Go Comercios',
        contactPhone: '+58 414-9988776',
        coords: {
          lat: 8.2985 + (Math.random() - 0.5) * 0.015,
          lng: -62.7350 + (Math.random() - 0.5) * 0.015
        }
      },
      dropoff: {
        title: 'Destino Cliente Go Comercios',
        address: 'Urb. Los Olivos / Villa Central',
        contactName: 'Cliente Go Delivery',
        contactPhone: '+58 412-3344556',
        coords: {
          lat: 8.2880 + (Math.random() - 0.5) * 0.015,
          lng: -62.7280 + (Math.random() - 0.5) * 0.015
        }
      },
      packageType: selectedMerchant.pkg,
      distanceKm,
      estimatedMinutes: Math.round(distanceKm * 3.5) + 6,
      payoutUsd,
      payoutVes: +(payoutUsd * exchangeRate).toFixed(2),
      clientName: 'Cliente Verificado Go Comercios',
      clientPhone: '+58 412-3344556',
      securityPin: String(Math.floor(1000 + Math.random() * 9000)),
      pickupMerchantCode: randomCode,
      houseApartmentNumber: 'Torre Residencial, Apto 2-A',
      isPriority: true,
      paymentType: 'Prepagado vía Go Comercios'
    };

    if (onDispatchFromComercios) {
      onDispatchFromComercios(generatedOrder);
    }

    setDispatchedSuccess(true);
    setTimeout(() => {
      setDispatchedSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white flex flex-col max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative overflow-hidden shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition cursor-pointer text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xl shrink-0 text-2xl">
                🏪
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-200 bg-white/10 px-2 py-0.5 rounded-full inline-block border border-white/20">
                  Ecosistema Go
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  Go Comercios
                </h2>
                <p className="text-xs text-orange-100">
                  Portal Aliados: Comercios envían pedidos a Go Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Description Banner */}
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-orange-700 dark:text-orange-400">
                <Sparkles className="w-4 h-4 shrink-0 text-orange-500" />
                <span>¿Cómo funciona la conexión con Go Delivery?</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Go Comercios</strong> es la aplicación gemela para restaurantes, farmacias, tiendas y negocios de Puerto Ordaz y San Félix. Cada vez que un comercio registra una venta, el pedido se envía automáticamente a la bolsa de repartidores de <strong>Go Delivery</strong> en tiempo real.
              </p>
            </div>

            {/* Features 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Store className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <strong className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                  Comercios
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Crea y paga el despacho
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <strong className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                  En Tiempo Real
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Suena en los repartidores
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <Package className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <strong className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                  Código PIN
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Entrega 100% segura
                </span>
              </div>
            </div>

            {/* Test Simulation Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Probar Envío desde Comercio Aliado:</span>
                </span>
                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/15 px-2 py-0.5 rounded-full">
                  Demo en Vivo
                </span>
              </div>

              {/* Merchant Picker */}
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_MERCHANTS.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMerchant(m)}
                    className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                      selectedMerchant.name === m.name
                        ? 'bg-orange-500/15 border-orange-500 text-orange-600 dark:text-orange-300 shadow-sm'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-orange-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <strong className="text-[11px] font-bold block leading-tight truncate">
                      {m.name}
                    </strong>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {m.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action Button: Dispatch directly */}
              <button
                type="button"
                onClick={handleSimulateDispatch}
                disabled={dispatchedSuccess}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFBF00] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                {dispatchedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                    <span>¡Pedido Enviado a Go Delivery con Éxito!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Despachar Pedido desde Go Comercios Ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer with External Link */}
          <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Enlace Directo Go Comercios:</span>
              <strong className="text-orange-500 font-mono">gocomercios.app</strong>
            </div>

            <a
              href="https://gocomercios.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // In iframe preview avoid full page navigate
                e.preventDefault();
                soundEngine.vibrate(20);
                soundEngine.playAdvanceChime();
                handleSimulateDispatch();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
            >
              <span>Abrir App Go Comercios</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
