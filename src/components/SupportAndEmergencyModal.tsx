import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bot,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Send,
  MessageSquare,
  Sparkles,
  MapPin,
  HelpCircle,
  Share2,
  CheckCircle2,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';
import { DriverProfile } from '../types';

interface SupportAndEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverProfile;
  currentCoords?: { lat: number; lng: number };
}

interface QuickFAQ {
  id: string;
  question: string;
  category: 'pagos' | 'pedidos' | 'rutas' | 'seguridad';
  answer: string;
}

const FAQ_LIST: QuickFAQ[] = [
  {
    id: '1',
    question: '¿Cómo cobro mis carreras en Pago Móvil y Efectivo USD?',
    category: 'pagos',
    answer: 'Al llegar al Punto B y validar el PIN de seguridad de 4 dígitos, el pago en Efectivo USD te lo entrega el destinatario en mano (verifica que no esté roto). Si el pedido indica Pago Móvil, el cliente te mostrará la referencia bancaria y debes confirmar el abono en tu cuenta bancaria (Banesco, Banco de Venezuela, Mercantil o Pago Móvil interbancario).'
  },
  {
    id: '2',
    question: '¿Cómo se calcula el precio en Bs/$ con la tasa en vivo?',
    category: 'pagos',
    answer: 'La app sincroniza en tiempo real la tasa del mercado oficial y Google para Ciudad Guayana. Todos los pagos en Bolívares (Bs) se multiplican exactamente por la tasa visible en la barra superior (ej. 845.50 Bs/$), garantizando que tu ganancia no sufra devaluación.'
  },
  {
    id: '3',
    question: '¿Qué hago si el destinatario no responde o no tiene el PIN?',
    category: 'pedidos',
    answer: 'Nunca entregues el paquete sin el PIN de 4 dígitos. Utiliza el botón de llamada directa en la pantalla de entrega. Si tras 10 minutos de espera reglamentaria no responde, contacta a Soporte Go Delivery. La orden será cancelada y recibirás el pago por el traslado.'
  },
  {
    id: '4',
    question: '¿Cómo cambio entre Moto, Carro, Bici y Caminante a pie?',
    category: 'rutas',
    answer: 'Toca el botón de tu Placa/Modalidad en la barra superior o ve a Ajustes. En modalidad "A Pie", el sistema solo te asignará encomiendas de hasta 1.0 km sin carga pesada, ideal si no tienes vehículo o combustible en ese momento.'
  },
  {
    id: '5',
    question: '¿Dónde están las zonas de mayor demanda en Puerto Ordaz y San Félix?',
    category: 'rutas',
    answer: 'En Puerto Ordaz: Alta Vista (C.C. Alta Vista I y II, Macrocentro), Unare II y Chilemex. En San Félix: Centro de San Félix, Av. Manuel Piar y El Roble. Las horas pico son de 11:30 AM a 2:30 PM y de 6:00 PM a 9:30 PM.'
  },
  {
    id: '6',
    question: '¿Puedo llevar paquetes sellados sin saber el contenido?',
    category: 'seguridad',
    answer: 'Sí. Go Delivery opera con estricta política de privacidad: los paquetes deben viajar precintados. Como repartidor solo verificas el estado exterior del empaque y la correspondencia del PIN.'
  }
];

