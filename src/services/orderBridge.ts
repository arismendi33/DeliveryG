import { DriverOrder, OrderStatus, AddressPoint } from '../types';

/**
 * Payload flexible que puede enviar la otra aplicación (en español o inglés)
 */
export interface ExternalOrderPayload {
  // Identificador opcional (si no viene, se genera automáticamente GD-XXXX)
  id?: string;
  orderId?: string;
  codigo?: string;

  // Datos del Cliente
  clientName?: string;
  cliente?: string;
  nombreCliente?: string;
  clientPhone?: string;
  telefono?: string;
  telefonoCliente?: string;

  // Origen / Comercio / Restaurante
  pickup?: {
    title?: string;
    nombre?: string;
    address?: string;
    direccion?: string;
    details?: string;
    contactName?: string;
    contactPhone?: string;
    coords?: { lat: number; lng: number };
  } | string;
  origen?: {
    nombre?: string;
    direccion?: string;
    coords?: { lat: number; lng: number };
  } | string;

  // Destino / Entrega
  dropoff?: {
    title?: string;
    address?: string;
    direccion?: string;
    details?: string;
    contactName?: string;
    contactPhone?: string;
    coords?: { lat: number; lng: number };
  } | string;
  destino?: {
    nombre?: string;
    direccion?: string;
    coords?: { lat: number; lng: number };
  } | string;

  // Montos y Pagos
  payoutUsd?: number;
  gananciaRepartidorUsd?: number;
  tarifaDelivery?: number;
  orderCostUsd?: number;
  costoPedidoUsd?: number;
  totalUsd?: number;
  paymentType?: string;
  metodoPago?: string;

  // Detalles del Paquete
  packageType?: string;
  tipoPaquete?: string;
  descripcionProductos?: string;
  items?: Array<{ name: string; quantity: number; price?: number }>;
  notesForDriver?: string;
  notas?: string;
  isPriority?: boolean;
  prioritario?: boolean;

  // PIN de seguridad
  securityPin?: string;
  pin?: string;
}

const BROADCAST_CHANNEL_NAME = 'GO_DELIVERY_INTERAPP_ORDERS';
const STORAGE_KEY = 'gd_incoming_interapp_order';

// Coordenadas por defecto en Ciudad Guayana / Puerto Ordaz
const DEFAULT_COORDS_ALTA_VISTA = { lat: 8.2974, lng: -62.7291 };
const DEFAULT_COORDS_UNARE = { lat: 8.2831, lng: -62.7612 };

/**
 * Normaliza cualquier formato recibido de la otra aplicación a la estructura DriverOrder
 */
