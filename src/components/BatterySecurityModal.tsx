import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Battery,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  ShieldAlert,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Smartphone
} from 'lucide-react';
import { BatteryStatus } from '../hooks/useBatteryStatus';

interface BatterySecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  batteryStatus: BatteryStatus;
}

export const BatterySecurityModal: React.FC<BatterySecurityModalProps> = ({
  isOpen,
  onClose,
  batteryStatus
}) => {
  const {
    level,
    isCharging,
    isSupported,
    isSimulated,
    isBelow10Percent,
    isLocked,
    setSimulatedLevel,
    resetToRealBattery
  } = batteryStatus;

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="w-8 h-8 text-amber-500 animate-pulse" />;
    if (level < 10) return <BatteryWarning className="w-8 h-8 text-red-500 animate-bounce" />;
    if (level <= 20) return <BatteryLow className="w-8 h-8 text-amber-500" />;
    if (level <= 60) return <BatteryMedium className="w-8 h-8 text-blue-500" />;
    return <Battery className="w-8 h-8 text-emerald-500" />;
  };

  const getStatusColor = () => {
    if (level < 10) return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30';
    if (level <= 20) return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-md bg-white dark:bg-[#0c101b] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Top gradient accent */}
            <div className={`h-1.5 w-full ${level < 10 ? 'bg-gradient-to-r from-red-600 to-rose-500' : 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500'}`} />

            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-2xl border ${getStatusColor()}`}>
                  {getBatteryIcon()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Estado de Batería & Bloqueo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Regla de seguridad: Bloqueo invisible si &lt; 10%
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition active-spring"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Battery Level Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Carga Detectada
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                      {level}%
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColor()}`}>
                      {level < 10 ? 'Batería Crítica (< 10%)' : level <= 20 ? 'Batería Baja' : 'Nivel Óptimo'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isSimulated ? '🛠 Modo Simulación / Prueba' : isSupported ? '📱 Sensor Real del Dispositivo' : '💻 Sensor Estándar Web'}
                    {isCharging ? ' • ⚡ Conectado al cargador' : ''}
                  </p>
                </div>

                {/* Visual Battery Bar */}
                <div className="w-10 h-16 rounded-xl border-2 border-slate-300 dark:border-white/20 p-1 flex flex-col justify-end relative">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-t-sm bg-slate-300 dark:bg-white/20" />
                  <div
                    className={`w-full rounded-md transition-all duration-300 ${
                      level < 10
                        ? 'bg-red-500'
                        : level <= 20
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ height: `${Math.max(8, level)}%` }}
                  />
                </div>
              </div>

              {/* Status explanation */}
              <div className={`p-4 rounded-2xl border ${level < 10 ? 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200' : 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'}`}>
                <div className="flex items-start gap-2.5">
                  {level < 10 ? (
                    <Lock className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-1">
                    <p className="font-bold">
                      {level < 10
                        ? 'Bloqueo invisible ACTIVO'
                        : 'Sistema Operativo y Desbloqueado'}
                    </p>
                    <p className="opacity-90 leading-relaxed">
                      {level < 10
                        ? 'La batería es inferior al 10%. Por seguridad, la interfaz no responde a toques ni clics de forma invisible para salvaguardar el dispositivo.'
                        : 'El nivel de batería es igual o superior al 10%. No hay ningún bloqueo activo.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulation Controls for Testing */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Simular para pruebas
                  </span>
                  {isSimulated && (
                    <button
                      onClick={resetToRealBattery}
                      className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restablecer sensor real
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSimulatedLevel(8);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition active-spring"
                  >
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      Simular 8% (&lt; 10%)
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Activa bloqueo invisible
                    </p>
                  </button>

                  <button
                    onClick={() => setSimulatedLevel(100)}
                    className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition active-spring"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Simular 100%
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Desbloqueo inmediato
                    </p>
                  </button>
                </div>

                {/* Slider */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Ajustar porcentaje manual:</span>
                    <span className="font-mono font-bold">{level}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={level}
                    onChange={(e) => setSimulatedLevel(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-red-500 font-bold">1% (Bloqueado)</span>
                    <span className="text-amber-500 font-bold">10% (Límite)</span>
                    <span className="text-emerald-500 font-bold">100%</span>
                  </div>
                </div>
              </div>

              {/* Rescue Information Box */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-slate-300 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Mecanismos de escape durante la prueba:
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 opacity-90 pl-1">
                  <li>Presiona la tecla <strong>Escape 3 veces</strong> para desbloquear al instante.</li>
                  <li>Toca <strong>5 veces rápido</strong> en la esquina superior derecha de la pantalla.</li>
                  <li>Al conectar el cargador o subir a 10% o más, se libera automáticamente.</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition active-spring"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
