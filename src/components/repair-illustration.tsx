/**
 * Repair-themed "404" artwork: the zero is a gear with a wrench laid across it. Drawn with theme colours
 * (currentColor + CSS variables), so it follows light and dark mode. Decorative: the page heading says 404.
 */
export function NotFoundIllustration({ className }: { className?: string }) {
  // Gear teeth: 8 rounded blocks around the centre.
  const teeth = Array.from({ length: 8 }, (_, index) => index * 45);

  return (
    <svg viewBox="0 0 360 180" aria-hidden="true" className={className} fill="none">
      <ellipse cx="180" cy="164" rx="150" ry="10" fill="var(--secondary)" />

      {/* "4" left */}
      <path d="M70 128V40L22 106h66" stroke="var(--foreground)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      {/* "4" right */}
      <path d="M318 128V40l-48 66h66" stroke="var(--foreground)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />

      {/* Gear as the "0" */}
      <g transform="translate(180 86)">
        {teeth.map((angle) => (
          <rect key={angle} x="-11" y="-66" width="22" height="24" rx="5" fill="var(--accent)" transform={`rotate(${angle})`} />
        ))}
        <circle r="50" fill="var(--accent)" />
        <circle r="24" fill="var(--card)" />
        <circle r="24" stroke="var(--foreground)" strokeOpacity="0.12" strokeWidth="2" />
      </g>

      {/* Wrench lying across the gear, its open-jaw head past the teeth */}
      <g transform="translate(180 86) rotate(-38)">
        <rect x="-80" y="-9" width="164" height="18" rx="9" fill="var(--foreground)" />
        <path d="M108.9 -7A22 22 0 1 0 108.9 7H95V-7Z" fill="var(--foreground)" />
        <circle cx="-68" cy="0" r="4.5" fill="var(--card)" />
      </g>

      {/* Sparks */}
      <g stroke="var(--warning)" strokeWidth="4" strokeLinecap="round">
        <path d="M284 22l10 -12" />
        <path d="M292 40l14 -4" />
        <path d="M108 30l-10 -12" />
      </g>
    </svg>
  );
}
