import fs from 'fs';

// 1. Exact Standalone Vector Replica of 89340.svg (Tight viewBox for responsive UI)
export const exact89340Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 320 905 460" width="100%" height="100%">
  <!-- Exact 1:1 Vector Replica of 89340.svg -->
  <g fill="currentColor">
    <!-- Letter G -->
    <path
      fill-rule="evenodd"
      d="
        M 54,332
        L 348,332
        A 218 218 0 0 1 554,478
        L 442,478
        A 118 118 0 0 0 348,432
        A 118 118 0 0 0 230,550
        A 118 118 0 0 0 348,668
        A 118 118 0 0 0 461,582
        L 364,582
        L 364,505
        L 570,505
        L 570,758
        L 496,758
        C 454,765 404,768 348,768
        A 218 218 0 0 1 130,550
        C 130,518 136,490 146,464
        L 54,424
        L 142,390
        Z
      "
    />

    <!-- Letter o -->
    <path
      fill-rule="evenodd"
      d="
        M 595,425
        L 768,425
        A 173 173 0 0 1 941,598
        A 173 173 0 0 1 768,771
        A 173 173 0 0 1 595,598
        L 595,425
        Z

        M 768,526
        A 72 72 0 1 0 768,670
        A 72 72 0 1 0 768,526
        Z
      "
    />
  </g>
</svg>`;

// 2. Square 1000x1000 version of 89340.svg
export const exact89340Square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <!-- Exact 1:1 Vector Replica of 89340.svg (1000x1000 Canvas) -->
  <g fill="#000000">
    <!-- Letter G -->
    <path
      fill-rule="evenodd"
      d="
        M 54,332
        L 348,332
        A 218 218 0 0 1 554,478
        L 442,478
        A 118 118 0 0 0 348,432
        A 118 118 0 0 0 230,550
        A 118 118 0 0 0 348,668
        A 118 118 0 0 0 461,582
        L 364,582
        L 364,505
        L 570,505
        L 570,758
        L 496,758
        C 454,765 404,768 348,768
        A 218 218 0 0 1 130,550
        C 130,518 136,490 146,464
        L 54,424
        L 142,390
        Z
      "
    />

    <!-- Letter o -->
    <path
      fill-rule="evenodd"
      d="
        M 595,425
        L 768,425
        A 173 173 0 0 1 941,598
        A 173 173 0 0 1 768,771
        A 173 173 0 0 1 595,598
        L 595,425
        Z

        M 768,526
        A 72 72 0 1 0 768,670
        A 72 72 0 1 0 768,526
        Z
      "
    />
  </g>
</svg>`;

