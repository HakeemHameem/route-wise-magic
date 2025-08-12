import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageSEO } from "@/hooks/usePageSEO";

const Simulation = () => {
  usePageSEO({ title: "Simulation | Run Logistics Simulation", description: "Set inputs and run simulation to update KPIs in real-time." });
  const { runSim } = useData();
  const [availableDrivers, setAvailableDrivers] = useState(3);
  const [startTimeHHMM, setStartTime] = useState("09:00");
  const [maxHoursPerDriver, setMaxHours] = useState(8);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      await runSim({ availableDrivers, startTimeHHMM, maxHoursPerDriver });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Simulation</h1>
      <Card className="max-w-2xl shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Configure Inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="drivers">Available drivers</Label>
            <Input id="drivers" type="number" min={1} value={availableDrivers} onChange={(e) => setAvailableDrivers(Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start">Route start time</Label>
            <Input id="start" type="time" value={startTimeHHMM} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxh">Max hours/driver/day</Label>
            <Input id="maxh" type="number" min={1} max={12} value={maxHoursPerDriver} onChange={(e) => setMaxHours(Number(e.target.value))} />
          </div>
          <div className="flex items-end">
            <Button onClick={handleRun} disabled={loading}>{loading ? "Running..." : "Run Simulation"}</Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">Note: Backend endpoints will be connected once Supabase is enabled. This runs a local simulation.</p>
    </main>
  );
};

export default Simulation;
