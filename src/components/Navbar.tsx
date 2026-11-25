import React from 'react';
import {
  Bike,
  Smartphone,
  ArrowRightLeft,
  RefreshCw
} from 'lucide-react';
import { AppTab, UserRole, ThemeMode } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { BrandLogo } from './BrandLogo';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { soundEngine } from '../utils/soundEffects';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  activeOrdersCount: number;
  onOpenApkModal: () => void;
  onOpenLogoModal: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTab,
  userRole,
  onToggleRole,
  onOpenApkModal
}) => {
  const { rate, isUpdating, refreshRate } = useExchangeRate();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#090d18]/90 border-b border-slate-200/80 dark:border-white/10 transition-all select-none">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 min-w-0">
          {/* Brand & Live Exchange Rate */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              onClick={() => onSelectTab('discover')}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
              title="Go Delivery - Inicio"
            >
              <BrandLogo variant="emblem" size="md" showSubtitle={false} />
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.vibrate(10);
                refreshRate();
              }}
              className="h-9 px-2.5 rounded-xl flex items-center gap-1.5 text-[11px] font-mono font-bold tabular-nums whitespace-nowrap bg-transparent hover:bg-emerald-500/10 border border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 cursor-pointer transition active:scale-95 shrink-0"
              title="Tasa oficial en tiempo real (toca para refrescar)"
            >
              <span>{rate.toFixed(2)} Bs/$</span>
              <RefreshCw
                className={`w-3 h-3 shrink-0 text-emerald-600 dark:text-emerald-400 ${
                  isUpdating ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>

          {/* Right Action Controls (Theme switcher lives in Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.vibrate(20);
                soundEngine.playAdvanceChime();
                onToggleRole();
              }}
              title="Cambiar entre vista de Cliente y Repartidor"
              className={`h-9 px-3 rounded-xl flex items-center gap-1.5 border text-xs font-bold whitespace-nowrap transition active:scale-95 cursor-pointer ${
                userRole === 'driver'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-sm'
                  : 'bg-slate-100 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/10'
              }`}
            >
              {userRole === 'driver' ? (
                <>
                  <Bike className="w-3.5 h-3.5 shrink-0" />
                  <span>Conductor</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-3.5 h-3.5 shrink-0 text-orange-500" />
                  <span>Conductor</span>
                </>
              )}
            </button>

            <PWAInstallButton onOpenApkModal={onOpenApkModal} />

            <button
              type="button"
              onClick={() => {
                soundEngine.vibrate(10);
                onOpenApkModal();
              }}
              title="Descargar APK para Android"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-orange-500 hover:border-orange-500/40 transition active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Smartphone className="w-4 h-4 text-orange-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
