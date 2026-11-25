import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  RotateCcw,
  Route,
  Layers,
  Map as MapIcon,
  LocateFixed,
  Moon,
  Sun,
  SlidersHorizontal,
  Compass,
  Palette,
  Eye,
  Sparkles,
  Move,
  Navigation
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import { MapLayerStyle } from './InteractiveMap';

export interface MapButtonsVisibility {
  route: boolean;
  poi: boolean;
  layer: boolean;
  geo: boolean;
  theme: boolean;
  settings: boolean;
  googleMaps: boolean;
  waze: boolean;
}

interface MapControlsFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleButtons: MapButtonsVisibility;
  onToggleVisibility: (key: keyof MapButtonsVisibility) => void;
  onEnableAll: () => void;
  onResetPositions: () => void;
  layerStyle: MapLayerStyle;
  onChangeLayerStyle: (style: MapLayerStyle) => void;
  currentTheme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const MapControlsFullscreenModal: React.FC<MapControlsFullscreenModalProps> = ({
  isOpen,
  onClose,
  visibleButtons,
  onToggleVisibility,
  onEnableAll,
  onResetPositions,
  layerStyle,
  onChangeLayerStyle,
  currentTheme,
  onToggleTheme
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundEngine.playAdvanceChime();
    onClose();
  };

  const handleResetPositionsWithSound = () => {
    soundEngine.vibrate(25);
    soundEngine.playNotification();
    onResetPositions();
  };

  const handleToggleThemeWithSound = () => {
    soundEngine.vibrate(30);
    soundEngine.playAdvanceChime();
    onToggleTheme();
  };

  const mapHubButtons = [
    {
      key: 'route' as keyof MapButtonsVisibility,
      title: 'Botón de Ruta y Destinos',
      subtitle: 'Centra la ruta (A ➔ B) o salta rápido a Puerto Ordaz y San Félix',
      icon: Route,
      colorBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      activeBadge: 'Ruta'
    },
    {
      key: 'poi' as keyof MapButtonsVisibility,
      title: 'Puntos Guía (POI)',
      subtitle: 'Filtra gasolineras, supermercados, bancos y franquicias',
      icon: Layers,
      colorBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      activeBadge: 'Referencias'
    },
    {
      key: 'layer' as keyof MapButtonsVisibility,
      title: 'Estilo de Mapa',
      subtitle: 'Alterna entre Modo Oscuro, OSM Vías y Voyager',
      icon: MapIcon,
      colorBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      activeBadge: 'Mosaicos'
    },
    {
      key: 'geo' as keyof MapButtonsVisibility,
      title: 'Geolocalización GPS',
      subtitle: 'Centra la vista en tu ubicación en tiempo real',
      icon: LocateFixed,
      colorBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      activeBadge: 'GPS Vivo'
    },
    {
      key: 'theme' as keyof MapButtonsVisibility,
      title: 'Modo Claro / Oscuro',
      subtitle: 'Cambia el tema de toda la interfaz al instante',
      icon: currentTheme === 'dark' ? Sun : Moon,
      colorBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      activeBadge: currentTheme === 'dark' ? 'Oscuro' : 'Claro'
    },
    {
      key: 'settings' as keyof MapButtonsVisibility,
      title: 'Botón de Menú y Ajustes',
      subtitle: 'Acceso directo en el Hub para abrir este panel lateral',
      icon: SlidersHorizontal,
      colorBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      activeBadge: 'Ajustes'
    }
  ];

  const externalNavButtons = [
    {
      key: 'googleMaps' as keyof MapButtonsVisibility,
      title: 'Google Maps (Lado Derecho)',
      subtitle: 'Abre la navegación guiada por voz en la app de Google Maps',
      icon: Navigation,
      colorBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      activeBadge: 'Maps'
    },
    {
      key: 'waze' as keyof MapButtonsVisibility,
      title: 'Waze (Lado Derecho)',
      subtitle: 'Abre la ruta con alertas de tráfico y rutas en tiempo real',
      icon: Navigation,
      colorBg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      activeBadge: 'Waze'
    }
  ];

  return (
    <AnimatePresence>
      {/* Backdrop con desenfoque suave */}
      <motion.div
        key="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm select-none"
      />

      {/* Panel lateral que ocupa hasta la mitad de la pantalla */}
      <motion.div
        key="drawer-panel"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 bottom-0 left-0 z-50 w-full sm:w-[50vw] max-w-lg bg-[#090c15] text-white border-r border-white/15 shadow-2xl flex flex-col select-none overflow-hidden"
      >
        {/* Header del Menú Lateral */}
        <header className="shrink-0 bg-[#0e1322] border-b border-white/10 px-4 sm:px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-white truncate">
                Ajustes de Controles
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Personaliza qué botones mostrar en pantalla
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition active:scale-95"
              title="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Contenido deslizable del panel */}
        <main className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-5 text-slate-200 text-xs">
          {/* Banner descriptivo del Hub y movimiento libre */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#121829] border border-white/10 shadow-md space-y-2">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Move className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">
                  Hub Desplegable y Arrastre Libre
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                  Los botones del mapa se agrupan en un solo botón principal. Al tocarlo se despliega hacia abajo y puedes arrastrarlo a cualquier zona de la pantalla.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={onEnableAll}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Activar Todos</span>
              </button>

              <button
                onClick={handleResetPositionsWithSound}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition"
                title="Devuelve los controles a su esquina inicial"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restablecer Posición</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN 1: NAVEGACIÓN EXTERNA (LADO DERECHO) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Navegación Externa (Lado Derecho)
                </h3>
              </div>
              <span className="text-[10px] text-slate-200 font-bold">
                Ubicación: Esquina Superior Derecha
              </span>
            </div>

            <div className="space-y-2">
              {externalNavButtons.map((btn) => {
                const isVisible = visibleButtons[btn.key];
                const IconComponent = btn.icon;

                return (
                  <div
                    key={btn.key}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isVisible
                        ? 'bg-[#111626] border-white/20 shadow-sm'
                        : 'bg-[#0b0e19]/80 border-white/10 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${btn.colorBg}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-white truncate">
                            {btn.title}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded-md bg-white/15 text-[9px] font-mono text-white font-bold">
                            {btn.activeBadge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-200 leading-tight truncate">
                          {btn.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundEngine.vibrate(20);
                        onToggleVisibility(btn.key);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 border ${
                        isVisible
                          ? 'bg-orange-600 border-orange-500 shadow-sm shadow-orange-600/30'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                      title={isVisible ? 'Deshabilitar botón' : 'Habilitar botón'}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                          isVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {isVisible ? <Check className="w-3 h-3 text-orange-600" /> : null}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECCIÓN 2: BOTONES DEL HUB DEL MAPA */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Botones del Hub (Desplegable)
                </h3>
              </div>
              <span className="text-[10px] text-slate-200 font-bold">
                Se abren hacia abajo al pulsar el Hub
              </span>
            </div>

            <div className="space-y-2">
              {mapHubButtons.map((btn) => {
                const isVisible = visibleButtons[btn.key];
                const IconComponent = btn.icon;

                return (
                  <div
                    key={btn.key}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isVisible
                        ? 'bg-[#111626] border-white/20 shadow-sm'
                        : 'bg-[#0b0e19]/80 border-white/10 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${btn.colorBg}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-white truncate">
                            {btn.title}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded-md bg-white/15 text-[9px] font-mono text-white font-bold">
                            {btn.activeBadge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-200 leading-tight truncate">
                          {btn.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundEngine.vibrate(20);
                        onToggleVisibility(btn.key);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 border ${
                        isVisible
                          ? 'bg-orange-600 border-orange-500 shadow-sm shadow-orange-600/30'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                      title={isVisible ? 'Deshabilitar botón' : 'Habilitar botón'}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                          isVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {isVisible ? <Check className="w-3 h-3 text-orange-600" /> : null}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECCIÓN 3: MODO CLARO / OSCURO */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Tema de la App (Alto Contraste)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (currentTheme !== 'dark') handleToggleThemeWithSound();
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-[#151b2e] border-orange-500 ring-2 ring-orange-500/30'
                    : 'bg-[#0a0c16] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Moon className="w-4 h-4 text-purple-300" />
                  {currentTheme === 'dark' && (
                    <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-bold">
                      Activo
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-white">Modo Oscuro</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Letras blancas de alto contraste</div>
              </button>

              <button
                onClick={() => {
                  if (currentTheme !== 'light') handleToggleThemeWithSound();
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  currentTheme === 'light'
                    ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-[#0a0c16] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Sun className="w-4 h-4 text-amber-300" />
                  {currentTheme === 'light' && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                      Activo
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-white">Modo Claro</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Luz diurna para sol directo</div>
              </button>
            </div>
          </section>

          {/* SECCIÓN 4: MOSAICO BASE DEL MAPA */}
          <section className="space-y-2.5 pb-6">
            <div className="flex items-center gap-1.5 pb-1 border-b border-white/10">
              <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Mosaico Base del Mapa
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  soundEngine.vibrate(20);
                  onChangeLayerStyle('dark');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  layerStyle === 'dark'
                    ? 'bg-slate-900 border-orange-500 ring-1 ring-orange-500'
                    : 'bg-[#0a0c16] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Moon className="w-3.5 h-3.5 text-orange-400" />
                  {layerStyle === 'dark' && <Check className="w-3 h-3 text-orange-500" />}
                </div>
                <div className="text-[11px] font-black text-white">Google Maps</div>
                <div className="text-[9px] text-cyan-300 font-medium">Azul & Celeste</div>
              </button>

              <button
                onClick={() => {
                  soundEngine.vibrate(20);
                  onChangeLayerStyle('osm');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  layerStyle === 'osm'
                    ? 'bg-slate-900 border-orange-500 ring-1 ring-orange-500'
                    : 'bg-[#0a0c16] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  {layerStyle === 'osm' && <Check className="w-3 h-3 text-orange-500" />}
                </div>
                <div className="text-[11px] font-black text-white">OSM Vías</div>
                <div className="text-[9px] text-slate-200 font-medium">Sentidos calles</div>
              </button>

              <button
                onClick={() => {
                  soundEngine.vibrate(20);
                  onChangeLayerStyle('voyager');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  layerStyle === 'voyager'
                    ? 'bg-slate-900 border-orange-500 ring-1 ring-orange-500'
                    : 'bg-[#0a0c16] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  {layerStyle === 'voyager' && <Check className="w-3 h-3 text-orange-500" />}
                </div>
                <div className="text-[11px] font-black text-white">Voyager</div>
                <div className="text-[9px] text-slate-200 font-medium">Edificios vivos</div>
              </button>
            </div>
          </section>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};
