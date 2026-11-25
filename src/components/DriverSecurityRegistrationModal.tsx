import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Camera,
  Upload,
  User,
  Phone,
  FileText,
  Bike,
  Car,
  Footprints,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Lock,
  Smartphone,
  Eye,
  ScanFace,
  AlertCircle
} from 'lucide-react';
import { DriverProfile, VehicleTypeId } from '../types';
import { GoogleLogoSvg } from './BrandSvgIcons';

interface DriverSecurityRegistrationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (profile: DriverProfile) => void;
  initialProfile?: DriverProfile;
}

export const DriverSecurityRegistrationModal: React.FC<DriverSecurityRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialProfile
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [ceoCode, setCeoCode] = useState('');
  const [showCeoField, setShowCeoField] = useState(false);

  // Paso 1: Google y Teléfono
  const [googleLinked, setGoogleLinked] = useState(initialProfile?.googleLinked ?? false);
  const [googleEmail, setGoogleEmail] = useState(initialProfile?.googleEmail || 'juan.conductor@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState(initialProfile?.phone || '+58 414-8899221');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(initialProfile?.phoneVerified ?? false);

  // Paso 2: Datos Personales
  const [fullName, setFullName] = useState(initialProfile?.name || 'Carlos Mendoza');
  const [documentId, setDocumentId] = useState(initialProfile?.documentId || 'V-26.842.190');
  const [cityArea, setCityArea] = useState(initialProfile?.cityArea || 'Alta Vista y Puerto Ordaz');
  const [emergencyContactName, setEmergencyContactName] = useState(initialProfile?.emergencyContactName || 'María Mendoza (Madre)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialProfile?.emergencyContactPhone || '+58 412-8822100');

  // Paso 3: Vehículo y Modalidad
  const [vehicleType, setVehicleType] = useState<VehicleTypeId>(initialProfile?.vehicleType || 'moto');
  const [vehicleModel, setVehicleModel] = useState(initialProfile?.vehicleModel || 'Bera Socialista 150cc');
  const [vehiclePlate, setVehiclePlate] = useState(initialProfile?.vehiclePlate || 'AB-829K');

  // Paso 4: Fotos de Documentos
  const [idCardFront, setIdCardFront] = useState<string>(initialProfile?.idCardFrontUrl || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80');
  const [idCardBack, setIdCardBack] = useState<string>(initialProfile?.idCardBackUrl || 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80');
  const [licenseUrl, setLicenseUrl] = useState<string>(initialProfile?.driversLicenseUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80');
  const [medicalCertUrl, setMedicalCertUrl] = useState<string>(initialProfile?.medicalCertificateUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=400&q=80');
  const [circulationCertUrl, setCirculationCertUrl] = useState<string>(initialProfile?.vehicleRegistrationUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');

  // Paso 5: Selfie Biométrica en Vivo
  const [selfieUrl, setSelfieUrl] = useState<string>(initialProfile?.biometricSelfieUrl || initialProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [biometricApproved, setBiometricApproved] = useState(true);

  // Errores
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Manejador de subida de fotos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setter(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Simular Vinculación Google
  const handleLinkGoogle = () => {
    setGoogleLinked(true);
    setGoogleEmail('juanjosearismendi33@gmail.com');
  };

  // Simular Envío de OTP
  const handleSendOtp = () => {
    if (!phoneNumber) {
      setErrorMessage('Por favor ingresa un número de teléfono celular');
      return;
    }
    setOtpSent(true);
    setOtpCode('8942'); // Código simulado listo
    setErrorMessage('');
  };

  // Simular Verificación de OTP
  const handleVerifyOtp = () => {
    if (otpCode === '8942' || otpCode.length === 4 || otpCode.length === 6) {
      setPhoneVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Código incorrecto. Prueba con 8942');
    }
  };

  // Escaneo Biométrico Facial
  const handleTriggerBiometricScan = () => {
    setIsScanningBiometric(true);
    setTimeout(() => {
      setIsScanningBiometric(false);
      setBiometricApproved(true);
    }, 1800);
  };

  // Pase CEO con 0000
  const handleCeoBypass = () => {
    if (ceoCode === '0000') {
      const ceoProfile: DriverProfile = {
        id: 'CEO-001',
        name: 'Juan José Arismendi (CEO & Fundador)',
        phone: '+58 412-0000000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        rating: 5.0,
        totalTrips: 1840,
        vehicleType: 'moto',
        vehicleModel: 'Flota Oficial Go Delivery (Bera 150)',
        vehiclePlate: 'GO-CEO-01',
        cityArea: 'Toda Ciudad Guayana',
        isOnline: true,
        autoAcceptOrders: true,
        soundAlerts: true,
        theme: 'light',
        isVerified: true,
        verificationLevel: 'verified_maximum_security',
        googleLinked: true,
        googleEmail: 'juanjosearismendi33@gmail.com',
        phoneVerified: true,
        documentId: 'V-20.000.000',
        emergencyContactName: 'Central Go Delivery',
        emergencyContactPhone: '+58 414-8899221',
        verificationDate: '2026-09-20'
      };
      onSuccess(ceoProfile);
    } else {
      setErrorMessage('Código CEO incorrecto. Usa 0000');
    }
  };

  // Guardar y Finalizar Registro
  const handleFinishRegistration = () => {
    const finalProfile: DriverProfile = {
      id: initialProfile?.id || `DRV-${Date.now().toString().slice(-4)}`,
      name: fullName.trim() || 'Conductor Go Delivery',
      phone: phoneNumber.trim() || '+58 414-8899221',
      avatar: selfieUrl,
      rating: initialProfile?.rating || 5.0,
      totalTrips: initialProfile?.totalTrips || 0,
      vehicleType: vehicleType,
      vehicleModel: vehicleType === 'caminando' ? 'A Pie (Caminante)' : vehicleModel.trim() || 'Moto Estándar',
      vehiclePlate: vehicleType === 'caminando' ? 'A-PIE' : vehiclePlate.trim().toUpperCase() || 'SIN-PLACA',
      cityArea: cityArea,
      isOnline: true,
      autoAcceptOrders: false,
      soundAlerts: true,
      theme: initialProfile?.theme || 'light',
      isVerified: true,
      verificationLevel: 'verified_maximum_security',
      googleLinked: googleLinked,
      googleEmail: googleEmail,
      phoneVerified: phoneVerified,
      documentId: documentId,
      idCardFrontUrl: idCardFront,
      idCardBackUrl: idCardBack,
      driversLicenseUrl: licenseUrl,
      medicalCertificateUrl: medicalCertUrl,
      vehicleRegistrationUrl: circulationCertUrl,
      biometricSelfieUrl: selfieUrl,
      emergencyContactName: emergencyContactName,
      emergencyContactPhone: emergencyContactPhone,
      verificationDate: new Date().toISOString().split('T')[0]
    };
    onSuccess(finalProfile);
  };

  const isMotorVehicle = vehicleType === 'moto' || vehicleType === 'auto';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
        <div className="w-full max-w-xl my-auto rounded-3xl bg-white dark:bg-[#0d121f] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Top Accent Gradient Bar: De naranja intenso a un naranja casi amarillo */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFBF00]" />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF3700] to-[#FFBF00] text-white flex items-center justify-center shadow-md shadow-orange-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Registro de Máxima Seguridad
                  </h2>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    KYC Oficial
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paso {step} de 6: {
                    step === 1 ? 'Google y Celular' :
                    step === 2 ? 'Datos de Identidad' :
                    step === 3 ? 'Modalidad y Vehículo' :
                    step === 4 ? 'Fotos de Documentos' :
                    step === 5 ? 'Selfie Biométrica' : 'Aprobación Final'
                  }
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar with Intense-to-Yellow Orange Gradient */}
          <div className="w-full bg-slate-100 dark:bg-white/5 h-2 flex gap-1 px-3 py-0.5 inner-recessed">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  i <= step
                    ? 'bg-gradient-to-r from-[#FF3700] via-[#FF6E00] to-[#FFBF00] shadow-[0_0_8px_rgba(255,100,0,0.5)]'
                    : 'bg-slate-200 dark:bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* =========================================================================
                PASO 1: VERIFICACIÓN CON GOOGLE Y CELULAR
               ========================================================================= */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Paso 1: Autenticación de Cuentas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vincula tu cuenta de Google y verifica tu número de teléfono celular para recibir órdenes.
                  </p>
                </div>

                {/* Google Sign In Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/70 flex items-center justify-center shrink-0">
                      <GoogleLogoSvg className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Cuenta de Google</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {googleLinked ? googleEmail : 'No vinculada'}
                      </p>
                    </div>
                  </div>

                  {googleLinked ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Vinculado
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLinkGoogle}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-xs font-bold text-slate-900 dark:text-white transition active-spring"
                    >
                      Vincular Google
                    </button>
                  )}
                </div>

                {/* Phone Verification Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Verificación de Celular por SMS / WhatsApp
                      </span>
                    </div>
                    {phoneVerified && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verificado
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+58 414 1234567"
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                    {!phoneVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition active-spring shrink-0"
                      >
                        {otpSent ? 'Reenviar SMS' : 'Enviar Código'}
                      </button>
                    )}
                  </div>

                  {otpSent && !phoneVerified && (
                    <div className="pt-1 flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Código recibido (ej. 8942)"
                        className="w-40 px-3 py-2 text-center tracking-widest font-mono text-xs sm:text-sm bg-white dark:bg-black/30 border border-orange-500/40 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition active-spring"
                      >
                        Confirmar PIN
                      </button>
                    </div>
                  )}
                </div>

                {/* Acceso Rápido CEO */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCeoField(!showCeoField)}
                    className="text-[11px] text-slate-400 hover:text-orange-500 transition underline block mx-auto"
                  >
                    ¿Eres el CEO Juan José Arismendi? Acceso con Código Maestro
                  </button>

                  {showCeoField && (
                    <div className="mt-2 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="Código 0000"
                        value={ceoCode}
                        onChange={(e) => setCeoCode(e.target.value)}
                        className="w-28 px-3 py-1.5 text-center font-mono font-bold text-xs bg-white dark:bg-black/40 border border-orange-500/40 rounded-xl text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleCeoBypass}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition"
                      >
                        Desbloquear CEO
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =========================================================================
                PASO 2: DATOS DE IDENTIDAD Y CONTACTO DE EMERGENCIA
               ========================================================================= */}
            {step === 2 && (
              <div className="space-y-3.5">
                <div className="text-center pb-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Paso 2: Datos de Identidad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Información oficial según tu Cédula de Identidad y contacto para emergencias.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Nombre Completo (como en la Cédula)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Carlos Alberto Mendoza"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Cédula / RIF
                    </label>
                    <input
                      type="text"
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                      placeholder="V-26.842.190"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Zona Principal
                    </label>
                    <select
                      value={cityArea}
                      onChange={(e) => setCityArea(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Alta Vista y Puerto Ordaz">Alta Vista y Puerto Ordaz</option>
                      <option value="Unare y Castillito">Unare y Castillito</option>
                      <option value="San Félix">San Félix</option>
                      <option value="Toda Ciudad Guayana">Toda Ciudad Guayana</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contacto Directo de Emergencia</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="Nombre y Parentesco (ej. Madre)"
                      className="px-3 py-2 text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
                    />
                    <input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      placeholder="Teléfono móvil (+58 412...)"
                      className="px-3 py-2 text-xs bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                PASO 3: MODALIDAD Y VEHÍCULO
               ========================================================================= */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center pb-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Paso 3: Modalidad de Transporte
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Elige cómo realizarás las entregas. Esto ajustará los requerimientos de documentación.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVehicleType('moto')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      vehicleType === 'moto'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Bike className={`w-6 h-6 ${vehicleType === 'moto' ? 'text-orange-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold">Moto</p>
                      <p className="text-[10px] text-slate-400">Bera, Empire, etc.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('auto')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      vehicleType === 'auto'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Car className={`w-6 h-6 ${vehicleType === 'auto' ? 'text-orange-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold">Carro / Auto</p>
                      <p className="text-[10px] text-slate-400">Sedán o compacto</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('bici')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      vehicleType === 'bici'
                        ? 'bg-orange-500/10 border-orange-500 text-orange-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Bike className={`w-6 h-6 ${vehicleType === 'bici' ? 'text-orange-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold">Bicicleta</p>
                      <p className="text-[10px] text-slate-400">Ecológico</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('caminando')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      vehicleType === 'caminando'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Footprints className={`w-6 h-6 ${vehicleType === 'caminando' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold">A Pie (Caminante)</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">≤ 1.0 km sin vehículo</p>
                    </div>
                  </button>
                </div>

                {isMotorVehicle ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Modelo del Vehículo
                      </label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Ej. Bera Socialista 150"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Número de Placa
                      </label>
                      <input
                        type="text"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        placeholder="Ej. AB-829K"
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl text-orange-600 dark:text-orange-400 uppercase"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                    💡 <b>Modalidad sin combustible:</b> No necesitas placa ni habilitación vehicular. Solo se te exigirá Cédula de Identidad y Selfie biométrica.
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                PASO 4: FOTOS DE DOCUMENTOS OFICIALES Y HABILITACIÓN
               ========================================================================= */}
            {step === 4 && (
              <div className="space-y-3.5">
                <div className="text-center pb-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Paso 4: Documentos de Máxima Seguridad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isMotorVehicle
                      ? 'Cédula, Licencia de Conducir / Habilitación, Certificado Médico y Carnet de Circulación.'
                      : 'Cédula de Identidad y comprobante de residencia.'}
                  </p>
                </div>

                {/* Cédula Frontal y Posterior */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Cédula (Frontal)
                    </span>
                    <div className="w-full h-20 rounded-xl bg-slate-200 dark:bg-black/40 overflow-hidden relative group">
                      <img src={idCardFront} alt="Cédula Frontal" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition">
                        <Camera className="w-4 h-4 mb-1" />
                        Cambiar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setIdCardFront)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Cédula (Reverso)
                    </span>
                    <div className="w-full h-20 rounded-xl bg-slate-200 dark:bg-black/40 overflow-hidden relative group">
                      <img src={idCardBack} alt="Cédula Reverso" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition">
                        <Camera className="w-4 h-4 mb-1" />
                        Cambiar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setIdCardBack)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Si es Moto o Carro: Habilitación / Licencia y Certificado Médico */}
                {isMotorVehicle && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Licencia / Habilitación */}
                    <div className="p-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 text-center space-y-2">
                      <span className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400 block">
                        Licencia / Habilitación
                      </span>
                      <div className="w-full h-18 rounded-xl bg-slate-200 dark:bg-black/40 overflow-hidden relative group">
                        <img src={licenseUrl} alt="Licencia" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition">
                          <Upload className="w-3.5 h-3.5 mb-0.5" />
                          Subir
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setLicenseUrl)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Certificado Médico */}
                    <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                        Certificado Médico
                      </span>
                      <div className="w-full h-18 rounded-xl bg-slate-200 dark:bg-black/40 overflow-hidden relative group">
                        <img src={medicalCertUrl} alt="Certificado Médico" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition">
                          <Upload className="w-3.5 h-3.5 mb-0.5" />
                          Subir
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setMedicalCertUrl)}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Carnet de Circulación / Título */}
                    <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                        Carnet Circulación
                      </span>
                      <div className="w-full h-18 rounded-xl bg-slate-200 dark:bg-black/40 overflow-hidden relative group">
                        <img src={circulationCertUrl} alt="Carnet Circulación" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition">
                          <Upload className="w-3.5 h-3.5 mb-0.5" />
                          Subir
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setCirculationCertUrl)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                PASO 5: SELFIE BIOMÉTRICA FACIAL EN VIVO
               ========================================================================= */}
            {step === 5 && (
              <div className="space-y-4 text-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Paso 5: Validación Biométrica Facial
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprueba que eres el titular de los documentos mediante reconocimiento de rostro en vivo.
                  </p>
                </div>

                {/* Oval Camera Scanner Frame */}
                <div className="relative w-40 h-52 mx-auto rounded-[60px] border-4 border-dashed border-orange-500 overflow-hidden shadow-xl bg-black">
                  <img src={selfieUrl} alt="Selfie Biométrica" className="w-full h-full object-cover" />

                  {/* Scanning Laser Line */}
                  {isScanningBiometric && (
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [0, 180, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399]"
                    />
                  )}

                  {biometricApproved && !isScanningBiometric && (
                    <div className="absolute bottom-2 left-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold py-1 rounded-full flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Rostro Aprobado
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleTriggerBiometricScan}
                    disabled={isScanningBiometric}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active-spring"
                  >
                    <ScanFace className="w-4 h-4" />
                    <span>{isScanningBiometric ? 'Escaneando rasgos...' : 'Escanear Rostro'}</span>
                  </button>

                  <label className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
                    <Camera className="w-4 h-4" />
                    <span>Tomar Nueva Selfie</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setSelfieUrl)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* =========================================================================
                PASO 6: EMISIÓN DE CREDENCIAL Y APROBACIÓN FINAL
               ========================================================================= */}
            {step === 6 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <ShieldCheck className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    ¡Verificación de Seguridad Completada al 100%!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                    Tus documentos, cuenta de Google, línea telefónica y biometría han sido encriptados y aprobados por la plataforma.
                  </p>
                </div>

                {/* Carnet Digital de Conductor Verificado */}
                <div className="max-w-sm mx-auto p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-black text-white border border-white/20 shadow-xl text-left space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
                  
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <img src="/89340.svg" alt="Go" className="w-6 h-6 object-contain" />
                      <span className="text-xs font-black tracking-wider uppercase text-white">Go Delivery Oficial</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-black font-black uppercase">
                      Verificado 100%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={selfieUrl} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500" />
                    <div>
                      <p className="text-sm font-black text-white">{fullName}</p>
                      <p className="text-xs text-slate-300 font-mono">{documentId}</p>
                      <p className="text-[11px] text-orange-400 font-bold">
                        {vehicleType === 'caminando' ? 'Modalidad A Pie (≤ 1km)' : `${vehicleModel} · ${vehiclePlate}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-1 flex justify-between border-t border-white/10">
                    <span>Zona: {cityArea}</span>
                    <span>Emisión: {new Date().toLocaleDateString('es-VE')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-orange-500/30 active-spring"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishRegistration}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-600/30 active-spring"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Iniciar como Conductor Verificado</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
