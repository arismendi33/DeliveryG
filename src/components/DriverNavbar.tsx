import React from 'react';
import {
  RefreshCw,
  Bot,
  Menu,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Download
} from 'lucide-react';
import { DriverProfile } from '../types';
import { GoStatusButton } from './GoStatusButton';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { isAiStudioDevMode } from '../utils/isDevMode';

interface DriverNavbarProps {
  profile: DriverProfile;
  onToggleOnline: () => void;
  onOpenSettings: () => void;
  onOpenHowItWorks?: () => void;
  onOpenSupport?: () => void;
  onOpenSecurityRegistration?: () => void;
  onOpenSlideBar?: () => void;
  isFloating?: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  onOpenBatteryModal?: () => void;
  onOpenDevSync?: () => void;
}

export const DriverNavbar: React.FC<DriverNavbarProps> = ({
  profile,
  onToggleOnline,
  onOpenSupport,
  onOpenSlideBar,
  batteryLevel = 100,
  isCharging = false,
  onOpenBatteryModal,
  onOpenDevSync
}) => {
  const { rate, isUpdating, refreshRate, lastUpdated } = useExchangeRate();
  const isDev = isAiStudioDevMode();

  return (
    <header
      style={{ top: 'calc(0.625rem + env(safe-area-inset-top, 0px))' }}
      className="fixed left-2.5 sm:left-4 right-2.5 sm:right-4 z-40 max-w-5xl mx-auto transition-all duration-300"
    >
      <div className="relative rounded-2xl backdrop-blur-xl bg-white/92 dark:bg-[#0c101b]/92 border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/50 overflow-hidden">
        {/* Hairline Top Brand Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFBF00]" />

        <div className="px-2.5 sm:px-4 h-14 flex items-center justify-between gap-2 min-w-0">
          {/* Left: Menu Trigger & GO Status */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0">
            {onOpenSlideBar && (
              <button
                type="button"
                onClick={onOpenSlideBar}
                title="Abrir menú principal"
                className="w-10 h-10 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 transition active-spring flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Abrir menú lateral"
              >
                <Menu className="w-4 h-4 text-orange-600 dark:text-orange-400 stroke-[2.2]" />
              </button>
            )}

            <GoStatusButton
              isOnline={profile.isOnline}
              onToggle={onToggleOnline}
              size="md"
            />
          </div>

          {/* Right: Rate, Battery, Support & Dev Sync (Theme toggle moved to Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live USD/VES Rate Chip */}
            <button
              type="button"
              onClick={refreshRate}
              title={`Tasa oficial: ${rate.toFixed(2)} Bs/$ (${lastUpdated}). Toca para actualizar.`}
              className="h-10 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 text-[11px] font-mono font-bold tabular-nums whitespace-nowrap bg-transparent hover:bg-emerald-500/10 border border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 transition active:scale-95 shrink-0 cursor-pointer"
            >
              <span>{rate.toFixed(2)} Bs/$</span>
              <RefreshCw
                className={`w-3 h-3 shrink-0 text-emerald-600 dark:text-emerald-400 ${
                  isUpdating ? 'animate-spin' : ''
                }`}
              />
            </button>

            {/* Compact Battery Status */}
            {onOpenBatteryModal && (
              <button
                type="button"
                onClick={onOpenBatteryModal}
                title={`Batería: ${batteryLevel}% ${batteryLevel < 10 ? '(Bloqueo < 10%)' : ''}`}
                className={`h-10 px-2.5 rounded-xl flex items-center gap-1 text-[11px] font-mono font-bold tabular-nums whitespace-nowrap transition active-spring shrink-0 border cursor-pointer ${
                  batteryLevel < 10
                    ? 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400'
                    : batteryLevel <= 20
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-100/90 dark:bg-white/[0.06] border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200'
                }`}
                aria-label="Estado de batería"
              >
                {isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                ) : batteryLevel < 10 ? (
                  <BatteryWarning className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                ) : batteryLevel <= 20 ? (
                  <BatteryLow className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                ) : (
                  <BatteryMedium className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <span className="hidden xs:inline sm:inline">{batteryLevel}%</span>
              </button>
            )}

            {/* AI Support / SOS */}
            {onOpenSupport && (
              <button
                type="button"
                onClick={onOpenSupport}
                title="Soporte IA y Emergencias SOS"
                className="w-10 h-10 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 transition active-spring shrink-0 flex items-center justify-center cursor-pointer"
                aria-label="Soporte IA y Emergencias"
              >
                <Bot className="w-4 h-4" />
              </button>
            )}

            {/* Exclusive AI Studio Dev Mode Button */}
            {isDev && onOpenDevSync && (
              <button
                type="button"
                onClick={onOpenDevSync}
                title="Modo Desarrollador (AI Studio): Actualizar APK y Exportar Código"
                className="h-10 px-2.5 rounded-xl flex items-center gap-1.5 border border-orange-500/40 bg-orange-500/15 hover:bg-orange-500/25 text-orange-600 dark:text-orange-400 text-[11px] font-mono font-bold whitespace-nowrap transition active:scale-95 shrink-0 cursor-pointer"
                aria-label="Actualizar APK en Modo Desarrollador"
              >
                <Download className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="hidden md:inline">Actualizar APK</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
