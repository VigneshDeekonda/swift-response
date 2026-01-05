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
}

// Resource requirements based on severity
export const RESOURCE_REQUIREMENTS: Record<Severity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};
