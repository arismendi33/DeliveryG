import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Navigation,
  ShieldCheck,
  Wallet,
  Smartphone,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Compass,
  Building2,
  RotateCcw
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAvailableOrders?: () => void;
}

interface StepItem {
  id: number;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  tip: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    badge: 'Paso 1: Notificación',
    title: 'Alerta Sonora de Corrida Entrante',
    subtitle: 'Suena fuerte en tu casco o teléfono cuando hay un despacho cerca',
    description:
      'Cuando un cliente o negocio solicita un servicio en tu zona, la app emite una alerta sonora potente y vibración háptica. Verás la ganancia en USD y Bolívares, distancia en kilómetros y tiempo estimado de viaje.',
    tip: 'Consejo: Puedes pulsar el botón "Escuchar Tono" abajo para probar cómo suena la alerta en tu teléfono.'
  },
  {
    id: 2,
    badge: 'Paso 2: Aceptación',
    title: 'Desliza para Aceptar el Pedido',
    subtitle: 'Toma la corrida al instante con un solo gesto seguro',
    description:
      'Para evitar toques accidentales mientras conduces tu moto o bicicleta, la asignación se confirma deslizando la barra hacia la derecha. La corrida queda reservada 100% para ti.',
    tip: '¡Nadie te la puede quitar una vez aceptada!'
  },
  {
    id: 3,
    badge: 'Paso 3: Navegación',
    title: 'Mapa Satelital con Modo Oscuro Azul',
    subtitle: 'Carreteras azul brillante y ubicación GPS en tiempo real',
    description:
      'El mapa satelital interactivo resalta las carreteras en azul celeste brillante sobre fondo azul oscuro descansado para la vista nocturna. Tu marcador de moto se sincroniza con tu chip GPS para guiarte hasta el comercio y cliente.',
    tip: 'También puedes tocar el botón lateral de Google Maps o Waze para recibir instrucciones por voz paso a paso.'
  },
  {
    id: 4,
    badge: 'Paso 4: Recogida',
    title: 'Llegada a Punto A y Paquete en Mano',
    subtitle: 'Avisa con un toque que estás en el restaurante o tienda',
    description:
      'Al llegar al local comercial (Punto A), tocas "Llegué a Punto A". El negocio te entregará el paquete sellado. Luego tocas "Paquete Recogido" y el mapa recalculará automáticamente la ruta hacia el destino del cliente.',
    tip: 'Verifica siempre que el número de orden coincida antes de arrancar la moto.'
  },
  {
    id: 5,
    badge: 'Paso 5: Entrega & Pago',
    title: 'PIN de Seguridad y Ganancia Inmediata',
    subtitle: 'El cliente te da su PIN de 4 dígitos y el dinero entra al instante',
    description:
      'Al llegar al Punto B, solicitas el código PIN de 4 dígitos al cliente para validar la entrega segura. Al ingresarlo, se reproduce el tono de éxito y el dinero ($ USD y Bolívares a la tasa actual) se acredita de inmediato a tu Billetera Go.',
    tip: 'Los fondos acumulados están listos para retirar a Pago Móvil venezolano o Zelle cuando tú lo desees.'
  }
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onOpenAvailableOrders
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasTestedSound, setHasTestedSound] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentStep = STEPS[currentStepIndex];
  const STEP_DURATION_MS = 6500;

  // Auto-advance timer when playing
  useEffect(() => {
    if (!isOpen) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying) {
      const interval = 50;
      const stepIncrement = (interval / STEP_DURATION_MS) * 100;

      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next step
            setCurrentStepIndex((curr) => {
              const next = (curr + 1) % STEPS.length;
              return next;
            });
            return 0;
          }
          return prev + stepIncrement;
        });
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, isPlaying, currentStepIndex]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setProgress(0);
      setIsPlaying(true);
      setHasTestedSound(false);
      soundEngine.unlock();
    }
  }, [isOpen]);

  const handleTestSound = () => {
    soundEngine.playNewOrderAlert();
    setHasTestedSound(true);
  };

  const handleNextStep = () => {
    setProgress(0);
    soundEngine.playNotification();
    setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
  };

  const handlePrevStep = () => {
    setProgress(0);
    soundEngine.playNotification();
    setCurrentStepIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  };

  const handleSelectStep = (index: number) => {
    setProgress(0);
    soundEngine.playNotification();
    setCurrentStepIndex(index);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 18 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl text-white overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-orange-600/20 via-slate-900 to-sky-600/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  ¿Cómo Funciona Go Delivery?
                </h2>
                <p className="text-[11px] text-slate-400">
                  Guía animada interactiva para repartidores
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Progress Bars (Stories / Reels Style) */}
          <div className="px-4 sm:px-5 pt-3 pb-1 flex items-center gap-1.5">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(idx)}
                  className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden transition-all relative cursor-pointer hover:bg-white/25"
                  title={step.title}
                >
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-75"
                    style={{
                      width: isPast ? '100%' : isCurrent ? `${progress}%` : '0%'
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Simulation / Visual Canvas */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Visual Phone Simulation Area */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-[#070d1f] border border-sky-500/30 overflow-hidden shadow-inner flex flex-col justify-between p-4">
              {/* Animated Background Road Network (Dark Blue + Glowing Cyan Roads) */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  {/* Glowing Neon Blue Roads */}
                  <path d="M-20,60 Q120,40 260,110 T550,80" fill="none" stroke="url(#roadGlow)" strokeWidth="6" />
                  <path d="M60,-20 Q90,130 180,180 T300,320" fill="none" stroke="url(#roadGlow)" strokeWidth="5" />
                  <path d="M180,180 L480,240" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="6,6" />
                  <path d="M-10,210 C140,190 280,260 480,190" fill="none" stroke="#60a5fa" strokeWidth="4" />
                </svg>
              </div>

              {/* Step 1 Visual: New Order Alert with Sound */}
              {currentStepIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative z-10 w-full h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                      <span>¡NUEVA CORRIDA ENTRANTE!</span>
                    </div>
                    <span className="text-[11px] font-mono text-sky-300 font-bold">~1.8 km de ti</span>
                  </div>

                  {/* Order Floating Card */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="p-3 rounded-2xl bg-slate-800/90 border border-white/20 backdrop-blur-md shadow-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/30">
                        GD
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white">Burgers & Wings Alta Vista</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold">Punto A</span>
                        </div>
                        <p className="text-[11px] text-slate-300">Entrega en Urb. Los Olivos (Punto B)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black font-mono text-emerald-400">+$3.50 USD</span>
                      <span className="text-[10px] font-mono text-slate-400 block">≈ 2,959 Bs</span>
                    </div>
                  </motion.div>

                  {/* Sound Trigger Button within Visual */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleTestSound}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/30 active:scale-95 transition"
                    >
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span>🔊 Escuchar Tono de Corrida</span>
                    </button>
                    {hasTestedSound && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ¡Así suena tu teléfono!
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2 Visual: Swipe to Accept */}
              {currentStepIndex === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative z-10 w-full h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Gesto de confirmación rápida</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">100% Asignado</span>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-300">Desliza la barra verde hacia la derecha:</p>
                    {/* Animated Mock Slider */}
                    <div className="relative w-full h-12 rounded-2xl bg-slate-800 border border-white/20 overflow-hidden flex items-center p-1">
                      <motion.div
                        animate={{ x: [0, 180, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                        className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg cursor-grab"
                      >
                        <ChevronRight className="w-5 h-5 font-bold" />
                      </motion.div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/60 pointer-events-none">
                        Deslizar para Aceptar Envío ➔
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sin toques accidentales mientras estás en marcha</span>
                  </div>
                </motion.div>
              )}

              {/* Step 3 Visual: GPS Map with Dark Blue & Cyan Roads */}
              {currentStepIndex === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative z-10 w-full h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
                      <Navigation className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                      <span>GPS Satelital Activo (Modo Azul Neón)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Precisión ±4m</span>
                  </div>

                  {/* Simulated Moving Courier Moto Icon */}
                  <div className="relative w-full flex-1 flex items-center justify-center">
                    {/* Punto A */}
                    <div className="absolute left-6 top-8 flex items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-md">
                        A
                      </div>
                      <span className="text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-orange-300 font-bold">Local</span>
                    </div>

                    {/* Moto Repartidor animada */}
                    <motion.div
                      animate={{
                        x: [-60, 60, -60],
                        y: [-20, 20, -20]
                      }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                      className="relative z-20 flex flex-col items-center"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white border-2 border-white shadow-xl shadow-orange-500/40 flex items-center justify-center text-lg">
                        🏍️
                      </div>
                      <span className="text-[9px] font-black bg-black/80 px-1.5 py-0.5 rounded text-emerald-400 mt-1 border border-emerald-500/40">
                        En camino
                      </span>
                    </motion.div>

                    {/* Punto B */}
                    <div className="absolute right-6 bottom-4 flex items-center gap-1">
                      <span className="text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-sky-300 font-bold">Cliente</span>
                      <div className="w-7 h-7 rounded-full bg-sky-600 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-md">
                        B
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>Calles en azul brillante para no encandilar</span>
                    <span className="text-orange-400 font-bold">Google Maps / Waze listos</span>
                  </div>
                </motion.div>
              )}

              {/* Step 4 Visual: Pickup at Point A */}
              {currentStepIndex === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative z-10 w-full h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-300">Punto A: Recogida en Comercio</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold">Comida Lista</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/90 border border-white/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">1. Pulsas: "Llegué a Punto A"</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">2. Recibes paquete sellado</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-orange-400">3. Pulsas: "Paquete Recogido"</span>
                      <span className="text-[10px] font-mono bg-orange-500/20 px-2 py-0.5 rounded text-orange-300 font-bold">➔ Hacia Punto B</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 text-center">
                    El cliente recibe notificación automática en su teléfono avisándole que vas en camino.
                  </div>
                </motion.div>
              )}

              {/* Step 5 Visual: Delivery Complete + PIN + Instant Wallet */}
              {currentStepIndex === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative z-10 w-full h-full flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ¡Entrega Finalizada!
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">PIN Validado</span>
                  </div>

                  {/* Cash Credited Card */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-1 shadow-xl">
                    <span className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider">Acreditado en Billetera</span>
                    <div className="text-2xl font-black font-mono text-white">
                      +$3.50 <span className="text-sm font-semibold text-emerald-300">USD</span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-emerald-400">
                      ≈ 2,959.25 Bs al precio actual
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>Retiros directos a Pago Móvil</span>
                    <button
                      onClick={() => soundEngine.playCompleteDelivery()}
                      className="text-orange-400 hover:text-orange-300 font-bold underline"
                    >
                      Escuchar sonido triunfal 🔔
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Step Explanation Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                  {currentStep.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentStepIndex + 1} de {STEPS.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-amber-300 flex items-start gap-2 mt-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentStep.tip}</span>
              </div>
            </div>

            {/* Controls: Play/Pause, Prev, Next */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Continuar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  title="Reiniciar animación"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                  title="Paso anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextStep}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                  title="Siguiente paso"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAvailableOrders) {
                      onOpenAvailableOrders();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition active:scale-95"
                >
                  Ver Pedidos Disponibles ➔
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
