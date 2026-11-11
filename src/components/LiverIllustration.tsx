/**
 * Anatomical illustration of the human liver (anterior view), drawn as a
 * layered vector so it stays crisp on every screen and adds no image weight.
 *
 * Structures shown: right & left lobes, falciform ligament, gallbladder,
 * inferior vena cava, hepatic artery, hepatic portal vein and common bile duct.
 */
export function LiverIllustration({ className = "" }: { className?: string }) {
  const liverPath =
    "M80 215 C 95 150, 170 108, 270 104 C 350 100, 420 112, 480 140 C 530 162, 568 188, 582 212 C 586 221, 578 227, 566 229 C 520 237, 470 251, 425 270 C 395 283, 372 297, 352 313 C 320 341, 280 372, 232 386 C 185 400, 132 386, 102 352 C 74 320, 68 262, 80 215 Z";

  return (
    <svg
      viewBox="40 40 580 420"
      className={className}
      role="img"
      aria-labelledby="liver-title liver-desc"
    >
      <title id="liver-title">Anatomical illustration of the human liver</title>
      <desc id="liver-desc">
        Front view of the liver showing the right and left lobes, the falciform ligament, the gallbladder and the
        major blood vessels and bile duct.
      </desc>

      <defs>
        {/* Organ body */}
        <radialGradient id="lv-body" cx="38%" cy="34%" r="78%">
          <stop offset="0" stopColor="#d4685a" />
          <stop offset="0.35" stopColor="#b2443b" />
          <stop offset="0.75" stopColor="#862b27" />
          <stop offset="1" stopColor="#5c1a1b" />
        </radialGradient>
        <linearGradient id="lv-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c45548" stopOpacity="0.0" />
          <stop offset="1" stopColor="#5a1819" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="lv-spec" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#ffd9cf" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lv-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb3a3" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffb3a3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lv-under" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#3a0e10" stopOpacity="0" />
          <stop offset="1" stopColor="#3a0e10" stopOpacity="0.55" />
        </linearGradient>

        {/* Gallbladder */}
        <linearGradient id="lv-gb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9ccf7c" />
          <stop offset="0.55" stopColor="#5d9a4a" />
          <stop offset="1" stopColor="#2f5f2d" />
        </linearGradient>

        {/* Vessels */}
        <linearGradient id="lv-ivc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2b3f8c" />
          <stop offset="0.45" stopColor="#5a77d1" />
          <stop offset="1" stopColor="#1f2e6c" />
        </linearGradient>
        <linearGradient id="lv-portal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a3c8f" />
          <stop offset="0.5" stopColor="#7c6bd0" />
          <stop offset="1" stopColor="#3a2e78" />
        </linearGradient>
        <linearGradient id="lv-artery" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b3171f" />
          <stop offset="0.5" stopColor="#ee4a4a" />
          <stop offset="1" stopColor="#9a1219" />
        </linearGradient>

        {/* Lobule micro-texture */}
        <pattern id="lv-lobules" width="22" height="19" patternUnits="userSpaceOnUse">
          <path
            d="M5.5 0 L16.5 0 L22 9.5 L16.5 19 L5.5 19 L0 9.5 Z"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.07"
            strokeWidth="0.8"
          />
          <circle cx="11" cy="9.5" r="1.1" fill="#3a0e10" fillOpacity="0.18" />
        </pattern>

        <filter id="lv-soft" x="-30%" y="-300%" width="160%" height="700%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="lv-inner" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <clipPath id="lv-clip">
          <path d={liverPath} />
        </clipPath>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="330" cy="420" rx="220" ry="22" fill="#0d1838" opacity="0.18" filter="url(#lv-soft)" />

      {/* Inferior vena cava (behind the organ) */}
      <path d="M296 52 h40 v86 h-40 z" fill="url(#lv-ivc)" />
      <path d="M304 52 h6 v80 h-6 z" fill="#ffffff" opacity="0.18" />

      {/* Hilum structures (behind / beneath the organ) */}
      <path
        d="M352 300 C 356 340, 350 380, 360 430"
        stroke="url(#lv-portal)"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M380 296 C 388 340, 396 382, 410 430" stroke="url(#lv-artery)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M330 312 C 326 350, 322 392, 326 432" stroke="#5f9a46" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M327 316 C 323 352, 320 392, 323 430" stroke="#bfe3a6" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Gallbladder */}
      <path
        d="M298 316 C 320 328, 330 360, 318 386 C 307 408, 281 408, 274 390 C 267 371, 279 340, 298 316 Z"
        fill="url(#lv-gb)"
      />
      <ellipse cx="290" cy="372" rx="7" ry="13" fill="#ffffff" opacity="0.22" transform="rotate(-18 290 372)" />

      {/* Liver body */}
      <path d={liverPath} fill="url(#lv-body)" />

      <g clipPath="url(#lv-clip)">
        {/* Left lobe shading */}
        <path d="M392 108 C 470 120, 560 170, 600 220 L 600 300 L 380 300 Z" fill="url(#lv-left)" />
        {/* Lobule texture */}
        <rect x="40" y="80" width="580" height="340" fill="url(#lv-lobules)" />
        {/* Underside shadow */}
        <rect x="40" y="80" width="580" height="340" fill="url(#lv-under)" />
        {/* Upper rim light */}
        <path d={liverPath} fill="none" stroke="url(#lv-rim)" strokeWidth="14" filter="url(#lv-inner)" />
        {/* Specular highlights */}
        <ellipse cx="210" cy="190" rx="110" ry="58" fill="url(#lv-spec)" transform="rotate(-12 210 190)" />
        <ellipse cx="470" cy="170" rx="60" ry="22" fill="url(#lv-spec)" opacity="0.7" transform="rotate(18 470 170)" />
        {/* Hilum shadow notch */}
        <ellipse cx="360" cy="320" rx="70" ry="34" fill="#2d0a0c" opacity="0.35" filter="url(#lv-inner)" />
      </g>

      {/* Falciform ligament */}
      <path
        d="M402 112 C 396 160, 388 220, 372 292"
        stroke="#3d0f11"
        strokeOpacity="0.45"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        filter="url(#lv-inner)"
      />
      <path
        d="M398 112 C 392 160, 384 220, 368 292"
        stroke="#f6c2b6"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Subtle outline for definition */}
      <path d={liverPath} fill="none" stroke="#3a0e10" strokeOpacity="0.35" strokeWidth="1.2" />
    </svg>
  );
}