export function normalizeExternalOrder(raw: any, currentExchangeRate: number = 65.50): DriverOrder {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const orderId = raw.id || raw.orderId || raw.codigo || `GD-${randomNum}`;
  const pin = String(raw.securityPin || raw.pin || Math.floor(1000 + Math.random() * 9000));
  
  const clientName = raw.clientName || raw.cliente || raw.nombreCliente || 'Cliente App';
  const clientPhone = raw.clientPhone || raw.telefono || raw.telefonoCliente || '+58 414 000-0000';

  // Parse pickup
  let pickupPoint: AddressPoint = {
    title: 'Comercio / Restaurante',
    address: 'Alta Vista, Puerto Ordaz',
    contactName: 'Encargado del Local',
    contactPhone: '+58 286 962-0000',
    coords: DEFAULT_COORDS_ALTA_VISTA
  };

  if (typeof raw.pickup === 'string') {
    pickupPoint.title = raw.pickup;
    pickupPoint.address = raw.pickup;
  } else if (raw.pickup && typeof raw.pickup === 'object') {
    pickupPoint.title = raw.pickup.title || raw.pickup.nombre || pickupPoint.title;
    pickupPoint.address = raw.pickup.address || raw.pickup.direccion || pickupPoint.address;
    pickupPoint.details = raw.pickup.details;
    pickupPoint.contactName = raw.pickup.contactName || pickupPoint.contactName;
    pickupPoint.contactPhone = raw.pickup.contactPhone || pickupPoint.contactPhone;
    if (raw.pickup.coords?.lat && raw.pickup.coords?.lng) {
      pickupPoint.coords = raw.pickup.coords;
    }
  } else if (raw.origen) {
    if (typeof raw.origen === 'string') {
      pickupPoint.title = raw.origen;
      pickupPoint.address = raw.origen;
    } else {
      pickupPoint.title = raw.origen.nombre || pickupPoint.title;
      pickupPoint.address = raw.origen.direccion || pickupPoint.address;
      if (raw.origen.coords?.lat && raw.origen.coords?.lng) {
        pickupPoint.coords = raw.origen.coords;
      }
    }
  }

  // Parse dropoff
  let dropoffPoint: AddressPoint = {
    title: `Entrega a ${clientName}`,
    address: 'Urb. Los Olivos, Puerto Ordaz',
    contactName: clientName,
    contactPhone: clientPhone,
    coords: DEFAULT_COORDS_UNARE
  };

  if (typeof raw.dropoff === 'string') {
    dropoffPoint.title = `Entrega: ${raw.dropoff}`;
    dropoffPoint.address = raw.dropoff;
  } else if (raw.dropoff && typeof raw.dropoff === 'object') {
    dropoffPoint.title = raw.dropoff.title || dropoffPoint.title;
    dropoffPoint.address = raw.dropoff.address || raw.dropoff.direccion || dropoffPoint.address;
    dropoffPoint.details = raw.dropoff.details;
    dropoffPoint.contactName = raw.dropoff.contactName || clientName;
    dropoffPoint.contactPhone = raw.dropoff.contactPhone || clientPhone;
    if (raw.dropoff.coords?.lat && raw.dropoff.coords?.lng) {
      dropoffPoint.coords = raw.dropoff.coords;
    }
  } else if (raw.destino) {
    if (typeof raw.destino === 'string') {
      dropoffPoint.title = raw.destino;
      dropoffPoint.address = raw.destino;
    } else {
      dropoffPoint.title = raw.destino.nombre || dropoffPoint.title;
      dropoffPoint.address = raw.destino.direccion || dropoffPoint.address;
      if (raw.destino.coords?.lat && raw.destino.coords?.lng) {
        dropoffPoint.coords = raw.destino.coords;
      }
    }
  }

  // Montos
  const payoutUsd = Number(raw.payoutUsd ?? raw.gananciaRepartidorUsd ?? raw.tarifaDelivery ?? 3.50);
  const payoutVes = +(payoutUsd * currentExchangeRate).toFixed(2);
  const orderCostUsd = Number(raw.orderCostUsd ?? raw.costoPedidoUsd ?? raw.totalUsd ?? 15.00);
  const orderCostVes = +(orderCostUsd * currentExchangeRate).toFixed(2);

  // Paquete e ítems
  let packageDesc = raw.packageType || raw.tipoPaquete || 'Bolsa térmica sellada';
  if (raw.descripcionProductos) {
    packageDesc = `${packageDesc} (${raw.descripcionProductos})`;
  } else if (Array.isArray(raw.items) && raw.items.length > 0) {
    const itemsSummary = raw.items.map((i: any) => `${i.quantity}x ${i.name || i.title}`).join(', ');
    packageDesc = `${packageDesc}: ${itemsSummary}`;
  }

  return {
    id: orderId,
    createdAt: 'Recibido hace un instante de app de pedidos',
    status: 'available',
    pickup: pickupPoint,
    dropoff: dropoffPoint,
    packageType: packageDesc,
    distanceKm: +(2.0 + Math.random() * 3.5).toFixed(1),
    estimatedMinutes: Math.floor(12 + Math.random() * 15),
    payoutUsd,
    payoutVes,
    clientName,
    clientPhone,
    securityPin: pin,
    pickupMerchantCode: raw.pickupMerchantCode || `#LOCAL-${randomNum}`,
    houseApartmentNumber: raw.houseApartmentNumber || raw.dropoff?.details || 'Casa / Apto sin especificar',
    notesForDriver: raw.notesForDriver || raw.notas || 'Manejar con precaución. Llamar al llegar.',
    isPriority: Boolean(raw.isPriority || raw.prioritario),
    paymentType: (raw.paymentType || raw.metodoPago || 'Prepagado vía Go Comercios') as any,
    orderCostUsd,
    orderCostVes,
    isWalkingFriendly: false
  };
}

