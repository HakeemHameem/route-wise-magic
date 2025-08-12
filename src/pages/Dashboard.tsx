import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnTimeLateChart } from "@/components/charts/OnTimeLateChart";
import { FuelCostChart } from "@/components/charts/FuelCostChart";
import { usePageSEO } from "@/hooks/usePageSEO";

const KPIStat = ({ label, value }: { label: string; value: string }) => (
  <Card className="shadow-[var(--shadow-soft)]">
    <CardHeader>
      <CardTitle>{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  usePageSEO({ title: "Dashboard | Logistics KPIs", description: "View total profit, efficiency, on-time vs late deliveries, and fuel cost breakdown." });
  const { kpi } = useData();
  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Logistics Dashboard</h1>
      <section className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <KPIStat label="Total Profit" value={`₹${kpi.totalProfit.toLocaleString()}`} />
        <KPIStat label="Efficiency Score" value={`${kpi.efficiencyScore}%`} />
        <KPIStat label="Deliveries" value={`${kpi.onTime + kpi.late} total`} />
      </section>
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <OnTimeLateChart onTime={kpi.onTime} late={kpi.late} />
        <FuelCostChart base={kpi.fuelBase} surcharge={kpi.fuelSurcharge} />
      </section>
    </main>
  );
};

export default Dashboard;
