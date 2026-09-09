interface MascotProps {
  size?: number;
  mood?: 'normal' | 'happy' | 'thinking' | 'cheer';
  className?: string;
}

export function Mascot({ size = 56, mood = 'normal', className = '' }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={`shrink-0 select-none ${className}`}
    >
      <ellipse cx="60" cy="110" rx="28" ry="5" fill="#33414E" opacity="0.08" />
      <g>
        {/* Pencil body */}
        <rect x="46" y="18" width="28" height="70" rx="6" fill="#F0A63E" />
        {/* Metal band / eraser holder */}
        <rect x="46" y="18" width="28" height="14" rx="6" fill="#FBD79A" />
        {/* Wood cone */}
        <polygon points="46,88 74,88 60,110" fill="#E8C79A" />
        {/* Lead tip at the very bottom */}
        <polygon points="54.5,101 65.5,101 60,110" fill="#33414E" />

        {/* Face background */}
        <circle cx="60" cy="52" r="17" fill="#FBF7EC" stroke="#33414E" strokeWidth="2.5" />

        {/* Eyes */}
        {mood === 'happy' ? (
          <>
            <path d="M50 51 Q54 46 58 51" stroke="#33414E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M62 51 Q66 46 70 51" stroke="#33414E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="53" cy="48" r="2.4" fill="#33414E" />
            <circle cx="67" cy="48" r="2.4" fill="#33414E" />
            <ellipse cx="50" cy="54" rx="2.5" ry="1.5" fill="#EE7A63" opacity="0.6" />
            <ellipse cx="70" cy="54" rx="2.5" ry="1.5" fill="#EE7A63" opacity="0.6" />
          </>
        ) : (
          <>
            <circle cx="54" cy="50" r="2.4" fill="#33414E" />
            <circle cx="66" cy="50" r="2.4" fill="#33414E" />
            <ellipse cx="50" cy="54" rx="2.5" ry="1.5" fill="#EE7A63" opacity="0.5" />
            <ellipse cx="70" cy="54" rx="2.5" ry="1.5" fill="#EE7A63" opacity="0.5" />
          </>
        )}

        {/* Mouth */}
        {mood === 'happy' || mood === 'cheer' ? (
          <path d="M52 56 Q60 66 68 56" stroke="#33414E" strokeWidth="2.4" fill="#EE7A63" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <path d="M56 59 Q60 57 64 59" stroke="#33414E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M53 58 Q60 64 67 58" stroke="#33414E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* Cheering arms */}
        {(mood === 'cheer' || mood === 'happy') && (
          <>
            <path d="M40 40 Q30 30 36 18" stroke="#33414E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M80 40 Q90 30 84 18" stroke="#33414E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
