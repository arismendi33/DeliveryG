import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bike,
  ShieldCheck,
  Check,
  Smartphone,
  Footprints,
  Car,
  Info,
  FileCheck,
  FlaskConical,
  ArrowRight,
  RefreshCw,
  Camera,
  UploadCloud,
  CheckCircle2,
  Zap,
  Lock,
  HeartPulse,
  AlertTriangle,
  Network,
  UserCheck
} from 'lucide-react';
import { DriverProfile, ThemeMode } from '../types';
import { soundEngine } from '../utils/soundEffects';
import { checkForOtaUpdates, subscribeOtaStatus, APP_VERSION, OtaStatus } from '../utils/otaManager';
import { BatteryStatus } from '../hooks/useBatteryStatus';

interface SettingsViewProps {
  profile: DriverProfile;
  onUpdateProfile: (updated: Partial<DriverProfile>) => void;
  onOpenApkModal: () => void;
  onOpenHowItWorks?: () => void;
  onOpenSplash?: () => void;
  onResetDemoOrder?: () => void;
  onOpenSecurityRegistration?: () => void;
  onOpenSupport?: () => void;
  onSimulateIncomingOrder?: () => void;
  onPenaltyUnfulfilledOrder?: () => void;
  onRestoreHealth?: () => void;
  onOpenHealthModal?: () => void;
  batteryStatus?: BatteryStatus;
  onOpenBatteryModal?: () => void;
  onOpenVercelExport?: () => void;
  onOpenIntegrationModal?: () => void;
}

