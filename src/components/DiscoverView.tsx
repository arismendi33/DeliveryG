import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Star,
  Clock,
  Plus,
  Bike,
  Shield,
  Zap,
  Check,
  Heart,
  Search,
  Package,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { FEATURED_FOOD_ITEMS, FOOD_CATEGORIES } from '../data/mockData';
import { MenuItem, AppTab } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface DiscoverViewProps {
  onSelectProduct: (item: MenuItem) => void;
  onNavigateToTab: (tab: AppTab) => void;
  onAddToCart: (item: MenuItem) => void;
  onOpenNewOrder?: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onSelectProduct,
  onNavigateToTab,
  onAddToCart,
  onOpenNewOrder
}) => {
  const { rate } = useExchangeRate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredItems = FEATURED_FOOD_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEngine.vibrate(15);
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    soundEngine.vibrate(25);
    soundEngine.playAdvanceChime();
    setRecentlyAddedId(item.id);
    onAddToCart(item);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 850);
  };

  return (
    <div className="space-y-7 pb-28 text-white select-none">
      {/* Dynamic Hero Banner with Glassmorphism and Neon Accents */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 bg-gradient-to-br from-[#0c101b]/95 via-[#111728]/85 to-orange-950/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Zap className="w-3.5 h-3.5 fill-orange-400" />
              <span>Despachos Ultra Rápidos en Guayana · 15-25 min</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              ¿Qué necesitas pedir hoy en{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Puerto Ordaz & San Félix
              </span>
              ?
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Envíos punto a punto en moto express, encomiendas seguras con PIN y la mejor gastronomía aliada directo a tu puerta con rastreo satelital en vivo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateToTab('explore')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/30 active:scale-95 transition-all cursor-pointer"
              >
                <Bike className="w-4 h-4" />
                <span>Explorar Menú Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab('tracking')}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/15 text-xs sm:text-sm font-semibold flex items-center gap-2 backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Mapa de Rutas en Vivo</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Trust Badges */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold mb-1">
                <Bike className="w-4 h-4" />
                <span>120+ Repartidores</span>
              </div>
              <span className="text-[11px] text-zinc-400">Activos en Alta Vista y San Félix</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                <Shield className="w-4 h-4" />
                <span>Protección con PIN</span>
              </div>
              <span className="text-[11px] text-zinc-400">Seguridad total en entrega</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Promotional Floating Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl glass-card border border-white/15 bg-gradient-to-br from-[#121829] to-[#0c101c] shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center gap-3.5 hover:border-orange-500/40 transition">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Envíos Punto a Punto</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Sobres, encomiendas y paquetes sellados</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-white/15 bg-gradient-to-br from-[#121829] to-[#0c101c] shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center gap-3.5 hover:border-emerald-500/40 transition">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Tasa Oficial en Vivo</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Calculada en tiempo real: {rate.toFixed(2)} Bs/$</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-white/15 bg-gradient-to-br from-[#121829] to-[#0c101c] shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center gap-3.5 hover:border-amber-500/40 transition">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Flota Motorizada</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Caja térmica sellada contra lluvia y calor</p>
          </div>
        </div>
      </div>

      {/* Slidable Horizontal Categories Tray */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Categorías Gastronómicas
          </h2>
          <span className="text-[11px] text-orange-400 font-semibold">Desliza para ver más</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundEngine.vibrate(10);
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 border active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-[0_4px_16px_rgba(249,115,22,0.4)]'
                    : 'bg-[#0c101b]/70 hover:bg-zinc-800 text-zinc-300 border-white/10 backdrop-blur-md'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Soft Cards Grid with Shared Element Transitions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span>Platillos Destacados en Guayana</span>
            </h2>
            <p className="text-xs text-zinc-400">Toca cualquier tarjeta para expandirla a pantalla completa</p>
          </div>
          <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            {filteredItems.length} opciones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredItems.map((item) => {
            const isLiked = likedItems[item.id];
            const isJustAdded = recentlyAddedId === item.id;
            const priceVES = item.price * rate;

            return (
              <motion.div
                key={item.id}
                layoutId={`card-container-${item.id}`}
                onClick={() => {
                  soundEngine.vibrate(15);
                  onSelectProduct(item);
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-pointer rounded-3xl glass-card overflow-hidden border border-white/15 bg-[#0e1320]/80 hover:border-orange-500/50 relative flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all"
              >
                {/* Image Section */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-900">
                  <motion.img
                    layoutId={`card-image-${item.id}`}
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1320] via-transparent to-black/35" />

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/15 transition-transform active:scale-90"
                    title="Guardar favorito"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Popular Tag */}
                  {item.isPopular && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </div>
                  )}

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200 bg-black/70 px-2.5 py-0.5 rounded-lg backdrop-blur-md border border-white/10">
                      {item.restaurant}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-400 bg-black/70 px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {item.rating}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 font-medium">Precio</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-orange-400 tabular-nums">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold tabular-nums">
                          ≈ {priceVES.toFixed(0)} Bs
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Button with Ripple / Physics */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      title="Añadir directo al pedido"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-90 flex items-center gap-1.5 shadow-sm cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/35'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>¡Listo!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Añadir</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
