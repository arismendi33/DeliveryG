import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Clock,
  Flame,
  Plus,
  ShieldCheck,
  Heart,
  Sparkles,
  UtensilsCrossed,
  Check
} from 'lucide-react';
import { MenuItem } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface ExploreMenuModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export const ExploreMenuModal: React.FC<ExploreMenuModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  const { rate } = useExchangeRate();
  const [isLiked, setIsLiked] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!item) return null;

  const priceVES = item.price * rate;

  const handleAddToCart = () => {
    soundEngine.unlock();
    soundEngine.playAdvanceChime();
    soundEngine.vibrate(30);
    setIsAdded(true);
    onAddToCart(item);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
        {/* Backdrop Glass Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Sheet with Shared Layout and Spring Physics */}
        <motion.div
          layoutId={`card-container-${item.id}`}
          drag="y"
          dragConstraints={{ top: 0, bottom: 350 }}
          dragElastic={{ top: 0.05, bottom: 0.5 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 350) {
              soundEngine.vibrate(20);
              onClose();
            }
          }}
          initial={{ y: 80, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 180, scale: 0.9, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 360,
            mass: 0.8
          }}
          className="relative w-full max-w-lg bg-[#0e121d] border border-white/20 rounded-t-3xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden z-10 max-h-[92vh] flex flex-col text-white"
        >
          {/* Top Drag Handle Indicator */}
          <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-white/30 rounded-full" />
          </div>

          {/* Close & Favorite Top Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.vibrate(15);
                setIsLiked(!isLiked);
              }}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95 border border-white/15"
              title="Guardar en favoritos"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95 border border-white/15 cursor-pointer"
              title="Cerrar vista"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Expanded Hero Image with Shared Element */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0 bg-zinc-900">
            {!imageFailed ? (
              <motion.img
                layoutId={`card-image-${item.id}`}
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-orange-400">
                <UtensilsCrossed className="w-14 h-14 opacity-50 mb-2" />
                <span className="text-xs font-bold text-zinc-400">{item.restaurant}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e121d] via-transparent to-black/40" />

            {/* Restaurant & Tag Badge */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/95 text-white backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {item.restaurant}
              </span>
              {item.calories && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-zinc-200 backdrop-blur-md border border-white/15 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {item.calories}
                </span>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 no-scrollbar">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {item.name}
                </h2>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-orange-400 block tabular-nums">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-semibold tabular-nums">
                    ≈ {priceVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.
                  </span>
                </div>
              </div>

              {/* Clean Unboxed Metadata with Typographic Separators (Rule 1.A) */}
              <div className="flex items-center gap-2 mt-2.5 text-xs text-zinc-300">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {item.rating}
                </span>
                <span aria-hidden="true" className="text-zinc-500">·</span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  {item.timeEstimate}
                </span>
                <span aria-hidden="true" className="text-zinc-500">·</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Garantía Go Delivery
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-normal">
              {item.description}
            </p>

            {/* Special Instructions or Add-on features */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-1">
              <span className="font-semibold text-white block">✨ Despacho Express en Ciudad Guayana</span>
              <p className="text-zinc-400">Entrega rápida en Puerto Ordaz y San Félix con caja térmica sellada y validación por PIN.</p>
            </div>
          </div>

          {/* Sticky Bottom Action */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0a0d14] backdrop-blur-xl flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(249,115,22,0.4)] active:scale-98 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>¡Añadido al Carrito!</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>Añadir al Carrito · ${item.price.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
