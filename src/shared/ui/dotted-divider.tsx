interface DottedDividerProps {
  className?: string;
}

export function DottedDivider({ className = '' }: DottedDividerProps) {
  return (
    <div
      className={`relative h-px bg-[radial-gradient(circle,#404040_1px,transparent_1px)] bg-[length:8px_1px] bg-repeat-x ${className}`}
    />
  );
}
