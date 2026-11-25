import { DriverOrder } from '../types';
import { USD_TO_VES_RATE } from '../data/driverData';

interface MerchantTemplate {
  title: string;
  address: string;
  contactName: string;
  coords: { lat: number; lng: number };
  pkg: string;
  category: string;
}

const GUAYANA_MERCHANTS: MerchantTemplate[] = [
  {
    title: 'Arturo’s C.C. Alta Vista 2',
    address: 'Av. Paseo Caroní, Nivel Feria, Local F-14',
    contactName: 'Despacho Rápido Arturo’s',
    coords: { lat: 8.2985, lng: -62.7350 },
    pkg: 'Combo Familiar Pollo Crujiente con Refresco',
    category: 'Restaurante'
  },
  {
    title: 'Farmatodo Paseo Caroní',
    address: 'Av. Paseo Caroní, sector Unare',
    contactName: 'Lic. Farmacéutico Despacho',
    coords: { lat: 8.2865, lng: -62.7530 },
    pkg: 'Medicinas y Fórmulas Térmicas Selladas',
    category: 'Farmacia'
  },
  {
    title: 'Don Pan Bulevar Los Olivos',
    address: 'Av. Italia con Calle Roma, Urb. Los Olivos',
    contactName: 'Encargado Mostrador',
    coords: { lat: 8.2930, lng: -62.7440 },
    pkg: 'Bolsa Panadería y Postres Sellados',
    category: 'Panadería'
  },
  {
    title: 'Sushi Bar & Wok Chilemex',
    address: 'Calle Chile, C.C. Chilemex, Local 6',
    contactName: 'Chef Delivery',
    coords: { lat: 8.2895, lng: -62.7385 },
    pkg: 'Caja Térmica Sushi Rolls y Bebidas',
    category: 'Restaurante'
  },
  {
    title: 'Supermercado Santa María',
    address: 'Av. Manuel Piar, San Félix Centro',
    contactName: 'Almacén Despacho San Félix',
    coords: { lat: 8.3450, lng: -62.6680 },
    pkg: 'Bolsas de Víveres y Charcutería Sellada',
    category: 'Supermercado'
  },
  {
    title: 'Bodegón Castillito Gourmet',
    address: 'Av. Castillito, cerca de la Redoma',
    contactName: 'Atención Clientes Go',
    coords: { lat: 8.3120, lng: -62.7180 },
    pkg: 'Caja Regalo y Delicatesses Selladas',
    category: 'Bodegón'
  },
  {
    title: 'Helados 4D Orinokia Mall',
    address: 'Av. Guayana, C.C. Orinokia, Entrada Santo Tomé',
    contactName: 'Despacho Heladería',
    coords: { lat: 8.2940, lng: -62.7290 },
    pkg: 'Contenedor Isotérmico con Hielo Seco',
    category: 'Postres'
  },
  {
    title: 'Ferretería y Repuestos El Roble',
    address: 'Vía San Félix - El Roble, Galpón 3',
    contactName: 'Mostrador de Repuestos',
    coords: { lat: 8.3390, lng: -62.6750 },
    pkg: 'Caja sellada de repuestos mecánicos',
    category: 'Ferretería'
  }
];

const RESIDENTIAL_DESTINATIONS = [
  {
    title: 'Residencias Los Raudales',
    address: 'Calle Roma, Torre B, Apto 5-A, Los Olivos',
    coords: { lat: 8.2925, lng: -62.7415 },
    contactName: 'Mariana Benítez',
    phone: '+58 414-9922114'
  },
  {
    title: 'Villa Central Residencial',
    address: 'Calle 4 con Carrera 6, Manzana 12, Casa 8',
    coords: { lat: 8.2880, lng: -62.7310 },
    contactName: 'Carlos Gutiérrez',
    phone: '+58 412-4455667'
  },
  {
    title: 'Urb. Chilemex Residencial',
    address: 'Av. Las Américas con Calle Perú, Casa 24',
    coords: { lat: 8.2870, lng: -62.7405 },
    contactName: 'Elena Quintero',
    phone: '+58 416-8899001'
  },
  {
    title: 'Residencias La Churuata',
    address: 'Urb. La Churuata, Torre 4, PB-02, Alta Vista',
    coords: { lat: 8.2970, lng: -62.7390 },
    contactName: 'David Soublette',
    phone: '+58 424-7711223'
  },
  {
    title: 'San Félix - Urb. Manoa',
    address: 'Sector 2, Manzana 8, Casa 15, Manoa',
    coords: { lat: 8.3410, lng: -62.6620 },
    contactName: 'Raiza Morales',
    phone: '+58 414-3322119'
  },
  {
    title: 'Villa Africana',
    address: 'Calle Dakar con Av. Atlántico, Casa 11',
    coords: { lat: 8.2790, lng: -62.7610 },
    contactName: 'Andrés Gil',
    phone: '+58 412-6677889'
  }
];

