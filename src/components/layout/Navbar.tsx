import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/simulation", label: "Simulation" },
  { to: "/drivers", label: "Drivers" },
  { to: "/routes", label: "Routes" },
  { to: "/orders", label: "Orders" },
];

const NavLinks = () => (
  <nav className="flex items-center gap-2">
    {navItems.map((n) => (
      <NavLink
        key={n.to}
        to={n.to}
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm transition-colors ${
            isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-accent hover:text-accent-foreground"
          }`
        }
      >
        {n.label}
      </NavLink>
    ))}
  </nav>
);

const Navbar = () => {
  const isMobile = useIsMobile();
  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/80 border-b border-border">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/dashboard" className="font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
          Purple Merit
        </Link>
        {!isMobile ? (
          <div className="flex items-center gap-3">
            <NavLinks />
            <Button variant="default">Run Simulation</Button>
          </div>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="py-4">
                <Link to="/dashboard" className="font-semibold tracking-tight">Purple Merit</Link>
              </div>
              <Separator />
              <div className="py-4 flex flex-col gap-1">
                {navItems.map((n) => (
                  <NavLink key={n.to} to={n.to} className={({ isActive }) => `px-3 py-2 rounded-md ${isActive ? "bg-secondary" : "hover:bg-accent"}`}>{n.label}</NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Navbar;
