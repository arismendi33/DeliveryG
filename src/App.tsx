import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  DriverAppTab,
  DriverOrder,
  DriverProfile,
  DriverEarningRecord,
  ThemeMode,
  AppTab,
  UserRole,
  CartItem,
  MenuItem,
  DeliveryOrder,
  WalletTransaction
} from './types';
import {
  INITIAL_DRIVER_PROFILE,
  INITIAL_ACTIVE_ORDER,
  AVAILABLE_ORDERS_POOL,
  INITIAL_EARNINGS
} from './data/driverData';
import {
  INITIAL_ORDER,
  INITIAL_TRANSACTIONS,
  FEATURED_FOOD_ITEMS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { DiscoverView } from './components/DiscoverView';
import { ExploreMenuView } from './components/ExploreMenuView';
import { ExploreMenuModal } from './components/ExploreMenuModal';
import { TrackingView } from './components/TrackingView';
import { FloatingCartHub } from './components/FloatingCartHub';
import { FloatingDock } from './components/FloatingDock';
import { LogoInspectorModal } from './components/LogoInspectorModal';

import { DriverNavbar } from './components/DriverNavbar';
import { ActiveDeliveryView } from './components/ActiveDeliveryView';
import { AvailableOrdersView } from './components/AvailableOrdersView';
import { EarningsView } from './components/EarningsView';
import { SettingsView } from './components/SettingsView';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SplashAndAuthModal } from './components/SplashAndAuthModal';
import { SupportAndEmergencyModal } from './components/SupportAndEmergencyModal';
import { DriverSecurityRegistrationModal } from './components/DriverSecurityRegistrationModal';
import { DriverSidebarDrawer } from './components/DriverSidebarDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderAcceptedSuccessModal } from './components/OrderAcceptedSuccessModal';
import { OrdersSearchDrawer } from './components/OrdersSearchDrawer';
import { VercelExportModal } from './components/VercelExportModal';
import { isAiStudioDevMode } from './utils/isDevMode';
import { TrafficLightGoModal } from './components/TrafficLightGoModal';
import { AccountHealthLockedModal } from './components/AccountHealthLockedModal';
import { GoComerciosModal } from './components/GoComerciosModal';
import { InvisibleBatteryLock } from './components/InvisibleBatteryLock';
import { BatterySecurityModal } from './components/BatterySecurityModal';
import { IntroSplashScreen } from './components/IntroSplashScreen';
import { AppIntegrationModal } from './components/AppIntegrationModal';
import { IncomingOrderBanner } from './components/IncomingOrderBanner';
import { initInterAppOrderBridge } from './services/orderBridge';
import { useExchangeRate } from './hooks/useExchangeRate';
import { generateDynamicOrder } from './utils/orderGenerator';
import { useSwipeTabs } from './hooks/useSwipeTabs';
import { useBatteryStatus } from './hooks/useBatteryStatus';
import { Lock, AlertTriangle } from 'lucide-react';

import { soundEngine } from './utils/soundEffects';

