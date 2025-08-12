import { useState } from "react";
import { useData, type Driver } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePageSEO } from "@/hooks/usePageSEO";

const Drivers = () => {
  usePageSEO({ title: "Drivers | Manage Drivers", description: "Create, update, and delete driver records." });
  const { drivers, setDrivers } = useData();
  const [form, setForm] = useState<Driver>({ id: "", name: "", currentShiftHours: 0, past7DayHours: [0,0,0,0,0,0,0] });

  const add = () => {
    if (!form.id || !form.name) return;
    setDrivers([...drivers, form]);
    setForm({ id: "", name: "", currentShiftHours: 0, past7DayHours: [0,0,0,0,0,0,0] });
  };
  const remove = (id: string) => setDrivers(drivers.filter((d) => d.id !== id));

  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Drivers</h1>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader><CardTitle>Add Driver</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-3">
          <div className="grid gap-1"><Label htmlFor="id">ID</Label><Input id="id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
          <div className="grid gap-1"><Label htmlFor="name">Name</Label><Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid gap-1"><Label htmlFor="hours">Shift Hours</Label><Input id="hours" type="number" value={form.currentShiftHours} onChange={(e) => setForm({ ...form, currentShiftHours: Number(e.target.value) })} /></div>
          <div className="flex items-end"><Button onClick={add}>Add</Button></div>
        </CardContent>
      </Card>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader><CardTitle>All Drivers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Shift Hours</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.currentShiftHours}</TableCell>
                  <TableCell className="text-right"><Button variant="destructive" onClick={() => remove(d.id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default Drivers;