export type OrderListenerCallback = (order: DriverOrder, source: string) => void;

/**
 * Escucha pedidos emitidos por la otra app a través de:
 * 1. BroadcastChannel API (comunicación instantánea local entre apps/pestañas/ventanas)
 * 2. LocalStorage sync (fallback entre pestañas del mismo dominio)
 * 3. PostMessage (para iframes o comunicación entre ventanas de navegador)
 * 4. URL query parameters (para abrir pedidos mediante enlace directo)
 */
export function initInterAppOrderBridge(
  onOrderReceived: OrderListenerCallback,
  getCurrentExchangeRate: () => number
): () => void {
  const cleanups: Array<() => void> = [];

  // 1. BroadcastChannel API
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (!event.data) return;
        const data = event.data;
        if (data.type === 'NEW_ORDER' || data.order) {
          const rawOrder = data.order || data;
          const normalized = normalizeExternalOrder(rawOrder, getCurrentExchangeRate());
          onOrderReceived(normalized, 'BroadcastChannel (Tiempo Real)');
        }
      };
      cleanups.push(() => channel.close());
    } catch (e) {
      console.warn('BroadcastChannel not available:', e);
    }
  }

  // 2. Storage Event (para comunicación entre pestañas)
  if (typeof window !== 'undefined') {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const normalized = normalizeExternalOrder(parsed, getCurrentExchangeRate());
          onOrderReceived(normalized, 'LocalStorage Inter-App Sync');
        } catch (err) {
          console.error('Error parsing inter-app order from storage:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    cleanups.push(() => window.removeEventListener('storage', handleStorage));

    // 3. PostMessage Event (para popups, iframes o WebView)
    const handleMessage = (e: MessageEvent) => {
      if (e.data && (e.data.type === 'GO_DELIVERY_NEW_ORDER' || e.data.type === 'NEW_ORDER')) {
        const raw = e.data.order || e.data.payload || e.data;
        const normalized = normalizeExternalOrder(raw, getCurrentExchangeRate());
        onOrderReceived(normalized, 'PostMessage / WebView');
      }
    };
    window.addEventListener('message', handleMessage);
    cleanups.push(() => window.removeEventListener('message', handleMessage));

    // 4. URL Param: Verificar si la app fue abierta con un pedido en la URL (?new_order=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newOrderParam = urlParams.get('new_order') || urlParams.get('import_order');
      if (newOrderParam) {
        const decoded = JSON.parse(decodeURIComponent(newOrderParam));
        const normalized = normalizeExternalOrder(decoded, getCurrentExchangeRate());
        setTimeout(() => {
          onOrderReceived(normalized, 'Enlace Directo URL');
        }, 800);
      }
    } catch (e) {
      // ignore
    }
  }

  return () => {
    cleanups.forEach((c) => c());
  };
}

/**
 * Función que la otra app puede llamar (o nosotros para pruebas)
 * para emitir un pedido directamente por el canal de comunicación.
 */
export function sendOrderFromOrderingApp(orderPayload: ExternalOrderPayload): void {
  // 1. Enviar por BroadcastChannel
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'NEW_ORDER',
        timestamp: Date.now(),
        order: orderPayload
      });
      setTimeout(() => channel.close(), 100);
    } catch (e) {
      console.warn('Error broadcasting order:', e);
    }
  }

  // 2. Enviar por LocalStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...orderPayload,
        _timestamp: Date.now()
      }));
    } catch (e) {
      // ignore
    }

    // 3. Enviar por PostMessage a la ventana actual o padre
    try {
      window.postMessage({
        type: 'GO_DELIVERY_NEW_ORDER',
        order: orderPayload
      }, '*');
    } catch (e) {
      // ignore
    }
  }
}
