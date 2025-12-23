interface DottedDividerProps {
  className?: string;
}

export function DottedDivider({ className = '' }: DottedDividerProps) {
  return (
    <div
      className={`relative h-px bg-size-[8px_1px] bg-repeat-x ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle, var(--border) 1px, transparent 1px)',
      }}
    />
  );
}
