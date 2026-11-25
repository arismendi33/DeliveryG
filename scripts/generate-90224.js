import fs from 'fs';

// Accurate reproduction of 90224.svg (The Official Delivery Bag Mascot)
// Coordinates based on 1000x1000 canvas matching uploaded image

export function generateDeliveryBagMascotSvg(options = {}) {
  const {
    transparent = true,
    withStickerOutline = false,
    viewBox = "260 200 480 500" // tight crop around the bag
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
  <defs>
    <!-- Clip path for the bag body to constrain internal layers -->
    <clipPath id="bagBodyClip90224">
      <rect x="322" y="328" width="338" height="337" rx="6" />
    </clipPath>

    <!-- Optional drop shadow -->
    <filter id="softBagShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>

  ${!transparent ? '<rect width="100%" height="100%" fill="#ffffff" />' : ''}

  <!-- ======================================================== -->
  <!-- 0. OPTIONAL WHITE STICKER OUTLINE (Continuous Contour)   -->
  <!-- ======================================================== -->
  ${withStickerOutline ? `
  <g stroke="#ffffff" stroke-width="26" stroke-linejoin="round" stroke-linecap="round" fill="#ffffff">
    <!-- Handle arch -->
    <path d="M 395,328 C 395,210 587,210 587,328" fill="none" stroke-width="46" />
    <!-- Bag body -->
    <rect x="322" y="328" width="338" height="337" rx="8" />
  </g>
  <!-- Handle hole white rim -->
  <path d="M 416,328 C 416,236 566,236 566,328" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" />
  ` : ''}

  <!-- ======================================================== -->
  <!-- 1. BAG HANDLE (ORANGE ARCH)                              -->
  <!-- ======================================================== -->
  <path
    d="M 395,328 C 395,212 587,212 587,328"
    fill="none"
    stroke="#ff6e00"
    stroke-width="17"
    stroke-linecap="round"
  />

  <!-- ======================================================== -->
  <!-- 2. MAIN BAG BODY WITH CUTOUTS & 3D CORNER               -->
  <!-- ======================================================== -->
  <g clip-path="url(#bagBodyClip90224)">
    <!-- Base Orange Square -->
    <rect x="322" y="328" width="338" height="337" fill="#ff6e00" />

    <!-- Bottom-Right 3D Corner Detail -->
    <!-- Lower dark orange / amber side fold -->
    <polygon points="565,665 660,570 660,665" fill="#ff6e00" />
    <polygon points="616,665 660,570 660,665" fill="#ea8500" />

    <!-- Bottom-Right Diagonal White Speed Stripe -->
    <polygon points="505,665 538,665 660,543 660,510" fill="#ffffff" />

    <!-- Top-Left White Speed Swoosh / Cutout -->
    <!-- The swoosh scoops from the top edge to the left edge -->
    <!-- Outer boundary of corner cut: pure white background cut -->
    <path
      d="M 322,328
         L 415,328
         C 378,348 348,382 322,435
         Z"
      fill="${transparent ? '#ffffff' : '#ffffff'}"
    />
    <!-- The White Crescent Band -->
    <path
      d="M 415,328
         C 378,348 348,382 322,435
         L 322,498
         C 358,435 410,380 476,328
         Z"
      fill="#ffffff"
    />
  </g>

  <!-- ======================================================== -->
  <!-- 3. THE ICONIC KAWAII FACE                               -->
  <!-- ======================================================== -->
  <!-- Left Eye: Solid Black Oval Tilted -8 deg -->
  <ellipse
    cx="405"
    cy="476"
    rx="20"
    ry="28"
    fill="#000000"
    transform="rotate(-8 405 476)"
  />

  <!-- Right Eye: Stylized Dynamic Wink with Eyelash Wing -->
  <g id="kawaiiWink">
    <!-- Main Wink Arch (thick, dynamic sweep) -->
    <path
      d="M 488,495 C 504,452 542,435 578,446 C 596,452 606,462 608,466"
      fill="none"
      stroke="#000000"
      stroke-width="18"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Eyelash Wing flick pointing up-right -->
    <path
      d="M 552,438 Q 582,428 604,402"
      fill="none"
      stroke="#000000"
      stroke-width="12"
      stroke-linecap="round"
    />
  </g>

  <!-- Joyful Smile: Wide crescent tilting up into a mischievous wink smirk -->
  <path
    d="M 398,552 C 438,604 532,604 602,492"
    fill="none"
    stroke="#000000"
    stroke-width="22"
    stroke-linecap="round"
  />
</svg>`;
}

// Write the standalone 90224.svg file
const bagSvg1000 = generateDeliveryBagMascotSvg({ transparent: true, viewBox: "0 0 1000 1000" });
const bagSvgCrop = generateDeliveryBagMascotSvg({ transparent: true, viewBox: "280 180 420 510" });
const bagSvgSticker = generateDeliveryBagMascotSvg({ transparent: true, withStickerOutline: true, viewBox: "260 170 460 530" });

fs.writeFileSync('public/90224.svg', bagSvg1000);
fs.writeFileSync('public/delivery-bag.svg', bagSvgCrop);
fs.writeFileSync('public/delivery-bag-sticker.svg', bagSvgSticker);

console.log('Successfully generated public/90224.svg and cropped delivery-bag assets!');
