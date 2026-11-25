import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet DOM defensive patch against unmounted elements accessing _leaflet_pos
if (typeof window !== 'undefined' && (L as any)?.DomUtil) {
  const origGetPos = L.DomUtil.getPosition;
  (L.DomUtil as any).getPosition = function (el: HTMLElement) {
    if (!el) return new L.Point(0, 0);
    try {
      const pos = origGetPos(el);
      return pos || new L.Point(0, 0);
    } catch {
      return new L.Point(0, 0);
    }
  };

  const origSetPos = L.DomUtil.setPosition;
  (L.DomUtil as any).setPosition = function (el: HTMLElement, point: L.Point) {
    if (!el) return;
    try {
      origSetPos(el, point);
    } catch {
      // ignore
    }
  };
}

import {
  LocateFixed,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AddressPoint, OrderStatus } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface InteractiveMapProps {
  pickup?: AddressPoint;
  dropoff?: AddressPoint;
  pickupCoords?: { lat: number; lng: number };
  dropoffCoords?: { lat: number; lng: number };
  pickupTitle?: string;
  dropoffTitle?: string;
  isTracking?: boolean;
  orderId?: string;
  deliveryPhase?: 1 | 2 | 3 | 4;
  driver?: {
    name?: string;
    avatar?: string;
    phone?: string;
    vehiclePlate?: string;
    vehicleModel?: string;
    vehicleType?: string;
  };
  status?: OrderStatus;
  estimatedMinutes?: number;
  distanceKm?: number;
  className?: string;
  onToggleTheme?: () => void;
  currentTheme?: 'dark' | 'light';
  visibleButtons?: any;
  onUpdateVisibleButtons?: any;
}

