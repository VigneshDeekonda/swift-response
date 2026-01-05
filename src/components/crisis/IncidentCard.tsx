import { Incident, RESOURCE_REQUIREMENTS } from '@/types/incident';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { IncidentTypeIcon } from './IncidentTypeIcon';
import { MapPin, AlertTriangle, Clock } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface IncidentCardProps {
  incident: Incident;
  showActions?: boolean;
  isEscalatedView?: boolean;
}

export function IncidentCard({ incident, showActions = false, isEscalatedView = false }: IncidentCardProps) {
  const { startHandling, resolveIncident, wardResources } = useIncidents();

  const handleStartHandling = () => {
    const requiredResources = RESOURCE_REQUIREMENTS[incident.severity];
    const result = startHandling(incident.id);

    if (result.escalated) {
      toast.error('Incident Automatically Escalated', {
        description: `Insufficient ward resources. Required: ${requiredResources}, Available: ${wardResources.availableResources}. Incident escalated to City level.`,
        duration: 5000,
      });
    } else if (result.success) {
      toast.success('Incident Handling Started', {
        description: `${requiredResources} resources allocated. Status updated to In Progress.`,
      });
    }
  };

  const handleResolve = () => {
    resolveIncident(incident.id);
    toast.success('Incident Resolved', {
      description: 'Resources have been released back to the ward.',
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        incident.status === 'ESCALATED' && 'border-status-escalated border-2 shadow-md',
        isEscalatedView && 'bg-status-escalated/5'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <IncidentTypeIcon type={incident.type} />
          <StatusBadge status={incident.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <SeverityBadge severity={incident.severity} />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(incident.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs">
            {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
          </span>
        </div>

        {incident.status === 'ESCALATED' && incident.escalationReason && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-status-escalated/10 border border-status-escalated/20">
            <AlertTriangle className="h-5 w-5 text-status-escalated flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-status-escalated">
                🚨 Automatically escalated to City
              </p>
              <p className="text-muted-foreground mt-1">
                Reason: {incident.escalationReason}
              </p>
            </div>
          </div>
        )}

        {showActions && (
          <div className="pt-2 border-t">
            {incident.status === 'NEW' && (
              <Button
                onClick={handleStartHandling}
                className="w-full"
                variant="default"
              >
                Start Handling
              </Button>
            )}
            {incident.status === 'IN_PROGRESS' && (
              <Button
                onClick={handleResolve}
                className="w-full bg-status-resolved hover:bg-status-resolved/90 text-status-resolved-foreground"
              >
                Resolve Incident
              </Button>
            )}
            {incident.status === 'ESCALATED' && (
              <div className="text-center text-sm text-muted-foreground py-2">
                Awaiting City-level response
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
