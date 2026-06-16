import Link from "next/link";
import { Activity, LayoutDashboard, Stethoscope, Users } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="mr-8 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-primary">
            AI-PHMS
          </span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/patient"
              className="flex items-center space-x-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Users className="h-4 w-4" />
              <span>Patient Portal</span>
            </Link>
            <Link
              href="/doctor"
              className="flex items-center space-x-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Doctor Portal</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Portal</span>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