const CITY_AREAS = [
  'Toda Ciudad Guayana',
  'Alta Vista y Puerto Ordaz',
  'San Félix y El Roble',
  'Unare, Castillito y Villa Alianza'
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenApkModal,
  onOpenSplash,
  onOpenSecurityRegistration,
  onOpenSupport,
  onRestoreHealth,
  onOpenHealthModal,
  onOpenIntegrationModal
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [photoUploadMsg, setPhotoUploadMsg] = useState<string | null>(null);
  const [otaCheckMsg, setOtaCheckMsg] = useState<string | null>(null);
  const [isSpeakingTest, setIsSpeakingTest] = useState(false);
  const [otaStatus, setOtaStatus] = useState<OtaStatus>({
    isChecking: false,
    hasUpdate: false,
    lastChecked: null,
    registration: null,
    version: APP_VERSION
  });

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeOtaStatus((status) => {
      setOtaStatus(status);
    });
    return unsubscribe;
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateProfile({
          avatar: dataUrl,
          photoFileName: file.name
        });
        setPhotoUploadMsg(`Foto actualizada: ${file.name}`);
        soundEngine.playAdvanceChime();
        setTimeout(() => setPhotoUploadMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerSaveToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAreaChange = (area: string) => {
    onUpdateProfile({ cityArea: area });
    triggerSaveToast();
  };

  const handleThemeChange = (mode: ThemeMode) => {
    onUpdateProfile({ theme: mode });
    triggerSaveToast();
  };

  const handleTestVoice = () => {
    setIsSpeakingTest(true);
    soundEngine.unlock();
    soundEngine.speakVenezuelanSweetVoice(
      '¡Hola mi amor! Soy tu asistente de Go Delivery en Venezuela. Qué chévere escucharte, ¡estamos listos para rodar!',
      () => setIsSpeakingTest(false)
    );
    setTimeout(() => setIsSpeakingTest(false), 6000);
  };

  const score = profile.healthScore ?? 100;
  const isLocked = profile.isLocked || score <= 0;
  const unfulfilledCount = profile.unfulfilledOrdersCount ?? 0;

  return (
    <div className="space-y-4 pb-28">
      {/* Minimalist Driver Profile Card */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            onClick={() => photoFileInputRef.current?.click()}
            className="relative cursor-pointer group shrink-0"
            title="Cambiar foto de perfil"
          >
            <img
              src={profile.avatar || '/ceo-avatar.jpg'}
              alt={profile.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-orange-500/40 group-hover:opacity-80 transition"
            />
            <button
              type="button"
              aria-label="Cambiar foto"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center border-2 border-white dark:border-[#0c101b] shadow-sm transition"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              ref={photoFileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="text-base font-black text-slate-900 dark:text-white truncate">
                {profile.name}
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {profile.googleEmail || 'Sin correo'} · {profile.phone}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tabular-nums pt-0.5">
              <span className="text-amber-500 font-bold font-mono">★ {profile.rating}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">{profile.totalTrips} viajes</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">ID {profile.id}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70 dark:border-white/8 shrink-0">
          <button
            type="button"
            onClick={() => photoFileInputRef.current?.click()}
            className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
          >
            <UploadCloud className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Cambiar Foto</span>
          </button>

          {onOpenSplash && (
            <button
              type="button"
              onClick={onOpenSplash}
              className="h-9 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/25 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Editar Registro</span>
            </button>
          )}
        </div>
      </div>

      {photoUploadMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="truncate">{photoUploadMsg}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Configuración actualizada.</span>
        </div>
      )}

      {/* Adaptive 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Account Health Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
            isLocked
              ? 'bg-red-950/20 border-red-500/40'
              : 'glass-card'
          }`}
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-white/8">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isLocked
                    ? 'bg-red-500/15 text-red-500'
                    : 'bg-orange-500/10 text-orange-500'
                }`}
              >
                {isLocked ? <Lock className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  Salud de la Cuenta
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isLocked ? 'Cuenta bloqueada' : score < 50 ? 'Riesgo alto' : 'Estado óptimo'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 tabular-nums">
              <span
                className={`text-2xl font-black font-mono ${
                  isLocked ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/100</span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.max(4, score)}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isLocked
                  ? 'bg-red-500'
                  : score < 50
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04]">
              <span className="text-[10px] text-slate-400 font-semibold block truncate">Fallas</span>
              <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                {unfulfilledCount}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04]">
              <span className="text-[10px] text-slate-400 font-semibold block truncate">Penalidad</span>
              <span className="text-sm font-black font-mono text-orange-500">-25 pts</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04]">
              <span className="text-[10px] text-slate-400 font-semibold block truncate">Recepción</span>
              <span className={`text-xs font-bold ${isLocked ? 'text-red-500' : 'text-emerald-500'}`}>
                {isLocked ? 'Pausada' : 'Activa'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Abandonar pedidos aceptados resta 25 puntos. Al llegar a 0, la cuenta se suspende automáticamente.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {isLocked && onRestoreHealth && (
              <button
                type="button"
                onClick={onRestoreHealth}
                className="h-9 px-3.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Restaurar Cuenta
              </button>
            )}
            {onOpenHealthModal && (
              <button
                type="button"
                onClick={onOpenHealthModal}
                className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ml-auto"
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Políticas y Apelaciones</span>
              </button>
            )}
          </div>
        </div>

        {/* Voz Venezolana & Alertas */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Voz Venezolana y Alertas
          </h3>

          {/* Interactive Venezuelan Voice Test Card */}
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <Volume2 className={`w-4 h-4 text-orange-500 shrink-0 ${isSpeakingTest ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Voz Femenina Venezolana
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Indicaciones de ruta, bienvenida y alertas en voz dulce.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#FF3700] to-[#FFAE00] text-white text-xs font-bold shrink-0 whitespace-nowrap transition active:scale-95 cursor-pointer self-start sm:self-center"
            >
              {isSpeakingTest ? 'Hablando...' : 'Escuchar Voz'}
            </button>
          </div>

          <div className="space-y-3 divide-y divide-slate-200/70 dark:divide-white/8">
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {profile.soundAlerts ? (
                    <Volume2 className="w-4 h-4 text-orange-500 shrink-0" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    Sonido de Nuevos Pedidos
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Alerta audible mientras conduces.
                </p>
              </div>
              <button
                type="button"
                aria-label="Alternar sonido"
                onClick={() => {
                  onUpdateProfile({ soundAlerts: !profile.soundAlerts });
                  triggerSaveToast();
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                  profile.soundAlerts ? 'bg-orange-500' : 'bg-slate-300 dark:bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.soundAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3">
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate">
                  Aceptación Automática
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Acepta envíos cercanos automáticamente.
                </p>
              </div>
              <button
                type="button"
                aria-label="Alternar aceptación automática"
                onClick={() => {
                  onUpdateProfile({ autoAcceptOrders: !profile.autoAcceptOrders });
                  triggerSaveToast();
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                  profile.autoAcceptOrders ? 'bg-orange-500' : 'bg-slate-300 dark:bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.autoAcceptOrders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme & Operational Area */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Apariencia
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              También disponible en todo momento desde el menú lateral.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                profile.theme === 'light'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4 shrink-0" />
              <span>Modo Claro</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`h-11 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                profile.theme === 'dark'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Moon className="w-4 h-4 shrink-0" />
              <span>Modo Oscuro</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200/70 dark:border-white/8 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Zona Operativa
              </h4>
            </div>

            <div className="space-y-1.5">
              {CITY_AREAS.map((area) => {
                const isSelected = profile.cityArea === area;
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleAreaChange(area)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/40 text-orange-600 dark:text-orange-400'
                        : 'bg-slate-100/70 dark:bg-white/[0.04] border-slate-200/70 dark:border-white/8 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{area}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vehicle & OTA & Inter-App Connection */}
        <div className="space-y-4">
          {/* Vehicle Card */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
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
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {profile.vehicleModel || 'Motocicleta'}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                    Placa: {profile.vehiclePlate || 'Registrada'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                Fijo
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenSupport) onOpenSupport();
                else if (onOpenSecurityRegistration) onOpenSecurityRegistration();
              }}
              className="w-full h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">Solicitar Cambio de Vehículo</span>
            </button>
          </div>

          {/* Inter-App Integration */}
          {onOpenIntegrationModal && (
            <button
              type="button"
              onClick={onOpenIntegrationModal}
              className="w-full text-left glass-card p-4 rounded-2xl border-emerald-500/25 flex items-center justify-between gap-3 hover:border-emerald-500/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Network className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    Conectar App de Pedidos · API
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Puente para recibir pedidos de comercios externos.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
            </button>
          )}

          {/* OTA APK Card */}
          <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">
                  Sincronización APK (OTA)
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {otaStatus.version}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  setOtaCheckMsg('Verificando versión...');
                  const updated = await checkForOtaUpdates();
                  setOtaCheckMsg(
                    updated
                      ? '¡Actualización sincronizada!'
                      : 'Tienes la versión más reciente.'
                  );
                  setTimeout(() => setOtaCheckMsg(null), 4000);
                }}
                disabled={otaStatus.isChecking}
                className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${otaStatus.isChecking ? 'animate-spin' : ''}`} />
                <span>Verificar Actualización</span>
              </button>

              <button
                type="button"
                onClick={onOpenApkModal}
                className="h-9 px-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                <span>Instalar APK</span>
              </button>
            </div>

            {otaCheckMsg && (
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {otaCheckMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
