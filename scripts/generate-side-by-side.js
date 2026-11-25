import fs from 'fs';

// Letter G and o from 89340.svg
const gAndOPaths = `
  <!-- Letter G from 89340.svg -->
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

  <!-- Letter o from 89340.svg -->
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
`;

// Exact Bag Mascot from 90224.svg
const bagMascotGuts = `
  <defs>
    <clipPath id="bagSquareClipSideBySide">
      <rect x="322" y="328" width="338" height="337" rx="4" />
    </clipPath>
  </defs>

  <!-- 1. BAG HANDLE (ORANGE ARCH) -->
  <path
    d="M 394,328 C 394,206 588,206 588,328"
    fill="none"
    stroke="#ff6e00"
    stroke-width="16"
    stroke-linecap="round"
  />

  <!-- 2. BAG BODY & DYNAMIC SPEED ACCENTS -->
  <g clip-path="url(#bagSquareClipSideBySide)">
    <rect x="322" y="328" width="338" height="337" fill="#ff6e00" />
    <path d="M 322,328 L 416,328 C 378,350 346,386 322,442 Z" fill="#ffffff" />
    <path d="M 416,328 C 378,350 346,386 322,442 L 322,504 C 356,440 408,382 478,328 Z" fill="#ffffff" />
    <polygon points="566,665 660,571 660,665" fill="#ff6e00" />
    <polygon points="616,665 660,571 660,665" fill="#ea8500" />
    <polygon points="506,665 540,665 660,545 660,511" fill="#ffffff" />
  </g>

  <!-- External Extensions -->
  <path d="M 322,442 C 322,442 320,432 322,426 L 322,442 Z" fill="#ffffff" />
  <polygon points="504,665 542,665 538,667 504,667" fill="#ffffff" />

  <!-- 3. Expressive Kawaii Face -->
  <ellipse cx="406" cy="476" rx="21" ry="29" fill="#000000" transform="rotate(-8 406 476)" />
  <path
    d="M 488,498
       C 502,460 534,440 568,442
       L 602,398
       C 584,432 566,450 554,460
       C 568,452 590,452 608,466
       C 608,466 596,478 578,474
       C 544,466 516,482 488,498
       Z"
    fill="#000000"
  />
  <path
    d="M 398,552 C 438,602 532,602 602,492"
    fill="none"
    stroke="#000000"
    stroke-width="22"
    stroke-linecap="round"
  />
`;

// Side-by-side combined SVG: 89340 on the left, 90224 on the right
const sideBySideSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 195 1315 585" width="100%" height="100%">
  <!-- Left: 89340.svg (Go Mark) in Pure Black -->
  <g fill="#000000">
    ${gAndOPaths}
  </g>

  <!-- Right: 90224.svg (Delivery Bag Mascot) aligned right next to 89340 -->
  <g transform="translate(980, 0) translate(-315, 0)">
    ${bagMascotGuts}
  </g>
</svg>`;

fs.writeFileSync('public/logo-official.svg', sideBySideSvg);
fs.writeFileSync('public/logo-full.svg', sideBySideSvg);

// App Icon (512x512)
const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradIconSideBySide" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bgGradIconSideBySide)" stroke="#e2e8f0" stroke-width="4" />
  <g transform="translate(26, 75) scale(0.35)">
    ${sideBySideSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
  <text x="256" y="445" text-anchor="middle" fill="#ff6e00" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="19" letter-spacing="4">GUAYANA · PTO ORDAZ - SAN FÉLIX</text>
</svg>`;

fs.writeFileSync('public/icon.svg', appIconSvg);

console.log('Successfully generated side-by-side 89340 + 90224 official logos!');
