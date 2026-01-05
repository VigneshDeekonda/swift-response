import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useIncidents } from '@/context/IncidentContext';
import { Building2, Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function WardComparison() {
  const { wards, incidents } = useIncidents();

  const wardStats = wards.map(ward => {
    const wardIncidents = incidents.filter(i => i.assignedWard === ward.wardName);
    const activeIncidents = wardIncidents.filter(i => i.status !== 'RESOLVED');
    const escalatedCount = wardIncidents.filter(i => i.status === 'ESCALATED').length;
    const resolvedCount = wardIncidents.filter(i => i.status === 'RESOLVED').length;
    const utilizationRate = ((ward.totalResources - ward.availableResources) / ward.totalResources) * 100;
    
    return {
      ...ward,
      activeIncidents: activeIncidents.length,
      escalatedCount,
      resolvedCount,
      totalIncidents: wardIncidents.length,
      utilizationRate,
    };
  });

  const chartData = wardStats.map(w => ({
    name: w.wardName.split(' - ')[1] || w.wardName,
    available: w.availableResources,
    used: w.totalResources - w.availableResources,
    total: w.totalResources,
    color: w.color,
  }));

  const incidentChartData = wardStats.map(w => ({
    name: w.wardName.split(' - ')[1] || w.wardName,
    active: w.activeIncidents,
    escalated: w.escalatedCount,
    resolved: w.resolvedCount,
    color: w.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Multi-Ward Resource Overview</h1>
          <p className="text-muted-foreground">Compare resource utilization across all wards</p>
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wardStats.map(ward => (
          <Card 
            key={ward.wardId} 
            className="relative overflow-hidden"
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1" 
              style={{ backgroundColor: ward.color }}
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {ward.wardName}
                {ward.escalatedCount > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {ward.escalatedCount} Escalated
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resources */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Resources
                  </span>
                  <span className="font-semibold">
                    {ward.availableResources}/{ward.totalResources}
                  </span>
                </div>
                <Progress 
                  value={(ward.availableResources / ward.totalResources) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {ward.utilizationRate.toFixed(0)}% utilized
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <AlertTriangle className="h-4 w-4 mx-auto text-status-progress mb-1" />
                  <p className="text-lg font-bold">{ward.activeIncidents}</p>
                  <p className="text-[10px] text-muted-foreground">Active</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <TrendingUp className="h-4 w-4 mx-auto text-status-escalated mb-1" />
                  <p className="text-lg font-bold">{ward.escalatedCount}</p>
                  <p className="text-[10px] text-muted-foreground">Escalated</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <CheckCircle className="h-4 w-4 mx-auto text-status-resolved mb-1" />
                  <p className="text-lg font-bold">{ward.resolvedCount}</p>
                  <p className="text-[10px] text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resource Availability by Ward</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="available" stackId="a" name="Available" fill="hsl(158, 64%, 45%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="used" stackId="a" name="In Use" fill="hsl(0, 70%, 55%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incident Distribution by Ward</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="active" name="Active" fill="hsl(45, 90%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="escalated" name="Escalated" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="hsl(158, 64%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City-wide Summary */}
      <Card className="bg-sidebar text-sidebar-foreground">
        <CardHeader>
          <CardTitle className="text-lg">City-Wide Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-sidebar-accent/30">
              <p className="text-3xl font-bold">{wards.length}</p>
              <p className="text-sm text-sidebar-foreground/70">Total Wards</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-sidebar-accent/30">
              <p className="text-3xl font-bold">
                {wards.reduce((acc, w) => acc + w.availableResources, 0)}
              </p>
              <p className="text-sm text-sidebar-foreground/70">Available Resources</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-sidebar-accent/30">
              <p className="text-3xl font-bold">
                {wards.reduce((acc, w) => acc + w.totalResources, 0)}
              </p>
              <p className="text-sm text-sidebar-foreground/70">Total Resources</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-sidebar-accent/30">
              <p className="text-3xl font-bold">{incidents.filter(i => i.status !== 'RESOLVED').length}</p>
              <p className="text-sm text-sidebar-foreground/70">Active Incidents</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-sidebar-accent/30">
              <p className="text-3xl font-bold text-status-escalated">
                {incidents.filter(i => i.status === 'ESCALATED').length}
              </p>
              <p className="text-sm text-sidebar-foreground/70">Escalated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
