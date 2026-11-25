import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Power,
  Wallet,
  Navigation2,
  Inbox,
  Settings,
  Bot,
  Sparkles,
  Smartphone,
  Sun,
  Moon,
  Footprints,
  Bike,
  Car,
  RefreshCw,
  ChevronRight,
  Camera,
  Lock,
  FileCheck,
  BatteryCharging,
  BatteryWarning,
  BatteryMedium,
  Download,
  Code,
  Network,
  Volume2,
  UserCheck
} from 'lucide-react';
import { DriverProfile, DriverAppTab } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { isAiStudioDevMode } from '../utils/isDevMode';
import { soundEngine } from '../utils/soundEffects';

interface DriverSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverProfile;
  currentTab: DriverAppTab;
  onSelectTab: (tab: DriverAppTab) => void;
  onToggleOnline: () => void;
  onToggleTheme?: () => void;
  onUpdateProfile?: (updated: Partial<DriverProfile>) => void;
  onOpenSecurityRegistration?: () => void;
  onOpenSupport?: () => void;
  onOpenHowItWorks?: () => void;
  onOpenApkModal?: () => void;
  onOpenSplash?: () => void;
  onOpenGoComercios?: () => void;
  onOpenIntegrationModal?: () => void;
  todayEarningsUsd?: number;
  batteryLevel?: number;
  isCharging?: boolean;
  onOpenBatteryModal?: () => void;
  onOpenVercelExport?: () => void;
}

