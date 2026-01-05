import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIncidents } from '@/context/IncidentContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp, Clock, Users, AlertTriangle } from 'lucide-react';

export function AnalyticsDashboard() {
  const { incidents, wardResources } = useIncidents();

  const stats = useMemo(() => {
    const total = incidents.length;
    const escalated = incidents.filter(i => i.status === 'ESCALATED').length;
    const resolved = incidents.filter(i => i.status === 'RESOLVED').length;
    const inProgress = incidents.filter(i => i.status === 'IN_PROGRESS').length;
    const escalationRate = total > 0 ? ((escalated / total) * 100).toFixed(1) : '0';
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';

    return { total, escalated, resolved, inProgress, escalationRate, resolutionRate };
  }, [incidents]);

  const incidentsByType = useMemo(() => {
    const counts: Record<string, number> = { FLOOD: 0, FIRE: 0, EARTHQUAKE: 0, ACCIDENT: 0 };
    incidents.forEach(i => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  const incidentsBySeverity = useMemo(() => {
    const counts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    incidents.forEach(i => {
      counts[i.severity] = (counts[i.severity] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = { NEW: 0, IN_PROGRESS: 0, ESCALATED: 0, RESOLVED: 0 };
    incidents.forEach(i => {
      counts[i.status] = (counts[i.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  const resourceUtilization = useMemo(() => {
    const used = wardResources.totalResources - wardResources.availableResources;
    return [
      { name: 'Used', value: used },
      { name: 'Available', value: wardResources.availableResources },
    ];
  }, [wardResources]);

  const COLORS = {
    type: ['hsl(200, 80%, 50%)', 'hsl(15, 90%, 55%)', 'hsl(45, 85%, 50%)', 'hsl(280, 70%, 55%)'],
    severity: ['hsl(142, 76%, 36%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)'],
    status: ['hsl(217, 91%, 60%)', 'hsl(32, 95%, 44%)', 'hsl(0, 84%, 60%)', 'hsl(142, 76%, 36%)'],
    resource: ['hsl(0, 84%, 60%)', 'hsl(142, 76%, 36%)'],
  };

  // Simulated response time data based on severity
  const responseTimeData = useMemo(() => {
    return [
      { severity: 'LOW', avgTime: 15, target: 20 },
      { severity: 'MEDIUM', avgTime: 25, target: 15 },
      { severity: 'HIGH', avgTime: 8, target: 5 },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.escalationRate}%</p>
                <p className="text-xs text-muted-foreground">Escalation Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resolutionRate}%</p>
                <p className="text-xs text-muted-foreground">Resolution Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {wardResources.availableResources}/{wardResources.totalResources}
                </p>
                <p className="text-xs text-muted-foreground">Resources Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentsByType}>
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
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {incidentsByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.type[index % COLORS.type.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentsBySeverity}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    labelLine={false}
                  >
                    {incidentsBySeverity.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.severity[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time vs Target (mins)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="severity" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    name="Avg Response"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceUtilization}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {resourceUtilization.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.resource[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Incident Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {statusDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.status[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
