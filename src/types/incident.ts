export type IncidentType = 'FLOOD' | 'FIRE' | 'EARTHQUAKE' | 'ACCIDENT';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';
export type IncidentStatus = 'NEW' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED';
export type EscalationLevel = 'WARD' | 'CITY';

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  escalationLevel: EscalationLevel;
  escalationReason?: string;
  assignedWard: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WardResources {
  wardId: string;
  wardName: string;
  availableResources: number;
  totalResources: number;
  color: string;
}

// Resource requirements based on severity
export const RESOURCE_REQUIREMENTS: Record<Severity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Default wards configuration
export const DEFAULT_WARDS: WardResources[] = [
  { wardId: 'ward-1', wardName: 'Ward 1 - Central', availableResources: 2, totalResources: 5, color: 'hsl(158, 64%, 40%)' },
  { wardId: 'ward-2', wardName: 'Ward 2 - North', availableResources: 4, totalResources: 6, color: 'hsl(200, 80%, 50%)' },
  { wardId: 'ward-3', wardName: 'Ward 3 - South', availableResources: 3, totalResources: 4, color: 'hsl(280, 70%, 55%)' },
  { wardId: 'ward-4', wardName: 'Ward 4 - East', availableResources: 5, totalResources: 7, color: 'hsl(45, 90%, 50%)' },
];
