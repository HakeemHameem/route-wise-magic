import type { Driver, Order, RouteItem } from "@/context/DataContext";

export const initialDrivers: Driver[] = [
  { id: "D-001", name: "Aarav", currentShiftHours: 4, past7DayHours: [6, 7, 8, 4, 5, 7, 6] },
  { id: "D-002", name: "Isha", currentShiftHours: 6, past7DayHours: [5, 5, 7, 8, 6, 4, 5] },
  { id: "D-003", name: "Rohan", currentShiftHours: 2, past7DayHours: [8, 8, 8, 8, 7, 7, 6] },
];

export const initialRoutes: RouteItem[] = [
  { id: "R-101", distanceKm: 24, traffic: "Low", baseTimeMin: 45 },
  { id: "R-102", distanceKm: 18, traffic: "High", baseTimeMin: 50 },
  { id: "R-103", distanceKm: 40, traffic: "Medium", baseTimeMin: 70 },
];

export const initialOrders: Order[] = [
  { id: "O-9001", valueRs: 700, routeId: "R-101", deliveryTimestamp: new Date().toISOString() },
  { id: "O-9002", valueRs: 1200, routeId: "R-102", deliveryTimestamp: new Date().toISOString() },
  { id: "O-9003", valueRs: 400, routeId: "R-103", deliveryTimestamp: new Date().toISOString() },
  { id: "O-9004", valueRs: 1800, routeId: "R-103", deliveryTimestamp: new Date().toISOString() },
];
