import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  X,
  Copy,
  Check,
  Building,
  BellRing,
  Send,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface ClientContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactPhone: string;
  pointType: 'Punto A (Remitente)' | 'Punto B (Destinatario)';
  orderId: string;
}

export const ClientContactModal: React.FC<ClientContactModalProps> = ({
  isOpen,
  onClose,
  contactName,
  contactPhone,
  pointType,
  orderId
}) => {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [quickAlertSent, setQuickAlertSent] = useState<string | null>(null);

  if (!isOpen) return null;

  // Clean phone number for WhatsApp link
  const cleanPhone = contactPhone.replace(/[^\d+]/g, '').replace(/^0/, '58');

  const copyNumber = () => {
    navigator.clipboard?.writeText(contactPhone);
    setCopied(true);
    soundEngine.vibrate(30);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendPresetWhatsApp = (presetText: string) => {
    soundEngine.vibrate(30);
    const fullText = encodeURIComponent(
      `¡Hola ${contactName}! Soy tu repartidor de Go Delivery (Orden #${orderId}). ${presetText}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${fullText}`, '_blank');
    setQuickAlertSent(presetText);
    setTimeout(() => setQuickAlertSent(null), 3000);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    sendPresetWhatsApp(customMsg.trim());
    setCustomMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
              {pointType}
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
              {contactName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phone number display & quick copy */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                Teléfono Directo
              </span>
              <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {contactPhone}
              </p>
            </div>
          </div>

          <button
            onClick={copyNumber}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
            title="Copiar número"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Action Buttons: Call & WhatsApp */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${contactPhone}`}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <Phone className="w-4 h-4 text-orange-500" />
            <span>Llamar</span>
          </a>

          <button
            onClick={() => sendPresetWhatsApp('Estoy en camino con tu entrega.')}
            className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Quick Pre-formatted WhatsApp Alerts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Avisos en 1 toque (WhatsApp)
          </span>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => sendPresetWhatsApp('Ya estoy afuera en la entrada / garita.')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-orange-500" />
                <span>"Ya estoy afuera en la entrada / garita"</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => sendPresetWhatsApp('Estoy subiendo en el ascensor / edificio.')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5 text-orange-500" />
                <span>"Estoy subiendo al piso / apartamento"</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => sendPresetWhatsApp('¿Podrías confirmar si estás listo para recibir?')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-between transition active:scale-98"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                <span>"¿Estás listo para recibir el paquete?"</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {quickAlertSent && (
          <p className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 font-bold">
            ✓ Abriendo WhatsApp para enviar aviso
          </p>
        )}
      </div>
    </div>
  );
};
