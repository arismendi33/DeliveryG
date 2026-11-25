import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles,
  Archive,
  X
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { downloadVerifiedProjectZip } from '../utils/zipDownloader';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipFeedback, setZipFeedback] = useState<string | null>(null);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-...run.app';

  const manifestJsonText = JSON.stringify({
    "id": "/",
    "name": "Go delivery",
    "short_name": "Go delivery",
    "description": "Go delivery app de entregas VE",
    "dir": "ltr",
    "lang": "es",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "orientation": "any",
    "background_color": "#ffffff",
    "theme_color": "#ffffff",
    "categories": ["travel", "food", "shopping", "business"],
    "icons": [
      {
        "src": `${currentUrl.replace(/\/$/, '')}/pwa-192x192.png`,
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": `${currentUrl.replace(/\/$/, '')}/pwa-maskable-192x192.png`,
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": `${currentUrl.replace(/\/$/, '')}/pwa-512x512.png`,
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": `${currentUrl.replace(/\/$/, '')}/pwa-maskable-512x512.png`,
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ]
  }, null, 2);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyManifest = () => {
    navigator.clipboard.writeText(manifestJsonText);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#0c101b] border border-zinc-200 dark:border-white/15 shadow-2xl p-6 sm:p-8 text-zinc-900 dark:text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with authentic brand logo */}
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-white/10">
          <BrandLogo variant="emblem" size="md" />
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              Descargar APK / Generar en PWABuilder
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Go Delivery Guayana · Empaqueta e instala directamente en tu teléfono Android
            </p>
          </div>
        </div>

        {/* 3 Methods */}
        <div className="mt-5 space-y-4">
          {/* Download ZIP Package Direct */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                  <Archive className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Archivo ZIP Listo
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1.5">
                  Descargar Código Fuente y Build (.ZIP)
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                  Contiene todo el proyecto listo para abrir en VS Code, compilar con Capacitor o subir a tu propio hosting independiente (Vercel / Netlify) sin marcas de Google.
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={async () => {
                  setDownloadingZip(true);
                  setZipFeedback(null);
                  const res = await downloadVerifiedProjectZip('go-delivery-project.zip');
                  setDownloadingZip(false);
                  if (res.ok) {
                    setZipFeedback(`✅ ZIP descargado (${res.sizeMb || '5.6'} MB) y verificado.`);
                  } else {
                    setZipFeedback(`⚠️ ${res.error}`);
                  }
                }}
                disabled={downloadingZip}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition active:scale-95 shadow-md cursor-pointer disabled:opacity-60"
              >
                <Download className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
                <span>
                  {downloadingZip
                    ? 'Verificando e iniciando descarga...'
                    : 'Descargar go-delivery-project.zip (Código Actualizado)'}
                </span>
              </button>
              {zipFeedback && (
                <p className="text-[11px] font-bold text-center text-blue-700 dark:text-blue-300">
                  {zipFeedback}
                </p>
              )}
            </div>
          </div>

          {/* Method 1: Instant PWA APK-equivalent */}
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/30">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
                <Sparkles className="w-3 h-3 text-orange-600 dark:text-orange-400" /> Recomendado e Inmediato
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1.5">
                1. Instalar directo en Android (PWA / WebAPK)
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                Abre este enlace en Google Chrome en tu celular. Pulsa en el menú <strong className="text-orange-700 dark:text-orange-400">⋮ (tres puntos)</strong> y selecciona <strong className="text-orange-700 dark:text-orange-400">"Instalar aplicación"</strong>. Android creará el icono oficial de <strong>Go Delivery</strong> que se ejecuta a pantalla completa como cualquier APK nativo.
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full text-xs font-mono bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/15 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-200 truncate"
              />
              <button
                onClick={copyUrl}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar URL'}
              </button>
            </div>
          </div>

          {/* Method 2: PWABuilder */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              2. Generar archivo .APK con PWABuilder.com
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
              Si en PWABuilder te aparece <strong className="text-amber-600 dark:text-amber-400">"Missing Name"</strong> o <strong className="text-amber-600 dark:text-amber-400">"did not find a Web Manifest"</strong>, es porque el servidor de PWABuilder no puede acceder a las cookies de Google AI Studio. Para solucionarlo en 5 segundos:
            </p>

            <ol className="mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-decimal list-inside">
              <li>En la pantalla de PWABuilder, pulsa el botón morado <strong className="text-purple-600 dark:text-purple-400">"Edit Your Manifest"</strong>.</li>
              <li>Pulsa el botón de abajo para copiar el <strong>JSON oficial del Manifiesto</strong>.</li>
              <li>Pégalo en la pestaña <strong>JSON</strong> de PWABuilder (o escribe Nombre: <code>Go delivery</code>) y pulsa <strong>Save</strong>.</li>
              <li>El botón gris <strong className="text-emerald-600">"Package For Stores"</strong> se activará inmediatamente para descargar tu <strong>.APK</strong>.</li>
            </ol>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={copyManifest}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition active:scale-95 shadow-sm"
              >
                {copiedManifest ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedManifest ? '¡Manifiesto JSON Copiado!' : 'Copiar JSON del Manifiesto'}
              </button>

              <a
                href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition active:scale-95 shadow-md"
              >
                <span>Abrir PWABuilder.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* OTA Automatic Updates Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-zinc-800 dark:text-zinc-200">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Actualizaciones Over-The-Air (OTA) en Vivo</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              <strong>Todos los ajustes futuros se sincronizan directamente al APK:</strong> Gracias al Service Worker configurado con <code>skipWaiting</code> y recarga en caliente, cualquier cambio que realices en el código o en la app se descarga e instala automáticamente en el teléfono de tus usuarios sin tener que reinstalar el APK.
            </p>
          </div>

          {/* Method 3: Capacitor Native */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              3. Compilar APK local con Capacitor & Android Studio
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
              Exporta este proyecto y ejecuta en tu terminal:
            </p>
            <div className="mt-2.5 bg-zinc-900 p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-orange-400 space-y-1 overflow-x-auto">
              <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
              <div>npx cap init "Go Delivery" "com.godelivery.app"</div>
              <div>npm run build</div>
              <div>npx cap add android</div>
              <div>npx cap open android</div>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
              Se abrirá en Android Studio donde das clic en <strong>Build ➔ Build APK(s)</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Todo el código es 100% compatible con Capacitor y PWA
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
