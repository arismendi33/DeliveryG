import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  Bike
} from 'lucide-react';
import { AppTab, UserRole } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface FloatingDockProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  activeOrdersCount: number;
  cartCount: number;
  userRole?: UserRole;
  showDriverMode?: boolean;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  currentTab,
  onSelectTab,
  activeOrdersCount,
  cartCount,
  showDriverMode = true
}) => {
  const tabs = [
    {
      id: 'discover' as AppTab,
      label: 'Inicio',
      icon: Compass,
      badge: 0
    },
    {
      id: 'explore' as AppTab,
      label: 'Explorar',
      icon: UtensilsCrossed,
      badge: 0
    },
    {
      id: 'tracking' as AppTab,
      label: 'En Vivo',
      icon: MapPin,
      badge: activeOrdersCount
    },
    {
      id: 'profile' as AppTab,
      label: 'Carrito',
      icon: ShoppingBag,
      badge: cartCount
    }
  ];

  if (showDriverMode) {
    tabs.push({
      id: 'driver_mode' as AppTab,
      label: 'Conductor',
      icon: Bike,
      badge: 0
    });
  }

  const handleTabClick = (tabId: AppTab) => {
    if (tabId !== currentTab) {
      soundEngine.vibrate(15);
      soundEngine.playAdvanceChime();
    }
    onSelectTab(tabId);
  };

  return (
    <div
      style={{ bottom: 'calc(0.85rem + env(safe-area-inset-bottom, 0px))' }}
      className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none px-3 select-none"
    >
      <motion.nav
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-2xl bg-[#090d18]/90 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center w-14 sm:w-16 h-12 rounded-full transition-all duration-200 focus:outline-none group active-spring cursor-pointer"
            >
              {/* Active Background Pill with Spring physics */}
              {isActive && (
                <motion.div
                  layoutId="dock-active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFBF00] rounded-full shadow-[0_4px_18px_rgba(255,77,0,0.55)] border border-white/40"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 32,
                    mass: 0.6
                  }}
                />
              )}

              {/* Icon & Label */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white stroke-[2.4]' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold mt-0.5 tracking-tight transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </span>

                {/* Live Badge for active tracking or cart */}
                {tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-1 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black text-white shadow-md border-2 border-[#090d18] ${
                      isActive ? 'bg-zinc-950 text-orange-400' : 'bg-red-500 animate-pulse'
                    }`}
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </div>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};
