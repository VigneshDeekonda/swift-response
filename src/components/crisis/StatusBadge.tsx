import { IncidentStatus } from '@/types/incident';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

const statusConfig: Record<IncidentStatus, { label: string; className: string }> = {
  NEW: {
    label: 'New',
    className: 'bg-status-new text-status-new-foreground',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-status-progress text-status-progress-foreground',
  },
  ESCALATED: {
    label: 'Escalated',
    className: 'bg-status-escalated text-status-escalated-foreground animate-pulse',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-status-resolved text-status-resolved-foreground',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
