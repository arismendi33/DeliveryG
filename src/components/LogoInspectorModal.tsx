import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Download,
  Copy,
  Check,
  Eye,
  Trash2,
  ZoomIn,
  ZoomOut,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LogoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomLogoChange?: (logoDataUrl: string | null) => void;
}

export const LogoInspectorModal: React.FC<LogoInspectorModalProps> = ({
  isOpen,
  onClose,
  onCustomLogoChange
}) => {
  const [activeTab, setActiveTab] = useState<'vector' | 'upload'>('vector');
  const [vectorViewMode, setVectorViewMode] = useState<'side-by-side' | '89340' | '90224'>('side-by-side');
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('gd_custom_logo') : null;
  });
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'grid'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('gd_custom_logo');
    setCustomLogo(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('gd_custom_logo', dataUrl);
        setCustomLogo(dataUrl);
        if (onCustomLogoChange) onCustomLogoChange(dataUrl);
        window.dispatchEvent(new Event('storage'));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    localStorage.removeItem('gd_custom_logo');
    setCustomLogo(null);
    if (onCustomLogoChange) onCustomLogoChange(null);
    window.dispatchEvent(new Event('storage'));
  };

  const activeSvgFile =
    vectorViewMode === '89340'
      ? '/89340.svg'
      : vectorViewMode === '90224'
      ? '/90224.svg'
      : '/logo-official.svg';

  const downloadFilename =
    vectorViewMode === '89340'
      ? '89340-emblema-go.svg'
      : vectorViewMode === '90224'
      ? '90224-mascota-delivery.svg'
      : 'go-delivery-oficial-89340-90224.svg';

  const handleDownloadSvg = () => {
    const link = document.createElement('a');
    link.href = activeSvgFile;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySvgCode = async () => {
    try {
      const res = await fetch(activeSvgFile);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 text-zinc-900 my-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900">
              Logo Oficial Vectorizado 1:1 Fiel al Original
            </h2>
            <p className="text-xs text-zinc-500">
              Trazado matemático exacto sin alterar formas, curvas ni colores del diseño original.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 p-1 bg-zinc-100 rounded-2xl border border-zinc-200 text-xs">
          <button
            onClick={() => setActiveTab('vector')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'vector'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-orange-500" />
            <span>Vector SVG Exacto (1:1)</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-orange-500" />
            <span>Comparar / Cargar Imagen</span>
            {customLogo && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" title="Logo activo" />
            )}
          </button>
        </div>

        {/* Tab 1: Vector High-Def View */}
        {activeTab === 'vector' && (
          <div className="mt-5 space-y-4">
            {/* Format selector: Side by side vs 89340.svg vs 90224.svg */}
            <div className="grid grid-cols-1 sm:grid-cols-3 p-1.5 rounded-2xl bg-zinc-100/80 border border-zinc-200 gap-1.5">
              <button
                onClick={() => setVectorViewMode('side-by-side')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  vectorViewMode === 'side-by-side'
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 ring-1 ring-orange-500/20'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="truncate">89340 + 90224 (Lado a Lado)</span>
              </button>
              <button
                onClick={() => setVectorViewMode('89340')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  vectorViewMode === '89340'
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 ring-1 ring-orange-500/20'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="truncate">89340.svg (Emblema Go)</span>
              </button>
              <button
                onClick={() => setVectorViewMode('90224')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  vectorViewMode === '90224'
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 ring-1 ring-orange-500/20'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="truncate">90224.svg (Mascota)</span>
              </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mostrando archivo: <strong className="text-zinc-900 font-mono">{activeSvgFile}</strong></span>
              </span>

              <div className="flex items-center gap-2">
                {/* Background selector */}
                <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                  <button
                    onClick={() => setBgMode('light')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                      bgMode === 'light' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Blanco
                  </button>
                  <button
                    onClick={() => setBgMode('grid')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                      bgMode === 'grid' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Cuadrícula
                  </button>
                  <button
                    onClick={() => setBgMode('dark')}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                      bgMode === 'dark' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Oscuro
                  </button>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                    className="p-1 rounded text-zinc-600 hover:text-zinc-900 transition"
                    title="Reducir"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold px-1 text-zinc-700 min-w-[32px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    className="p-1 rounded text-zinc-600 hover:text-zinc-900 transition"
                    title="Aumentar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Preview Area */}
            <div
              className={`p-6 sm:p-12 rounded-3xl border flex items-center justify-center transition-colors min-h-[260px] overflow-hidden ${
                bgMode === 'light'
                  ? 'bg-white border-zinc-200 text-zinc-900'
                  : bgMode === 'dark'
                  ? 'bg-zinc-950 border-zinc-800 text-white'
                  : 'bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            >
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="transition-transform duration-150 flex items-center justify-center max-w-full"
              >
                <img
                  src={activeSvgFile}
                  alt={`Go Delivery Vectorial - ${activeSvgFile}`}
                  className="w-full max-w-[500px] h-auto object-contain select-none"
                />
              </div>
            </div>

            {/* Fidelity breakdown */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
              <div className="font-black text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Configuración exacta de archivos de marca oficiales:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-700">
                <li className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-zinc-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 font-bold">89340.svg (Emblema Go):</strong> Letras vectoriales "Go" de velocidad en negro sólido con contorno blanco integrado para máxima visibilidad en modo oscuro.
                  </div>
                </li>
                <li className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-zinc-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 font-bold">90224.svg (Mascota Oficial):</strong> Bolsa delivery con corte en la esquina, rostro kawaii, guiño alado y sonrisa pícara.
                  </div>
                </li>
                <li className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-zinc-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 font-bold">Lado a Lado:</strong> Ambos archivos alineados directamente uno al lado del otro con idéntica proporción óptica.
                  </div>
                </li>
                <li className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-zinc-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 font-bold">Fondo Transparente:</strong> Renderizado limpio sin fondos oscuros artificiales ni contornos pesados.
                  </div>
                </li>
              </ul>
            </div>

            {/* Actions: Download SVG & Copy SVG Code */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Descargar {downloadFilename}</span>
              </button>

              <button
                onClick={handleCopySvgCode}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200 transition active:scale-95"
              >
                {copiedSvg ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSvg ? 'Código SVG Copiado al Portapapeles' : `Copiar Código de ${downloadFilename}`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Upload / Compare image */}
        {activeTab === 'upload' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 leading-relaxed">
              <strong>Comparar o usar tu propio archivo PNG/JPG:</strong>
              <p className="mt-1 text-orange-900">
                Si deseas alternar temporalmente con tu archivo raster original, puedes cargarlo aquí. Puedes removerlo en cualquier momento para volver al vector SVG oficial.
              </p>
            </div>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-zinc-300 hover:border-orange-500 bg-zinc-50 hover:bg-orange-50/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition text-center group">
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 group-hover:border-orange-300 flex items-center justify-center text-zinc-500 group-hover:text-orange-600 mb-3 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-zinc-800 group-hover:text-orange-600">
                Haz clic para seleccionar tu imagen
              </span>
              <span className="text-xs text-zinc-400 mt-1">
                Formatos recomendados: PNG transparente, SVG o JPG
              </span>
            </label>

            {customLogo && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200">
                <div className="flex items-center gap-3">
                  <img
                    src={customLogo}
                    alt="Logo personalizado cargado"
                    className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-zinc-200"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-zinc-900">Imagen de logo activa en la app</p>
                    <p className="text-zinc-500 text-[11px]">Guardada en tu navegador</p>
                  </div>
                </div>

                <button
                  onClick={handleRemoveCustomLogo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Volver al SVG oficial</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
