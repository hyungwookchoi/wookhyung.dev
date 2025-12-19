import type { ReactNode } from 'react';

interface DottedCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DottedCard({
  children,
  className = '',
  contentClassName = '',
}: DottedCardProps) {
  return (
    <div
      className={`relative bg-transparent border-2 border-dotted border-neutral-700 ${className}`}
    >
      <div className={`relative p-4 ${contentClassName}`}>{children}</div>
    </div>
  );
}
