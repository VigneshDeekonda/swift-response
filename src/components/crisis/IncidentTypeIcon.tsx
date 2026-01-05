import { IncidentType } from '@/types/incident';
import { Droplets, Flame, Mountain, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncidentTypeIconProps {
  type: IncidentType;
  className?: string;
}

const iconConfig: Record<IncidentType, { icon: React.ElementType; className: string; label: string }> = {
  FLOOD: {
    icon: Droplets,
    className: 'text-primary',
    label: 'Flood',
  },
  FIRE: {
    icon: Flame,
    className: 'text-status-escalated',
    label: 'Fire',
  },
  EARTHQUAKE: {
    icon: Mountain,
    className: 'text-severity-medium',
    label: 'Earthquake',
  },
  ACCIDENT: {
    icon: Car,
    className: 'text-secondary',
    label: 'Accident',
  },
};

export function IncidentTypeIcon({ type, className }: IncidentTypeIconProps) {
  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className={cn('h-5 w-5', config.className)} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
}
