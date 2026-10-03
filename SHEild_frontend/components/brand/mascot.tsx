/** Sheeld, the SHEild mascot: a little shield with a face. */
export function Mascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 230" className={className} role="img" aria-label="Sheeld, the SHEild mascot: a smiling pink shield">
      {/* bow */}
      <path d="M100 22 L70 4 Q60 22 70 38 Z" fill="oklch(0.9 0.09 95)" />
      <path d="M100 22 L130 4 Q140 22 130 38 Z" fill="oklch(0.9 0.09 95)" />
      <circle cx="100" cy="24" r="9" fill="oklch(0.78 0.15 85)" />
      {/* shield body */}
      <path
        d="M100 28 C140 44 170 48 182 50 V116 C182 168 148 204 100 222 C52 204 18 168 18 116 V50 C30 48 60 44 100 28Z"
        fill="oklch(0.82 0.13 350)"
        stroke="oklch(0.95 0.05 350)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M100 52 C128 64 150 68 160 70 V116 C160 154 136 182 100 198 Z" fill="oklch(0.86 0.11 350)" />
      {/* eyes */}
      <ellipse cx="72" cy="112" rx="12" ry="15" fill="oklch(0.25 0.06 305)" />
      <ellipse cx="128" cy="112" rx="12" ry="15" fill="oklch(0.25 0.06 305)" />
      <circle cx="76" cy="106" r="4.5" fill="#fff" />
      <circle cx="132" cy="106" r="4.5" fill="#fff" />
      {/* blush + smile */}
      <ellipse cx="52" cy="138" rx="12" ry="7" fill="oklch(0.74 0.16 15)" opacity="0.75" />
      <ellipse cx="148" cy="138" rx="12" ry="7" fill="oklch(0.74 0.16 15)" opacity="0.75" />
      <path d="M86 140 Q100 158 114 140" fill="none" stroke="oklch(0.25 0.06 305)" strokeWidth="5" strokeLinecap="round" />
      {/* sparkles */}
      <path d="M170 20 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4Z" fill="oklch(0.9 0.09 95)" />
      <path d="M26 76 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z" fill="oklch(0.84 0.12 170)" />
    </svg>
  )
}
