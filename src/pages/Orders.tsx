import { useState } from "react";
import { useData, type Order } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePageSEO } from "@/hooks/usePageSEO";

const Orders = () => {
  usePageSEO({ title: "Orders | Manage Orders", description: "Create, update, and delete orders." });
  const { orders, setOrders } = useData();
  const [form, setForm] = useState<Order>({ id: "", valueRs: 0, routeId: "", deliveryTimestamp: new Date().toISOString() });

  const add = () => {
    if (!form.id || !form.routeId) return;
    setOrders([...orders, form]);
    setForm({ id: "", valueRs: 0, routeId: "", deliveryTimestamp: new Date().toISOString() });
  };
  const remove = (id: string) => setOrders(orders.filter((o) => o.id !== id));

  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader><CardTitle>Add Order</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-5 gap-3">
          <div className="grid gap-1"><Label htmlFor="id">ID</Label><Input id="id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
          <div className="grid gap-1"><Label htmlFor="val">Value (₹)</Label><Input id="val" type="number" value={form.valueRs} onChange={(e) => setForm({ ...form, valueRs: Number(e.target.value) })} /></div>
          <div className="grid gap-1"><Label htmlFor="route">Route ID</Label><Input id="route" value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} /></div>
          <div className="grid gap-1"><Label htmlFor="ts">Delivery Timestamp</Label><Input id="ts" type="datetime-local" value={new Date(form.deliveryTimestamp).toISOString().slice(0,16)} onChange={(e) => setForm({ ...form, deliveryTimestamp: new Date(e.target.value).toISOString() })} /></div>
          <div className="flex items-end"><Button onClick={add}>Add</Button></div>
        </CardContent>
      </Card>
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader><CardTitle>All Orders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>₹{o.valueRs}</TableCell>
                  <TableCell>{o.routeId}</TableCell>
                  <TableCell>{o.deliveredOnTime == null ? "-" : o.deliveredOnTime ? "On-Time" : "Late"}</TableCell>
                  <TableCell className="text-right"><Button variant="destructive" onClick={() => remove(o.id)}>Delete</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default Orders;
