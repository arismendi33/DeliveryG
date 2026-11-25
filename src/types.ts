export type DriverAppTab = 'active_delivery' | 'available_orders' | 'earnings' | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressPoint {
  title: string;
  address: string;
  details?: string;
  contactName: string;
  contactPhone: string;
  coords: Coordinates;
}

export type OrderStatus =
  | 'available'
  | 'accepted'
  | 'heading_to_pickup'
  | 'arrived_at_pickup'
  | 'package_collected'
  | 'heading_to_dropoff'
  | 'arrived_at_dropoff'
  | 'delivered'
  | 'cancelled'
  | 'draft'
  | 'searching_driver'
  | 'driver_assigned'
  | 'in_transit_delivery';

export interface DriverOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  pickup: AddressPoint;
  dropoff: AddressPoint;
  packageType: 'Paquete sellado estándar' | 'Bolsa térmica sellada' | 'Documentos / Sobre cerrado' | 'Caja mediana sellada' | string;
  distanceKm: number;
  estimatedMinutes: number;
  payoutUsd: number;
  payoutVes: number;
  clientName: string;
  clientPhone: string;
  securityPin: string;
  pickupMerchantCode?: string;
  houseApartmentNumber?: string;
  notesForDriver?: string;
  isPriority?: boolean;
  paymentType?: 'Efectivo USD' | 'Pago Móvil' | 'Prepagado' | 'Efectivo Bs' | 'Prepagado vía Go Comercios';
  orderCostUsd?: number;
  orderCostVes?: number;
  proofPhoto?: string;
  isWalkingFriendly?: boolean;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role?: string;
  photoFileName?: string;
  rating: number;
  totalTrips: number;
  vehicleType?: VehicleTypeId;
  vehicleModel: string;
  vehiclePlate: string;
  cityArea: string; // e.g. 'Alta Vista y Puerto Ordaz' | 'San Félix' | 'Toda Ciudad Guayana'
  isOnline: boolean;
  autoAcceptOrders: boolean;
  soundAlerts: boolean;
  theme: ThemeMode;
  healthScore?: number; // 0 to 100 points
  unfulfilledOrdersCount?: number;
  isLocked?: boolean;
  lockReason?: string;
  isVerified?: boolean;
  verificationLevel?: 'unverified' | 'pending' | 'verified_standard' | 'verified_maximum_security';
  googleLinked?: boolean;
  googleEmail?: string;
  phoneVerified?: boolean;
  documentId?: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  driversLicenseUrl?: string;
  medicalCertificateUrl?: string;
  vehicleRegistrationUrl?: string;
  biometricSelfieUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  verificationDate?: string;
}

export interface DriverEarningRecord {
  id: string;
  orderId: string;
  timestamp: string;
  amountUsd: number;
  amountVes: number;
  routeSummary: string;
  status: 'credited' | 'processing';
}

/* =========================================================================
   Compatibility definitions for client app separation and legacy components
   ========================================================================= */
export type AppTab = 'discover' | 'explore' | 'tracking' | 'profile' | 'driver_mode';
export type UserRole = 'client' | 'driver';
export type PackageCategoryId = 'docs' | 'small' | 'medium' | 'large' | 'fragile';
export type VehicleTypeId = 'moto' | 'bici' | 'caminando' | 'auto' | 'furgon';
export type PaymentMethod = 'cash' | 'wallet' | 'card' | 'transfer';

export interface MenuItem {
  id: string;
  name: string;
  restaurant: string;
  description: string;
  price: number;
  rating: number;
  timeEstimate: string;
  category: string;
  image: string;
  isPopular?: boolean;
  calories?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface PackageCategory {
  id: PackageCategoryId;
  title: string;
  description: string;
  weightLimit: string;
  baseFare: number;
  perKmFare: number;
  iconName: string;
}

export interface VehicleOption {
  id: VehicleTypeId;
  name: string;
  speedMinPerKm: number;
  fareMultiplier: number;
  capacity: string;
  iconName: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  tripsCount: number;
  phone: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleType: VehicleTypeId;
  currentCoords: Coordinates;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'driver' | 'system';
  text: string;
  time: string;
}

export interface DeliveryOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  pickup: AddressPoint;
  dropoff: AddressPoint;
  packageCategory: PackageCategoryId;
  vehicleType: VehicleTypeId;
  packageDescription: string;
  isUrgent: boolean;
  insuranceRequired: boolean;
  distanceKm: number;
  estimatedMinutes: number;
  priceBreakdown: {
    baseFare: number;
    distanceFare: number;
    urgencyFare: number;
    insuranceFare: number;
    total: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  securityPin: string;
  driver?: DriverInfo;
  chat: ChatMessage[];
  deliveredAt?: string;
  proofSignatureOrPhoto?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'recharge' | 'order_payment' | 'driver_earning' | 'cashback';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  orderId?: string;
  status: 'completed' | 'pending';
}
