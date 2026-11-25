import { DriverOrder, DriverProfile, DriverEarningRecord } from '../types';
import { DEFAULT_GOOGLE_USD_TO_VES } from '../utils/exchangeRate';

export const USD_TO_VES_RATE = DEFAULT_GOOGLE_USD_TO_VES;

export const INITIAL_DRIVER_PROFILE: DriverProfile = {
  id: 'CEO-001',
  name: 'Juan José Arismendi',
  phone: '+58 414-8899221',
  avatar: '/ceo-avatar.jpg',
  role: 'CEO & Fundador',
  rating: 5.0,
  totalTrips: 1250,
  vehicleType: 'moto',
  vehicleModel: 'Bera Socialista 150cc · Edición CEO',
  vehiclePlate: 'CEO-GO-01',
  cityArea: 'Toda Ciudad Guayana',
  isOnline: true,
  autoAcceptOrders: false,
  soundAlerts: true,
  theme: 'dark',
  healthScore: 100,
  unfulfilledOrdersCount: 0,
  isLocked: false,
  isVerified: true,
  verificationLevel: 'verified_maximum_security',
  googleLinked: true,
  googleEmail: 'juanjosearismendi33@gmail.com',
  phoneVerified: true,
  documentId: 'V-26.842.190',
  emergencyContactName: 'Despacho Central Go Delivery',
  emergencyContactPhone: '+58 412-8822100',
  verificationDate: '2026-09-18'
};

export const INITIAL_ACTIVE_ORDER: DriverOrder = {
  id: 'GD-8492',
  createdAt: 'Hace 5 min',
  status: 'accepted',
  pickup: {
    title: 'Comercio / Remitente Alta Vista',
    address: 'Av. Paseo Caroní, C.C. Alta Vista 2, Local B-12',
    details: 'Entrada por rampa de carga este',
    contactName: 'Encargado Despacho',
    contactPhone: '+58 414-9988112',
    coords: { lat: 8.2985, lng: -62.7350 }
  },
  dropoff: {
    title: 'Destinatario Residencial',
    address: 'Urb. Los Raudales, Torre C, Apto 4-B',
    details: 'Tocar intercomunicador o llamar al llegar',
    contactName: 'Cliente Destinatario',
    contactPhone: '+58 412-5544332',
    coords: { lat: 8.2910, lng: -62.7420 }
  },
  packageType: 'Bolsa térmica sellada',
  distanceKm: 3.4,
  estimatedMinutes: 14,
  payoutUsd: 3.80,
  payoutVes: 3212.90,
  clientName: 'Alejandro Ramos',
  clientPhone: '+58 412-5544332',
  securityPin: '4819',
  pickupMerchantCode: '#7492',
  houseApartmentNumber: 'Torre C, Apto 4-B',
  notesForDriver: 'Paquete precintado con sello de seguridad. No abrir bajo ningún concepto.',
  isPriority: true,
  paymentType: 'Efectivo USD',
  orderCostUsd: 14.50,
  orderCostVes: 12259.75
};

