import { useIncidents } from '@/context/IncidentContext';
import { IncidentCard } from './IncidentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, AlertTriangle, ArrowUpCircle, Shield } from 'lucide-react';

export function CityDashboard() {
  const { incidents } = useIncidents();

  const escalatedIncidents = incidents.filter((i) => i.status === 'ESCALATED');
  const allEscalatedCount = incidents.filter((i) => i.escalationLevel === 'CITY').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Landmark className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">City Emergency Control Room</h1>
            <p className="text-muted-foreground">Central Command & Escalation Management</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Automatic Escalation System Active</p>
              <p className="text-sm text-muted-foreground mt-1">
                Incidents are automatically escalated here when ward-level resources are insufficient.
                This ensures no critical incident goes unattended due to local resource constraints.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-status-escalated" />
              Active Escalated Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold text-status-escalated">
              {escalatedIncidents.length}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Total City-Level Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{allEscalatedCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Escalated Incidents */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-status-escalated" />
          Escalated Incidents Requiring City Response
        </h2>
        {escalatedIncidents.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-status-resolved/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-status-resolved" />
              </div>
              <div>
                <p className="text-lg font-medium">All Clear</p>
                <p className="text-muted-foreground mt-1">
                  No escalated incidents at this time
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ward-level resources are handling all current incidents
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {escalatedIncidents
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((incident) => (
                <IncidentCard key={incident.id} incident={incident} isEscalatedView />
              ))}
          </div>
        )}
      </div>

      {/* System Flow Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Automatic Escalation Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-status-new/20 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-status-new">1</span>
              </div>
              <p className="font-medium">Citizen Reports</p>
              <p className="text-muted-foreground text-xs mt-1">
                Incident submitted with severity level
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-status-progress/20 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-status-progress">2</span>
              </div>
              <p className="font-medium">Ward Assessment</p>
              <p className="text-muted-foreground text-xs mt-1">
                System checks available resources
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-status-escalated/20 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-status-escalated">3</span>
              </div>
              <p className="font-medium">Auto-Escalation</p>
              <p className="text-muted-foreground text-xs mt-1">
                If resources insufficient, escalates to City
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-status-resolved/20 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-status-resolved">4</span>
              </div>
              <p className="font-medium">City Response</p>
              <p className="text-muted-foreground text-xs mt-1">
                City allocates additional resources
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
