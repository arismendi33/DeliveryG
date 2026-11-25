import React, { useEffect, useRef } from 'react';

interface InvisibleBatteryLockProps {
  isLocked: boolean; // True si y sólo si batería < 10%
  onEmergencyUnlock: () => void;
}

/**
 * InvisibleBatteryLock
 * Implementa el requerimiento: "un bloqueo invisible si y sólo si la batería está en menos de 10%".
 * - No muestra ningún modal, anuncio ni texto invasivo: la pantalla permanece visible pero totalmente inerte.
 * - Bloquea e intercepta el 100% de clics, toques, gestos, pulsaciones y teclado en fase de captura.
 * - Mecanismo de escape para pruebas: 3 pulsaciones seguidas de la tecla Escape o 5 toques rápidos en la esquina superior derecha.
 */
export const InvisibleBatteryLock: React.FC<InvisibleBatteryLockProps> = ({
  isLocked,
  onEmergencyUnlock
}) => {
  const escapePressCountRef = useRef(0);
  const escapePressTimerRef = useRef<any>(null);
  const cornerTapCountRef = useRef(0);
  const cornerTapTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isLocked) return;

    // Capture-phase event interceptor
    const blockEvent = (e: Event) => {
      // Check for tester / emergency rescue via Escape key
      if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
        escapePressCountRef.current += 1;
        if (escapePressTimerRef.current) clearTimeout(escapePressTimerRef.current);
        escapePressTimerRef.current = setTimeout(() => {
          escapePressCountRef.current = 0;
        }, 1500);

        if (escapePressCountRef.current >= 3) {
          escapePressCountRef.current = 0;
          onEmergencyUnlock();
          return;
        }
      }

      // Check for tester / emergency rescue via 5 taps in top-right 50x50 area
      if (e.type === 'pointerdown' || e.type === 'touchstart') {
        const clientX = (e as PointerEvent).clientX ?? ((e as TouchEvent).touches?.[0]?.clientX || 0);
        const clientY = (e as PointerEvent).clientY ?? ((e as TouchEvent).touches?.[0]?.clientY || 0);
        const screenWidth = window.innerWidth;

        if (clientX >= screenWidth - 55 && clientY <= 55) {
          cornerTapCountRef.current += 1;
          if (cornerTapTimerRef.current) clearTimeout(cornerTapTimerRef.current);
          cornerTapTimerRef.current = setTimeout(() => {
            cornerTapCountRef.current = 0;
          }, 2000);

          if (cornerTapCountRef.current >= 5) {
            cornerTapCountRef.current = 0;
            onEmergencyUnlock();
            return;
          }
        }
      }

      // Absorb and suppress all events without executing any target handler
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (e.cancelable && e.type !== 'scroll') {
        e.preventDefault();
      }
    };

    const targetEvents = [
      'click',
      'dblclick',
      'mousedown',
      'mouseup',
      'pointerdown',
      'pointerup',
      'pointercancel',
      'touchstart',
      'touchend',
      'touchmove',
      'keydown',
      'keyup',
      'keypress',
      'contextmenu',
      'wheel'
    ];

    targetEvents.forEach((eventName) => {
      window.addEventListener(eventName, blockEvent, { capture: true, passive: false });
    });

    return () => {
      targetEvents.forEach((eventName) => {
        window.removeEventListener(eventName, blockEvent, { capture: true } as any);
      });
      if (escapePressTimerRef.current) clearTimeout(escapePressTimerRef.current);
      if (cornerTapTimerRef.current) clearTimeout(cornerTapTimerRef.current);
    };
  }, [isLocked, onEmergencyUnlock]);

  if (!isLocked) return null;

  return (
    <div
      id="gd-invisible-battery-barrier"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999999,
        background: 'transparent',
        opacity: 0,
        pointerEvents: 'auto',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: 'not-allowed'
      }}
    />
  );
};
