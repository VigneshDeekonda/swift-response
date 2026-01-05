import { useIncidents } from '@/context/IncidentContext';
import { IncidentCard } from './IncidentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RESOURCE_REQUIREMENTS } from '@/types/incident';
import { Building2, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function WardDashboard() {
  const { incidents, wardResources } = useIncidents();

  const wardIncidents = incidents.filter(
    (i) => i.assignedWard === 'Ward 1' && i.escalationLevel === 'WARD'
  );
  const escalatedIncidents = incidents.filter(
    (i) => i.assignedWard === 'Ward 1' && i.status === 'ESCALATED'
  );

  const newCount = wardIncidents.filter((i) => i.status === 'NEW').length;
  const inProgressCount = wardIncidents.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = wardIncidents.filter((i) => i.status === 'RESOLVED').length;

  const resourcePercentage =
    (wardResources.availableResources / wardResources.totalResources) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Ward Emergency Dashboard</h1>
            <p className="text-muted-foreground">{wardResources.wardName} Control Center</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Available Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{wardResources.availableResources}</span>
              <span className="text-muted-foreground">/ {wardResources.totalResources}</span>
            </div>
            <Progress value={resourcePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Resource allocation: LOW=1, MEDIUM=2, HIGH=3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              New Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-status-new">{newCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-status-progress">{inProgressCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-status-resolved">{resolvedCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Escalated Alert */}
      {escalatedIncidents.length > 0 && (
        <Card className="border-status-escalated border-2 bg-status-escalated/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-status-escalated animate-pulse" />
              <div>
                <p className="font-semibold text-status-escalated">
                  {escalatedIncidents.length} Incident(s) Automatically Escalated to City
                </p>
                <p className="text-sm text-muted-foreground">
                  These incidents required more resources than available at ward level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incidents Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Incidents</h2>
        {wardIncidents.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No incidents assigned to this ward</p>
            <p className="text-sm text-muted-foreground mt-1">
              New incidents will appear here when citizens report them
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wardIncidents
              .filter((i) => i.status !== 'RESOLVED')
              .sort((a, b) => {
                const statusOrder = { NEW: 0, IN_PROGRESS: 1, ESCALATED: 2, RESOLVED: 3 };
                return statusOrder[a.status] - statusOrder[b.status];
              })
              .map((incident) => (
                <IncidentCard key={incident.id} incident={incident} showActions />
              ))}
          </div>
        )}
      </div>

      {/* Resolved Incidents */}
      {resolvedCount > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-status-resolved" />
            Resolved Incidents
            <Badge variant="secondary">{resolvedCount}</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
            {wardIncidents
              .filter((i) => i.status === 'RESOLVED')
              .map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