export type MapLayerStyle = 'dark' | 'osm' | 'voyager';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup: rawPickup,
  dropoff: rawDropoff,
  pickupCoords,
  dropoffCoords,
  pickupTitle,
  dropoffTitle,
  orderId = 'GD-8492',
  deliveryPhase,
  driver,
  estimatedMinutes = 14,
  distanceKm = 4.2,
  className = ''
}) => {
  const pickup: AddressPoint = {
    title: rawPickup?.title || pickupTitle || 'Alta Vista, Puerto Ordaz',
    address: rawPickup?.address || 'Av. Las Américas, Sector Alta Vista',
    contactName: rawPickup?.contactName || 'Comercio Aliado',
    contactPhone: rawPickup?.contactPhone || '+58 414-0000000',
    coords: rawPickup?.coords || pickupCoords || { lat: 8.2965, lng: -62.7315 }
  };

  const dropoff: AddressPoint = {
    title: rawDropoff?.title || dropoffTitle || 'Urb. Los Olivos / Chilemex',
    address: rawDropoff?.address || 'Av. Atlántico, Puerto Ordaz',
    contactName: rawDropoff?.contactName || 'Cliente',
    contactPhone: rawDropoff?.contactPhone || '+58 412-0000000',
    coords: rawDropoff?.coords || dropoffCoords || { lat: 8.2835, lng: -62.7225 }
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const courierMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // States
  const [isLocating, setIsLocating] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [geoErrorMessage, setGeoErrorMessage] = useState<string | null>(null);
  const [realCourierCoords, setRealCourierCoords] = useState<[number, number] | null>(null);

  // Clean up GPS watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // 1. Initialize Map Instance ONCE (Persistent Leaflet Context, no unnecessary reloads)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return; // Map is already initialized and persistent

    if (mapContainerRef.current) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const centerLat = (pickup.coords.lat + dropoff.coords.lat) / 2;
    const centerLng = (pickup.coords.lng + dropoff.coords.lng) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: false,
      zoomAnimation: true,
      wheelPxPerZoomLevel: 100
    });

    leafletMapRef.current = map;

    // Tile Layer: OpenStreetMap Original (OMS estándar fiel y detallado)
    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
      crossOrigin: true
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Auto invalidate size on container resize
    const resizeObserver = new ResizeObserver(() => {
      const currentMap = leafletMapRef.current;
      if (currentMap && (currentMap as any)._mapPane) {
        try {
          currentMap.invalidateSize({ animate: false, pan: false });
        } catch {
          // ignore
        }
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.stop();
          leafletMapRef.current.remove();
        } catch {
          // ignore
        }
        leafletMapRef.current = null;
      }
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // 2. Render Solo Punto A, Punto B y Marcador de Repartidor (Sin línea de ruta)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !(map as any)._mapPane) return;

    if (pickupMarkerRef.current) pickupMarkerRef.current.remove();
    if (dropoffMarkerRef.current) dropoffMarkerRef.current.remove();
    if (courierMarkerRef.current) courierMarkerRef.current.remove();

    // Punto A (Recogida) Marker
    const pickupIcon = L.divIcon({
      className: 'custom-pickup-marker',
      html: `
        <div class="flex flex-col items-center select-none cursor-pointer">
          <div class="bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-orange-500 shadow-md flex items-center gap-1 mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span>A</span>
          </div>
          <div class="w-3.5 h-3.5 rounded-full bg-orange-500 ring-4 ring-orange-500/25 shadow-md"></div>
        </div>
      `,
      iconSize: [40, 44],
      iconAnchor: [20, 38]
    });

    const markerA = L.marker([pickup.coords.lat, pickup.coords.lng], { icon: pickupIcon }).addTo(map);
    markerA.bindPopup(`
      <div style="padding: 3px; min-width: 155px; color: #ffffff;">
        <span style="color: #ff7828; font-size: 10px; font-weight: 800; text-transform: uppercase;">Punto A · Recogida</span>
        <strong style="margin: 2px 0 0 0; font-size: 13px; display: block; color: #ffffff;">${pickup.title}</strong>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #cbd5e1;">${pickup.address}</p>
      </div>
    `);
    pickupMarkerRef.current = markerA;

    // Punto B (Entrega) Marker
    const dropoffIcon = L.divIcon({
      className: 'custom-dropoff-marker',
      html: `
        <div class="flex flex-col items-center select-none cursor-pointer">
          <div class="bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-500 shadow-md flex items-center gap-1 mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>B</span>
          </div>
          <div class="w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-500/25 shadow-md"></div>
        </div>
      `,
      iconSize: [40, 44],
      iconAnchor: [20, 38]
    });

    const markerB = L.marker([dropoff.coords.lat, dropoff.coords.lng], { icon: dropoffIcon }).addTo(map);
    markerB.bindPopup(`
      <div style="padding: 3px; min-width: 155px; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 10px; font-weight: 800; text-transform: uppercase;">Punto B · Destino</span>
        <strong style="margin: 2px 0 0 0; font-size: 13px; display: block; color: #ffffff;">${dropoff.title}</strong>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #cbd5e1;">${dropoff.address}</p>
      </div>
    `);
    dropoffMarkerRef.current = markerB;

    // Courier Marker (Ubicación en tiempo real del repartidor)
    const courierPoint: [number, number] = realCourierCoords || [
      (pickup.coords.lat + dropoff.coords.lat) / 2,
      (pickup.coords.lng + dropoff.coords.lng) / 2
    ];

    const isWalker = driver?.vehicleType === 'caminando';

    const courierIcon = L.divIcon({
      className: 'custom-courier-marker',
      html: isWalker
        ? `
        <div class="relative flex items-center justify-center cursor-pointer select-none group" style="transform: translate3d(0,0,0);">
          <div class="absolute w-14 h-14 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="absolute w-11 h-11 rounded-full bg-emerald-400/25 animate-pulse"></div>
          
          <div class="relative w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[2.5px] shadow-2xl shadow-emerald-500/50 ring-2 ring-white">
            <div class="w-full h-full rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white font-black overflow-hidden shadow-inner">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow">
                <circle cx="12" cy="4.5" r="2.5"/>
                <path d="m9 20 3-6 2 2 3 4"/>
                <path d="m6 16 3-3 2 1 1-3 3 2"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-md">
              🚶
            </div>
          </div>
        </div>
      `
        : `
        <div class="relative flex items-center justify-center cursor-pointer select-none group" style="transform: translate3d(0,0,0);">
          <div class="absolute w-15 h-15 rounded-full bg-[#00E5FF]/25 animate-ping"></div>
          <div class="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-pulse"></div>
          
          <div class="relative w-11 h-11 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-[#00E5FF] p-[2.5px] shadow-2xl shadow-orange-500/60 ring-2 ring-white">
            <div class="w-full h-full rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center text-white font-black overflow-hidden shadow-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow">
                <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1.5"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-orange-500 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-md">
              🏍️
            </div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const courierMarker = L.marker(courierPoint, { icon: courierIcon }).addTo(map);
    courierMarkerRef.current = courierMarker;

    // Encuadre suave de la cámara entre los puntos A y B
    try {
      const bounds = L.latLngBounds([
        [pickup.coords.lat, pickup.coords.lng],
        [dropoff.coords.lat, dropoff.coords.lng]
      ]);

      if (deliveryPhase === 1) {
        map.flyTo([pickup.coords.lat, pickup.coords.lng], 15.5, { animate: true, duration: 0.6 });
      } else if (deliveryPhase === 2) {
        map.flyToBounds(bounds, { animate: true, duration: 0.6, padding: [45, 45], maxZoom: 16 });
      } else if (deliveryPhase === 3) {
        const focusCoords: [number, number][] = realCourierCoords
          ? [realCourierCoords, [dropoff.coords.lat, dropoff.coords.lng]]
          : [
              [pickup.coords.lat, pickup.coords.lng],
              [dropoff.coords.lat, dropoff.coords.lng]
            ];
        map.flyToBounds(L.latLngBounds(focusCoords), { animate: true, duration: 0.6, padding: [40, 40], maxZoom: 16 });
      } else if (deliveryPhase === 4) {
        map.flyTo([dropoff.coords.lat, dropoff.coords.lng], 16.5, { animate: true, duration: 0.6 });
      } else {
        map.fitBounds(bounds, { animate: false, padding: [45, 45], maxZoom: 15 });
      }
    } catch {
      // ignore
    }
  }, [
    pickup.coords.lat,
    pickup.coords.lng,
    dropoff.coords.lat,
    dropoff.coords.lng,
    pickup.title,
    dropoff.title,
    driver?.vehicleType,
    deliveryPhase
  ]);

  // 3. Dedicated real-time update of Courier marker & accuracy circle without disturbing camera
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!realCourierCoords || !map || !(map as any)._mapPane) return;
    const [lat, lng] = realCourierCoords;

    if (courierMarkerRef.current) {
      courierMarkerRef.current.setLatLng([lat, lng]);
      courierMarkerRef.current.setZIndexOffset(1000);
    }

    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng([lat, lng]);
      if (gpsAccuracy) {
        accuracyCircleRef.current.setRadius(gpsAccuracy);
      }
    } else if (gpsAccuracy) {
      accuracyCircleRef.current = L.circle([lat, lng], {
        radius: gpsAccuracy,
        color: '#ff7828',
        fillColor: '#ff7828',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '3, 4'
      }).addTo(map);
    }
  }, [realCourierCoords, gpsAccuracy]);

  // 4. Centrar geolocalización GPS real del teléfono
  const centrarGeolocalizacion = () => {
    soundEngine.vibrate(25);
    setIsLocating(true);
    setGeoErrorMessage(null);

    if (realCourierCoords && leafletMapRef.current && (leafletMapRef.current as any)._mapPane) {
      try {
        leafletMapRef.current.flyTo(realCourierCoords, 17, { animate: true, duration: 0.6 });
      } catch {
        // ignore
      }
    }

    const applyLocationSuccess = (lat: number, lng: number, accuracy: number) => {
      setIsLocating(false);
      setGeoErrorMessage(null);
      setRealCourierCoords([lat, lng]);
      setGpsAccuracy(accuracy);

      const map = leafletMapRef.current;
      if (map && (map as any)._mapPane) {
        try {
          map.flyTo([lat, lng], 17, { animate: true, duration: 0.8 });
        } catch {
          // ignore
        }
      }

      soundEngine.playAdvanceChime();

      if (!watchIdRef.current && 'geolocation' in navigator) {
        try {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (watchPos) => {
              const wLat = watchPos.coords.latitude;
              const wLng = watchPos.coords.longitude;
              const wAcc = Math.round(watchPos.coords.accuracy || 8);
              setRealCourierCoords([wLat, wLng]);
              setGpsAccuracy(wAcc);
            },
            (wErr) => {
              console.warn('Watch position notice:', wErr);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
          );
          setIsLiveTracking(true);
        } catch (e) {
          console.warn('Error iniciando watchPosition', e);
        }
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 6);
          applyLocationSuccess(lat, lng, accuracy);
        },
        (err) => {
          console.warn('GPS alta precisión no disponible o lento, probando red móvil/WiFi...', err);

          if (err.code === err.PERMISSION_DENIED) {
            setIsLocating(false);
            setGeoErrorMessage(
              'Permiso de ubicación denegado en el navegador. Por favor permite el acceso al GPS en la configuración de tu navegador.'
            );
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (pos2) => {
              const lat = pos2.coords.latitude;
              const lng = pos2.coords.longitude;
              const accuracy = Math.round(pos2.coords.accuracy || 35);
              applyLocationSuccess(lat, lng, accuracy);
            },
            async (err2) => {
              console.warn('Red móvil también falló, intentando geolocalización por IP...', err2);

              try {
                const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
                if (res.ok) {
                  const data = await res.json();
                  if (data.latitude && data.longitude) {
                    const lat = parseFloat(data.latitude);
                    const lng = parseFloat(data.longitude);
                    applyLocationSuccess(lat, lng, 600);
                    return;
                  }
                }
              } catch (ipErr) {
                console.warn('Fallback IP falló:', ipErr);
              }

              setIsLocating(false);
              setGeoErrorMessage(
                'No se pudo conectar con el GPS del teléfono. Comprueba que la ubicación esté activada en tu teléfono.'
              );
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    } else {
      setIsLocating(false);
      setGeoErrorMessage('Este dispositivo o navegador no admite geolocalización GPS.');
    }
  };

  return (
    <div className={`relative w-full h-full bg-[#e2e8f0] dark:bg-[#0f172a] overflow-hidden select-none ${className}`}>
      {/* Map Canvas (OpenStreetMap / OMS Original) */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-x pan-y' }}
      />

      {/* AVISOS DE ESTADO Y ERROR DE GEOLOCALIZACIÓN GPS */}
      <AnimatePresence>
        {geoErrorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-red-950/95 text-white border border-red-500/50 backdrop-blur-md shadow-2xl text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-[11px] leading-tight text-red-100">{geoErrorMessage}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => centrarGeolocalizacion()}
                className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold active:scale-95 transition"
              >
                Reintentar
              </button>
              <button
                onClick={() => setGeoErrorMessage(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN FIJO DE GEOLOCALIZACIÓN: ESQUINA INFERIOR DERECHA DEL MAPA (Elevado 10mm adicionales) */}
      <div
        className="absolute right-4 z-30 pointer-events-auto transition-all"
        style={{ bottom: 'calc(1rem + 10mm + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            centrarGeolocalizacion();
          }}
          title="Centrar en mi ubicación GPS real del teléfono"
          aria-label="Centrar en mi ubicación GPS"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl border transition-all duration-200 cursor-pointer active:scale-95 ${
            isLocating
              ? 'bg-orange-600 text-white border-orange-400 ring-4 ring-orange-500/50 shadow-orange-500/40 animate-pulse'
              : isLiveTracking
              ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/50 shadow-emerald-500/40'
              : 'bg-slate-900/90 dark:bg-black/95 text-white border-white/20 hover:bg-slate-800 hover:border-orange-500/50 shadow-black/60'
          }`}
        >
          <LocateFixed
            className={`w-6 h-6 transition-transform duration-200 ${
              isLocating ? 'text-white animate-spin' : isLiveTracking ? 'text-white animate-pulse' : 'text-emerald-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
