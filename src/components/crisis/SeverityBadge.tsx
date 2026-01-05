import { Severity } from '@/types/incident';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  LOW: {
    label: 'Low',
    className: 'bg-severity-low/20 text-severity-low border border-severity-low/30',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-severity-medium/20 text-severity-medium border border-severity-medium/30',
  },
  HIGH: {
    label: 'High',
    className: 'bg-severity-high/20 text-severity-high border border-severity-high/30',
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