export const SupportAndEmergencyModal: React.FC<SupportAndEmergencyModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentCoords = { lat: 8.2985, lng: -62.7350 }
}) => {
  const [activeTab, setActiveTab] = useState<'ai_support' | 'emergency_sos'>('ai_support');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<QuickFAQ | null>(FAQ_LIST[0]);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `¡Hola ${profile.name.split(' ')[0]}! Soy tu Asistente Inteligente Go Delivery. Estoy aquí para resolver cualquier duda sobre tus carreras, pagos en Bs o USD, rutas en Ciudad Guayana o resolver cualquier inconveniente en camino. ¿En qué te ayudo?`,
      time: 'Ahora'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);

  if (!isOpen) return null;

  const filteredFaqs = FAQ_LIST.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendAiMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuestion.trim()) return;

    const userText = userQuestion.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiChat((prev) => [...prev, { role: 'user', text: userText, time: timeNow }]);
    setUserQuestion('');
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('pin') || lower.includes('codigo') || lower.includes('clave')) {
        reply = 'El PIN de seguridad consta de 4 dígitos únicos generados al crear el pedido. Solo el cliente destinatario o remitente lo conoce. Si el cliente no lo tiene a mano, pídele que revise su WhatsApp o SMS de confirmación.';
      } else if (lower.includes('pago') || lower.includes('ves') || lower.includes('dolar') || lower.includes('bs') || lower.includes('bolivar')) {
        reply = `Todos los cobros se calculan con la tasa en tiempo real. Si el cliente paga en efectivo USD, verifica que el billete esté entero. Para Pago Móvil, exige ver la referencia aprobada antes de retirarte. Tu saldo acumulado se actualiza en la pestaña Ganancias.`;
      } else if (lower.includes('accidente') || lower.includes('policia') || lower.includes('emergencia') || lower.includes('robo') || lower.includes('ayuda')) {
        reply = '🚨 Si estás en una situación de peligro, cambia de inmediato a la pestaña SOS de esta ventana para llamar al VEN 911 o a la Policía de Bolívar y compartir tus coordenadas GPS con tu contacto de emergencia.';
      } else if (lower.includes('gasolina') || lower.includes('bomba') || lower.includes('combustible')) {
        reply = 'En Puerto Ordaz las estaciones subsidiadas e internacionales con menor cola suelen ser E/S Roraima (Paseo Caroní) y E/S Trebol (Alta Vista). Recuerda que si te quedas sin combustible puedes cambiar tu modalidad temporalmente a "A Pie" o "Bicicleta".';
      } else if (lower.includes('cliente') && (lower.includes('no responde') || lower.includes('no sale') || lower.includes('ausente'))) {
        reply = 'Protocolo cliente ausente: Realiza al menos 2 intentos de llamada telefónica. Si transcurren 10 minutos sin contacto en el Punto B, la central cancelará el pedido con compensación de flete por movilización.';
      } else {
        reply = `Entendido, ${profile.name.split(' ')[0]}. Para esa situación con tu viaje en ${profile.cityArea}: mantén la comunicación activa, resguarda el paquete con el precinto cerrado y valida que el estado de tu corrida coincida en el mapa. Si requieres asistencia humana, el centro de control Go Delivery está disponible las 24 horas.`;
      }

      setAiChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiTyping(false);
    }, 750);
  };

  const handleTriggerSos = () => {
    setSosActivated(true);
  };

  const emergencyMessage = encodeURIComponent(
    `🚨 ¡ALERTA DE EMERGENCIA GO DELIVERY!\n\nSoy el conductor ${profile.name} (Vehículo: ${profile.vehicleModel}, Placa: ${profile.vehiclePlate}).\nRequiero asistencia urgente en Ciudad Guayana.\n\n📍 Mis coordenadas GPS exactas son:\nhttps://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}\n\nPor favor comuníquense con las autoridades o acudan a esta ubicación.`
  );

  const emergencyPhone = profile.emergencyContactPhone?.replace(/\s+/g, '') || '+584148899221';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
        <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#0c101a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                {activeTab === 'ai_support' ? <Bot className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5 text-rose-500" />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {activeTab === 'ai_support' ? 'Soporte Inteligente Go' : 'Centro de Emergencias SOS'}
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    24/7 en Vivo
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTab === 'ai_support'
                    ? 'Respuestas inmediatas a preguntas y resolución de dudas en ruta'
                    : 'Protocolo de rescate, llamadas a autoridades y auxilio vial'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
              aria-label="Cerrar soporte"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 p-1.5 mx-4 sm:mx-6 mt-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setActiveTab('ai_support')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'ai_support'
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-orange-500" />
              <span>Asistente IA & Preguntas</span>
            </button>
            <button
              onClick={() => setActiveTab('emergency_sos')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'emergency_sos'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Protocolo SOS Emergencias</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeTab === 'ai_support' ? (
              <div className="space-y-5">
                {/* AI Interactive Chat Box */}
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-orange-500/15 pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300">
                      <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                      <span>Chat con Asistente Go IA (Gemini 24/7)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Respuesta instantánea</span>
                  </div>

                  {/* Chat Messages */}
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {aiChat.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            AI
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-orange-500 text-white rounded-tr-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-tl-none shadow-sm'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span
                            className={`text-[9px] block mt-1 font-mono ${
                              msg.role === 'user' ? 'text-white/80 text-right' : 'text-slate-400 text-left'
                            }`}
                          >
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                        <Bot className="w-4 h-4 animate-spin" />
                        <span>Analizando respuesta operativa...</span>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendAiMessage} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder="Escribe tu duda sobre pagos, rutas o incidencias..."
                      className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={!userQuestion.trim() || isAiTyping}
                      className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active-spring"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preguntar</span>
                    </button>
                  </form>
                </div>

                {/* Preguntas Frecuentes Rápidas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-orange-500" />
                      <span>Preguntas Frecuentes de Repartidores</span>
                    </h3>
                    <input
                      type="text"
                      placeholder="Buscar tema..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-32 sm:w-44 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredFaqs.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => setSelectedFaq(faq)}
                        className={`text-left p-3 rounded-xl border transition-all text-xs ${
                          selectedFaq?.id === faq.id
                            ? 'bg-orange-500/10 border-orange-500/40 text-orange-950 dark:text-orange-200 font-bold'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-orange-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="line-clamp-2">{faq.question}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedFaq && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{selectedFaq.question}</span>
                      </div>
                      <p className="leading-relaxed text-xs sm:text-sm pl-6">{selectedFaq.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB: PROTOCOLO SOS & EMERGENCIAS */
              <div className="space-y-4">
                {/* Big Red SOS Button */}
                <div className="p-4 sm:p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 animate-pulse">
                    <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      Botón de Pánico y Alerta SOS
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1">
                      Úsalo en caso de accidente de tránsito, intento de asalto o situación de riesgo inminente.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/?text=${emergencyMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Enviar SOS por WhatsApp con mi GPS</span>
                    </a>
                    <button
                      onClick={handleTriggerSos}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Activar Alarma de Resguardo</span>
                    </button>
                  </div>

                  {sosActivated && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs font-bold animate-bounce">
                      ⚠️ Alerta SOS activada: Tu ubicación GPS ha sido fijada para auxilio inmediato.
                    </div>
                  )}
                </div>

                {/* Coordenadas GPS del Conductor */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                        Ubicación Satelital en Tiempo Real
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)} ({profile.cityArea})
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[11px]"
                  >
                    Ver en Mapa
                  </a>
                </div>

                {/* Llamadas Rápidas de Emergencia */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Líneas Directas de Socorro (Un Toque)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* VEN 911 */}
                    <a
                      href="tel:911"
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-rose-500/40 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xs">
                          911
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">VEN 911 Nacional</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Emergencias integradas</p>
                        </div>
                      </div>
                      <PhoneCall className="w-4 h-4 text-rose-500 group-hover:scale-110 transition" />
                    </a>

                    {/* Policía Bolívar */}
                    <a
                      href="tel:02869234411"
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                          PEB
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Policía Bolívar Caroní</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Cuadrantes de Paz</p>
                        </div>
                      </div>
                      <PhoneCall className="w-4 h-4 text-blue-500 group-hover:scale-110 transition" />
                    </a>

                    {/* Bomberos Caroní */}
                    <a
                      href="tel:02869315555"
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500/40 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
                          BOM
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Bomberos de Caroní</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Paramédicos y rescate</p>
                        </div>
                      </div>
                      <PhoneCall className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
                    </a>

                    {/* Auxilio Vial y Grúa */}
                    <a
                      href={`tel:${emergencyPhone}`}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                          <LifeBuoy className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {profile.emergencyContactName || 'Auxilio Vial Go'}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {profile.emergencyContactPhone || 'Grúa / Soporte conductor'}
                          </p>
                        </div>
                      </div>
                      <PhoneCall className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
                    </a>
                  </div>
                </div>

                {/* Protocolos de Acción Rápida */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                    <span>Pasos a seguir ante un incidente en ruta:</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Prioriza siempre tu seguridad personal y mantén la calma.</li>
                    <li>Si tienes falla mecánica (pinchazo o gasolina), oríllate en zona iluminada y transitada.</li>
                    <li>Ante cualquier sospecha de inseguridad, no te detengas y dirígete al punto policial más cercano.</li>
                    <li>El paquete está asegurado por la empresa. Nunca arriesgues tu integridad física.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Go Delivery Guayana • Asistencia Continua
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
