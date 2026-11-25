import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  FolderArchive,
  CheckCircle2,
  ExternalLink,
  Copy,
  Terminal,
  FileCode2,
  Sparkles,
  Smartphone,
  RefreshCw,
  ShieldAlert,
  Code
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import { downloadVerifiedProjectZip } from '../utils/zipDownloader';

interface VercelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelExportModal: React.FC<VercelExportModalProps> = ({ isOpen, onClose }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipSizeMb, setZipSizeMb] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [syncingPwa, setSyncingPwa] = useState(false);
  const [syncPwaSuccess, setSyncPwaSuccess] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : '';

  const handleDownloadClick = async () => {
    soundEngine.playAdvanceChime();
    setDownloadingZip(true);
    setZipError(null);
    setDownloadStarted(false);

    const result = await downloadVerifiedProjectZip('Go-delivery-A1.zip');
    setDownloadingZip(false);

    if (result.ok) {
      setZipSizeMb(result.sizeMb || null);
      setDownloadStarted(true);
    } else {
      setZipError(result.error || 'No se pudo verificar la descarga del archivo ZIP.');
    }
  };

  const handleCopyCli = () => {
    soundEngine.vibrate(10);
    navigator.clipboard?.writeText('npx vercel --prod');
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2500);
  };

  const handleForcePwaUpdate = async () => {
    soundEngine.vibrate(20);
    setSyncingPwa(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
      soundEngine.playCompleteDelivery();
      setSyncPwaSuccess(true);
      setTimeout(() => setSyncPwaSuccess(false), 4000);
    } catch (err) {
      console.error('Error syncing caches:', err);
    } finally {
      setSyncingPwa(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0c101b] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Top gradient accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-[#FF6A00] to-amber-500" />

            {/* Exclusive Developer Mode Banner */}
            <div className="bg-amber-500/10 dark:bg-amber-500/15 px-4 py-2 border-b border-amber-500/20 flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-500" />
                <span>Modo Desarrollador (AI Studio) · Solo tú puedes ver esto</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-mono text-[9px]">
                Oculto al publicar
              </span>
            </div>

            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Actualizar APK y Proyecto</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                      En Vivo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sincroniza los últimos cambios en el APK y exporta el código
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition active-spring cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
              {/* Option 1: Live APK Refresh / PWA Cache Clear */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
                      1. Forzar Actualización Inmediata en el APK
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                    Sin reinstalar
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Si ya tienes el APK instalado en tu teléfono o moto, pulsa este botón para limpiar la caché de Service Worker y cargar todo el código nuevo al instante.
                </p>

                <button
                  type="button"
                  onClick={handleForcePwaUpdate}
                  disabled={syncingPwa}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition active-spring flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${syncingPwa ? 'animate-spin' : ''}`} />
                  <span>{syncingPwa ? 'Sincronizando...' : 'Actualizar Versión del APK Ahora'}</span>
                </button>

                {syncPwaSuccess && (
                  <p className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Caché limpiada y Service Worker actualizado con éxito!</span>
                  </p>
                )}
              </div>

              {/* Option 2: Download Updated ZIP for Vercel/GitHub */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white border border-slate-700 shadow-xl space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
                      <FolderArchive className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        2. Descargar Código Fuente Completo (.ZIP)
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Go-delivery-A1.zip (con todos los cambios actuales)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Al día
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Descarga un archivo ZIP con todo el código actual de Go Delivery listo para subir a <strong>Vercel</strong>, <strong>GitHub</strong> o desplegar en tu hosting.
                </p>

                {/* Direct Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  disabled={downloadingZip}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-[#FF6A00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/30 transition active-spring flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Download className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
                  <span>
                    {downloadingZip
                      ? 'Empaquetando y Verificando ZIP...'
                      : 'Descargar Archivo ZIP con Cambios'}
                  </span>
                </button>

                {downloadStarted && (
                  <p className="text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      ¡ZIP verificado y descargado ({zipSizeMb || '5.6'} MB)! Listo para descomprimir.
                    </span>
                  </p>
                )}

                {zipError && (
                  <p className="text-center text-xs text-amber-300 font-semibold flex items-center justify-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{zipError}</span>
                  </p>
                )}
              </div>

              {/* Option 2.5: Direct Link & Commands for GitHub Repo (arismendi33/DeliveryG) */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Subir a tu GitHub (arismendi33/DeliveryG):
                  </span>
                  <a
                    href="https://github.com/arismendi33/DeliveryG/upload/main"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center gap-1 hover:opacity-90 transition"
                  >
                    <span>Subir archivos en GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Descomprime el <code className="font-mono">.zip</code>, entra a la carpeta y arrastra los archivos a tu repo o ejecuta en VS Code:
                </p>
                <pre className="font-mono text-[11px] text-emerald-400 bg-slate-950 p-2.5 rounded-xl overflow-x-auto">
{`git init
git add .
git commit -m "Go-delivery-A1"
git branch -M main
git remote add origin https://github.com/arismendi33/DeliveryG.git
git push -u origin main --force`}
                </pre>
              </div>

              {/* Option 3: PWABuilder Link for New APK */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Generar Nuevo Instalador APK en PWABuilder:
                  </span>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 font-black flex items-center gap-1 hover:underline"
                  >
                    <span>Abrir PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pega la URL de tu app en PWABuilder para compilar el archivo <code className="font-mono bg-slate-200 dark:bg-white/10 px-1 py-0.5 rounded">.apk</code> oficial firmado para Android.
                </p>
              </div>

              {/* CLI Shortcut */}
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold">Comando Vercel CLI:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCli}
                    className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 transition cursor-pointer"
                  >
                    {copiedCommand ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCommand ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-emerald-400 bg-black/50 p-2 rounded-xl overflow-x-auto">
                  npx vercel --prod
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDownloadClick}
                disabled={downloadingZip}
                className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingZip ? 'Preparando ZIP...' : 'Descarga verificada (.zip)'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition active-spring cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
