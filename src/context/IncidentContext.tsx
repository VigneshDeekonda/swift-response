import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Incident, IncidentType, Severity, WardResources, RESOURCE_REQUIREMENTS, DEFAULT_WARDS } from '@/types/incident';
import { toast } from 'sonner';

interface EscalationEvent {
  incidentId: string;
  wardName: string;
  incidentType: IncidentType;
  severity: Severity;
  reason: string;
  timestamp: Date;
}

interface IncidentContextType {
  incidents: Incident[];
  wards: WardResources[];
  selectedWardId: string;
  setSelectedWardId: (wardId: string) => void;
  reportIncident: (type: IncidentType, severity: Severity, latitude: number, longitude: number, wardId?: string) => void;
  startHandling: (incidentId: string) => { success: boolean; escalated: boolean };
  resolveIncident: (incidentId: string) => void;
  getWardResources: (wardId: string) => WardResources | undefined;
  escalationEvents: EscalationEvent[];
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

interface IncidentProviderProps {
  children: ReactNode;
}

// Alert sound using Web Audio API
const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for alert sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Second beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.setValueAtTime(660, audioContext.currentTime);
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 200);
  } catch (e) {
    // Silently fail if audio is not available
    console.log('Audio not available');
  }
};

export function IncidentProvider({ children }: IncidentProviderProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [wards, setWards] = useState<WardResources[]>(DEFAULT_WARDS);
  const [selectedWardId, setSelectedWardId] = useState<string>('ward-1');
  const [escalationEvents, setEscalationEvents] = useState<EscalationEvent[]>([]);
  const prevIncidentsRef = useRef<Incident[]>([]);

  // Watch for escalation events
  useEffect(() => {
    const newEscalated = incidents.filter(
      i => i.status === 'ESCALATED' && 
      !prevIncidentsRef.current.find(prev => prev.id === i.id && prev.status === 'ESCALATED')
    );

    newEscalated.forEach(incident => {
      const event: EscalationEvent = {
        incidentId: incident.id,
        wardName: incident.assignedWard,
        incidentType: incident.type,
        severity: incident.severity,
        reason: incident.escalationReason || 'Insufficient ward resources',
        timestamp: new Date(),
      };
      
      setEscalationEvents(prev => [...prev, event]);
      
      // Play alert sound
      playAlertSound();
      
      // Show toast notification
      toast.error(`🚨 ESCALATION ALERT`, {
        description: `${incident.type} incident (${incident.severity}) from ${incident.assignedWard} escalated to City level. Reason: ${incident.escalationReason}`,
        duration: 8000,
      });
    });

    prevIncidentsRef.current = incidents;
  }, [incidents]);

  const reportIncident = useCallback((
    type: IncidentType,
    severity: Severity,
    latitude: number,
    longitude: number,
    wardId?: string
  ) => {
    const targetWardId = wardId || selectedWardId;
    const ward = wards.find(w => w.wardId === targetWardId);
    
    const newIncident: Incident = {
      id: generateId(),
      type,
      severity,
      latitude,
      longitude,
      status: 'NEW',
      escalationLevel: 'WARD',
      assignedWard: ward?.wardName || 'Ward 1 - Central',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setIncidents(prev => [...prev, newIncident]);
  }, [selectedWardId, wards]);

  const getWardResources = useCallback((wardId: string) => {
    return wards.find(w => w.wardId === wardId);
  }, [wards]);

  const startHandling = useCallback((incidentId: string): { success: boolean; escalated: boolean } => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return { success: false, escalated: false };

    const ward = wards.find(w => w.wardName === incident.assignedWard);
    if (!ward) return { success: false, escalated: false };

    const requiredResources = RESOURCE_REQUIREMENTS[incident.severity];
    const hasEnoughResources = ward.availableResources >= requiredResources;

    if (hasEnoughResources) {
      // Allocate resources and set status to IN_PROGRESS
      setWards(prev =>
        prev.map(w =>
          w.wardId === ward.wardId
            ? { ...w, availableResources: w.availableResources - requiredResources }
            : w
        )
      );

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
                escalationReason: `Insufficient ward resources (need ${requiredResources}, have ${ward.availableResources})`,
                updatedAt: new Date(),
              }
            : i
        )
      );

      return { success: true, escalated: true };
    }
  }, [incidents, wards]);

  const resolveIncident = useCallback((incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident || incident.status !== 'IN_PROGRESS') return;

    const ward = wards.find(w => w.wardName === incident.assignedWard);
    if (!ward) return;

    const requiredResources = RESOURCE_REQUIREMENTS[incident.severity];

    // Release resources back
    setWards(prev =>
      prev.map(w =>
        w.wardId === ward.wardId
          ? { ...w, availableResources: Math.min(w.totalResources, w.availableResources + requiredResources) }
          : w
      )
    );

    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentId
          ? { ...i, status: 'RESOLVED', updatedAt: new Date() }
          : i
      )
    );

    toast.success('Incident Resolved', {
      description: `Resources released back to ${ward.wardName}`,
    });
  }, [incidents, wards]);

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        wards,
        selectedWardId,
        setSelectedWardId,
        reportIncident,
        startHandling,
        resolveIncident,
        getWardResources,
        escalationEvents,
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
