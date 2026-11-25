import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Flame,
  Star,
  Clock,
  Plus,
  Heart,
  SlidersHorizontal,
  Sparkles,
  UtensilsCrossed,
  Check
} from 'lucide-react';
import { FEATURED_FOOD_ITEMS } from '../data/mockData';
import { MenuItem } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface ExploreMenuViewProps {
  onSelectProduct: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todo el Menú', icon: '🍽️' },
  { id: 'burger', label: 'Hamburguesas', icon: '🍔' },
  { id: 'pizza', label: 'Pizzas', icon: '🍕' },
  { id: 'poke', label: 'Bowls & Poke', icon: '🥗' },
  { id: 'dessert', label: 'Postres', icon: '🍰' },
  { id: 'drinks', label: 'Bebidas', icon: '🥤' }
];

export const ExploreMenuView: React.FC<ExploreMenuViewProps> = ({
  onSelectProduct,
  onAddToCart
}) => {
  const { rate } = useExchangeRate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.vibrate(10);
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.vibrate(15);
    soundEngine.playAdvanceChime();
    onAddToCart(item);

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const filteredItems = FEATURED_FOOD_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'burger' && item.category.toLowerCase().includes('burger')) ||
      (selectedCategory === 'pizza' && item.category.toLowerCase().includes('pizza')) ||
      (selectedCategory === 'poke' && (item.category.toLowerCase().includes('bowl') || item.category.toLowerCase().includes('poke') || item.category.toLowerCase().includes('saludable'))) ||
      (selectedCategory === 'dessert' && (item.category.toLowerCase().includes('postre') || item.category.toLowerCase().includes('dulce'))) ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Search & Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Gastronomía de Alta Cocina
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Explorar Menú
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-xl bg-transparent border border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 shadow-xs">
              Tasa: {rate.toFixed(2)} Bs/$
            </span>
          </div>
        </div>

        {/* Search input with Glassmorphism */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca hamburguesas, pizzas, postres o restaurantes..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition shadow-xs"
          />
        </div>
      </div>

      {/* Horizontal Scrollable Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundEngine.vibrate(10);
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 border-transparent'
                  : 'bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-orange-500/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No encontramos platillos con ese filtro
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Intenta con otro término de búsqueda o selecciona "Todo el Menú".
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-black tracking-wide cursor-pointer hover:bg-orange-600 transition"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const priceVES = item.price * rate;
            const isFav = Boolean(favorites[item.id]);
            const isJustAdded = Boolean(addedItemIds[item.id]);

            return (
              <motion.div
                key={item.id}
                layoutId={`card-container-${item.id}`}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => onSelectProduct(item)}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#0c101b] border border-slate-200/90 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/30 flex flex-col justify-between cursor-pointer hover:border-orange-500/50 transition-all"
              >
                {/* Image Section */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <motion.img
                    layoutId={`card-image-${item.id}`}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/ceo-avatar.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges: Category & Favorite Button */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-orange-400 border border-white/10">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                        isFav
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40'
                          : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
                      }`}
                      aria-label="Guardar como favorito"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom rating & time on image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-bold pointer-events-none">
                    <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{item.rating}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md text-zinc-300">
                      <Clock className="w-3 h-3" />
                      <span>{item.timeEstimate}</span>
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider block">
                      {item.restaurant}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Dual Currency Price & Add Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">USD</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                        ≈ {priceVES.toLocaleString('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Bs.
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={(e) => handleAdd(item, e)}
                      className={`px-3.5 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isJustAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Listo</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Añadir</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