export default function App() {
  // Splash Screen con animación del logo de GO expandiéndose al iniciar
  const [showIntroSplash, setShowIntroSplash] = useState<boolean>(true);

  // Application Mode: 'driver' (Consola Repartidor y Mapa Principal) vs 'client' (Go Delivery Experiencia Usuario)
  const [appMode, setAppMode] = useState<UserRole>(() => {
    const saved = localStorage.getItem('gd_app_mode');
    return (saved as UserRole) || 'driver';
  });

  // Client Tab System
  const [clientTab, setClientTab] = useState<AppTab>(() => {
    const saved = localStorage.getItem('gd_client_tab');
    if (saved && ['discover', 'explore', 'tracking', 'profile'].includes(saved)) {
      return saved as AppTab;
    }
    return 'discover';
  });

  // Client Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gd_client_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial sample item for preview
    return [
      { item: FEATURED_FOOD_ITEMS[0], quantity: 1 }
    ];
  });

  // Client Selected Product for Shared Element Modal
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Client Real-Time Tracking Delivery Order
  const [trackingOrder, setTrackingOrder] = useState<DeliveryOrder | null>(() => {
    const saved = localStorage.getItem('gd_tracking_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDER;
  });

  // Client Wallet Balance & Transactions
  const [walletBalance, setWalletBalance] = useState<number>(45.50);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Persistence for Driver Profile (Default Dark Mode if unset, respect user choice afterwards)
  const [profile, setProfile] = useState<DriverProfile>(() => {
    const saved = localStorage.getItem('gd_driver_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.theme) {
          parsed.theme = 'dark';
        }
        // Upgrade legacy mock profile without breaking user theme choice
        if (parsed.name === 'Carlos Mendoza' || !parsed.role || parsed.avatar?.includes('unsplash')) {
          const upgraded = {
            ...parsed,
            id: INITIAL_DRIVER_PROFILE.id,
            name: INITIAL_DRIVER_PROFILE.name,
            avatar: INITIAL_DRIVER_PROFILE.avatar,
            role: INITIAL_DRIVER_PROFILE.role,
            googleEmail: INITIAL_DRIVER_PROFILE.googleEmail,
            theme: (parsed.theme || 'dark') as ThemeMode
          };
          localStorage.setItem('gd_driver_profile', JSON.stringify(upgraded));
          return upgraded;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return { ...INITIAL_DRIVER_PROFILE, theme: 'dark' };
  });

  // Current Active Delivery Order (Starts empty for clean home screen)
  const [activeOrder, setActiveOrder] = useState<DriverOrder | null>(() => {
    return null;
  });

  // Available Orders Pool
  const [availableOrders, setAvailableOrders] = useState<DriverOrder[]>(() => {
    const saved = localStorage.getItem('gd_driver_available_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return AVAILABLE_ORDERS_POOL;
  });

  // Earnings History
  const [earnings, setEarnings] = useState<DriverEarningRecord[]>(() => {
    const saved = localStorage.getItem('gd_driver_earnings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EARNINGS;
  });

  // Active Tab with Horizontal Swipe Support for Driver Mode
  const [activeTab, setActiveTab] = useState<DriverAppTab>('active_delivery');
  const {
    currentTab,
    direction,
    goToTab,
    goToNextTab,
    goToPrevTab,
    swipeHandlers
  } = useSwipeTabs({
    currentTab: activeTab,
    onTabChange: setActiveTab,
    threshold: 45
  });
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<DriverOrder | null>(null);
  const [acceptedOrderModal, setAcceptedOrderModal] = useState<DriverOrder | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(() => {
    return localStorage.getItem('gd_user_registered_v2') === 'true';
  });
  const [showSplashAuth, setShowSplashAuth] = useState<boolean>(false);
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false);
  const [isTrafficLightOpen, setIsTrafficLightOpen] = useState(false);
  const [selectedOrderForTraffic, setSelectedOrderForTraffic] = useState<DriverOrder | null>(null);
  const [isAccountLockedModalOpen, setIsAccountLockedModalOpen] = useState(false);
  const [isGoComerciosOpen, setIsGoComerciosOpen] = useState(false);
  const batteryStatus = useBatteryStatus();
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isDevSyncOpen, setIsDevSyncOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [incomingAlertOrder, setIncomingAlertOrder] = useState<DriverOrder | null>(null);
  const { rate: currentExchangeRate } = useExchangeRate();

  // Handler: Penalizar pedido no entregado o cancelado (-25 pts salud)
  const handlePenaltyUnfulfilledOrder = useCallback((reason = 'Pedido no entregado o cancelado') => {
    soundEngine.vibrate([60, 40, 60]);
    setProfile((prev) => {
      const currentScore = prev.healthScore ?? 100;
      const currentUnfulfilled = prev.unfulfilledOrdersCount ?? 0;
      const nextScore = Math.max(0, currentScore - 25);
      const nextUnfulfilled = currentUnfulfilled + 1;
      const isNowLocked = nextScore <= 0;

      if (isNowLocked) {
        soundEngine.vibrate([100, 50, 100, 50, 100]);
        setTimeout(() => setIsAccountLockedModalOpen(true), 350);
      }

      return {
        ...prev,
        healthScore: nextScore,
        unfulfilledOrdersCount: nextUnfulfilled,
        isLocked: isNowLocked,
        isOnline: isNowLocked ? false : prev.isOnline,
        lockReason: isNowLocked ? `Bloqueo automático: ${reason}` : prev.lockReason
      };
    });
  }, []);

  // Handler: Restablecer salud de cuenta a 100 pts y desbloquear
  const handleRestoreAccountHealth = useCallback(() => {
    soundEngine.vibrate(25);
    setProfile((prev) => ({
      ...prev,
      healthScore: 100,
      unfulfilledOrdersCount: 0,
      isLocked: false,
      lockReason: undefined
    }));
  }, []);

  const handleStartTrafficLightAccept = (order: DriverOrder) => {
    // Si la batería es < 10%, bloqueo invisible activado
    if (batteryStatus.isLocked) {
      soundEngine.vibrate([100, 50, 100]);
      return;
    }
    if (profile.isLocked || (profile.healthScore ?? 100) <= 0) {
      soundEngine.vibrate([100, 50, 100]);
      setIsAccountLockedModalOpen(true);
      return;
    }
    setSelectedOrderForTraffic(order);
    setIsOrdersDrawerOpen(false);
    setIsTrafficLightOpen(true);
  };

  const handleTrafficLightComplete = () => {
    if (selectedOrderForTraffic) {
      soundEngine.playAdvanceChime();
      setActiveOrder({ ...selectedOrderForTraffic, status: 'accepted' });
      setAvailableOrders((prev) => prev.filter((o) => o.id !== selectedOrderForTraffic.id));
      setSelectedOrderForTraffic(null);
    }
    setIsTrafficLightOpen(false);
    goToTab('active_delivery');
  };

  const handleDispatchFromComercios = useCallback((newOrder: DriverOrder) => {
    try {
      soundEngine.unlock();
      soundEngine.playNewOrderAlert();
      setAvailableOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)].slice(0, 10));
      setIsOrdersDrawerOpen(true);
    } catch (err) {
      console.warn('Dispatch order handled:', err);
    }
  }, []);

  const handleRefreshAvailableOrders = useCallback(() => {
    try {
      const freshOrder = generateDynamicOrder();
      setAvailableOrders((prev) => {
        const filtered = prev.filter((o) => o.id !== freshOrder.id);
        return [freshOrder, ...filtered].slice(0, 10);
      });
    } catch (err) {
      console.warn('Generate order fallback:', err);
    }
  }, []);

  // Simulación continua de pedidos entrantes cada 30 segundos si el conductor está conectado (y batería >= 10%)
  useEffect(() => {
    if (!profile.isOnline || batteryStatus.isLocked) return;

    const interval = setInterval(() => {
      handleRefreshAvailableOrders();
      soundEngine.vibrate([20, 30, 20]);
    }, 30000);

    return () => clearInterval(interval);
  }, [profile.isOnline, batteryStatus.isLocked, handleRefreshAvailableOrders]);

  // Escucha activa de pedidos entrantes desde otra app (BroadcastChannel, PostMessage, LocalStorage, URL)
  useEffect(() => {
    const unsubscribe = initInterAppOrderBridge((order, source) => {
      try {
        soundEngine.unlock();
        soundEngine.vibrate([100, 60, 100, 60, 100]);
        soundEngine.playNewOrderAlert();

        // Incorporar a la lista de pedidos disponibles en primera posición
        setAvailableOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)].slice(0, 15));

        // Mostrar notificación flotante interactiva
        setIncomingAlertOrder(order);

        // Auto-desvanecer la notificación tras 14 segundos si no se interactúa
        setTimeout(() => {
          setIncomingAlertOrder((cur) => (cur?.id === order.id ? null : cur));
        }, 14000);
      } catch (err) {
        console.warn('Error procesando pedido inter-app entrante:', err);
      }
    }, () => currentExchangeRate);

    return unsubscribe;
  }, [currentExchangeRate]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('gd_driver_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('gd_driver_active_order', JSON.stringify(activeOrder));
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('gd_driver_available_orders', JSON.stringify(availableOrders));
  }, [availableOrders]);

  useEffect(() => {
    localStorage.setItem('gd_driver_earnings', JSON.stringify(earnings));
  }, [earnings]);

  // Apply Theme Mode (Default: Light Mode per user request)
  useEffect(() => {
    const root = document.documentElement;
    if (profile.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [profile.theme]);

  // Handler: Toggle Shift Online/Offline
  const handleToggleOnline = () => {
    if (profile.isLocked || (profile.healthScore ?? 100) <= 0) {
      soundEngine.vibrate([100, 50, 100]);
      setIsAccountLockedModalOpen(true);
      return;
    }
    setProfile((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  // Handler: Toggle Theme (Light / Dark)
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = profile.theme === 'dark' ? 'light' : 'dark';
    setProfile((prev) => ({ ...prev, theme: nextTheme }));
  };

  // Handler: Update Profile Settings
  const handleUpdateProfile = (updated: Partial<DriverProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Handler: Advance Order Progress
  const handleAdvanceOrderStatus = (orderId: string) => {
    if (!activeOrder || activeOrder.id !== orderId) return;

    let nextStatus = activeOrder.status;
    if (activeOrder.status === 'accepted') {
      nextStatus = 'arrived_at_pickup';
    } else if (activeOrder.status === 'arrived_at_pickup') {
      nextStatus = 'package_collected';
    } else if (activeOrder.status === 'package_collected') {
      nextStatus = 'arrived_at_dropoff';
    }

    soundEngine.playAdvanceChime();
    setActiveOrder({ ...activeOrder, status: nextStatus });
  };

  // Handler: Validate PIN and Complete Delivery
  const handleCompleteDelivery = (orderId: string, enteredPin: string, photoUrl?: string): boolean => {
    if (!activeOrder || activeOrder.id !== orderId) return false;

    if (enteredPin === activeOrder.securityPin) {
      soundEngine.playCompleteDelivery();

      // Create earning record
      const newEarning: DriverEarningRecord = {
        id: `earn-${Date.now().toString().slice(-6)}`,
        orderId: activeOrder.id,
        timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amountUsd: activeOrder.payoutUsd,
        amountVes: activeOrder.payoutVes,
        routeSummary: `${activeOrder.pickup.title.split('/')[0]} ➔ ${activeOrder.dropoff.title.split('/')[0]}`,
        status: 'credited'
      };

      setEarnings((prev) => [newEarning, ...prev]);
      setProfile((prev) => ({ ...prev, totalTrips: prev.totalTrips + 1 }));

      // Complete order and return to clean home screen with "pedidos" button
      setTimeout(() => {
        setActiveOrder(null);
        localStorage.removeItem('gd_driver_active_order');
        goToTab('active_delivery');
      }, 500);

      return true;
    }

    return false;
  };

  // Handler: Request Accept Order (Opens Confirmation Modal)
  const handleRequestAcceptOrder = (order: DriverOrder) => {
    if (profile.isLocked || (profile.healthScore ?? 100) <= 0) {
      soundEngine.vibrate([100, 50, 100]);
      setIsAccountLockedModalOpen(true);
      return;
    }
    soundEngine.unlock();
    soundEngine.playNewOrderAlert();
    setOrderToConfirm(order);
  };

  // Handler: Reset or restart a demo ride
  const handleResetDemoOrder = () => {
    soundEngine.playAdvanceChime();
    setActiveOrder(INITIAL_ACTIVE_ORDER);
    localStorage.setItem('gd_driver_active_order', JSON.stringify(INITIAL_ACTIVE_ORDER));
    goToTab('active_delivery');
  };

  // Handler: Simulate an incoming real-time order alert with timer & chime
  const handleSimulateIncomingOrder = () => {
    soundEngine.unlock();
    soundEngine.playNewOrderAlert();
    const sample = availableOrders.length > 0 ? availableOrders[0] : INITIAL_ACTIVE_ORDER;
    setOrderToConfirm({
      ...sample,
      id: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      timeAgo: '¡Oferta en vivo!'
    });
  };

  // Handler: Final Confirm Order after reviewing details
  const handleConfirmOrder = (order: DriverOrder) => {
    soundEngine.playAdvanceChime();
    setActiveOrder({ ...order, status: 'accepted' });
    setAvailableOrders((prev) => prev.filter((o) => o.id !== order.id));
    setOrderToConfirm(null);
    // Open the direction & Google Maps information screen
    setAcceptedOrderModal(order);
    goToTab('active_delivery');
  };

  // Handler: Decline Order in Confirmation Modal
  const handleDeclineOrder = () => {
    setOrderToConfirm(null);
  };

  // Handler: Withdraw Earnings
  const handleWithdrawEarnings = (amount: number) => {
    // Clear out or mark as processed
    setEarnings((prev) =>
      prev.map((e) => ({ ...e, status: 'processing' as const }))
    );
  };

  // Client Mode Handlers
  const handleSelectClientTab = (tab: AppTab) => {
    if (tab === 'driver_mode') {
      soundEngine.vibrate(20);
      soundEngine.playAdvanceChime();
      setAppMode('driver');
      localStorage.setItem('gd_app_mode', 'driver');
      return;
    }
    soundEngine.vibrate(12);
    setClientTab(tab);
    localStorage.setItem('gd_client_tab', tab);
  };

  const handleAddToCart = (item: MenuItem) => {
    soundEngine.vibrate(25);
    soundEngine.playAdvanceChime();
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        updated = [...prev, { item, quantity: 1 }];
      }
      localStorage.setItem('gd_client_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    soundEngine.vibrate(10);
    setCart((prev) => {
      const updated = prev
        .map((c) => (c.item.id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0);
      localStorage.setItem('gd_client_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    soundEngine.vibrate(15);
    setCart([]);
    localStorage.removeItem('gd_client_cart');
  };

  const handleClientCheckout = () => {
    if (cart.length === 0) return;
    soundEngine.unlock();
    soundEngine.playNewOrderAlert();
    soundEngine.vibrate([40, 60, 40]);

    const orderId = `GD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsDescription = cart.map((c) => `${c.quantity}x ${c.item.name}`).join(', ');
    const totalSpent = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0) + 2.50;

    const newDeliveryOrder: DeliveryOrder = {
      id: orderId,
      createdAt: 'Justo ahora',
      status: 'driver_assigned',
      pickup: {
        title: cart[0]?.item.restaurant || 'Restaurante Aliado Guayana',
        address: 'Av. Paseo Caroní, Alta Vista Sur, Puerto Ordaz',
        contactName: 'Encargado Despacho',
        contactPhone: '+58 414-9988220',
        coords: { lat: 8.2985, lng: -62.7350 }
      },
      dropoff: {
        title: 'Tu Dirección en Guayana',
        address: 'Urb. Los Olivos, Manzana 14, Puerto Ordaz',
        contactName: 'Cliente',
        contactPhone: '+58 412-5544332',
        coords: { lat: 8.2835, lng: -62.7225 }
      },
      packageCategory: 'small',
      vehicleType: 'moto',
      packageDescription: itemsDescription,
      isUrgent: true,
      insuranceRequired: true,
      distanceKm: 4.2,
      estimatedMinutes: 18,
      priceBreakdown: {
        baseFare: 3.00,
        distanceFare: 4.20,
        urgencyFare: 1.50,
        insuranceFare: 0.80,
        total: totalSpent
      },
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      securityPin: String(Math.floor(1000 + Math.random() * 9000)),
      driver: {
        id: 'drv-guayana-ceo',
        name: 'Yeferson Rodríguez',
        avatar: '/ceo-avatar.jpg',
        rating: 4.98,
        tripsCount: 1850,
        phone: '+58 414-885-3320',
        vehicleModel: 'Bera Socialista 150cc (Naranja)',
        vehiclePlate: 'AB-829K',
        vehicleType: 'moto',
        currentCoords: { lat: 8.2985, lng: -62.7350 }
      },
      chat: [
        {
          id: 'c1',
          sender: 'system',
          text: `Orden #${orderId} recibida. Repartidor asignado en camino al local.`,
          time: 'Ahora'
        },
        {
          id: 'c2',
          sender: 'driver',
          text: 'Buenas tardes compa, ya voy llegando al restaurante por tu pedido.',
          time: 'Ahora'
        }
      ]
    };

    setTrackingOrder(newDeliveryOrder);
    localStorage.setItem('gd_tracking_order', JSON.stringify(newDeliveryOrder));

    setWalletBalance((prev) => Math.max(0, prev - totalSpent));
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'order_payment',
        title: `Pedido ${orderId}`,
        subtitle: itemsDescription,
        amount: -totalSpent,
        date: 'Justo ahora',
        orderId,
        status: 'completed'
      },
      ...prev
    ]);

    setCart([]);
    localStorage.removeItem('gd_client_cart');
    setClientTab('tracking');
    localStorage.setItem('gd_client_tab', 'tracking');
  };

  const handleAdvanceTrackingStatus = (orderId: string) => {
    if (!trackingOrder || trackingOrder.id !== orderId) return;
    soundEngine.playAdvanceChime();
    soundEngine.vibrate(20);

    const statusFlow: DeliveryOrder['status'][] = [
      'searching_driver',
      'driver_assigned',
      'heading_to_pickup',
      'package_collected',
      'in_transit_delivery',
      'delivered'
    ];
    const currentIndex = statusFlow.indexOf(trackingOrder.status);
    const nextStatus = statusFlow[Math.min(statusFlow.length - 1, currentIndex + 1)];

    const updated = {
      ...trackingOrder,
      status: nextStatus,
      deliveredAt: nextStatus === 'delivered' ? 'Justo ahora' : undefined
    };
    setTrackingOrder(updated);
    localStorage.setItem('gd_tracking_order', JSON.stringify(updated));
  };

  const handleSendTrackingMessage = (orderId: string, text: string) => {
    if (!trackingOrder || trackingOrder.id !== orderId) return;
    soundEngine.playNotification();

    const clientMsg = {
      id: `msg-${Date.now()}`,
      sender: 'client' as const,
      text,
      time: 'Ahora'
    };

    const updatedOrder = {
      ...trackingOrder,
      chat: [...trackingOrder.chat, clientMsg]
    };
    setTrackingOrder(updatedOrder);

    setTimeout(() => {
      soundEngine.playAdvanceChime();
      soundEngine.vibrate([30, 40]);
      const driverReplies = [
        '¡Copiado compa! Voy en camino en mi moto.',
        'Entendido pana, ya salgo para allá con el paquete térmico.',
        'Perfecto, voy cruzando la avenida. Ten listo el PIN.',
        '¡Listo mi pana! Ya estoy casi en la entrada.'
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setTrackingOrder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          chat: [
            ...prev.chat,
            {
              id: `msg-${Date.now() + 1}`,
              sender: 'driver',
              text: randomReply,
              time: 'Ahora'
            }
          ]
        };
      });
    }, 1400);
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0
    })
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#06070a] text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-200">
      {/* Intro Splash Screen con Logo GO y Moto Repartidor antes de iniciar la app */}
      {showIntroSplash && (
        <IntroSplashScreen
          onComplete={() => {
            setShowIntroSplash(false);
            if (localStorage.getItem('gd_user_registered_v2') !== 'true') {
              setShowSplashAuth(true);
            }
          }}
        />
      )}
      {appMode === 'client' ? (
        /* =========================================================================
           EXPERIENCIA CLIENTE GO DELIVERY (4 PÁGINAS FLUIDAS + DOCK + GLASSMORPHISM)
           ========================================================================= */
        <>
          {/* Top Client Navbar with Brand, Live Rate, Theme Toggle and Mode Switcher */}
          <Navbar
            currentTab={clientTab}
            onSelectTab={handleSelectClientTab}
            userRole={appMode}
            onToggleRole={() => {
              soundEngine.vibrate(20);
              soundEngine.playAdvanceChime();
              setAppMode('driver');
              localStorage.setItem('gd_app_mode', 'driver');
            }}
            activeOrdersCount={trackingOrder && trackingOrder.status !== 'delivered' ? 1 : 0}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenLogoModal={() => setIsLogoModalOpen(true)}
            theme={profile.theme}
            onToggleTheme={handleToggleTheme}
          />

          {/* Main Client Content Container with Spring Physics */}
          <main className="flex-1 w-full max-w-5xl mx-auto px-3.5 sm:px-6 pt-5 pb-24 overflow-x-hidden">
            <AnimatePresence mode="wait">
              {/* Página 1: Inicio / Descubrir */}
              {clientTab === 'discover' && (
                <motion.div
                  key="client-discover"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  <DiscoverView
                    onSelectProduct={(item) => setSelectedProduct(item)}
                    onNavigateToTab={(t) => handleSelectClientTab(t)}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              )}

              {/* Página 2: Explorar / Menú Interactivo */}
              {clientTab === 'explore' && (
                <motion.div
                  key="client-explore"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  <ExploreMenuView
                    onSelectProduct={(item) => setSelectedProduct(item)}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              )}

              {/* Página 3: Seguimiento de Pedidos en Tiempo Real */}
              {clientTab === 'tracking' && (
                <motion.div
                  key="client-tracking"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  <TrackingView
                    order={trackingOrder}
                    onAdvanceOrderStatus={handleAdvanceTrackingStatus}
                    onSendMessage={handleSendTrackingMessage}
                    onNewOrderClick={() => handleSelectClientTab('explore')}
                  />
                </motion.div>
              )}

              {/* Página 4: Perfil / Carrito Flotante */}
              {clientTab === 'profile' && (
                <motion.div
                  key="client-profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  <FloatingCartHub
                    cart={cart}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onClearCart={handleClearCart}
                    walletBalance={walletBalance}
                    transactions={walletTransactions}
                    onCheckout={handleClientCheckout}
                    onNavigateToExplore={() => handleSelectClientTab('explore')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Floating Dock / Hub (Compact Glassmorphism Bottom Navigation with Spring Physics) */}
          <FloatingDock
            currentTab={clientTab}
            onSelectTab={handleSelectClientTab}
            activeOrdersCount={trackingOrder && trackingOrder.status !== 'delivered' ? 1 : 0}
            cartCount={cart.reduce((sum, c) => sum + c.quantity, 0)}
            showDriverMode={true}
          />

          {/* Shared Element Transition Modal for Product Details */}
          <ExploreMenuModal
            item={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />

          {/* Logo Inspector Modal */}
          <LogoInspectorModal
            isOpen={isLogoModalOpen}
            onClose={() => setIsLogoModalOpen(false)}
          />
        </>
      ) : (
        /* =========================================================================
           CONSOLA DE CONDUCTOR PROFESIONAL (RUTAS, TRAFFIC LIGHT GO, BATERÍA <10%)
           ========================================================================= */
        <>
          {/* Top Driver Navbar (Theme switcher moved into Menu) */}
          <DriverNavbar
            profile={profile}
            onToggleOnline={handleToggleOnline}
            onOpenSettings={() => goToTab('settings')}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onOpenSecurityRegistration={() => setIsSecurityModalOpen(true)}
            onOpenSlideBar={() => setIsSidebarOpen(true)}
            batteryLevel={batteryStatus.level}
            isCharging={batteryStatus.isCharging}
            onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
            onOpenDevSync={() => setIsDevSyncOpen(true)}
          />

          {/* Persistent Account Locked Warning Banner */}
          {(profile.isLocked || (profile.healthScore ?? 100) <= 0) && (
            <div
              onClick={() => setIsAccountLockedModalOpen(true)}
              style={{ top: 'calc(4.5rem + env(safe-area-inset-top, 0px))' }}
              className="fixed inset-x-0 z-40 bg-red-600 text-white px-4 py-2 text-xs font-black flex items-center justify-between shadow-2xl cursor-pointer hover:bg-red-700 transition select-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="w-4 h-4 text-white animate-pulse shrink-0" />
                <span className="truncate">Cuenta Bloqueada (Salud en 0%) · No puedes recibir carreras</span>
              </div>
              <span className="underline font-bold text-[11px] shrink-0 ml-2">
                Ver / Desbloquear
              </span>
            </div>
          )}

          {/* Main Single-Focused Driver View Container with Pure Fluid Swipe Gestures */}
          <main
            {...swipeHandlers}
            className={`flex-1 w-full mx-auto ${
              currentTab === 'active_delivery'
                ? 'p-0 m-0 max-w-full h-[100dvh] overflow-hidden'
                : 'max-w-5xl px-3.5 sm:px-6 pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[calc(5rem+env(safe-area-inset-bottom,0px))] h-[100dvh] overflow-y-auto overflow-x-hidden overscroll-y-contain'
            }`}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={currentTab}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 38,
                  mass: 0.6
                }}
                className="w-full"
              >
                {/* Tab 1: Ruta Activa */}
                {currentTab === 'active_delivery' && (
                  <ActiveDeliveryView
                    order={activeOrder}
                    driver={profile}
                    onCompleteDelivery={handleCompleteDelivery}
                    onViewAvailable={() => setIsOrdersDrawerOpen(true)}
                    onOpenSupport={() => setIsSupportModalOpen(true)}
                    onResetDemoOrder={handleResetDemoOrder}
                  />
                )}

                {/* Tab 2: Pedidos Disponibles */}
                {currentTab === 'available_orders' && (
                  <AvailableOrdersView
                    orders={availableOrders}
                    onAcceptOrder={handleStartTrafficLightAccept}
                    hasActiveDelivery={Boolean(activeOrder && activeOrder.status !== 'delivered')}
                    onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                    onOpenGoComercios={() => setIsGoComerciosOpen(true)}
                    onOpenIntegrationModal={() => setIsIntegrationModalOpen(true)}
                    profile={profile}
                  />
                )}

                {/* Tab 3: Ganancias / Billetera */}
                {currentTab === 'earnings' && (
                  <EarningsView
                    earnings={earnings}
                    onWithdraw={handleWithdrawEarnings}
                  />
                )}

                {/* Tab 4: Ajustes y Configuración */}
                {currentTab === 'settings' && (
                  <SettingsView
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    onOpenApkModal={() => setIsApkModalOpen(true)}
                    onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                    onOpenSplash={() => setShowSplashAuth(true)}
                    onResetDemoOrder={handleResetDemoOrder}
                    onOpenSupport={() => setIsSupportModalOpen(true)}
                    onOpenSecurityRegistration={() => setIsSecurityModalOpen(true)}
                    onSimulateIncomingOrder={handleSimulateIncomingOrder}
                    onPenaltyUnfulfilledOrder={() => handlePenaltyUnfulfilledOrder('Pedido no entregado o cancelado')}
                    onRestoreHealth={handleRestoreAccountHealth}
                    onOpenHealthModal={() => setIsAccountLockedModalOpen(true)}
                    batteryStatus={batteryStatus}
                    onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
                    onOpenVercelExport={() => setIsDevSyncOpen(true)}
                    onOpenIntegrationModal={() => setIsIntegrationModalOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Subtle Floating Page Slide Indicator */}
          <div
            style={{ bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
            className="fixed left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border border-white/10 shadow-lg"
          >
            {(['active_delivery', 'available_orders', 'earnings', 'settings'] as DriverAppTab[]).map((tab) => (
              <span
                key={tab}
                className={`transition-all duration-300 rounded-full ${
                  currentTab === tab
                    ? 'w-4 h-1.5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                    : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Slide-Bar Drawer with Tactile Relief and Intense-to-Yellow Gradient */}
          <DriverSidebarDrawer
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            profile={profile}
            currentTab={currentTab}
            onSelectTab={(tab) => {
              goToTab(tab);
              setIsSidebarOpen(false);
            }}
            onToggleOnline={handleToggleOnline}
            onToggleTheme={handleToggleTheme}
            onUpdateProfile={handleUpdateProfile}
            onOpenSecurityRegistration={() => {
              setIsSidebarOpen(false);
              setIsSecurityModalOpen(true);
            }}
            onOpenSupport={() => {
              setIsSidebarOpen(false);
              setIsSupportModalOpen(true);
            }}
            onOpenHowItWorks={() => {
              setIsSidebarOpen(false);
              setIsHowItWorksOpen(true);
            }}
            onOpenApkModal={() => {
              setIsSidebarOpen(false);
              setIsApkModalOpen(true);
            }}
            onOpenSplash={() => {
              setIsSidebarOpen(false);
              setShowSplashAuth(true);
            }}
            onOpenGoComercios={() => {
              setIsSidebarOpen(false);
              setIsGoComerciosOpen(true);
            }}
            onOpenIntegrationModal={() => {
              setIsSidebarOpen(false);
              setIsIntegrationModalOpen(true);
            }}
            todayEarningsUsd={earnings.reduce((sum, item) => sum + item.amountUsd, 0)}
            batteryLevel={batteryStatus.level}
            isCharging={batteryStatus.isCharging}
            onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
            onOpenVercelExport={() => setIsDevSyncOpen(true)}
          />
        </>
      )}

      {/* Global Modals: Mobile APK Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Interactive Animated Guide: How the App Works */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenAvailableOrders={() => {
          setAppMode('driver');
          goToTab('available_orders');
        }}
      />

      {/* AI Support and SOS Emergency Modal */}
      <SupportAndEmergencyModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        profile={profile}
      />

      {/* Maximum Security KYC Registration Modal */}
      <DriverSecurityRegistrationModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        initialProfile={profile}
        onSuccess={(updated) => {
          setProfile(updated);
          localStorage.setItem('gd_driver_profile', JSON.stringify(updated));
          setIsSecurityModalOpen(false);
        }}
      />

      {/* Connectivity Indicator */}
      <OfflineIndicator />

      {/* Order Acceptance Confirmation Modal (Reviewing route, kilometers & payout) */}
      <OrderConfirmationModal
        order={orderToConfirm}
        isOpen={Boolean(orderToConfirm)}
        onConfirm={handleConfirmOrder}
        onDecline={handleDeclineOrder}
      />

      {/* Screen with Address details and direct Google Maps Navigation button */}
      <OrderAcceptedSuccessModal
        order={acceptedOrderModal}
        isOpen={Boolean(acceptedOrderModal)}
        onClose={() => setAcceptedOrderModal(null)}
        onNavigateToActiveDelivery={() => setAcceptedOrderModal(null)}
      />

      {/* Initial Registration Screen (Email + Gmail/Other links + Phone SMS verification) */}
      <SplashAndAuthModal
        isOpen={showSplashAuth}
        allowSkip={isUserRegistered}
        initialEmail={isUserRegistered ? (profile.googleEmail || '') : ''}
        initialPhone={isUserRegistered ? (profile.phone || '') : ''}
        initialName={isUserRegistered ? (profile.name || '') : ''}
        onClose={() => setShowSplashAuth(false)}
        onSuccess={(newProfile) => {
          const mergedProfile: DriverProfile = {
            ...profile,
            ...newProfile,
            role: newProfile.role,
            theme: profile.theme || 'dark'
          };
          setProfile(mergedProfile);
          setIsUserRegistered(true);
          localStorage.setItem('gd_user_registered', 'true');
          localStorage.setItem('gd_user_registered_v2', 'true');
          localStorage.setItem('gd_driver_profile', JSON.stringify(mergedProfile));
          setShowSplashAuth(false);
        }}
      />

      {/* Orders Search Drawer (Deslizar hacia arriba con conteo de 30s) */}
      <OrdersSearchDrawer
        isOpen={isOrdersDrawerOpen}
        onClose={() => setIsOrdersDrawerOpen(false)}
        orders={availableOrders}
        onAcceptOrderWithTrafficLight={handleStartTrafficLightAccept}
        onRefreshOrders={handleRefreshAvailableOrders}
        onOpenGoComercios={() => setIsGoComerciosOpen(true)}
      />

      {/* Go Comercios Dispatch & Link Modal */}
      <GoComerciosModal
        isOpen={isGoComerciosOpen}
        onClose={() => setIsGoComerciosOpen(false)}
        onDispatchFromComercios={handleDispatchFromComercios}
        exchangeRate={currentExchangeRate}
      />

      {/* Traffic Light Modal with Voice: "En sus marcas... ¿listos?... ¡GO!" */}
      <TrafficLightGoModal
        isOpen={isTrafficLightOpen}
        onComplete={handleTrafficLightComplete}
        orderDestination={selectedOrderForTraffic?.dropoff.title}
      />

      {/* Account Health & Automatic Lock Modal */}
      <AccountHealthLockedModal
        isOpen={isAccountLockedModalOpen}
        onClose={() => setIsAccountLockedModalOpen(false)}
        profile={profile}
        onRestoreHealth={handleRestoreAccountHealth}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

      {/* Invisible Battery Lock: Activado si y sólo si la batería está en menos de 10% */}
      <InvisibleBatteryLock
        isLocked={batteryStatus.isLocked}
        onEmergencyUnlock={batteryStatus.triggerEmergencyUnlock}
      />

      {/* Battery Security & Diagnostic Modal */}
      <BatterySecurityModal
        isOpen={isBatteryModalOpen}
        onClose={() => setIsBatteryModalOpen(false)}
        batteryStatus={batteryStatus}
      />

      {/* Floating Alert for Incoming External Orders */}
      <IncomingOrderBanner
        order={incomingAlertOrder}
        onAccept={(order) => {
          setIncomingAlertOrder(null);
          handleStartTrafficLightAccept(order);
        }}
        onViewList={() => {
          setIncomingAlertOrder(null);
          goToTab('available_orders');
          setIsOrdersDrawerOpen(true);
        }}
        onDismiss={() => setIncomingAlertOrder(null)}
        exchangeRate={currentExchangeRate}
      />

      {/* Inter-App Order Integration & API Hub Modal */}
      <AppIntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        currentRate={currentExchangeRate}
      />

      {/* Developer Mode (AI Studio only): Export ZIP & Sync APK */}
      {isAiStudioDevMode() && (
        <VercelExportModal
          isOpen={isDevSyncOpen}
          onClose={() => setIsDevSyncOpen(false)}
        />
      )}
    </div>
  );
}
