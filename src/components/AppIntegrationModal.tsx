import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  Copy,
  Check,
  Zap,
  Flame,
  Radio,
  Share2,
  Code2,
  HelpCircle,
  Play,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Server,
  Database,
  ArrowRight,
  ShieldCheck,
  Store,
  DollarSign,
  MapPin,
  X
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import { sendOrderFromOrderingApp, ExternalOrderPayload } from '../services/orderBridge';

interface AppIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
}

export const AppIntegrationModal: React.FC<AppIntegrationModalProps> = ({
  isOpen,
  onClose,
  currentRate
}) => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'code' | 'test'>('requirements');
  const [codeType, setCodeType] = useState<'firebase' | 'broadcast' | 'webhook'>('firebase');
  const [copied, setCopied] = useState(false);

  // Formulario para probar en vivo
  const [testMerchant, setTestMerchant] = useState('Burger King Alta Vista');
  const [testPickupAddress, setTestPickupAddress] = useState('C.C. Alta Vista 1, Puerto Ordaz');
  const [testClient, setTestClient] = useState('Carlos Fernández');
  const [testPhone, setTestPhone] = useState('+58 414 789-1234');
  const [testDropoffAddress, setTestDropoffAddress] = useState('Urb. Chilemex, Calle Chile, Casa #14');
  const [testPayoutUsd, setTestPayoutUsd] = useState(3.50);
  const [testTotalUsd, setTestTotalUsd] = useState(14.80);
  const [testPackage, setTestPackage] = useState('Combo Whopper Doble + Refresco');
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    soundEngine.vibrate(30);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTestOrder = () => {
    soundEngine.unlock();
    soundEngine.vibrate([40, 50, 40]);

    const orderPayload: ExternalOrderPayload = {
      id: `GD-EXT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: testClient,
      clientPhone: testPhone,
      pickup: {
        title: testMerchant,
        address: testPickupAddress,
        coords: { lat: 8.2974, lng: -62.7291 }
      },
      dropoff: {
        title: `Entrega a ${testClient}`,
        address: testDropoffAddress,
        details: 'Tocar timbre o llamar al llegar',
        coords: { lat: 8.3032, lng: -62.7185 }
      },
      payoutUsd: Number(testPayoutUsd),
      orderCostUsd: Number(testTotalUsd),
      packageType: `Bolsa térmica: ${testPackage}`,
      paymentType: 'Prepagado vía Go Comercios',
      securityPin: String(Math.floor(1000 + Math.random() * 9000)),
      isPriority: true,
      notesForDriver: 'Cliente esperando en la puerta. Entregar precintado.'
    };

    sendOrderFromOrderingApp(orderPayload);
    setTestSentSuccess(true);
    setTimeout(() => setTestSentSuccess(false), 3000);
  };

  const codeSnippets = {
    firebase: `// ============================================================
// 1. CÓDIGO PARA TU OTRA APP (APP DE PEDIDOS / CLIENTES / COMERCIOS)
// Utilizando Firebase Firestore en Tiempo Real (Recomendado para producción)
// ============================================================

import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Inicializa Firestore en tu app de pedidos con la misma configuración
const db = getFirestore();

/**
 * Función que llama tu otra app al momento en que el cliente o comercio
 * confirma su pedido para enviarlo a los repartidores de Go Delivery:
 */
export async function enviarPedidoAGoDelivery(pedidoCliente) {
  try {
    const nuevoPedido = {
      // Identificador único generado por tu app de pedidos
      codigoPedido: pedidoCliente.id || 'PED-' + Date.now().toString().slice(-4),
      
      // Estado inicial para que los repartidores lo vean disponible
      status: 'available',
      
      // Datos del cliente que recibe
      cliente: {
        nombre: pedidoCliente.nombreCliente,
        telefono: pedidoCliente.telefonoCliente,
        direccionEntrega: pedidoCliente.direccionEntrega,
        coordenadas: pedidoCliente.coordenadasEntrega || { lat: 8.297, lng: -62.729 },
        detallesUbicacion: pedidoCliente.numeroCasaApto || ''
      },

      // Datos del comercio o restaurante donde se retira
      origenComercio: {
        nombre: pedidoCliente.nombreRestaurante,
        direccion: pedidoCliente.direccionRestaurante,
        coordenadas: pedidoCliente.coordenadasRestaurante || { lat: 8.305, lng: -62.715 },
        telefonoContacto: pedidoCliente.telefonoRestaurante || ''
      },

      // Ganancia ofrecida al repartidor en USD
      tarifaDeliveryUsd: Number(pedidoCliente.costoDeliveryUsd || 3.50),
      
      // Total de los productos en la orden
      costoProductosUsd: Number(pedidoCliente.totalProductosUsd || 15.00),
      
      // Descripción de los ítems
      descripcion: pedidoCliente.resumenProductos || 'Bolsa térmica sellada',
      
      // Método de pago
      metodoPago: pedidoCliente.metodoPago || 'Pago Móvil / Prepagado',
      
      // Código de seguridad de 4 dígitos para entrega segura
      pinSeguridad: Math.floor(1000 + Math.random() * 9000).toString(),
      
      fechaCreacion: serverTimestamp()
    };

    // Se guarda en la colección compartida 'orders'
    const docRef = await addDoc(collection(db, 'orders'), nuevoPedido);
    console.log('✅ Pedido emitido exitosamente a Go Delivery:', docRef.id);
    return { exito: true, id: docRef.id, pin: nuevoPedido.pinSeguridad };
  } catch (error) {
    console.error('❌ Error enviando pedido a Go Delivery:', error);
    throw error;
  }
}`,

    broadcast: `// ============================================================
// 2. CÓDIGO DIRECTO SIN SERVIDOR (BROADCAST CHANNEL & LOCALSYNC)
// Ideal para pruebas en el mismo navegador, teléfono o PWA
// ============================================================

/**
 * Emite un pedido que la app de Go Delivery Repartidor capturará
 * de forma instantánea en 0 milisegundos si están en el mismo dispositivo:
 */
export function emitirPedidoDirecto(pedido) {
  const payload = {
    type: 'NEW_ORDER',
    timestamp: Date.now(),
    order: {
      id: pedido.id || 'EXT-' + Math.floor(1000 + Math.random() * 9000),
      clientName: pedido.nombreCliente || 'Juan Pérez',
      clientPhone: pedido.telefono || '+58 414 1234567',
      pickup: {
        title: pedido.tienda || 'Arturos C.C. Alta Vista',
        address: pedido.direccionTienda || 'Alta Vista, Puerto Ordaz',
        coords: { lat: 8.2974, lng: -62.7291 }
      },
      dropoff: {
        title: 'Entrega a ' + (pedido.nombreCliente || 'Cliente'),
        address: pedido.direccionEntrega || 'Urb. Los Olivos, Calle 3, Casa #8',
        details: 'Apto 4B, frente al parque',
        coords: { lat: 8.3032, lng: -62.7185 }
      },
      payoutUsd: Number(pedido.gananciaDelivery || 3.50),
      orderCostUsd: Number(pedido.totalCompra || 18.00),
      packageType: pedido.descripcion || 'Bolsa térmica sellada con alimentos',
      paymentType: 'Prepagado vía Go Comercios',
      securityPin: String(Math.floor(1000 + Math.random() * 9000)),
      isPriority: true,
      notesForDriver: 'Manejar con cuidado. Bebidas incluidas.'
    }
  };

  // 1. Canal BroadcastChannel (para comunicarse entre pestañas o apps)
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    const channel = new BroadcastChannel('GO_DELIVERY_INTERAPP_ORDERS');
    channel.postMessage(payload);
    setTimeout(() => channel.close(), 100);
  }

  // 2. LocalStorage Sync (para disparar el evento de almacenamiento)
  try {
    localStorage.setItem('gd_incoming_interapp_order', JSON.stringify({
      ...payload.order,
      _time: Date.now()
    }));
  } catch (e) {}

  console.log('🚀 Pedido emitido a Go Delivery Repartidor');
}`,

    webhook: `// ============================================================
// 3. CÓDIGO VÍA API REST / WEBHOOK HTTP POST
// Si tienes un backend (Node.js, Express, Next.js, Python, PHP, etc.)
// ============================================================

// Llamada desde tu servidor o desde tu app de frontend:
async function enviarPedidoViaWebhook(pedido) {
  const URL_API_REPARTIDOR = 'https://tu-dominio-repartidor.app/api/orders/receive';

  const bodyData = {
    clientName: pedido.nombreCliente,
    clientPhone: pedido.telefonoCliente,
    pickup: {
      title: pedido.nombreLocal,
      address: pedido.direccionLocal,
      coords: pedido.coordsLocal
    },
    dropoff: {
      title: 'Entrega: ' + pedido.nombreCliente,
      address: pedido.direccionEntrega,
      details: pedido.detallesUbicacion,
      coords: pedido.coordsEntrega
    },
    payoutUsd: pedido.tarifaDeliveryUsd || 3.50,
    orderCostUsd: pedido.totalProductosUsd || 15.00,
    packageType: pedido.resumenProductos,
    securityPin: '4921'
  };

  const response = await fetch(URL_API_REPARTIDOR, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer TU_API_KEY_OPCIONAL'
    },
    body: JSON.stringify(bodyData)
  });

  const data = await response.json();
  return data;
}`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Cabecera con degradado esmeralda / cian */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
          <button
            onClick={() => {
              soundEngine.vibrate(20);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Network className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/25 border border-white/40 uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                Interconexión de Apps
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Conectar con App de Pedidos
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                Recibe pedidos en tiempo real generados por tu otra app de clientes o comercios
              </p>
            </div>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20">
            <button
              onClick={() => {
                soundEngine.vibrate(15);
                setActiveTab('requirements');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'requirements'
                  ? 'bg-white text-emerald-800 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              1. ¿Qué se necesita?
            </button>
            <button
              onClick={() => {
                soundEngine.vibrate(15);
                setActiveTab('code');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-white text-emerald-800 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              2. Código para tu App
            </button>
            <button
              onClick={() => {
                soundEngine.vibrate(15);
                setActiveTab('test');
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'test'
                  ? 'bg-white text-emerald-800 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              3. Probar en Vivo
            </button>
          </div>
        </div>

        {/* Contenido según pestaña */}
        <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto space-y-4">
          {/* TAB 1: REQUISITOS Y EXPLICACIÓN */}
          {activeTab === 'requirements' && (
            <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <h3 className="font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-base">
                  <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ¿Qué se necesita para conectar las dos aplicaciones?
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 mt-1 leading-relaxed">
                  Para que tu app de pedidos (clientes o comercios) y esta app de repartidores se comuniquen en tiempo real, existen dos escenarios según dónde se ejecuten:
                </p>
              </div>

              {/* Escenario 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                    A
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Para Teléfonos Diferentes en la Calle / Producción (Internet)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Cuando el cliente pide desde su casa y el repartidor está en su moto con el APK:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>1. Base de datos en la nube compartida</strong>: Lo más rápido y económico es <strong>Firebase Firestore</strong> o <strong>Supabase</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>2. Mismo Proyecto / Credenciales</strong>: Ambas apps usan la misma base de datos y la misma colección <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-emerald-600 font-mono">orders</code>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>3. Flujo en Tiempo Real</strong>: 
                      La app de clientes escribe un documento con <code className="font-mono text-emerald-600">status: 'available'</code>. Esta app de repartidor tiene un listener en vivo (<code className="font-mono text-emerald-600">onSnapshot</code>) que hace sonar la alarma inmediatamente. Al aceptar el pedido, el repartidor actualiza el estado a <code className="font-mono text-emerald-600">accepted</code> con su nombre y ubicación GPS.
                    </span>
                  </div>
                </div>
              </div>

              {/* Escenario 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center">
                    B
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Para Pruebas Inmediatas en el Mismo Dispositivo (¡Listo ya!)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  No necesitas configurar servidores ni pagar nada para probar:
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Esta app ya tiene incorporado <strong>BroadcastChannel</strong> y <strong>LocalStorage Sync</strong>. Cualquier pedido generado en la otra app en el mismo navegador o teléfono se recibe en <strong>0 milisegundos</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Datos mínimos requeridos */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Estructura Mínima que debe enviar tu otra App:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                    <strong className="text-emerald-600">cliente:</strong> Nombre y teléfono
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                    <strong className="text-emerald-600">origen:</strong> Nombre y dirección local
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                    <strong className="text-emerald-600">destino:</strong> Dirección de entrega y casa/apto
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                    <strong className="text-emerald-600">payoutUsd:</strong> Ganancia del delivery en $
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  Ver código listo para copiar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CÓDIGO LISTO PARA COPIAR */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Selector de método de código */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setCodeType('firebase')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    codeType === 'firebase'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Firebase (Producción)
                </button>
                <button
                  onClick={() => setCodeType('broadcast')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    codeType === 'broadcast'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  BroadcastChannel (Directo)
                </button>
                <button
                  onClick={() => setCodeType('webhook')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    codeType === 'webhook'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  API Webhook / REST
                </button>
              </div>

              {/* Caja de Código con Botón Copiar */}
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      {codeType === 'firebase'
                        ? 'enviarPedidoAGoDelivery.ts'
                        : codeType === 'broadcast'
                        ? 'emitirPedidoDirecto.js'
                        : 'enviarPedidoWebhook.js'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeSnippets[codeType])}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Código
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 text-[11px] sm:text-xs font-mono text-slate-200 overflow-x-auto max-h-[380px] leading-relaxed">
                  <code>{codeSnippets[codeType]}</code>
                </pre>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Pega este código en la función de tu otra app que se ejecuta cuando el cliente hace clic en <strong>"Confirmar Pedido"</strong> o <strong>"Pedir Delivery"</strong>.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: PROBAR EN VIVO AHORA MISMO */}
          {activeTab === 'test' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/50 text-xs text-cyan-900 dark:text-cyan-200 flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Simulador de Otra App:</strong> Modifica los datos abajo y pulsa el botón verde. Verás cómo esta app de repartidores recibe el pedido en tiempo real con alerta sonora, vibración y aviso visual.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Comercio / Restaurante de Origen:
                  </label>
                  <input
                    type="text"
                    value={testMerchant}
                    onChange={(e) => setTestMerchant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección del Local:
                  </label>
                  <input
                    type="text"
                    value={testPickupAddress}
                    onChange={(e) => setTestPickupAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Cliente:
                  </label>
                  <input
                    type="text"
                    value={testClient}
                    onChange={(e) => setTestClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono del Cliente:
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección de Entrega:
                  </label>
                  <input
                    type="text"
                    value={testDropoffAddress}
                    onChange={(e) => setTestDropoffAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Productos del Pedido:
                  </label>
                  <input
                    type="text"
                    value={testPackage}
                    onChange={(e) => setTestPackage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ganancia Repartidor (USD $):
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={testPayoutUsd}
                    onChange={(e) => setTestPayoutUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-600 font-mono mt-0.5 block">
                    ≈ {(testPayoutUsd * currentRate).toFixed(2)} Bs (Tasa {currentRate.toFixed(2)})
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Costo Total Orden (USD $):
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={testTotalUsd}
                    onChange={(e) => setTestTotalUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {testSentSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  ¡Pedido emitido con éxito! La app lo acaba de recibir.
                </motion.div>
              )}

              <button
                onClick={handleSendTestOrder}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-white" />
                ¡Disparar Pedido de Prueba desde Otra App Ahora!
              </button>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Protocolo: <span className="font-mono text-emerald-600 font-bold">InterApp OrderSync v1.0</span>
          </div>
          <button
            onClick={() => {
              soundEngine.vibrate(20);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-xs text-slate-800 dark:text-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