export function generateDynamicOrder(): DriverOrder {
  const merchant = GUAYANA_MERCHANTS[Math.floor(Math.random() * GUAYANA_MERCHANTS.length)];
  const destination = RESIDENTIAL_DESTINATIONS[Math.floor(Math.random() * RESIDENTIAL_DESTINATIONS.length)];

  // Calculate approximate straight distance with random variance
  const latDiff = Math.abs(merchant.coords.lat - destination.coords.lat) * 111;
  const lngDiff = Math.abs(merchant.coords.lng - destination.coords.lng) * 111;
  const rawDist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  const distanceKm = Math.max(0.6, +(rawDist * 1.35).toFixed(1));

  // Payout calculation: base $2.00 + $0.55/km
  const payoutUsd = +(1.80 + distanceKm * 0.65).toFixed(2);
  const payoutVes = +(payoutUsd * USD_TO_VES_RATE).toFixed(2);
  const estimatedMinutes = Math.max(7, Math.round(distanceKm * 3.4) + 5);

  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  const merchantCode = `#${Math.floor(1000 + Math.random() * 9000)}`;

  const isWalkingFriendly = distanceKm <= 1.2;
  const isPriority = Math.random() > 0.65;
  const paymentTypes: ('Pago Móvil' | 'Efectivo USD' | 'Prepagado vía Go Comercios')[] = [
    'Pago Móvil',
    'Efectivo USD',
    'Prepagado vía Go Comercios'
  ];
  const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];

  return {
    id: `GD-${orderNum}`,
    createdAt: 'Hace pocos segundos',
    status: 'available',
    pickup: {
      title: merchant.title,
      address: merchant.address,
      details: `Retiro por mostrador express. Categoría: ${merchant.category}.`,
      contactName: merchant.contactName,
      contactPhone: '+58 414-8899220',
      coords: {
        lat: +(merchant.coords.lat + (Math.random() - 0.5) * 0.003).toFixed(5),
        lng: +(merchant.coords.lng + (Math.random() - 0.5) * 0.003).toFixed(5)
      }
    },
    dropoff: {
      title: destination.title,
      address: destination.address,
      details: 'Entrega directa al cliente con código PIN de seguridad.',
      contactName: destination.contactName,
      contactPhone: destination.phone,
      coords: {
        lat: +(destination.coords.lat + (Math.random() - 0.5) * 0.003).toFixed(5),
        lng: +(destination.coords.lng + (Math.random() - 0.5) * 0.003).toFixed(5)
      }
    },
    packageType: merchant.pkg,
    distanceKm,
    estimatedMinutes,
    payoutUsd,
    payoutVes,
    clientName: destination.contactName,
    clientPhone: destination.phone,
    securityPin: pin,
    pickupMerchantCode: merchantCode,
    notesForDriver: isWalkingFriendly
      ? '🚶 Distancia corta favorable para caminantes o ciclistas.'
      : 'Bulto sellado. Requiere entrega cuidadosa y verificación de PIN.',
    isPriority,
    isWalkingFriendly,
    paymentType,
    orderCostUsd: +(payoutUsd * 3.8).toFixed(2),
    orderCostVes: +(payoutVes * 3.8).toFixed(2)
  };
}
