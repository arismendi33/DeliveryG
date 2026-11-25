import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initOtaServiceWorker} from './utils/otaManager';

// Initialize real-time Over-The-Air (OTA) updates for APK and PWA
initOtaServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
