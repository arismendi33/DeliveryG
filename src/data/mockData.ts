import {
  PackageCategory,
  VehicleOption,
  AddressPoint,
  DeliveryOrder,
  DriverInfo,
  WalletTransaction
} from '../types';
import { DEFAULT_GOOGLE_USD_TO_VES } from '../utils/exchangeRate';

export const USD_TO_VES_RATE = DEFAULT_GOOGLE_USD_TO_VES; // Tasa Google / Mercado real para Ciudad Guayana (Bs / USD)

export const PACKAGE_CATEGORIES: PackageCategory[] = [
  {
    id: 'docs',
    title: 'Documentos & Sobres',
    description: 'Facturas, trámites, llaves, contratos o pasaportes',
    weightLimit: 'Hasta 1 kg',
    baseFare: 2.00,
    perKmFare: 0.60,
    iconName: 'FileText'
  },
  {
    id: 'small',
    title: 'Paquete Pequeño',
    description: 'Comida, repuestos pequeños, ropa o medicinas',
    weightLimit: 'Hasta 5 kg',
    baseFare: 3.00,
    perKmFare: 0.80,
    iconName: 'Package'
  },
  {
    id: 'medium',
    title: 'Paquete Mediano',
    description: 'Cajas de encomienda, tecnología, herramientas',
    weightLimit: 'Hasta 15 kg',
    baseFare: 4.50,
    perKmFare: 1.00,
    iconName: 'Box'
  },
  {
    id: 'large',
    title: 'Bulto Grande / Carga',
    description: 'Mercancía voluminosa, sacos o repuestos pesados',
    weightLimit: 'Hasta 40 kg (cajuela o camioneta)',
    baseFare: 8.00,
    perKmFare: 1.50,
    iconName: 'Truck'
  },
  {
    id: 'fragile',
    title: 'Frágil / Delicado',
    description: 'Tortas, flores, cristalería con cuidado especial',
    weightLimit: 'Hasta 8 kg protegido',
    baseFare: 5.00,
    perKmFare: 1.10,
    iconName: 'ShieldAlert'
  }
];

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'moto',
    name: 'Moto Express (Rápido)',
    speedMinPerKm: 2.0,
    fareMultiplier: 1.0,
    capacity: 'Ideal para evitar tráfico en puentes y avenidas',
    iconName: 'Bike'
  },
  {
    id: 'bici',
    name: 'Bicicleta Urbana',
    speedMinPerKm: 3.5,
    fareMultiplier: 0.85,
    capacity: 'Envíos locales dentro de Alta Vista o San Félix Centro',
    iconName: 'Footprints'
  },
  {
    id: 'auto',
    name: 'Carro / Sedán',
    speedMinPerKm: 2.5,
    fareMultiplier: 1.4,
    capacity: 'Protección para lluvia y bultos medianos',
    iconName: 'Car'
  },
  {
    id: 'furgon',
    name: 'Camioneta / Pick-up',
    speedMinPerKm: 3.0,
    fareMultiplier: 2.0,
    capacity: 'Mercancía de Zona Industrial Unare o Chirica',
    iconName: 'Truck'
  }
];

export const PRESET_LOCATIONS: AddressPoint[] = [
  // PUERTO ORDAZ
  {
    title: 'Orinokia Mall (Puerto Ordaz)',
    address: 'Av. Paseo Caroní, Entrada Santo Tomé, Alta Vista Sur',
    details: 'Encuentro en la parada de taxis frente a la entrada principal',
    contactName: 'María Eugenia Rivas',
    contactPhone: '+58 414-852-1199',
    coords: { lat: 8.2930, lng: -62.7350 } // Alta Vista, Pto Ordaz
  },
  {
    title: 'C.C. Ciudad Alta Vista I (Puerto Ordaz)',
    address: 'Calle Cuchivero con Av. Las Américas, Alta Vista',
    details: 'PB pasillo central, cerca del Banco Mercantil',
    contactName: 'Pedro Luis Gómez',
    contactPhone: '+58 424-910-3344',
    coords: { lat: 8.2970, lng: -62.7300 } // Alta Vista, Pto Ordaz
  },
  {
    title: 'Clínica Chilemex / Villa Alianza',
    address: 'Calle Caura con Calle Chile, Urb. Chilemex, Puerto Ordaz',
    details: 'Recepción de emergencias ambulatorias',
    contactName: 'Dra. Luisa Bermúdez',
    contactPhone: '+58 412-180-2211',
    coords: { lat: 8.3050, lng: -62.7150 }
  },
  {
    title: 'Aeropuerto Manuel Carlos Piar / Unare',
    address: 'Av. Guayana, Terminal Nacional, Unare, Puerto Ordaz',
    details: 'Área de desembarque de pasajeros',
    contactName: 'Roberto Fuentes',
    contactPhone: '+58 416-588-9900',
    coords: { lat: 8.2870, lng: -62.7600 }
  },
  // SAN FÉLIX
  {
    title: 'El Roble / Redoma El Dorado (San Félix)',
    address: 'Av. Manuel Piar, Edif. San Miguel, El Roble, San Félix',
    details: 'Frente a la farmacia, casa portón gris',
    contactName: 'Carlos Hernández',
    contactPhone: '+58 414-889-4455',
    coords: { lat: 8.3450, lng: -62.6680 } // El Roble, San Félix
  },
  {
    title: 'Centro de San Félix / Plaza Bolívar',
    address: 'Calle Mariño cruce con Calle Sucre, San Félix',
    details: 'Local comercial Ferrecentro, diagonal a la Alcaldía',
    contactName: 'José Gregorio Salazar',
    contactPhone: '+58 424-933-2211',
    coords: { lat: 8.3620, lng: -62.6510 } // Casco histórico San Félix
  },
  {
    title: 'Hospital Dr. Raúl Leoni (Guaiparo)',
    address: 'Av. Centurión, Urb. Guaiparo, San Félix',
    details: 'Entrada principal de consultas externas',
    contactName: 'Lic. Carmen Valderrama',
    contactPhone: '+58 412-404-7711',
    coords: { lat: 8.3390, lng: -62.6790 }
  }
];

