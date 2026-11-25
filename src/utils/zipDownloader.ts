export interface ZipDownloadResult {
  ok: boolean;
  sizeMb?: string;
  error?: string;
}

/**
 * Fetches the project ZIP inside the authenticated browser context,
 * verifies its PK-ZIP magic bytes and non-empty payload, and downloads via Blob URL
 * so mobile/iframe browsers never save a 0-byte file or HTML redirect.
 */
export async function downloadVerifiedProjectZip(
  filename = 'Go-delivery-A1.zip'
): Promise<ZipDownloadResult> {
  const candidates = [
    `./Go-delivery-A1.zip?v=${Date.now()}`,
    `./go-delivery-vercel.zip?v=${Date.now()}`,
    `./go-delivery-project.zip?v=${Date.now()}`
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });

      if (!response.ok) {
        continue;
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength < 1024) {
        continue;
      }

      const bytes = new Uint8Array(buffer);
      // Verify standard ZIP header: 'P' (0x50), 'K' (0x4B)
      if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
        continue;
      }

      const blob = new Blob([buffer], { type: 'application/zip' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

      return {
        ok: true,
        sizeMb: (buffer.byteLength / (1024 * 1024)).toFixed(2)
      };
    } catch {
      // Try next candidate
    }
  }

  return {
    ok: false,
    error:
      'Tu navegador o iframe bloqueó la descarga directa. Usa el botón de descarga nativo de AI Studio en la barra superior derecha.'
  };
}
