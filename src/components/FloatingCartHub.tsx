import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Wallet,
  Sparkles,
  UtensilsCrossed,
  CheckCircle2
} from 'lucide-react';
import { CartItem, WalletTransaction } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface FloatingCartHubProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  walletBalance: number;
  transactions: WalletTransaction[];
  onCheckout: () => void;
  onNavigateToExplore?: () => void;
}

export const FloatingCartHub: React.FC<FloatingCartHubProps> = ({
  cart,
  onUpdateQuantity,
  onClearCart,
  walletBalance,
  transactions,
  onCheckout,
  onNavigateToExplore
}) => {
  const { rate } = useExchangeRate();
  const [activeTab, setActiveTab] = useState<'cart' | 'wallet'>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryFee = cart.length > 0 ? 2.50 : 0;
  const total = subtotal + deliveryFee;
  const totalVES = total * rate;

  const handleCheckoutClick = () => {
    soundEngine.unlock();
    soundEngine.playNewOrderAlert();
    soundEngine.vibrate([40, 60, 40]);
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onCheckout();
    }, 900);
  };

  return (
    <div className="space-y-6 pb-28 text-white max-w-4xl mx-auto select-none">
      {/* Top Selector: Carrito vs Billetera */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl glass-panel border border-white/10 bg-[#0c101b]/80 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            soundEngine.vibrate(10);
            setActiveTab('cart');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'cart'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Carrito ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.vibrate(10);
            setActiveTab('wallet');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Billetera (${walletBalance.toFixed(2)})</span>
        </button>
      </div>

      {activeTab === 'cart' ? (
        <motion.div
          key="cart-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-4"
        >
          {cart.length === 0 ? (
            <div className="p-10 rounded-3xl glass-card text-center space-y-4 border border-white/10 bg-[#0e1320]/60">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Tu carrito está esperando</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                Explora los platillos de los mejores restaurantes aliados en Puerto Ordaz y San Félix con delivery express.
              </p>
              {onNavigateToExplore && (
                <button
                  type="button"
                  onClick={onNavigateToExplore}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-orange-500/30 active:scale-95 transition"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Explorar Platillos</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-base font-black text-white">
                    Artículos en tu Pedido
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.vibrate(15);
                      onClearCart();
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar Carrito
                  </button>
                </div>

                {cart.map(({ item, quantity }) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 bg-[#0e1320]/75 flex items-center justify-between gap-3 shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-zinc-900"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate">{item.name}</h4>
                      <span className="text-xs text-zinc-400 block truncate">{item.restaurant}</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-orange-400 tabular-nums">
                          ${(item.price * quantity).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-semibold tabular-nums">
                          ≈ {((item.price * quantity) * rate).toFixed(0)} Bs
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.vibrate(10);
                          onUpdateQuantity(item.id, -1);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 active:scale-90 transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black px-1.5 min-w-4 text-center text-white tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.vibrate(10);
                          onUpdateQuantity(item.id, 1);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-300 active:scale-90 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary & Checkout */}
              <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-white/15 bg-[#0e1320]/90 space-y-4 h-fit shadow-2xl">
                <h4 className="text-base font-black text-white pb-3 border-b border-white/10">
                  Resumen de la Orden
                </h4>

                <div className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  <div className="flex justify-between">
                    <span>Subtotal platillos</span>
                    <span className="font-semibold text-white tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarifa Delivery Guayana</span>
                    <span className="font-semibold text-white tabular-nums">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-orange-400 font-bold">
                    <span>Tasa oficial en vivo</span>
                    <span className="tabular-nums">{rate.toFixed(2)} Bs/$</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1">
                  <div className="flex justify-between text-base font-black text-white">
                    <span>Total a Pagar</span>
                    <span className="text-orange-400 text-lg sm:text-xl tabular-nums">${total.toFixed(2)}</span>
                  </div>
                  <div className="text-right text-xs font-bold text-zinc-400 tabular-nums">
                    ≈ {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCheckingOut}
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(249,115,22,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isCheckingOut ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Despachando a Repartidor...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Pedido & Seguir en Vivo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 justify-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rastreo satelital y código PIN seguro</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        /* Wallet & Financial Details */
        <motion.div
          key="wallet-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          {/* Card Balance */}
          <div className="relative overflow-hidden rounded-3xl p-6 glass-panel border border-white/15 bg-gradient-to-br from-orange-600/80 via-amber-600/60 to-zinc-950/90 shadow-2xl text-white">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-orange-200">
                  Saldo Disponible Go Wallet
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-1 tabular-nums">
                  ${walletBalance.toFixed(2)}
                </h2>
                <span className="text-xs font-bold text-white/90 tabular-nums">
                  ≈ {(walletBalance * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/15 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-white/15 font-semibold backdrop-blur-md">
                Pago Móvil Inmediato
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/15 font-semibold backdrop-blur-md">
                Cero Comisiones
              </span>
            </div>
          </div>

          {/* Transactions History */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-white px-1">Últimos Movimientos</h3>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 sm:p-4 rounded-2xl glass-card border border-white/10 bg-[#0e1320]/75 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-bold text-white">{tx.title}</h5>
                    <p className="text-xs text-zinc-400">{tx.subtitle}</p>
                    <span className="text-[11px] text-zinc-500 font-mono">{tx.date}</span>
                  </div>

                  <span
                    className={`text-sm sm:text-base font-black tabular-nums ${
                      tx.amount < 0 ? 'text-zinc-200' : 'text-emerald-400'
                    }`}
                  >
                    {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
