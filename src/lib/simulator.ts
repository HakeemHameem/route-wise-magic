import type { Driver, KPI, Order, RouteItem, SimulationInput } from "@/context/DataContext";

export function runSimulation({ input, drivers, routes, orders }: { input: SimulationInput; drivers: Driver[]; routes: RouteItem[]; orders: Order[]; }): Promise<{ orders: Order[]; kpi: KPI; }> {
  return new Promise((resolve, reject) => {
    const { availableDrivers, startTimeHHMM, maxHoursPerDriver } = input;

    // Basic validations akin to backend contract
    if (availableDrivers <= 0) return reject(new Error("availableDrivers must be > 0"));
    if (!/^\d{2}:\d{2}$/.test(startTimeHHMM)) return reject(new Error("startTime must be HH:MM"));
    if (maxHoursPerDriver <= 0 || maxHoursPerDriver > 12) return reject(new Error("maxHoursPerDriver must be between 1 and 12"));

    const driverPool = drivers.slice(0, availableDrivers);
    if (driverPool.length === 0) return reject(new Error("No available drivers"));

    // Apply fatigue rule to compute speed factor next day
    const fatigueMap = new Map<string, number>();
    driverPool.forEach((d) => {
      const today = d.currentShiftHours;
      const fatigued = today > 8;
      fatigueMap.set(d.id, fatigued ? 0.7 : 1);
    });

    // Map helpers
    const routeMap = new Map(routes.map((r) => [r.id, r]));

    // Reallocate orders to drivers in round-robin under max hours
    let driverIdx = 0;
    const updatedOrders: Order[] = orders.map((o) => ({ ...o }));
    const driverHours = new Map<string, number>(driverPool.map((d) => [d.id, 0]));

    updatedOrders.forEach((order) => {
      // pick next driver who has capacity
      let attempts = 0;
      let chosen: Driver | null = null;
      while (attempts < driverPool.length) {
        const candidate = driverPool[driverIdx % driverPool.length];
        driverIdx++;
        attempts++;
        const used = driverHours.get(candidate.id) || 0;
        if (used < maxHoursPerDriver) {
          chosen = candidate;
          break;
        }
      }
      if (!chosen) chosen = driverPool[0];
      order.assignedDriverId = chosen.id;

      const r = routeMap.get(order.routeId)!;
      const speedFactor = fatigueMap.get(chosen.id) ?? 1;
      const trafficMultiplier = r.traffic === "High" ? 1.25 : r.traffic === "Medium" ? 1.1 : 1;
      const actualTime = Math.ceil(r.baseTimeMin * speedFactor * trafficMultiplier);

      // Company rule: Late if > base + 10min
      const lateThreshold = r.baseTimeMin + 10;
      order.deliveredOnTime = actualTime <= lateThreshold;

      // Accumulate hours
      const newUsed = (driverHours.get(chosen.id) || 0) + actualTime / 60;
      driverHours.set(chosen.id, newUsed);
    });

    // Compute KPIs
    let onTime = 0, late = 0;
    let fuelBase = 0, fuelSurcharge = 0;
    let totalProfit = 0;

    updatedOrders.forEach((o) => {
      const r = routeMap.get(o.routeId)!;
      const base = r.distanceKm * 5; // ₹5/km
      const surcharge = r.traffic === "High" ? r.distanceKm * 2 : 0; // +₹2/km
      fuelBase += base;
      fuelSurcharge += surcharge;

      let penalty = 0;
      let bonus = 0;
      if (!o.deliveredOnTime) {
        late++;
        penalty += 50; // Late Delivery Penalty
      } else {
        onTime++;
        if (o.valueRs > 1000) bonus += o.valueRs * 0.1; // High-Value Bonus
      }
      totalProfit += o.valueRs + bonus - penalty - (base + surcharge);
    });

    const efficiencyScore = updatedOrders.length ? (onTime / updatedOrders.length) * 100 : 0;

    const kpi: KPI = { totalProfit: Math.round(totalProfit), efficiencyScore: Math.round(efficiencyScore), onTime, late, fuelBase: Math.round(fuelBase), fuelSurcharge: Math.round(fuelSurcharge) };

    // Simulate network latency and real-time updates
    setTimeout(() => resolve({ orders: updatedOrders, kpi }), 600);
  });
}
