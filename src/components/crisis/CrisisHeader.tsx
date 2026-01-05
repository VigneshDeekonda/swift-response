import { Shield } from 'lucide-react';

export function CrisisHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Smart City Crisis Response Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              Integrated Emergency Management & Automatic Escalation System
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
