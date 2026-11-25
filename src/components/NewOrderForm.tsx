import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Package,
  Bike,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Phone,
  User,
  FileText,
  Box,
  Truck,
  ShieldAlert,
  Footprints,
  Car,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import {
  AddressPoint,
  PackageCategoryId,
  VehicleTypeId,
  DeliveryOrder,
  PaymentMethod
} from '../types';
import {
  PACKAGE_CATEGORIES,
  VEHICLE_OPTIONS,
  PRESET_LOCATIONS,
  USD_TO_VES_RATE
} from '../data/mockData';
import { BrandLogo } from './BrandLogo';

interface NewOrderFormProps {
  onOrderCreated: (order: DeliveryOrder) => void;
  walletBalance: number;
}

export const NewOrderForm: React.FC<NewOrderFormProps> = ({
  onOrderCreated,
  walletBalance
}) => {
  // Preset selection
  const [pickupPresetIndex, setPickupPresetIndex] = useState(0); // Orinokia Mall (Pto Ordaz)
  const [dropoffPresetIndex, setDropoffPresetIndex] = useState(4); // El Roble (San Félix)

  const [pickupPoint, setPickupPoint] = useState<AddressPoint>(PRESET_LOCATIONS[0]);
  const [dropoffPoint, setDropoffPoint] = useState<AddressPoint>(PRESET_LOCATIONS[4]);

  // Package & transportation options
  const [selectedCategory, setSelectedCategory] = useState<PackageCategoryId>('small');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeId>('moto');
  const [packageDescription, setPackageDescription] = useState('Repuestos y factura de entrega');
  const [isUrgent, setIsUrgent] = useState(true);
  const [insuranceRequired, setInsuranceRequired] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');

  // Route analysis: Puerto Ordaz ⇄ San Félix
  const isCrossingBridge = useMemo(() => {
    const isPickupPtoOrdaz = pickupPoint.title.includes('Puerto Ordaz') || pickupPoint.title.includes('Orinokia') || pickupPoint.title.includes('Chilemex') || pickupPoint.title.includes('Alta Vista') || pickupPoint.title.includes('Unare');
    const isDropoffSanFelix = dropoffPoint.title.includes('San Félix') || dropoffPoint.title.includes('El Roble') || dropoffPoint.title.includes('Guaiparo') || dropoffPoint.title.includes('Chirica');
    const isPickupSanFelix = pickupPoint.title.includes('San Félix') || pickupPoint.title.includes('El Roble') || pickupPoint.title.includes('Guaiparo');
    const isDropoffPtoOrdaz = dropoffPoint.title.includes('Puerto Ordaz') || dropoffPoint.title.includes('Orinokia') || dropoffPoint.title.includes('Alta Vista') || dropoffPoint.title.includes('Unare');

    return (isPickupPtoOrdaz && isDropoffSanFelix) || (isPickupSanFelix && isDropoffPtoOrdaz);
  }, [pickupPoint, dropoffPoint]);

  // Distance calculation
  const distanceKm = useMemo(() => {
    const lat1 = pickupPoint?.coords?.lat ?? 8.2965;
    const lon1 = pickupPoint?.coords?.lng ?? -62.7315;
    const lat2 = dropoffPoint?.coords?.lat ?? 8.2835;
    const lon2 = dropoffPoint?.coords?.lng ?? -62.7225;

    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    const roadFactor = isCrossingBridge ? 1.45 : 1.25;
    return Math.max(2.5, Number((dist * roadFactor).toFixed(1)));
  }, [pickupPoint, dropoffPoint, isCrossingBridge]);

  // Pricing calculation
  const categoryObj = PACKAGE_CATEGORIES.find((c) => c.id === selectedCategory)!;
  const vehicleObj = VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle)!;

  const baseFare = categoryObj.baseFare;
  const distanceFare = Number((distanceKm * categoryObj.perKmFare * vehicleObj.fareMultiplier).toFixed(2));
  const urgencyFare = isUrgent ? 1.50 : 0.00;
  const insuranceFare = insuranceRequired ? 0.80 : 0.00;
  const totalFare = Number((baseFare + distanceFare + urgencyFare + insuranceFare).toFixed(2));
  const totalFareBs = Math.round(totalFare * USD_TO_VES_RATE);

  const estimatedDuration = Math.round(distanceKm * vehicleObj.speedMinPerKm + (isCrossingBridge ? 7 : 3));

  const handleSelectPickupPreset = (index: number) => {
    setPickupPresetIndex(index);
    setPickupPoint(PRESET_LOCATIONS[index]);
  };

  const handleSelectDropoffPreset = (index: number) => {
    setDropoffPresetIndex(index);
    setDropoffPoint(PRESET_LOCATIONS[index]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrderId = `GO-GY-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: DeliveryOrder = {
      id: newOrderId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'searching_driver',
      pickup: pickupPoint,
      dropoff: dropoffPoint,
      packageCategory: selectedCategory,
      vehicleType: selectedVehicle,
      packageDescription,
      isUrgent,
      insuranceRequired,
      distanceKm,
      estimatedMinutes: estimatedDuration,
      priceBreakdown: {
        baseFare,
        distanceFare,
        urgencyFare,
        insuranceFare,
        total: totalFare
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
      securityPin: randomPin,
      chat: [
        {
          id: 'sys-init',
          sender: 'system',
          text: `Envío ${newOrderId} generado en Guayana. Localizando repartidor en ruta...`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    onOrderCreated(newOrder);
  };

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'Package': return <Package className="w-5 h-5 text-orange-600" />;
      case 'Box': return <Box className="w-5 h-5 text-orange-600" />;
      case 'Truck': return <Truck className="w-5 h-5 text-orange-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-orange-600" />;
      default: return <Package className="w-5 h-5 text-orange-600" />;
    }
  };

  const renderVehicleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bike': return <Bike className="w-5 h-5 text-orange-600" />;
      case 'Footprints': return <Footprints className="w-5 h-5 text-zinc-500" />;
      case 'Car': return <Car className="w-5 h-5 text-orange-600" />;
      case 'Truck': return <Truck className="w-5 h-5 text-orange-600" />;
      default: return <Bike className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28 text-white">
      {/* Brand Hero Slogan Card: Authentic logo with GO emblem 89340.svg */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel border border-white/15 bg-zinc-900/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BrandLogo variant="emblem" size="lg" showSubtitle={true} />
          <div className="hidden md:block border-l border-white/10 pl-4">
            <h2 className="text-base font-black text-white">
              Envíos Punto a Punto Express
            </h2>
            <p className="text-xs text-zinc-300 max-w-sm mt-0.5">
              Conectando todo Puerto Ordaz y San Félix con seguimiento en mapa en tiempo real, validación con PIN y pago en Bs o USD.
            </p>
          </div>
        </div>

        {/* Currency & Wallet quick badge */}
        <div className="flex items-center gap-2 text-xs bg-white/5 px-3.5 py-2 rounded-2xl border border-white/10">
          <span className="text-zinc-400">Tasa Ref:</span>
          <span className="font-mono font-bold text-white">{USD_TO_VES_RATE.toFixed(2)} Bs/$</span>
          <span className="text-white/20">|</span>
          <span className="text-zinc-400">Saldo:</span>
          <span className="font-mono font-bold text-orange-400">${walletBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Puente Caroní Indicator if crossing */}
      {isCrossingBridge && (
        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-2.5 text-xs text-orange-200">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span>
            <strong>Ruta Interurbana:</strong> Este envío cruza el <strong>Puente Caroní</strong> conectando Puerto Ordaz y San Félix con tarifa y tiempos optimizados.
          </span>
        </div>
      )}

      {/* Grid: Route Origin & Destination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* POINT A: ORIGEN */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                A
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Punto A · Recogida (Remitente)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">¿Dónde busca el paquete el repartidor?</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded-lg">
              Origen
            </span>
          </div>

          {/* Quick presets in Guayana */}
          <div>
            <label className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1 font-medium">
              Ubicaciones rápidas en Guayana:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {PRESET_LOCATIONS.map((loc, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSelectPickupPreset(i)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition text-[11px] ${
                    pickupPresetIndex === i
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {loc.title.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                Dirección / Punto de referencia
              </label>
              <input
                type="text"
                value={pickupPoint.address}
                onChange={(e) => setPickupPoint({ ...pickupPoint, address: e.target.value })}
                required
                className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10 placeholder-zinc-400 dark:placeholder-zinc-500"
                placeholder="Ej: Av. Paseo Caroní, Alta Vista..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                  Nombre remitente
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={pickupPoint.contactName}
                    onChange={(e) => setPickupPoint({ ...pickupPoint, contactName: e.target.value })}
                    required
                    className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                  Teléfono de contacto
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={pickupPoint.contactPhone}
                    onChange={(e) => setPickupPoint({ ...pickupPoint, contactPhone: e.target.value })}
                    required
                    className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                Detalles para el repartidor (opcional)
              </label>
              <input
                type="text"
                value={pickupPoint.details || ''}
                onChange={(e) => setPickupPoint({ ...pickupPoint, details: e.target.value })}
                className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10 placeholder-zinc-400 dark:placeholder-zinc-500"
                placeholder="Ej: Local comercial frente al banco, piso 1..."
              />
            </div>
          </div>
        </div>

        {/* POINT B: DESTINO */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs flex items-center justify-center shadow-xs">
                B
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-white">
                  Punto B · Entrega (Destinatario)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">¿A dónde y a quién entregamos?</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded-lg">
              Destino
            </span>
          </div>

          {/* Quick presets in Guayana */}
          <div>
            <label className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-1 font-medium">
              Ubicaciones rápidas en Guayana:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {PRESET_LOCATIONS.map((loc, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSelectDropoffPreset(i)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition text-[11px] ${
                    dropoffPresetIndex === i
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {loc.title.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                Dirección / Destino en Guayana
              </label>
              <input
                type="text"
                value={dropoffPoint.address}
                onChange={(e) => setDropoffPoint({ ...dropoffPoint, address: e.target.value })}
                required
                className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10 placeholder-zinc-400 dark:placeholder-zinc-500"
                placeholder="Ej: Av. Manuel Piar, El Roble, San Félix..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                  Nombre quien recibe
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={dropoffPoint.contactName}
                    onChange={(e) => setDropoffPoint({ ...dropoffPoint, contactName: e.target.value })}
                    required
                    className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                  Teléfono receptor
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={dropoffPoint.contactPhone}
                    onChange={(e) => setDropoffPoint({ ...dropoffPoint, contactPhone: e.target.value })}
                    required
                    className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
                Instrucciones de entrega
              </label>
              <input
                type="text"
                value={dropoffPoint.details || ''}
                onChange={(e) => setDropoffPoint({ ...dropoffPoint, details: e.target.value })}
                className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10 placeholder-zinc-400 dark:placeholder-zinc-500"
                placeholder="Ej: Entregar en portón negro, solicitar PIN de 4 dígitos..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Package Categories */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            ¿Qué vas a enviar?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Selecciona el tipo de bulto para asignar la tarifa justa
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {PACKAGE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl cursor-pointer transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-zinc-900 dark:text-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-orange-100 dark:bg-orange-500/20' : 'bg-white dark:bg-white/10'}`}>
                      {renderCategoryIcon(cat.iconName)}
                    </div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">
                      ${cat.baseFare.toFixed(2)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-tight">{cat.title}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                  <span>{cat.weightLimit}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Description field */}
        <div>
          <label className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mb-1">
            Descripción breve del paquete
          </label>
          <input
            type="text"
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            className="w-full text-xs bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-white/10 placeholder-zinc-400 dark:placeholder-zinc-500"
            placeholder="Ej: Repuesto de carro, comida sellada, documentos de oficina..."
          />
        </div>
      </div>

      {/* Vehicle selection & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vehicles */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Vehículo de Transporte
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VEHICLE_OPTIONS.map((veh) => {
              const isSelected = selectedVehicle === veh.id;
              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition border text-center ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-zinc-900 dark:text-white shadow-xs'
                      : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    {renderVehicleIcon(veh.iconName)}
                  </div>
                  <p className="text-xs font-bold">{veh.name}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{veh.capacity}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority options */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-zinc-200 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Opciones Adicionales
          </h3>

          <div
            onClick={() => setIsUrgent(!isUrgent)}
            className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
              isUrgent
                ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-zinc-900 dark:text-white'
                : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${isUrgent ? 'text-orange-500' : 'text-zinc-400'}`} />
              <div>
                <p className="text-xs font-bold">Envío Directo Express</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Sin escalas en ruta</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">+$1.50</span>
          </div>

          <div
            onClick={() => setInsuranceRequired(!insuranceRequired)}
            className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
              insuranceRequired
                ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-zinc-900 dark:text-white'
                : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${insuranceRequired ? 'text-orange-500' : 'text-zinc-400'}`} />
              <div>
                <p className="text-xs font-bold">Seguro de Paquete</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Cobertura hasta $200</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">+$0.80</span>
          </div>
        </div>
      </div>

      {/* Payment and Total Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Método de Pago
            </h3>
            <p className="text-xs text-zinc-400">
              Aceptamos Pago Móvil nacional, saldo en billetera o efectivo
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                paymentMethod === 'wallet'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Billetera (${walletBalance.toFixed(2)})
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                paymentMethod === 'cash'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              Efectivo ($ / Bs)
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                paymentMethod === 'transfer'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pago Móvil Guayana
            </button>
          </div>
        </div>

        {/* Fare calculation and submit trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400 block text-[11px]">Distancia Guayana</span>
              <span className="font-bold text-zinc-100 font-mono text-sm">{distanceKm} km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400 block text-[11px]">Tiempo en ruta</span>
              <span className="font-bold text-orange-400 font-mono text-sm">~{estimatedDuration} min</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400 block text-[11px]">Tarifa base</span>
              <span className="font-bold text-zinc-100 font-mono text-sm">${baseFare.toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400 block text-[11px]">Km + Adicionales</span>
              <span className="font-bold text-zinc-100 font-mono text-sm">${(distanceFare + urgencyFare + insuranceFare).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Total del Envío</span>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono tracking-tight">
                  ${totalFare.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-300 font-semibold font-mono">USD</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono block">
                ≈ {totalFareBs.toLocaleString()} Bs
              </span>
            </div>

            <button
              type="submit"
              id="btn-request-delivery"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-xl shadow-orange-500/20 transition active:scale-95"
            >
              <span>Pedir Repartidor</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
