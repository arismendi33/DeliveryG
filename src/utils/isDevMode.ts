/**
 * Detects if the app is currently running in AI Studio Developer Mode.
 * When published outside AI Studio (APK, Vercel, production domain, PWA standalone),
 * this returns false so developer controls remain strictly hidden from end users.
 */
export const isAiStudioDevMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // If running in standalone PWA or installed APK, it is never dev mode
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }

  const hostname = window.location.hostname;

  // Explicit external published hosts (Vercel, custom domain, production)
  if (
    hostname.includes('vercel.app') ||
    hostname.includes('netlify.app') ||
    hostname.includes('firebaseapp.com') ||
    hostname.includes('web.app') ||
    (!hostname.includes('ais-dev') &&
      !hostname.includes('localhost') &&
      !hostname.includes('127.0.0.1') &&
      !hostname.includes('run.app'))
  ) {
    return false;
  }

  // Inside Google AI Studio development container / iframe or localhost
  const isAisDevHost =
    hostname.includes('ais-dev') ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1');
  const isInsideIframe = window.self !== window.top;

  return isAisDevHost || isInsideIframe;
};