export const SAMPLE_DRIVERS: DriverInfo[] = [
  {
    id: 'drv-guayana-1',
    name: 'Yeferson Rodríguez',
    avatar: '/ceo-avatar.jpg',
    rating: 4.96,
    tripsCount: 1840,
    phone: '+58 414-885-3320',
    vehicleModel: 'Bera Socialista 150cc (Naranja)',
    vehiclePlate: 'AB-829K',
    vehicleType: 'moto',
    currentCoords: { lat: 8.3100, lng: -62.7050 } // Cruzando Puente Caroní
  },
  {
    id: 'drv-guayana-2',
    name: 'Deivis Marcano',
    avatar: '/juan-jose-arismendi.jpg',
    rating: 4.90,
    tripsCount: 1120,
    phone: '+58 424-941-7788',
    vehicleModel: 'Keeway Horse 150cc (Negro)',
    vehiclePlate: 'AC-104M',
    vehicleType: 'moto',
    currentCoords: { lat: 8.2980, lng: -62.7290 } // En Alta Vista
  }
];

export const INITIAL_ORDER: DeliveryOrder = {
  id: 'GD-5921',
  createdAt: 'Hoy, 11:15 AM',
  status: 'in_transit_delivery',
  pickup: PRESET_LOCATIONS[0], // Orinokia Mall (Pto Ordaz)
  dropoff: PRESET_LOCATIONS[4], // El Roble (San Félix)
  packageCategory: 'small',
  vehicleType: 'moto',
  packageDescription: 'Repuesto automotriz sellado y factura de compra',
  isUrgent: true,
  insuranceRequired: true,
  distanceKm: 8.4,
  estimatedMinutes: 22,
  priceBreakdown: {
    baseFare: 3.00,
    distanceFare: 6.72,
    urgencyFare: 1.50,
    insuranceFare: 0.80,
    total: 12.02
  },
  paymentMethod: 'wallet',
  paymentStatus: 'paid',
  securityPin: '4819',
  driver: SAMPLE_DRIVERS[0],
  chat: [
    {
      id: 'm1',
      sender: 'system',
      text: 'Envío asignado a Yeferson Rodríguez. Repartidor recogió en Orinokia Mall (Puerto Ordaz).',
      time: '11:18 AM'
    },
    {
      id: 'm2',
      sender: 'driver',
      text: 'Buenas tardes compa, ya tengo el paquete en mano saliendo de Orinokia.',
      time: '11:24 AM'
    },
    {
      id: 'm3',
      sender: 'client',
      text: 'Excelente pana, cuando vayas pasando el Puente Caroní me avisas.',
      time: '11:26 AM'
    },
    {
      id: 'm4',
      sender: 'driver',
      text: 'Voy cruzando el puente hacia El Roble. En 10 minutos estoy en la redoma.',
      time: '11:32 AM'
    }
  ]
};

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-guayana-01',
    type: 'order_payment',
    title: 'Envío Punto a Punto #GD-5921',
    subtitle: 'Orinokia Mall (Pto Ordaz) ➔ El Roble (San Félix)',
    amount: -12.02,
    date: 'Hoy, 11:15 AM',
    orderId: 'GD-5921',
    status: 'completed'
  },
  {
    id: 'tx-guayana-02',
    type: 'recharge',
    title: 'Recarga Pago Móvil (Banesco / Mercantil)',
    subtitle: 'Ref: #940182 · Banco de Venezuela',
    amount: 30.00,
    date: 'Ayer, 03:20 PM',
    status: 'completed'
  },
  {
    id: 'tx-guayana-03',
    type: 'order_payment',
    title: 'Envío Documentos #GD-5890',
    subtitle: 'Alta Vista I ➔ Casco Central San Félix',
    amount: -6.50,
    date: '13 Sep, 02:40 PM',
    orderId: 'GD-5890',
    status: 'completed'
  },
  {
    id: 'tx-guayana-04',
    type: 'cashback',
    title: 'Bono Guayana Express',
    subtitle: 'Descuento fidelidad cliente frecuente',
    amount: 2.00,
    date: '10 Sep, 10:00 AM',
    status: 'completed'
  }
];

