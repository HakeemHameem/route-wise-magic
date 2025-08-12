import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { initialDrivers, initialOrders, initialRoutes } from "@/lib/mockData";
import { runSimulation } from "@/lib/simulator";

export type Driver = {
  id: string;
  name: string;
  currentShiftHours: number; // today hours
  past7DayHours: number[]; // length 7
};

export type RouteItem = {
  id: string;
  distanceKm: number;
  traffic: "Low" | "Medium" | "High";
  baseTimeMin: number;
};

export type Order = {
  id: string;
  valueRs: number;
  routeId: string;
  deliveryTimestamp: string; // ISO
  assignedDriverId?: string;
  deliveredOnTime?: boolean;
};

export type KPI = {
  totalProfit: number;
  efficiencyScore: number; // 0-100
  onTime: number;
  late: number;
  fuelBase: number;
  fuelSurcharge: number;
};

export type SimulationInput = {
  availableDrivers: number;
  startTimeHHMM: string;
  maxHoursPerDriver: number;
};

type Ctx = {
  drivers: Driver[];
  routes: RouteItem[];
  orders: Order[];
  kpi: KPI;
  setDrivers: (d: Driver[]) => void;
  setRoutes: (r: RouteItem[]) => void;
  setOrders: (o: Order[]) => void;
  setKpi: (k: KPI) => void;
  runSim: (input: SimulationInput) => Promise<void>;
};

const DataContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "pm-data-v1";

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [kpi, setKpi] = useState<KPI>({ totalProfit: 0, efficiencyScore: 0, onTime: 0, late: 0, fuelBase: 0, fuelSurcharge: 0 });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDrivers(parsed.drivers ?? initialDrivers);
        setRoutes(parsed.routes ?? initialRoutes);
        setOrders(parsed.orders ?? initialOrders);
        setKpi(parsed.kpi ?? kpi);
      } catch {
        setDrivers(initialDrivers);
        setRoutes(initialRoutes);
        setOrders(initialOrders);
      }
    } else {
      setDrivers(initialDrivers);
      setRoutes(initialRoutes);
      setOrders(initialOrders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ drivers, routes, orders, kpi });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [drivers, routes, orders, kpi]);

  const runSim = async (input: SimulationInput) => {
    try {
      const result = await runSimulation({ input, drivers, routes, orders });
      setOrders(result.orders);
      setKpi(result.kpi);
      toast({ title: "Simulation complete", description: "KPIs updated in real-time." });
    } catch (e: any) {
      toast({ title: "Simulation failed", description: e?.message ?? "Unknown error" });
      throw e;
    }
  };

  const value = useMemo<Ctx>(() => ({ drivers, routes, orders, kpi, setDrivers, setRoutes, setOrders, setKpi, runSim }), [drivers, routes, orders, kpi]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
