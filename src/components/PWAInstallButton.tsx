import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Info, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenApkModal: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenApkModal }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      await install();
      setInstalling(false);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      onOpenApkModal();
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>APK Instalada</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        id="btn-install-apk"
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 transition active:scale-95"
      >
        <Smartphone className="w-4 h-4 text-white" />
        <span>Instalar APK Móvil</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 border border-zinc-200 shadow-2xl text-zinc-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-500" />
                Instalar en iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-zinc-400 hover:text-zinc-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                <p>Pulsa el botón <strong>Compartir</strong> <Share className="w-4 h-4 inline text-orange-600 mx-1" /> en la barra inferior de Safari.</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                <p>Baja en el menú y selecciona <strong>"Agregar al inicio"</strong>.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-3 text-xs font-black text-white transition active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
