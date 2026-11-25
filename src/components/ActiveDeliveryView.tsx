import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DriverOrder } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { Phase1PickupScreen } from './Phase1PickupScreen';
import { Phase2PackageScreen } from './Phase2PackageScreen';
import { Phase3OnRouteScreen } from './Phase3OnRouteScreen';
import { Phase4PinScreen } from './Phase4PinScreen';
import { soundEngine } from '../utils/soundEffects';

interface ActiveDeliveryViewProps {
  order: DriverOrder | null;
  driver?: {
    name?: string;
    phone?: string;
    avatar?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
    theme?: 'dark' | 'light';
    isOnline?: boolean;
    vehicleType?: string;
  };
  onAdvanceStatus?: (orderId: string) => void;
  onCompleteDelivery: (orderId: string, enteredPin: string, photoUrl?: string) => boolean;
  onViewAvailable: () => void;
  onOpenSupport?: () => void;
  onResetDemoOrder?: () => void;
}

export const ActiveDeliveryView: React.FC<ActiveDeliveryViewProps> = ({
  order,
  driver,
  onCompleteDelivery,
  onViewAvailable,
  onOpenSupport,
  onResetDemoOrder
}) => {
  // Current active delivery phase: 1: Recogida | 2: Paquete | 3: En Ruta | 4: PIN
  const [deliveryPhase, setDeliveryPhase] = useState<1 | 2 | 3 | 4>(1);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // If there's NO active order, render full-screen interactive searching map
  if (!order) {
    return (
      <div className="relative w-full h-[100dvh] overflow-hidden select-none bg-slate-100 dark:bg-black">
        {/* Mapa interactivo 100% full screen de Ciudad Guayana */}
        <div className="absolute inset-0 z-0">
          <InteractiveMap
            driver={driver}
            status="searching"
            isTracking={false}
          />
        </div>

        {/* SOLO UN BOTÓN FLOTANTE CON LA PALABRA "pedidos" (Elevado 10mm adicionales por requerimiento de usuario) */}
        <div
          className="absolute inset-x-0 z-30 flex items-center justify-center pointer-events-none px-4 transition-all"
          style={{ bottom: 'calc(2rem + 10mm + env(safe-area-inset-bottom, 0px))' }}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.unlock();
              soundEngine.playNotification();
              onViewAvailable();
            }}
            className="pointer-events-auto h-12 px-10 rounded-full bg-slate-950/90 dark:bg-black/90 text-white border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl font-bold text-[13px] tracking-[0.2em] uppercase flex items-center justify-center hover:border-emerald-400/60 hover:bg-black transition-all cursor-pointer"
          >
            pedidos
          </motion.button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RUTA ACTIVA PERSISTENTE: Mapa interactivo continuo entre Fases 1 a 4
  // Evita desmontar y recargar Leaflet; la ruta se visualiza clara y continua
  // =========================================================================
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-950 flex flex-col select-none">
      {/* PERSISTENT MAP VIEWPORT (Permanente y continuo entre Fases 1 a 4) */}
      <div
        className={`relative w-full transition-all duration-300 ease-out z-0 shrink-0 ${
          isMapExpanded ? 'h-[72vh] sm:h-[75vh]' : 'h-[36vh] sm:h-[40vh]'
        }`}
      >
        <InteractiveMap
          pickup={order.pickup}
          dropoff={order.dropoff}
          pickupCoords={order.pickup.coords}
          dropoffCoords={order.dropoff.coords}
          pickupTitle={order.pickup.title}
          dropoffTitle={order.dropoff.title}
          orderId={order.id}
          status="in_transit_delivery"
          deliveryPhase={deliveryPhase}
          driver={driver}
          isTracking={deliveryPhase === 3}
          distanceKm={order.distanceKm}
          estimatedMinutes={order.estimatedMinutes}
        />

        {/* Control Flotante: Alternar mapa ampliado / vista dividida */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="px-3 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-white hover:bg-black text-[11px] font-bold flex items-center gap-1.5 shadow-2xl active:scale-95 transition cursor-pointer"
          >
            <span>{isMapExpanded ? '▼ Reducir Mapa' : '▲ Ampliar Mapa'}</span>
          </button>
        </div>
      </div>

      {/* PANEL DE FASES DE ENTREGA (Deslizamiento fluido entre Fases 1 a 4 sin recargar mapa) */}
      <div className="flex-1 overflow-y-auto bg-slate-900 border-t border-white/10 rounded-t-3xl shadow-2xl relative z-10 -mt-3 flex flex-col">
        <AnimatePresence mode="wait">
          {deliveryPhase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <Phase1PickupScreen
                order={order}
                hideMap
                onAdvanceToPhase2={() => setDeliveryPhase(2)}
                onCancelOrBack={() => setDeliveryPhase(1)}
              />
            </motion.div>
          )}

          {deliveryPhase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <Phase2PackageScreen
                order={order}
                onAdvanceToPhase3={() => setDeliveryPhase(3)}
                onBackToPhase1={() => setDeliveryPhase(1)}
              />
            </motion.div>
          )}

          {deliveryPhase === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <Phase3OnRouteScreen
                order={order}
                hideMap
                onAdvanceToPhase4={() => setDeliveryPhase(4)}
                onBackToPhase2={() => setDeliveryPhase(2)}
              />
            </motion.div>
          )}

          {deliveryPhase === 4 && (
            <motion.div
              key="phase-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex-1 flex flex-col"
            >
              <Phase4PinScreen
                order={order}
                onFinishDelivery={(orderId, pin) => {
                  onCompleteDelivery(orderId, pin);
                  setDeliveryPhase(1);
                }}
                onBackToPhase3={() => setDeliveryPhase(3)}
                onOpenSupport={onOpenSupport}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