export const AVAILABLE_ORDERS_POOL: DriverOrder[] = [
  {
    id: 'GD-9021',
    createdAt: 'Hace 2 min',
    status: 'available',
    pickup: {
      title: 'Comercio Centro Puerto Ordaz',
      address: 'Calle Guasipati con Vía Venezuela, Local 4',
      details: 'Frente a la farmacia',
      contactName: 'Despacho Express',
      contactPhone: '+58 414-7766554',
      coords: { lat: 8.3120, lng: -62.7210 }
    },
    dropoff: {
      title: 'Residencias Chilemex',
      address: 'Calle Chile con Av. Las Américas, Casa #18',
      details: 'Reja negra grande',
      contactName: 'Mariana Silva',
      contactPhone: '+58 416-2233441',
      coords: { lat: 8.2890, lng: -62.7390 }
    },
    packageType: 'Paquete sellado estándar',
    distanceKm: 4.8,
    estimatedMinutes: 18,
    payoutUsd: 4.50,
    payoutVes: 3804.75,
    clientName: 'Mariana Silva',
    clientPhone: '+58 416-2233441',
    securityPin: '7392',
    pickupMerchantCode: '#8104',
    houseApartmentNumber: 'Casa #18, Urb. Chilemex',
    notesForDriver: 'Bulto mediano ligero. Entrega directa en puerta exterior.',
    isPriority: false,
    paymentType: 'Pago Móvil',
    orderCostUsd: 18.00,
    orderCostVes: 15219.00
  },
  {
    id: 'GD-9035',
    createdAt: 'Hace 1 min',
    status: 'available',
    pickup: {
      title: 'Zona Industrial Unare II',
      address: 'Av. Norte Sur 7, Galpón 14',
      details: 'Portón gris con timbre amarillo',
      contactName: 'Almacén Central',
      contactPhone: '+58 424-9112233',
      coords: { lat: 8.2810, lng: -62.7680 }
    },
    dropoff: {
      title: 'San Félix - El Roble',
      address: 'Av. Manuel Piar, cerca de la Redoma',
      details: 'Cruce del Puente Caroní - Tarifa preferencial',
      contactName: 'Roberto Fuentes',
      contactPhone: '+58 412-8877665',
      coords: { lat: 8.3450, lng: -62.6680 }
    },
    packageType: 'Caja mediana sellada',
    distanceKm: 9.6,
    estimatedMinutes: 26,
    payoutUsd: 7.80,
    payoutVes: 6594.90,
    clientName: 'Roberto Fuentes',
    clientPhone: '+58 412-8877665',
    securityPin: '5120',
    notesForDriver: 'Ruta interurbana PZO-San Félix. Cruce de puente incluido en tarifa.',
    isPriority: true,
    paymentType: 'Efectivo USD',
    orderCostUsd: 25.00,
    orderCostVes: 21137.50
  },
  {
    id: 'GD-9042',
    createdAt: 'Hace 3 min',
    status: 'available',
    pickup: {
      title: 'Farmacia & Market Alta Vista 1',
      address: 'Paseo Caroní, Entrada Oeste, Local 14',
      details: 'Retiro en mostrador express',
      contactName: 'Lic. Morales',
      contactPhone: '+58 414-3882211',
      coords: { lat: 8.2970, lng: -62.7335 }
    },
    dropoff: {
      title: 'Residencias Los Raudales Edif. A',
      address: 'Calle Roma, a 600m del C.C., Apto 2-A',
      details: 'Entrega a pie fácil - cruzar bulevar',
      contactName: 'Lucía Benítez',
      contactPhone: '+58 424-9445566',
      coords: { lat: 8.2940, lng: -62.7380 }
    },
    packageType: 'Paquete sellado estándar',
    distanceKm: 0.6,
    estimatedMinutes: 8,
    payoutUsd: 2.50,
    payoutVes: 2113.75,
    clientName: 'Lucía Benítez',
    clientPhone: '+58 424-9445566',
    securityPin: '3194',
    notesForDriver: '🚶 Apto para caminantes. Distancia corta de 600 metros sin necesidad de vehículo.',
    isPriority: false,
    isWalkingFriendly: true,
    paymentType: 'Pago Móvil',
    orderCostUsd: 9.50,
    orderCostVes: 8032.25
  },
  {
    id: 'GD-9055',
    createdAt: 'Hace 1 min',
    status: 'available',
    pickup: {
      title: 'Café & Deli C.C. Macrocentro',
      address: 'Nivel Feria, Local F-08',
      details: 'Pedido empacado en bolsa hermética',
      contactName: 'Chef Despacho',
      contactPhone: '+58 412-1122334',
      coords: { lat: 8.2950, lng: -62.7360 }
    },
    dropoff: {
      title: 'Torre Corporativa Bell',
      address: 'Av. Guayana, Planta Baja - Recepción',
      details: 'A 850m caminando directo por la avenida',
      contactName: 'Ing. Daniel Rojas',
      contactPhone: '+58 416-5566778',
      coords: { lat: 8.2905, lng: -62.7410 }
    },
    packageType: 'Bolsa térmica sellada',
    distanceKm: 0.85,
    estimatedMinutes: 11,
    payoutUsd: 2.90,
    payoutVes: 2451.95,
    clientName: 'Ing. Daniel Rojas',
    clientPhone: '+58 416-5566778',
    securityPin: '8821',
    notesForDriver: '🚶 Apto para caminantes. Entrega en recepción del edificio a 850 metros.',
    isPriority: true,
    isWalkingFriendly: true,
    paymentType: 'Efectivo USD',
    orderCostUsd: 12.00,
    orderCostVes: 10146.00
  }
];

export const INITIAL_EARNINGS: DriverEarningRecord[] = [
  {
    id: 'earn-101',
    orderId: 'GD-8310',
    timestamp: 'Hoy, 08:45 AM',
    amountUsd: 3.50,
    amountVes: 2959.25,
    routeSummary: 'Alta Vista Sur ➔ Castillito',
    status: 'credited'
  },
  {
    id: 'earn-102',
    orderId: 'GD-8324',
    timestamp: 'Hoy, 10:15 AM',
    amountUsd: 4.20,
    amountVes: 3551.10,
    routeSummary: 'Unare 1 ➔ Villa Alianza',
    status: 'credited'
  },
  {
    id: 'earn-103',
    orderId: 'GD-8350',
    timestamp: 'Ayer, 04:30 PM',
    amountUsd: 6.80,
    amountVes: 5749.40,
    routeSummary: 'Puerto Ordaz ➔ San Félix Centro',
    status: 'credited'
  }
];