// 3. Full Official Logo with 89340 Mark + Mascot
export const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 480" width="100%" height="100%">
  <defs>
    <clipPath id="bagClipFull89340">
      <rect x="710" y="145" width="220" height="220" rx="4" />
    </clipPath>
  </defs>

  <!-- 89340 Vector Go Emblem -->
  <g transform="translate(-22, -168) scale(0.77)" fill="#000000">
    <path
      fill-rule="evenodd"
      d="
        M 54,332
        L 348,332
        A 218 218 0 0 1 554,478
        L 442,478
        A 118 118 0 0 0 348,432
        A 118 118 0 0 0 230,550
        A 118 118 0 0 0 348,668
        A 118 118 0 0 0 461,582
        L 364,582
        L 364,505
        L 570,505
        L 570,758
        L 496,758
        C 454,765 404,768 348,768
        A 218 218 0 0 1 130,550
        C 130,518 136,490 146,464
        L 54,424
        L 142,390
        Z
      "
    />
    <path
      fill-rule="evenodd"
      d="
        M 595,425
        L 768,425
        A 173 173 0 0 1 941,598
        A 173 173 0 0 1 768,771
        A 173 173 0 0 1 595,598
        L 595,425
        Z

        M 768,526
        A 72 72 0 1 0 768,670
        A 72 72 0 1 0 768,526
        Z
      "
    />
  </g>

  <!-- Orange Delivery Bag Mascot -->
  <g id="deliveryBagMascot">
    <path
      d="M 765,145 C 765,80 875,80 875,145"
      fill="none"
      stroke="#ff6e00"
      stroke-width="16"
      stroke-linecap="round"
    />

    <g clip-path="url(#bagClipFull89340)">
      <rect x="710" y="145" width="220" height="220" fill="#ff6e00" />
      <path d="M 710,145 L 775,145 C 743,160 725,186 710,230 Z" fill="#ffffff" />
      <path d="M 815,365 L 930,250 L 930,285 L 850,365 Z" fill="#ffffff" />
      <path d="M 850,365 L 930,285 L 930,365 Z" fill="#ea4d00" />
    </g>

    <ellipse cx="768" cy="230" rx="19" ry="26" fill="#000000" transform="rotate(-6 768 230)" />
    <path d="M 828,238 C 840,218 870,218 894,234" fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round" />
    <path d="M 874,222 L 898,206" fill="none" stroke="#000000" stroke-width="11" stroke-linecap="round" />
    <path d="M 760,288 C 792,328 858,328 896,280" fill="none" stroke="#000000" stroke-width="16" stroke-linecap="round" />
  </g>

  <!-- Subtitle Text: "GO Delivery" -->
  <g transform="translate(680, 395)">
    <path
      d="
        M 0,16
        L 26,16
        C 34,9 45,9 54,16
        C 63,22 67,31 67,42
        L 40,42
        L 40,49
        L 56,49
        C 54,57 47,63 38,63
        C 27,63 19,53 19,41
        C 19,37 20,33 22,29
        L 0,29
        L 13,24
        L 0,16
        Z
      "
      fill="#000000"
    />
    <path
      fill-rule="evenodd"
      d="
        M 66,26
        C 75,26 86,26 94,32
        C 104,38 104,52 95,58
        C 86,65 72,65 66,58
        C 62,52 62,35 66,26
        Z
        M 81,36
        C 87,36 91,40 91,46
        C 91,52 87,56 81,56
        C 75,56 71,52 71,46
        C 71,40 75,36 81,36
        Z
      "
      fill="#000000"
    />
    <text
      x="105"
      y="58"
      font-family="system-ui, -apple-system, sans-serif"
      font-size="37"
      font-weight="900"
      letter-spacing="-0.8"
      fill="#000000"
    >Delivery</text>
  </g>
</svg>`;

// Write all assets to disk
fs.writeFileSync('public/89340.svg', exact89340Svg);
fs.writeFileSync('public/89340-square.svg', exact89340Square);
fs.writeFileSync('public/logo-official.svg', exact89340Svg);
fs.writeFileSync('public/logo-emblem.svg', exact89340Svg);
fs.writeFileSync('public/logo-full.svg', fullLogoSvg);

// Slogan SVG
const sloganSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" width="100%" height="100%">
  <text
    x="340"
    y="70"
    font-family="system-ui, cursive, sans-serif"
    font-size="62"
    font-weight="700"
    font-style="italic"
    fill="#000000"
    letter-spacing="-0.5"
  >llama y vamos!</text>
  <g transform="translate(0, 80)">
    ${fullLogoSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;
fs.writeFileSync('public/logo-slogan.svg', sloganSvg);

// App Icon (512x512)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f4f4f5" />
    </linearGradient>
    <filter id="softShadowIcon" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>

  <rect width="512" height="512" rx="120" fill="url(#bgGradIcon)" stroke="#e4e4e7" stroke-width="4" />
  <text x="256" y="95" text-anchor="middle" font-family="system-ui, cursive, sans-serif" font-size="44" font-style="italic" font-weight="900" fill="#111111">llama y vamos!</text>
  <g filter="url(#softShadowIcon)" transform="translate(16, 50) scale(0.48)">
    ${fullLogoSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
  <text x="256" y="455" text-anchor="middle" fill="#ff6e00" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" letter-spacing="4">GUAYANA · PTO ORDAZ - SAN FÉLIX</text>
</svg>`;
fs.writeFileSync('public/icon.svg', iconSvg);

console.log('Successfully written all brand SVGs');
