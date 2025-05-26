export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="outerGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feFlood floodColor="#06b6d4" floodOpacity="0.5"/>
          <feComposite in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="techGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="techGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="topOGradient" cx="0.5" cy="0.5" r="0.7" fx="0.35" fy="0.35">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="70%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </radialGradient>
        <radialGradient id="darkGradient" cx="0.5" cy="0.5" r="0.7" fx="0.35" fy="0.35">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke="url(#ringGradient)" strokeWidth="10" filter="url(#outerGlow)" />
      <circle cx="200" cy="200" r="185" fill="white" />
      <path d="M200,20 a180,180 0 0,1 0,360 a90,90 0 0,0 0,-180 a90,90 0 0,1 0,-180" fill="url(#darkGradient)" />
      <circle cx="200" cy="110" r="42" fill="none" stroke="url(#techGradient1)" strokeWidth="6" />
      <circle cx="200" cy="110" r="36" fill="url(#topOGradient)" />
      <circle cx="200" cy="290" r="42" fill="none" stroke="url(#techGradient2)" strokeWidth="6" />
      <circle cx="200" cy="290" r="36" fill="url(#darkGradient)" />
      <g opacity="0.8">
        <circle cx="130" cy="100" r="3" fill="#06b6d4" />
        <circle cx="130" cy="100" r="8" fill="none" stroke="#06b6d4" strokeWidth="1.2" opacity="0.7">
          <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="130" cy="100" r="14" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.5">
          <animate attributeName="r" values="14;18;14" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      <g opacity="0.8">
        <circle cx="270" cy="300" r="3" fill="#ec4899" />
        <circle cx="270" cy="300" r="8" fill="none" stroke="#ec4899" strokeWidth="1.2" opacity="0.7">
          <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="270" cy="300" r="14" fill="none" stroke="#ec4899" strokeWidth="0.8" opacity="0.5">
          <animate attributeName="r" values="14;18;14" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

