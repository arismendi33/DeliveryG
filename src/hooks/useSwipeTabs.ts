import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DriverAppTab } from '../types';
import { soundEngine } from '../utils/soundEffects';

export const TAB_ORDER: DriverAppTab[] = [
  'active_delivery',
  'available_orders',
  'earnings',
  'settings'
];

export const TAB_METADATA: Record<
  DriverAppTab,
  { label: string; index: number; shortDesc: string }
> = {
  active_delivery: { label: 'Ruta Activa', index: 0, shortDesc: 'Mapa GPS y despacho actual' },
  available_orders: { label: 'Disponibles', index: 1, shortDesc: 'Pedidos listos para tomar' },
  earnings: { label: 'Ganancias', index: 2, shortDesc: 'Billetera y retiro en Bs/USD' },
  settings: { label: 'Ajustes', index: 3, shortDesc: 'Perfil y configuración' }
};

interface UseSwipeTabsProps {
  currentTab: DriverAppTab;
  onTabChange: (tab: DriverAppTab) => void;
  threshold?: number;
}

export function useSwipeTabs({ currentTab, onTabChange, threshold = 28 }: UseSwipeTabsProps) {
  // Direction for sliding transition: +1 = sliding to right (next tab), -1 = sliding to left (prev tab)
  const [direction, setDirection] = useState<number>(1);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDraggingMouseRef = useRef(false);
  const mouseStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const currentIndex = TAB_ORDER.indexOf(currentTab);

  const goToTab = useCallback(
    (targetTab: DriverAppTab) => {
      if (targetTab === currentTab) return;
      const targetIndex = TAB_ORDER.indexOf(targetTab);
      const newDirection = targetIndex > currentIndex ? 1 : -1;
      setDirection(newDirection);
      soundEngine.vibrate(25);
      onTabChange(targetTab);
    },
    [currentTab, currentIndex, onTabChange]
  );

  const goToNextTab = useCallback(() => {
    if (currentIndex < TAB_ORDER.length - 1) {
      goToTab(TAB_ORDER[currentIndex + 1]);
    } else {
      // Reached the rightmost tab, subtle haptic bump
      soundEngine.vibrate([15, 20]);
    }
  }, [currentIndex, goToTab]);

  const goToPrevTab = useCallback(() => {
    if (currentIndex > 0) {
      goToTab(TAB_ORDER[currentIndex - 1]);
    } else {
      // Reached the leftmost tab, subtle haptic bump
      soundEngine.vibrate([15, 20]);
    }
  }, [currentIndex, goToTab]);

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.target as HTMLElement;

    // Ignore if touch started on interactive form controls or designated no-swipe components
    if (
      target.closest('.no-swipe') ||
      target.closest('input, textarea, select, button[role="slider"]')
    ) {
      touchStartRef.current = null;
      return;
    }

    // For map canvas: allow edge swipes (within 50px of screen edges) or anywhere outside map canvas
    const isMap = target.closest('.leaflet-container');
    const isEdgeSwipe = touch.clientX < 50 || touch.clientX > window.innerWidth - 50;
    if (isMap && !isEdgeSwipe) {
      touchStartRef.current = null;
      return;
    }

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // As soon as vertical motion is detected, immediately release horizontal swipe so vertical scroll is 100% fluid
    if (Math.abs(deltaY) > 6 && Math.abs(deltaY) > Math.abs(deltaX)) {
      touchStartRef.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Only swipe tabs if clearly a horizontal gesture (at least 35px and more than 1.6x vertical)
    if (absX >= 35 && absX > absY * 1.6) {
      if (deltaX < 0) {
        // Swiped Left -> Move to Next Page
        goToNextTab();
      } else {
        // Swiped Right -> Move to Previous Page
        goToPrevTab();
      }
    }
  };

  // Mouse drag handlers for desktop / preview testing
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.no-swipe') ||
      target.closest('button, a, input, textarea, select, .leaflet-container')
    ) {
      return;
    }

    isDraggingMouseRef.current = true;
    mouseStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingMouseRef.current || !mouseStartRef.current) return;
    const deltaX = e.clientX - mouseStartRef.current.x;
    const deltaY = e.clientY - mouseStartRef.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && Math.abs(deltaY) > 25 && Math.abs(deltaX) < 15) {
      isDraggingMouseRef.current = false;
      mouseStartRef.current = null;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingMouseRef.current || !mouseStartRef.current) return;
    const deltaX = e.clientX - mouseStartRef.current.x;
    const deltaY = e.clientY - mouseStartRef.current.y;
    const duration = Date.now() - mouseStartRef.current.time;

    isDraggingMouseRef.current = false;
    mouseStartRef.current = null;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const effectiveThreshold = duration < 350 ? 22 : 30;

    if (absX >= effectiveThreshold && absX > absY) {
      if (deltaX < 0) {
        goToNextTab();
      } else {
        goToPrevTab();
      }
    }
  };

  // Keyboard shortcut navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          Boolean(activeEl.isContentEditable))
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        goToNextTab();
      } else if (e.key === 'ArrowLeft') {
        goToPrevTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextTab, goToPrevTab]);

  return {
    currentTab,
    currentIndex,
    direction,
    goToTab,
    goToNextTab,
    goToPrevTab,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp
    }
  };
}
