import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Incident, IncidentType, Severity, WardResources, RESOURCE_REQUIREMENTS } from '@/types/incident';

interface IncidentContextType {
  incidents: Incident[];
  wardResources: WardResources;
  reportIncident: (type: IncidentType, severity: Severity, latitude: number, longitude: number) => void;
  startHandling: (incidentId: string) => { success: boolean; escalated: boolean };
  resolveIncident: (incidentId: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

interface IncidentProviderProps {
  children: ReactNode;
}

export function IncidentProvider({ children }: IncidentProviderProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [wardResources, setWardResources] = useState<WardResources>({
    wardId: 'ward-1',
    wardName: 'Ward 1',
    availableResources: 2,
    totalResources: 5,
  });

  const reportIncident = useCallback((
    type: IncidentType,
    severity: Severity,
    latitude: number,
    longitude: number
  ) => {
    const newIncident: Incident = {
      id: generateId(),
      type,
      severity,
      latitude,
      longitude,
      status: 'NEW',
      escalationLevel: 'WARD',
      assignedWard: 'Ward 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setIncidents(prev => [...prev, newIncident]);
  }, []);

  const startHandling = useCallback((incidentId: string): { success: boolean; escalated: boolean } => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return { success: false, escalated: false };

    const requiredResources = RESOURCE_REQUIREMENTS[incident.severity];
    const hasEnoughResources = wardResources.availableResources >= requiredResources;

    if (hasEnoughResources) {
      // Allocate resources and set status to IN_PROGRESS
      setWardResources(prev => ({
        ...prev,
        availableResources: prev.availableResources - requiredResources,
      }));

      setIncidents(prev =>
        prev.map(i =>
          i.id === incidentId
            ? { ...i, status: 'IN_PROGRESS', updatedAt: new Date() }
            : i
        )
      );

      return { success: true, escalated: false };
    } else {
      // Automatically escalate to city
      setIncidents(prev =>
        prev.map(i =>
          i.id === incidentId
            ? {
                ...i,
                status: 'ESCALATED',
                escalationLevel: 'CITY',
                escalationReason: 'Insufficient ward resources',
                updatedAt: new Date(),
              }
            : i
        )
      );

      return { success: true, escalated: true };
    }
  }, [incidents, wardResources]);

  const resolveIncident = useCallback((incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident || incident.status !== 'IN_PROGRESS') return;

    const requiredResources = RESOURCE_REQUIREMENTS[incident.severity];

    // Release resources back
    setWardResources(prev => ({
      ...prev,
      availableResources: Math.min(prev.totalResources, prev.availableResources + requiredResources),
    }));

    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentId
          ? { ...i, status: 'RESOLVED', updatedAt: new Date() }
          : i
      )
    );
  }, [incidents]);

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        wardResources,
        reportIncident,
        startHandling,
        resolveIncident,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
