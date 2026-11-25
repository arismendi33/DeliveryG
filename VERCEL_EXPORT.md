# Guía de Exportación y Despliegue en Vercel · Go Delivery

Este proyecto está 100% optimizado y configurado para desplegarse en **Vercel** en un solo clic con soporte completo para Progressive Web App (PWA), Service Workers y Single Page Application (SPA).

---

## 📁 Archivos de Configuración para Vercel Incluidos

1. **`vercel.json`**:
   - Define el framework como `vite`.
   - Comando de compilación: `npm run build` o `npm run vercel-build`.
   - Carpeta de salida: `dist`.
   - Reglas de reescritura SPA (`rewrites`) para que todas las rutas internas carguen `index.html`.
   - Cabeceras de caché y seguridad HTTP (`headers`) para PWA (`manifest.json`, `sw.js`, `registerSW.js`) y assets estáticos.

2. **`.vercelignore`**:
   - Omite archivos temporales y dependencias locales para una subida ultra rápida.

3. **`package.json`**:
   - Script `"vercel-build": "vite build"` añadido para compatibilidad nativa.

---

## 🚀 Opciones para Exportar y Desplegar

### Opción 1: Conectar con GitHub (Recomendada)
1. Sube este repositorio a tu cuenta de **GitHub**, **GitLab** o **Bitbucket**.
2. Ingresa a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New..."** > **"Project"**.
4. Selecciona tu repositorio de Go Delivery.
5. Vercel detectará automáticamente:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
6. Haz clic en **"Deploy"**. En menos de 1 minuto tendrás tu URL HTTPS pública y lista.

---

### Opción 2: Despliegue Directo con Vercel CLI (Terminal)
Si tienes el proyecto en tu máquina local o terminal:
```bash
# 1. Instalar la CLI de Vercel (si no la tienes)
npm i -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desplegar en producción
vercel --prod
```

---

### Opción 3: Variables de Entorno (Opcional)
Si necesitas configurar variables en Vercel:
- Dirígete a **Project Settings** > **Environment Variables** en el dashboard de Vercel.
- Agrega cualquier variable con prefijo `VITE_` si tu aplicación las requiere.

---

## ✅ Verificación del Despliegue
Al desplegarse en Vercel:
- La navegación fluida y las rutas funcionarán sin errores 404 al recargar.
- El Service Worker (`sw.js`) se registrará correctamente para funcionamiento offline.
- El manifest PWA permitirá instalar la aplicación en Android, iOS y computadoras.
