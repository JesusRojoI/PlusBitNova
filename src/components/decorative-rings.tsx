interface DecorativeRingsProps {
  className?: string;
}

/** Faint concentric arc rings used as hero background decoration. */
export function DecorativeRings({ className }: DecorativeRingsProps) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <circle
          key={i}
          cx="430"
          cy="150"
          r={60 + i * 52}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={0.55 - i * 0.06}
        />
      ))}
    </svg>
  );
}
