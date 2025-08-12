import { useState } from "react";
import { useData, type RouteItem } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePageSEO } from "@/hooks/usePageSEO";

const RoutesPage = () => {
  usePageSEO({ title: "Routes | Manage Routes", description: "Create, update, and delete route definitions." });
  const { routes, setRoutes } = useData();
  const [form, setForm] = useState<RouteItem>({ id: "", distanceKm: 0, traffic: "Low", baseTimeMin: 0 });

  const add = () => {
    if (!form.id) return;
    setRoutes([...routes, form]);
    setForm({ id: "", distanceKm: 0, traffic: "Low", baseTimeMin: 0 });
  };
  const remove = (id: string) => setRoutes(routes.filter((r) => r.id !== id));

  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Routes</h1>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader><CardTitle>Add Route</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-5 gap-3">
          <div className="grid gap-1"><Label htmlFor="id">ID</Label><Input id="id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
          <div className="grid gap-1"><Label htmlFor="dist">Distance (km)</Label><Input id="dist" type="number" value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: Number(e.target.value) })} /></div>
          <div className="grid gap-1"><Label htmlFor="traffic">Traffic</Label><Input id="traffic" list="trafficOptions" value={form.traffic} onChange={(e) => setForm({ ...form, traffic: e.target.value as any })} />
            <datalist id="trafficOptions"><option>Low</option><option>Medium</option><option>High</option></datalist>
          </div>
          <div className="grid gap-1"><Label htmlFor="base">Base Time (min)</Label><Input id="base" type="number" value={form.baseTimeMin} onChange={(e) => setForm({ ...form, baseTimeMin: Number(e.target.value) })} /></div>
          <div className="flex items-end"><Button onClick={add}>Add</Button></div>
        </CardContent>
      </Card>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader><CardTitle>All Routes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Traffic</TableHead>
                <TableHead>Base Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.distanceKm} km</TableCell>
                  <TableCell>{r.traffic}</TableCell>
                  <TableCell>{r.baseTimeMin} min</TableCell>
                  <TableCell className="text-right"><Button variant="destructive" onClick={() => remove(r.id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default RoutesPage;