export const DriverSidebarDrawer: React.FC<DriverSidebarDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  currentTab,
  onSelectTab,
  onToggleOnline,
  onToggleTheme,
  onUpdateProfile,
  onOpenSecurityRegistration,
  onOpenSupport,
  onOpenHowItWorks,
  onOpenApkModal,
  onOpenSplash,
  onOpenGoComercios,
  onOpenIntegrationModal,
  todayEarningsUsd = 42.5,
  batteryLevel = 100,
  isCharging = false,
  onOpenBatteryModal,
  onOpenVercelExport
}) => {
  const { rate, refreshRate, isUpdating } = useExchangeRate();
  const todayEarningsVes = todayEarningsUsd * rate;
  const drawerFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrawerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateProfile) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateProfile({
          avatar: dataUrl,
          photoFileName: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
          />

          {/* Minimalist Adaptive Slide-Bar Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34, mass: 0.8 }}
            className="relative z-10 w-[88vw] max-w-[340px] h-full bg-slate-50 dark:bg-[#0b0f19] border-r border-slate-200/80 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden select-none"
          >
            {/* Header Minimalist Gradient */}
            <div className="relative px-4 pt-4 pb-4 bg-gradient-to-br from-[#FF3700] via-[#FF6A00] to-[#FFAE00] text-white shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src="/89340.svg"
                    alt="Go Delivery"
                    className="h-8 w-auto object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block leading-none">
                      Menú Principal
                    </span>
                    <span className="text-sm font-black tracking-tight text-white truncate block">
                      Go Delivery Pro
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition active:scale-90 border border-white/20 shrink-0 cursor-pointer"
                  aria-label="Cerrar menú lateral"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Driver Identity Row */}
              <div className="mt-3.5 flex items-center gap-3 p-2.5 rounded-2xl bg-black/15 backdrop-blur-md border border-white/20">
                <div
                  onClick={() => drawerFileInputRef.current?.click()}
                  className="relative shrink-0 cursor-pointer group"
                  title="Cambiar foto de perfil"
                >
                  <img
                    src={profile.avatar || '/ceo-avatar.jpg'}
                    alt={profile.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/90 shadow-sm group-hover:opacity-80 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      profile.isOnline ? 'bg-emerald-400' : 'bg-slate-400'
                    }`}
                  />
                  <input
                    ref={drawerFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDrawerPhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="text-sm font-black text-white truncate">
                      {profile.name}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                  </div>
                  <p className="text-[11px] text-white/85 truncate font-medium">
                    {profile.googleEmail || profile.phone}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-white/90 font-semibold tabular-nums">
                    <span>★ {profile.rating || 5.0}</span>
                    <span>·</span>
                    <span>{profile.totalTrips || 0} viajes</span>
                    <span>·</span>
                    <span>Salud {profile.healthScore ?? 100}%</span>
                  </div>
                </div>
              </div>

              {profile.isLocked && (
                <div className="mt-2 p-2 rounded-xl bg-red-600/95 text-white border border-red-300/60 flex items-center gap-2 text-[11px] font-bold">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Cuenta bloqueada (Salud 0%)</span>
                </div>
              )}

              {/* Quick Online Toggle */}
              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Power className="w-3.5 h-3.5 text-white/90 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">
                    {profile.isOnline ? 'En Línea' : 'En Pausa'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onToggleOnline}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black tracking-wide uppercase transition active-spring shrink-0 cursor-pointer ${
                    profile.isOnline
                      ? 'bg-emerald-400 text-slate-950 shadow-sm'
                      : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  }`}
                >
                  {profile.isOnline ? 'Conectado' : 'Conectar'}
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4 no-scrollbar">
              {/* Theme Switcher Moved From Top Bar Into Menu (Prominent Segmented Control) */}
              {onToggleTheme && (
                <div className="p-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Apariencia de Pantalla
                    </span>
                    <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                      {profile.theme === 'dark' ? 'Oscuro' : 'Claro'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200/70 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        if (profile.theme !== 'light') onToggleTheme();
                        soundEngine.vibrate(12);
                      }}
                      className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        profile.theme === 'light'
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Claro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (profile.theme !== 'dark') onToggleTheme();
                        soundEngine.vibrate(12);
                      }}
                      className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        profile.theme === 'dark'
                          ? 'bg-[#161c2e] text-white shadow-xs border border-white/10'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Oscuro</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Minimalist Balance Summary */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab('earnings');
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-orange-500/40 transition active-spring cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Billetera Hoy
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                    ${todayEarningsUsd.toFixed(2)}
                    <span className="text-[11px] font-semibold text-slate-400 ml-1">USD</span>
                  </span>
                  <span className="text-xs font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400 truncate">
                    ≈ {todayEarningsVes.toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs
                  </span>
                </div>
              </button>

              {/* Main Views Navigation */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 block">
                  Navegación
                </span>

                {[
                  { id: 'active_delivery' as DriverAppTab, label: 'Mapa y Ruta Activa', icon: Navigation2 },
                  { id: 'available_orders' as DriverAppTab, label: 'Pedidos Disponibles', icon: Inbox },
                  { id: 'earnings' as DriverAppTab, label: 'Ganancias e Historial', icon: Wallet },
                  { id: 'settings' as DriverAppTab, label: 'Ajustes y Perfil', icon: Settings }
                ].map((nav) => {
                  const Icon = nav.icon;
                  const active = currentTab === nav.id;
                  return (
                    <button
                      key={nav.id}
                      type="button"
                      onClick={() => {
                        onSelectTab(nav.id);
                        onClose();
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 text-xs font-bold transition active-spring cursor-pointer ${
                        active
                          ? 'bg-orange-500/12 border border-orange-500/35 text-orange-600 dark:text-orange-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/[0.05] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-orange-500' : 'text-slate-400'}`} />
                        <span className="truncate">{nav.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Venezuelan Voice Quick Test */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.unlock();
                  soundEngine.speakVoiceSample();
                }}
                className="w-full p-3 rounded-2xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/25 text-orange-700 dark:text-orange-300 text-xs font-bold flex items-center justify-between gap-2 transition active-spring cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Volume2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <div className="text-left min-w-0">
                    <span className="block truncate font-bold">Voz Femenina Venezolana</span>
                    <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 block truncate">
                      Toca para escuchar saludo de prueba
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-500 text-white shrink-0">
                  Probar
                </span>
              </button>

              {/* Compact Vehicle Status */}
              <div className="p-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                      Vehículo Registrado
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                    Fijo
                  </span>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    {profile.vehicleType === 'caminando' ? (
                      <Footprints className="w-4 h-4 text-emerald-500" />
                    ) : profile.vehicleType === 'bici' ? (
                      <Bike className="w-4 h-4 text-sky-500" />
                    ) : profile.vehicleType === 'auto' ? (
                      <Car className="w-4 h-4 text-purple-500" />
                    ) : (
                      <Bike className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {profile.vehicleModel || 'Motocicleta'}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      Placa: {profile.vehiclePlate || 'Registrada'}
                    </p>
                  </div>
                </div>

                {onOpenSupport && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSupport();
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">Solicitar Cambio de Vehículo</span>
                  </button>
                )}
              </div>

              {/* Tools & Integrations */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 block">
                  Herramientas
                </span>

                {onOpenSplash && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSplash();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">Registro Email y Teléfono</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                )}

                {onOpenGoComercios && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenGoComercios();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 text-orange-800 dark:text-orange-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm shrink-0">🏪</span>
                      <span className="truncate font-bold">Go Comercios · Red Aliados</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  </button>
                )}

                {onOpenIntegrationModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenIntegrationModal();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Network className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate font-bold">Conectar App de Pedidos</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </button>
                )}

                {onOpenSecurityRegistration && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSecurityRegistration();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">Expediente y Verificación KYC</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                )}

                {onOpenSupport && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSupport();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Bot className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="truncate">Soporte IA & Emergencias SOS</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                )}

                {onOpenBatteryModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenBatteryModal();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isCharging ? (
                        <BatteryCharging className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : batteryLevel < 10 ? (
                        <BatteryWarning className="w-4 h-4 text-red-500 shrink-0" />
                      ) : (
                        <BatteryMedium className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <span className="truncate">Batería: {batteryLevel}%</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                )}

                {onOpenHowItWorks && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenHowItWorks();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="truncate">Cómo Funciona Go Delivery</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                )}

                {onOpenApkModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenApkModal();
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Smartphone className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="truncate">Instalar APK Móvil</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                )}

                {/* Developer Mode Only (AI Studio) */}
                {isAiStudioDevMode() && onOpenVercelExport && (
                  <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/25 space-y-2 mt-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5 truncate">
                        <Code className="w-3.5 h-3.5 shrink-0" />
                        <span>Modo Desarrollador</span>
                      </span>
                      <span className="text-[9px] font-mono text-orange-500 font-bold shrink-0">
                        AI Studio
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenVercelExport();
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 text-white text-xs font-bold flex items-center justify-between gap-2 transition active-spring cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Actualizar APK / ZIP</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Clean Footer: Live Rate */}
            <div
              style={{ paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom, 0px))' }}
              className="px-4 pt-3 border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0b0f19]/90 backdrop-blur-md flex items-center justify-between gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={refreshRate}
                title="Tasa oficial en tiempo real. Toca para sincronizar."
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-transparent hover:bg-emerald-500/10 border border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold tabular-nums active:scale-95 transition cursor-pointer"
              >
                <span>{rate.toFixed(2)} Bs/$</span>
                <RefreshCw className={`w-3 h-3 shrink-0 ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
              <span className="text-[10px] font-medium text-slate-400 truncate">
                Ciudad Guayana
              </span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
