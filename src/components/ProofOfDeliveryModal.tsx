import React, { useState, useRef } from 'react';
import {
  KeyRound,
  Camera,
  CheckCircle,
  X,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Upload,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface ProofOfDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedPin: string;
  orderId: string;
  clientName: string;
  onConfirmSuccess: (photoUrl?: string) => void;
}

export const ProofOfDeliveryModal: React.FC<ProofOfDeliveryModalProps> = ({
  isOpen,
  onClose,
  expectedPin,
  orderId,
  clientName,
  onConfirmSuccess
}) => {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDigitInput = (index: number, val: string) => {
    const num = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = num;
    setPinDigits(newDigits);
    setErrorMsg(null);
    soundEngine.vibrate(20);

    // Auto-focus next input
    if (num && index < 3) {
      const nextInput = document.getElementById(`pin-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleNumpadClick = (num: string) => {
    soundEngine.vibrate(20);
    const emptyIndex = pinDigits.findIndex((d) => d === '');
    if (emptyIndex !== -1) {
      handleDigitInput(emptyIndex, num);
    }
  };

  const handleNumpadBackspace = () => {
    soundEngine.vibrate(20);
    const lastFilledIndex = [...pinDigits].reverse().findIndex((d) => d !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 3 - lastFilledIndex;
      const newDigits = [...pinDigits];
      newDigits[actualIndex] = '';
      setPinDigits(newDigits);
      setErrorMsg(null);
      const input = document.getElementById(`pin-box-${actualIndex}`);
      input?.focus();
    }
  };

  const handleSimulateCamera = () => {
    soundEngine.vibrate(40);
    // Instant high-quality delivery photo simulation
    const samplePhotos = [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
    ];
    setPhotoPreview(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleValidateAndComplete = () => {
    const entered = pinDigits.join('');
    if (entered.length < 4) {
      setErrorMsg('Introduce los 4 dígitos del código PIN');
      soundEngine.vibrate([40, 40]);
      return;
    }

    if (entered !== expectedPin) {
      setErrorMsg('PIN incorrecto. Pide el código que el cliente tiene en su app.');
      soundEngine.vibrate([60, 60, 60]);
      return;
    }

    // Success!
    soundEngine.playCompleteDelivery();
    onConfirmSuccess(photoPreview || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Prueba de Entrega
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                Validar PIN de {clientName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Box Digits PIN Display */}
        <div className="space-y-2 text-center">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            Código PIN de Seguridad (4 Dígitos)
          </label>

          <div className="flex justify-center gap-3">
            {pinDigits.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-box-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitInput(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 rounded-2xl text-center text-xl font-mono font-black border transition-all ${
                  digit
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white'
                } focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
              />
            ))}
          </div>

          {/* Quick hint with demo pin */}
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
            (PIN en app del cliente: <strong>{expectedPin}</strong>)
          </span>
        </div>

        {/* Tactile Big Numpad (Motorcycle/Glove friendly) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumpadClick(n)}
              className="py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-base font-black font-mono shadow-sm active:scale-95 transition"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => {
              setPinDigits(['', '', '', '']);
              setErrorMsg(null);
            }}
            className="py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 text-xs font-bold active:scale-95 transition"
          >
            Limpiar
          </button>
          <button
            onClick={() => handleNumpadClick('0')}
            className="py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-base font-black font-mono shadow-sm active:scale-95 transition"
          >
            0
          </button>
          <button
            onClick={handleNumpadBackspace}
            className="py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-orange-600 dark:text-orange-400 text-xs font-bold active:scale-95 transition"
          >
            Borrar
          </button>
        </div>

        {/* Optional Proof of Delivery Photo (for receptions, gates, apartments) */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Foto de Entrega (Opcional)
            </span>
            {photoPreview && (
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Foto adjunta
              </span>
            )}
          </div>

          {photoPreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 max-h-32 group">
              <img src={photoPreview} alt="Comprobante" className="w-full h-32 object-cover" />
              <button
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                title="Eliminar foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateCamera}
                className="py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                <Camera className="w-4 h-4 text-orange-500" />
                <span>Capturar Foto</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Subir Foto</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Big Complete Button */}
        <button
          onClick={handleValidateAndComplete}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Confirmar y Finalizar Entrega</span>
        </button>
      </div>
    </div>
  );
};
