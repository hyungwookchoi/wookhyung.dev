import { ClaudeIcon } from '@/shared/icon/claude-icon';
import { cn } from '@/shared/lib/tailwind-merge';

interface WithClaudeBadgeProps {
  className?: string;
}

export function WithClaudeBadge({ className }: WithClaudeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5',
        'text-[10px] font-medium',
        'bg-gradient-to-r from-orange-500/20 to-amber-500/20',
        'text-orange-300 rounded border border-orange-500/30',
        className,
      )}
    >
      with Claude
      <ClaudeIcon className="w-3 h-3" />
    </span>
  );
}
