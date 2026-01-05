import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncidentProvider } from '@/context/IncidentContext';
import { CrisisHeader } from '@/components/crisis/CrisisHeader';
import { CitizenReport } from '@/components/crisis/CitizenReport';
import { WardDashboard } from '@/components/crisis/WardDashboard';
import { CityDashboard } from '@/components/crisis/CityDashboard';
import { AnalyticsDashboard } from '@/components/crisis/AnalyticsDashboard';
import { IncidentMap } from '@/components/crisis/IncidentMap';
import { User, Building2, Landmark, BarChart3, Map } from 'lucide-react';

type Role = 'citizen' | 'ward' | 'city' | 'analytics' | 'map';

const Index = () => {
  const [activeRole, setActiveRole] = useState<Role>('citizen');

  return (
    <IncidentProvider>
      <div className="min-h-screen bg-background">
        <CrisisHeader />

        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as Role)}>
            <div className="mb-6">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 h-12">
                <TabsTrigger
                  value="citizen"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Citizen</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ward"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Ward</span>
                </TabsTrigger>
                <TabsTrigger
                  value="city"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Landmark className="h-4 w-4" />
                  <span className="hidden sm:inline">City</span>
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="citizen" className="mt-0">
              <CitizenReport />
            </TabsContent>

            <TabsContent value="ward" className="mt-0">
              <WardDashboard />
            </TabsContent>

            <TabsContent value="city" className="mt-0">
              <CityDashboard />
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <IncidentMap />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </main>

        {/* Demo Instructions */}
        <footer className="border-t bg-card mt-8">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl mx-auto">
              <h3 className="font-semibold text-sm mb-3">🎬 Quick Demo Flow</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>
                  <strong>Citizen tab:</strong> Report a HIGH severity incident (requires 3 resources)
                </li>
                <li>
                  <strong>Ward tab:</strong> Click "Start Handling" — system has only 2 resources
                </li>
                <li>
                  <strong>Observe:</strong> System automatically escalates to City level
                </li>
                <li>
                  <strong>City tab:</strong> View the escalated incident with the reason displayed
                </li>
                <li>
                  <strong>Map tab:</strong> Visualize incident locations with heatmap density
                </li>
                <li>
                  <strong>Analytics tab:</strong> Review trends, response times, and resource utilization
                </li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">
                💡 The automatic escalation demonstrates intelligent resource-aware decision making without manual intervention.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </IncidentProvider>
  );
};

export default Index;
