import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  ArrowRight,
  MessageSquareText,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  RefreshCw,
  Volume2,
  X,
  User
} from 'lucide-react';
import { DriverProfile } from '../types';
import { soundEngine } from '../utils/soundEffects';
import {
  GoogleLogoSvg,
  GmailLogoSvg,
  OutlookLogoSvg,
  YahooLogoSvg,
  OtherMailLogoSvg
} from './BrandSvgIcons';
import welcomeBackdropImg from '../assets/images/welcome_brand_backdrop_1795404942476.jpg';

interface SplashAndAuthModalProps {
  isOpen: boolean;
  onSuccess: (profile: DriverProfile) => void;
  onClose?: () => void;
  initialEmail?: string;
  initialPhone?: string;
  initialName?: string;
  allowSkip?: boolean;
}

const EMAIL_DOMAINS = ['@gmail.com', '@outlook.com', '@hotmail.com', '@icloud.com'];
const QUICK_PREFIXES = ['+58', '+1', '+57', '+34', '+52'];

export const SplashAndAuthModal: React.FC<SplashAndAuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  initialEmail = '',
  initialPhone = '',
  initialName = '',
  allowSkip = false
}) => {
  const [view, setView] = useState<'welcome' | 'register' | 'sms_verify'>('welcome');
  const [authIntent, setAuthIntent] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [errorMsg, setErrorMsg] = useState('');

  // SMS 4-digit OTP state
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [resendSeconds, setResendSeconds] = useState<number>(0);
  const [showSmsBanner, setShowSmsBanner] = useState<boolean>(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState<boolean>(false);

  // Discreet CEO 0000 access toggle
  const [showCeoInput, setShowCeoInput] = useState<boolean>(false);
  const [ceoCode, setCeoCode] = useState<string>('');

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;
    setView('welcome');
    setName(initialName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setErrorMsg('');
    setIsSuccessAnim(false);
    setOtpDigits(['', '', '', '']);
    setShowSmsBanner(false);
    setShowCeoInput(false);
    setCeoCode('');
  }, [isOpen, initialName, initialEmail, initialPhone]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSeconds]);

  const handleAppendDomain = (domain: string) => {
    soundEngine.unlock();
    const clean = email.trim();
    if (!clean) {
      setEmail(`nombre${domain}`);
      return;
    }
    const localPart = clean.split('@')[0];
    setEmail(`${localPart}${domain}`);
  };

  const handleApplyPrefix = (prefix: string) => {
    soundEngine.unlock();
    const stripped = phone.trim().replace(/^\+\d{1,4}\s*/, '');
    setPhone(`${prefix} ${stripped}`.trim());
  };

  const createNewSmsCode = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedCode(code);
    setOtpDigits(['', '', '', '']);
    setResendSeconds(30);
    setShowSmsBanner(true);
    setErrorMsg('');
    soundEngine.unlock();
    soundEngine.playNewOrderAlert();
    soundEngine.speakSmsCodeSent();
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.unlock();

    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailValid) {
      setErrorMsg('Ingresa un correo electrónico válido (ej. tunombre@gmail.com).');
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setErrorMsg('Ingresa un teléfono válido de cualquier país (mín. 7 dígitos).');
      return;
    }

    setView('sms_verify');
    createNewSmsCode();
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 200);
  };

  const completeRegistration = (verifiedPhone: string, verifiedEmail: string) => {
    setIsSuccessAnim(true);
    soundEngine.unlock();
    soundEngine.playCompleteDelivery();
    const displayName = name.trim() || verifiedEmail.split('@')[0] || 'Socio Go';
    soundEngine.speakWelcomeGreeting(displayName);

    localStorage.setItem('gd_user_registered', 'true');
    localStorage.setItem('gd_user_registered_v2', 'true');

    setTimeout(() => {
      const registeredProfile: DriverProfile = {
        id: `DRV-${Date.now().toString().slice(-4)}`,
        name: displayName,
        phone: verifiedPhone,
        avatar: '/ceo-avatar.jpg',
        rating: 5.0,
        totalTrips: 0,
        vehicleType: 'moto',
        vehiclePlate: 'VERIFICADA',
        vehicleModel: 'Moto Go Delivery',
        cityArea: 'Toda Ciudad Guayana',
        isOnline: true,
        autoAcceptOrders: false,
        soundAlerts: true,
        theme: 'dark',
        googleLinked: true,
        googleEmail: verifiedEmail,
        phoneVerified: true,
        isVerified: true,
        verificationLevel: 'verified_standard'
      };
      onSuccess(registeredProfile);
    }, 950);
  };

  const handleOtpChange = (idx: number, raw: string) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean && raw !== '') return;

    if (clean.length >= 4) {
      const sliced = clean.slice(0, 4).split('');
      setOtpDigits(sliced);
      setErrorMsg('');
      if (sliced.join('') === generatedCode) {
        completeRegistration(phone.trim(), email.trim());
      } else {
        setErrorMsg('Código incorrecto. Revisa el mensaje SMS.');
      }
      return;
    }

    const next = [...otpDigits];
    next[idx] = clean.slice(-1);
    setOtpDigits(next);
    setErrorMsg('');

    if (clean && idx < 3) {
      otpRefs.current[idx + 1]?.focus();
    }

    const combined = next.join('');
    if (combined.length === 4) {
      if (combined === generatedCode) {
        completeRegistration(phone.trim(), email.trim());
      } else {
        soundEngine.vibrate([70, 40, 70]);
        setErrorMsg('Código incorrecto. Revisa el mensaje SMS.');
      }
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleAutoFillCode = () => {
    if (!generatedCode) return;
    soundEngine.unlock();
    soundEngine.playAdvanceChime();
    setOtpDigits(generatedCode.split(''));
    setErrorMsg('');
    completeRegistration(phone.trim(), email.trim());
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combined = otpDigits.join('');
    if (combined.length < 4) {
      setErrorMsg('Ingresa los 4 dígitos del mensaje SMS.');
      return;
    }
    if (combined === generatedCode) {
      completeRegistration(phone.trim(), email.trim());
    } else {
      soundEngine.vibrate([70, 40, 70]);
      setErrorMsg('El código ingresado no coincide.');
    }
  };

  const handleCeoUnlock = (codeVal: string) => {
    setCeoCode(codeVal);
    if (codeVal === '0000') {
      soundEngine.unlock();
      soundEngine.playCompleteDelivery();
      soundEngine.speakWelcomeGreeting('Juan José');
      localStorage.setItem('gd_user_registered', 'true');
      localStorage.setItem('gd_user_registered_v2', 'true');
      setIsSuccessAnim(true);
      setTimeout(() => {
        const ceoProfile: DriverProfile = {
          id: 'CEO-001',
          name: 'Juan José Arismendi (CEO)',
          phone: phone.trim() || '+58 412 000 0000',
          avatar: '/ceo-avatar.jpg',
          role: 'CEO / Fundador',
          rating: 5.0,
          totalTrips: 1250,
          vehicleType: 'moto',
          vehicleModel: 'Flota Oficial Go Delivery (Bera 150)',
          vehiclePlate: 'GO-CEO-01',
          cityArea: 'Toda Ciudad Guayana',
          isOnline: true,
          autoAcceptOrders: true,
          soundAlerts: true,
          theme: 'dark',
          googleLinked: true,
          googleEmail: email.trim() || 'juanjosearismendi33@gmail.com',
          phoneVerified: true,
          isVerified: true,
          verificationLevel: 'verified_maximum_security'
        };
        onSuccess(ceoProfile);
      }, 900);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-100 dark:bg-[#06070a]">
        {/* Mobile-First Adaptive Container Aligned With App Menu Palette */}
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full min-h-[100dvh] sm:min-h-[690px] sm:max-w-[430px] sm:my-6 sm:rounded-[2.25rem] sm:border sm:border-slate-200/80 sm:dark:border-white/10 sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col justify-between ${
            view === 'welcome'
              ? 'bg-[#0b0f19] text-white'
              : 'bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white'
          }`}
        >
          {/* Optional Close Button when reopened manually */}
          {allowSkip && onClose && !isSuccessAnim && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar registro"
              className="absolute top-[calc(1rem+env(safe-area-inset-top,0px))] right-4 z-30 w-10 h-10 rounded-xl bg-black/25 hover:bg-black/40 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {view === 'welcome' ? (
            /* ================================================================
               SCREEN 1: ORIGINAL STUDIO WELCOME (App Menu Palette: #FF3700 -> #FFAE00 + #0b0f19)
               ================================================================ */
            <>
              <img
                src={welcomeBackdropImg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-95"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/60 via-[#0b0f19]/35 to-[#0b0f19]/95 pointer-events-none"
              />

              <div className="relative z-10 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] px-8 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-18 h-18 rounded-2xl bg-white shadow-[0_16px_40px_rgba(255,55,0,0.35)] border border-white/40 flex items-center justify-center p-3 mb-7"
                >
                  <img
                    src="/89340.svg"
                    alt="Go Delivery"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFAE00] mb-2">
                  Go Delivery Pro
                </span>
                <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-white leading-snug">
                  Bienvenido a{' '}
                  <span className="bg-gradient-to-r from-[#FF6A00] to-[#FFAE00] bg-clip-text text-transparent font-black">
                    Go Delivery
                  </span>
                </h1>
                <p className="mt-3 text-xs sm:text-[13px] text-slate-300 max-w-[270px] leading-relaxed">
                  Registra tu correo y teléfono para recibir pedidos en tiempo real y gestionar tus ganancias.
                </p>
              </div>

              <div
                style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' }}
                className="relative z-10 px-7 space-y-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.unlock();
                    soundEngine.playAdvanceChime();
                    setAuthIntent('signup');
                    setView('register');
                  }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF3700] via-[#FF6A00] to-[#FFAE00] hover:brightness-105 text-white text-sm font-bold shadow-[0_10px_28px_rgba(255,70,0,0.4)] transition active:scale-[0.98] cursor-pointer"
                >
                  Registrarse
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.unlock();
                    soundEngine.playNotification();
                    setAuthIntent('login');
                    setView('register');
                  }}
                  className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-white text-sm font-semibold backdrop-blur-md transition active:scale-[0.98] cursor-pointer"
                >
                  Iniciar Sesión
                </button>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.unlock();
                      soundEngine.speakVoiceSample();
                    }}
                    className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-semibold text-[#FFAE00] hover:text-white transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Escuchar Voz Venezolana</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================================================================
               SCREEN 2 & 3: MENU-GRADIENT WAVES + CLEAN MINIMALIST FORM
               ================================================================ */
            <div className="relative flex-1 flex flex-col justify-between bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white">
              {/* Top Organic Curved Wave Header Using Exact Menu Gradient */}
              <div className="relative h-24 sm:h-28 w-full overflow-hidden shrink-0 pointer-events-none">
                <svg
                  viewBox="0 0 430 120"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="menuWaveTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF3700" />
                      <stop offset="50%" stopColor="#FF6A00" />
                      <stop offset="100%" stopColor="#FFAE00" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,0 L430,0 L430,52 C345,112 165,120 0,68 Z"
                    fill="url(#menuWaveTopGrad)"
                  />
                </svg>

                {/* Subtle Back Button */}
                {!isSuccessAnim && (
                  <button
                    type="button"
                    onClick={() => {
                      if (view === 'sms_verify') {
                        setView('register');
                      } else {
                        setView('welcome');
                      }
                      setErrorMsg('');
                    }}
                    className="pointer-events-auto absolute top-[calc(0.85rem+env(safe-area-inset-top,0px))] left-4 h-10 px-3.5 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </button>
                )}
              </div>

              {/* Center Minimalist Form Area */}
              <div className="relative z-10 flex-1 px-6 sm:px-8 py-2 flex flex-col justify-center">
                {isSuccessAnim ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      ¡Registro Completado!
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                      Tu correo y teléfono fueron confirmados. Entrando a Go Delivery...
                    </p>
                  </div>
                ) : view === 'register' ? (
                  <form onSubmit={handleSubmitRegister} className="space-y-3.5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="space-y-0.5">
                        <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#FF3700] via-[#FF6A00] to-[#FFAE00] bg-clip-text text-transparent">
                          {authIntent === 'signup' ? 'Crear Cuenta' : 'Iniciar Sesión'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Correo y teléfono (cualquier país) con confirmación por mensaje.
                        </p>
                      </div>
                      <img
                        src="/89340.svg"
                        alt="Go Delivery"
                        className="h-8 w-auto object-contain shrink-0"
                      />
                    </div>

                    {/* Nombre */}
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#FF6A00] focus:bg-white dark:focus:bg-white/[0.07] focus:outline-none transition"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="Correo electrónico (Email)"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMsg('');
                          }}
                          className="w-full h-11 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#FF6A00] focus:bg-white dark:focus:bg-white/[0.07] focus:outline-none transition"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {EMAIL_DOMAINS.map((dom) => (
                          <button
                            key={dom}
                            type="button"
                            onClick={() => handleAppendDomain(dom)}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] hover:bg-orange-500/15 hover:text-[#FF6A00] text-[11px] font-medium text-slate-600 dark:text-slate-300 transition cursor-pointer"
                          >
                            {dom}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Teléfono (Cualquier País) */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="Teléfono (cualquier país, ej. +58 412...)"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setErrorMsg('');
                          }}
                          className="w-full h-11 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 pl-10 pr-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#FF6A00] focus:bg-white dark:focus:bg-white/[0.07] focus:outline-none transition"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {QUICK_PREFIXES.map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleApplyPrefix(pref)}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] hover:bg-orange-500/15 hover:text-[#FF6A00] text-[11px] font-mono text-slate-600 dark:text-slate-300 transition cursor-pointer"
                          >
                            {pref}
                          </button>
                        ))}
                        <span className="text-[10px] text-slate-400">cualquier país</span>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/25 px-3 py-2 rounded-xl">
                        {errorMsg}
                      </div>
                    )}

                    {/* Primary CTA: Exact Menu Gradient */}
                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF3700] via-[#FF6A00] to-[#FFAE00] hover:brightness-105 text-white text-sm font-bold shadow-[0_8px_24px_rgba(255,70,0,0.3)] flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer mt-1"
                    >
                      <span>Confirmar por Mensaje</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Official Vector SVG Email & Google Access Row */}
                    <div className="pt-2 space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        <span>Ir directo a Google o tu correo</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <a
                          href="https://mail.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.unlock()}
                          title="Ir directo a Gmail"
                          className="h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.04] hover:border-[#FF6A00]/50 hover:bg-white dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center gap-0.5 transition"
                        >
                          <GmailLogoSvg className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">Gmail</span>
                        </a>

                        <a
                          href="https://accounts.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.unlock()}
                          title="Ir directo a Google"
                          className="h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.04] hover:border-[#FF6A00]/50 hover:bg-white dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center gap-0.5 transition"
                        >
                          <GoogleLogoSvg className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">Google</span>
                        </a>

                        <a
                          href="https://outlook.live.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.unlock()}
                          title="Ir directo a Outlook"
                          className="h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.04] hover:border-[#FF6A00]/50 hover:bg-white dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center gap-0.5 transition"
                        >
                          <OutlookLogoSvg className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">Outlook</span>
                        </a>

                        <a
                          href="https://mail.yahoo.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.unlock()}
                          title="Ir directo a Yahoo Mail"
                          className="h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.04] hover:border-[#FF6A00]/50 hover:bg-white dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center gap-0.5 transition"
                        >
                          <YahooLogoSvg className="w-4 h-4" />
                          <span className="text-[10px] font-semibold">Yahoo</span>
                        </a>
                      </div>

                      <div className="flex justify-center">
                        <a
                          href="mailto:"
                          onClick={() => soundEngine.unlock()}
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#FF6A00] transition"
                        >
                          <OtherMailLogoSvg className="w-3.5 h-3.5" />
                          <span>Abrir otra aplicación de correo</span>
                        </a>
                      </div>
                    </div>

                    {/* Discreet Voice & CEO Access */}
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.unlock();
                          soundEngine.speakVoiceSample();
                        }}
                        className="inline-flex items-center gap-1 text-[#FF6A00] font-semibold cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Probar voz</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCeoInput((v) => !v)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Acceso CEO</span>
                      </button>
                    </div>

                    {showCeoInput && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center gap-2">
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="Código 0000"
                          value={ceoCode}
                          onChange={(e) => handleCeoUnlock(e.target.value)}
                          className="flex-1 h-9 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/10 px-3 text-center font-mono tracking-widest text-sm text-slate-900 dark:text-white focus:border-[#FF6A00] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (ceoCode !== '0000') {
                              setErrorMsg('Código CEO inválido.');
                            } else {
                              handleCeoUnlock('0000');
                            }
                          }}
                          className="h-9 px-3.5 rounded-lg bg-gradient-to-r from-[#FF3700] to-[#FF6A00] text-white text-xs font-bold cursor-pointer"
                        >
                          Entrar
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  /* ================================================================
                     SCREEN 3: SMS CONFIRMATION STEP
                     ================================================================ */
                  <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#FF3700] via-[#FF6A00] to-[#FFAE00] bg-clip-text text-transparent">
                        Confirmar Teléfono
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ingresa el código de 4 dígitos enviado por mensaje a{' '}
                        <strong className="text-slate-800 dark:text-white font-mono">{phone}</strong>
                      </p>
                    </div>

                    {showSmsBanner && (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            <MessageSquareText className="w-4 h-4 shrink-0" />
                            <span>Mensaje SMS Recibido</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAutoFillCode}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            Autocompletar
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200">
                          Tu código Go Delivery es{' '}
                          <span className="font-mono font-black text-base text-slate-900 dark:text-white tracking-widest px-1.5 py-0.5 rounded bg-white dark:bg-[#0b0f19] border border-emerald-500/30">
                            {generatedCode}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 py-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          value={otpDigits[idx]}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className={`w-13 h-15 text-center text-2xl font-black font-mono rounded-xl border-2 outline-none transition ${
                            otpDigits[idx]
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white focus:border-[#FF6A00]'
                          }`}
                        />
                      ))}
                    </div>

                    {errorMsg && (
                      <div className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/25 px-3 py-2 rounded-xl text-center">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF3700] via-[#FF6A00] to-[#FFAE00] hover:brightness-105 text-white text-sm font-bold shadow-[0_8px_24px_rgba(255,70,0,0.3)] flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verificar y Entrar</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setView('register')}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold cursor-pointer"
                      >
                        Cambiar número
                      </button>

                      <button
                        type="button"
                        disabled={resendSeconds > 0}
                        onClick={createNewSmsCode}
                        className={`inline-flex items-center gap-1 font-semibold ${
                          resendSeconds > 0
                            ? 'text-slate-400 cursor-not-allowed'
                            : 'text-[#FF6A00] cursor-pointer'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{resendSeconds > 0 ? `Reenviar (${resendSeconds}s)` : 'Reenviar mensaje'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Bottom Organic Curved Wave Footer Matching Exact Menu Gradient */}
              <div className="relative h-16 sm:h-20 w-full overflow-hidden shrink-0 pointer-events-none">
                <svg
                  viewBox="0 0 430 100"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="menuWaveBottomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF3700" />
                      <stop offset="50%" stopColor="#FF6A00" />
                      <stop offset="100%" stopColor="#FFAE00" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 C140,-10 290,90 430,22 L430,100 L0,100 Z"
                    fill="url(#menuWaveBottomGrad)"
                    opacity="0.92"
                  />
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};