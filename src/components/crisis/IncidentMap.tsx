import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIncidents } from '@/context/IncidentContext';
import { Badge } from '@/components/ui/badge';
import { Droplets, Flame, Mountain, Car } from 'lucide-react';

const INCIDENT_ICONS = {
  FLOOD: Droplets,
  FIRE: Flame,
  EARTHQUAKE: Mountain,
  ACCIDENT: Car,
};

const SEVERITY_COLORS = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-amber-500',
  HIGH: 'bg-red-500',
};

const STATUS_OPACITY = {
  NEW: 'opacity-100',
  IN_PROGRESS: 'opacity-80',
  ESCALATED: 'opacity-100 animate-pulse',
  RESOLVED: 'opacity-40',
};

// Simulated ward boundaries for the map
const WARD_BOUNDS = {
  minLat: 28.5,
  maxLat: 28.7,
  minLng: 77.1,
  maxLng: 77.3,
};

export function IncidentMap() {
  const { incidents } = useIncidents();

  // Convert lat/lng to SVG coordinates
  const mapIncidents = useMemo(() => {
    return incidents.map(incident => {
      const x = ((incident.longitude - WARD_BOUNDS.minLng) / (WARD_BOUNDS.maxLng - WARD_BOUNDS.minLng)) * 100;
      const y = ((WARD_BOUNDS.maxLat - incident.latitude) / (WARD_BOUNDS.maxLat - WARD_BOUNDS.minLat)) * 100;
      return { ...incident, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
    });
  }, [incidents]);

  // Calculate heat map density
  const heatmapData = useMemo(() => {
    const gridSize = 5;
    const grid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    
    incidents.forEach(incident => {
      const x = Math.floor(((incident.longitude - WARD_BOUNDS.minLng) / (WARD_BOUNDS.maxLng - WARD_BOUNDS.minLng)) * gridSize);
      const y = Math.floor(((WARD_BOUNDS.maxLat - incident.latitude) / (WARD_BOUNDS.maxLat - WARD_BOUNDS.minLat)) * gridSize);
      
      const clampedX = Math.max(0, Math.min(gridSize - 1, x));
      const clampedY = Math.max(0, Math.min(gridSize - 1, y));
      
      // Weight by severity
      const weight = incident.severity === 'HIGH' ? 3 : incident.severity === 'MEDIUM' ? 2 : 1;
      grid[clampedY][clampedX] += weight;
    });
    
    return grid;
  }, [incidents]);

  const maxDensity = useMemo(() => {
    return Math.max(1, ...heatmapData.flat());
  }, [heatmapData]);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const escalatedCount = incidents.filter(i => i.status === 'ESCALATED').length;

  return (
    <div className="space-y-6">
      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Low
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Medium
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            High
          </Badge>
          <Badge variant="outline" className="gap-1 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Escalated
          </Badge>
        </div>
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span>Active: {activeIncidents.length}</span>
          <span className="text-destructive font-medium">Escalated: {escalatedCount}</span>
        </div>
      </div>

      {/* Main Map */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Incident Locations - Ward 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-muted/30 rounded-lg border overflow-hidden">
            {/* Grid Background */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Heatmap Layer */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {heatmapData.map((row, y) =>
                row.map((density, x) => {
                  if (density === 0) return null;
                  const opacity = (density / maxDensity) * 0.4;
                  return (
                    <rect
                      key={`${x}-${y}`}
                      x={`${(x / 5) * 100}%`}
                      y={`${(y / 5) * 100}%`}
                      width="20%"
                      height="20%"
                      fill="hsl(0, 84%, 60%)"
                      opacity={opacity}
                    />
                  );
                })
              )}
            </svg>

            {/* Ward Boundaries */}
            <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-lg">
              <span className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Ward 1 Boundary
              </span>
            </div>

            {/* Incident Markers */}
            {mapIncidents.map(incident => {
              const Icon = INCIDENT_ICONS[incident.type];
              return (
                <div
                  key={incident.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${STATUS_OPACITY[incident.status]}`}
                  style={{ left: `${incident.x}%`, top: `${incident.y}%` }}
                >
                  <div
                    className={`relative p-2 rounded-full ${SEVERITY_COLORS[incident.severity]} shadow-lg cursor-pointer transition-transform hover:scale-125`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                    {incident.status === 'ESCALATED' && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                      </span>
                    )}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
                    <span className="text-[10px] bg-background/90 px-1 py-0.5 rounded border shadow-sm">
                      {incident.type}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {incidents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No incidents reported yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Density Heatmap Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Incident Density Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-1 aspect-[2/1]">
            {heatmapData.map((row, y) =>
              row.map((density, x) => {
                const intensity = density / maxDensity;
                return (
                  <div
                    key={`heat-${x}-${y}`}
                    className="rounded flex items-center justify-center text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: density > 0
                        ? `hsla(0, 84%, 60%, ${0.2 + intensity * 0.6})`
                        : 'hsl(var(--muted))',
                      color: intensity > 0.5 ? 'white' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {density > 0 ? density : '-'}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Low Density</span>
            <div className="flex gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: `hsla(0, 84%, 60%, ${intensity})` }}
                />
              ))}
            </div>
            <span>High Density</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
