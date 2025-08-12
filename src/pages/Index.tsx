import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="min-h-[60vh] container flex items-center justify-center text-center">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold">Logistics Simulation Dashboard</h1>
        <p className="text-lg text-muted-foreground">Track profit, efficiency, deliveries, and fuel costs. Run simulations and manage drivers, routes, and orders.</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild><Link to="/dashboard">View Dashboard</Link></Button>
          <Button asChild variant="secondary"><Link to="/simulation">Run Simulation</Link></Button>
        </div>
      </div>
    </main>
  );
};

export default Index;
