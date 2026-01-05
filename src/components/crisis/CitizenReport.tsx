import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentType, Severity } from '@/types/incident';
import { toast } from 'sonner';
import { AlertCircle, MapPin, Send } from 'lucide-react';

export function CitizenReport() {
  const { reportIncident, wards, selectedWardId, setSelectedWardId } = useIncidents();
  const [incidentType, setIncidentType] = useState<IncidentType | ''>('');
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!incidentType || !severity || !latitude || !longitude) {
      toast.error('Please fill in all fields');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }

    reportIncident(incidentType, severity, lat, lng, selectedWardId);

    const selectedWard = wards.find(w => w.wardId === selectedWardId);
    toast.success('Incident Reported Successfully', {
      description: `Your incident has been forwarded to ${selectedWard?.wardName || 'the local ward'} for immediate attention.`,
      duration: 4000,
    });

    // Reset form
    setIncidentType('');
    setSeverity('');
    setLatitude('');
    setLongitude('');
  };

  const fillSampleLocation = () => {
    setLatitude('28.6139');
    setLongitude('77.2090');
    toast.info('Sample location filled (New Delhi)');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Report an Incident</CardTitle>
          </div>
          <CardDescription className="text-base">
            Help us respond faster by providing accurate incident details. Your report will be
            automatically routed to the nearest ward authority.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ward-select">Select Ward</Label>
              <Select
                value={selectedWardId}
                onValueChange={setSelectedWardId}
              >
                <SelectTrigger id="ward-select" className="bg-card">
                  <SelectValue placeholder="Select ward to report to" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {wards.map(ward => (
                    <SelectItem key={ward.wardId} value={ward.wardId}>
                      {ward.wardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type</Label>
              <Select
                value={incidentType}
                onValueChange={(value) => setIncidentType(value as IncidentType)}
              >
                <SelectTrigger id="incident-type" className="bg-card">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="FLOOD">🌊 Flood</SelectItem>
                  <SelectItem value="FIRE">🔥 Fire</SelectItem>
                  <SelectItem value="EARTHQUAKE">🏔️ Earthquake</SelectItem>
                  <SelectItem value="ACCIDENT">🚗 Accident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={severity}
                onValueChange={(value) => setSeverity(value as Severity)}
              >
                <SelectTrigger id="severity" className="bg-card">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="LOW">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-severity-low" />
                      Low - Minor incident, no immediate danger
                    </span>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-severity-medium" />
                      Medium - Requires attention within hours
                    </span>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-severity-high" />
                      High - Critical, immediate response needed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Location Coordinates</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillSampleLocation}
                  className="text-xs"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Use Sample Location
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm text-muted-foreground">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 28.6139"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm text-muted-foreground">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 77.2090"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="bg-card"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Send className="h-4 w-4 mr-2" />
              Submit Incident Report
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <h3 className="font-semibold text-sm mb-2">How it works:</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Your incident report is instantly routed to the selected ward</li>
          <li>Ward authorities assess and allocate resources</li>
          <li>If resources are insufficient, the system automatically escalates to City level</li>
          <li>You'll be notified once the incident is resolved</li>
        </ol>
      </div>
    </div>
  );
}