export const FOOD_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: 'Sparkles', count: 18 },
  { id: 'burgers', name: 'Burgers & Grill', icon: 'Flame', count: 6 },
  { id: 'pizza', name: 'Pizzas & Pasta', icon: 'Pizza', count: 5 },
  { id: 'sushi', name: 'Sushi & Bowls', icon: 'Fish', count: 4 },
  { id: 'desserts', name: 'Postres & Café', icon: 'Coffee', count: 3 },
  { id: 'healthy', name: 'Fit & Saludable', icon: 'Salad', count: 4 },
];

export const FEATURED_FOOD_ITEMS = [
  {
    id: 'food-01',
    name: 'Burger Doble Cheddar Crispy',
    restaurant: 'Smash Brothers Alta Vista',
    description: 'Carne Angus 200g, doble queso cheddar fundido, tocineta crujiente, cebolla caramelizada y salsa trufada especial.',
    price: 8.50,
    rating: 4.9,
    timeEstimate: '18-25 min',
    category: 'burgers',
    image: '/src/assets/images/dish_smash_burger_1790364658274.jpg',
    isPopular: true,
    calories: '680 kcal'
  },
  {
    id: 'food-02',
    name: 'Pizza Artesanal Napolitana Burrata',
    restaurant: 'Vittoria Forno & Bar',
    description: 'Masa madre fermentada 48h, salsa pomodoro San Marzano, mozzarella fior di latte, burrata fresca y albahaca.',
    price: 12.00,
    rating: 4.8,
    timeEstimate: '25-35 min',
    category: 'pizza',
    image: '/src/assets/images/dish_neapolitan_pizza_1790364667557.jpg',
    isPopular: true,
    calories: '820 kcal'
  },
  {
    id: 'food-03',
    name: 'Salmon Poke Bowl Tokio Sunset',
    restaurant: 'Kansai Sushi & Poke',
    description: 'Salmón fresco en cubos marinado en ponzu, aguacate hass, edamame, algas wakame, pepino japonés y arroz sushi.',
    price: 10.50,
    rating: 4.9,
    timeEstimate: '20-28 min',
    category: 'sushi',
    image: '/src/assets/images/dish_salmon_poke_1790364677332.jpg',
    isPopular: false,
    calories: '510 kcal'
  },
  {
    id: 'food-04',
    name: 'Cheesecake Cremoso Frutos Rojos',
    restaurant: 'Dolce Vita Pastry Lab',
    description: 'Base de galleta crujiente de mantequilla, queso crema sedoso horneado estilo New York y coulis de frutos silvestres.',
    price: 5.50,
    rating: 5.0,
    timeEstimate: '15-20 min',
    category: 'desserts',
    image: '/src/assets/images/dish_berry_cheesecake_1790364687014.jpg',
    isPopular: true,
    calories: '380 kcal'
  },
  {
    id: 'food-05',
    name: 'Smoked BBQ Ribs & Rustic Fries',
    restaurant: 'Smokehouse Guayana',
    description: 'Costillas de cerdo tiernas ahumadas a baja temperatura durante 6 horas con glaseado de miel y barbacoa casera.',
    price: 14.00,
    rating: 4.7,
    timeEstimate: '30-40 min',
    category: 'burgers',
    image: '/src/assets/images/dish_smash_burger_1790364658274.jpg',
    isPopular: true,
    calories: '940 kcal'
  },
  {
    id: 'food-06',
    name: 'Roll Tempura Oishi Dragón',
    restaurant: 'Kansai Sushi & Poke',
    description: 'Langostino crocante tempurizado, queso crema, topping de aguacate y mango con reducción de salsa teriyaki.',
    price: 9.80,
    rating: 4.8,
    timeEstimate: '20-30 min',
    category: 'sushi',
    image: '/src/assets/images/dish_salmon_poke_1790364677332.jpg',
    isPopular: false,
    calories: '490 kcal'
  }
];
