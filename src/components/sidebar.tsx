"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  Stethoscope,
  Users,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Calendar,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar() {
  const pathname = usePathname();
  // state to track if the mobile navigation drawer is open
  const [isOpen, setIsOpen] = useState(false);

  // state to track which submenus are expanded or collapsed
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true,
    patients: false,
    doctors: false,
    features: false,
    forms: false,
    apps: false,
    auth: false,
    misc: false,
    subCard: false,
    subUi: false,
    subIcons: false,
    subCustom: false,
    subComp: false,
    subForms: false,
    subTables: false,
    subCharts: false,
    subApps: false,
    subWidgets: false,
    subWidgetCustom: false,
    subWidgetMaps: false,
    subWidgetModals: false,
    subEcom: false,
    subSamples: false,
  });

  // toggles the visibility of sub-navigation menus
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* mobile top navigation bar shown only on smaller screens */}
      <header className="md:hidden flex h-14 w-full items-center justify-between border-b bg-card px-4 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0 rounded-full border border-[#22c55e]/20 bg-black h-8 w-8">
            <Image
              src="/assets/logo.png"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
              alt="AI-PHMS Logo"
            />
          </div>
          <div>
            <span className="text-base font-bold text-foreground font-mono block leading-tight">
              AI-Powered
            </span>
            <span className="text-xs text-muted-foreground font-mono block">
              Prescription &amp; Health Analytics MS
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* main desktop sidebar navigation drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        {/* application branding logo and title banner */}
        <div className="flex h-20 items-center px-5 border-b gap-3 shrink-0">
          <div className="flex items-center justify-center shrink-0 rounded-full border border-[#22c55e]/20 bg-black h-10 w-10">
            <Image
              src="/assets/logo.png"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              alt="AI-PHMS Logo"
            />
          </div>
          <div>
            <span className="text-base font-bold text-foreground block leading-tight font-mono">
              AI-Powered
            </span>
            <span className="text-xs text-muted-foreground font-mono block">
              Prescription &amp; Health Analytics MS
            </span>
          </div>
        </div>

        {/* scrollable navigation menu containing main app routes */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 select-none font-mono text-xs">
          {/* core system route navigation links */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Hospital Dashboard</span>
          </Link>

          <Link
            href="/patient"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/patient" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Activity className="h-4 w-4" />
            <span>Patient Portal (AI)</span>
          </Link>

          <Link
            href="/patients"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname.startsWith("/patients") ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Users className="h-4 w-4" />
            <span>Patients Directory</span>
          </Link>

          <Link
            href="/doctor"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/doctor" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Doctor Portal</span>
          </Link>

          <Link
            href="/doctors"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname.startsWith("/doctors") ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Doctors Directory</span>
          </Link>

          <Link
            href="/appointments"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/appointments" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </Link>

          <Link
            href="/reports"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/reports" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </Link>

          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/admin" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Lock className="h-4 w-4" />
            <span>Admin Portal</span>
          </Link>

          {/* category header for auth and policy pages */}
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-3 pt-4 pb-1">
            Account &amp; Policies
          </p>

          <Link
            href="/login"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/login" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Lock className="h-4 w-4" />
            <span>Login</span>
          </Link>

          <Link
            href="/register"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/register" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Lock className="h-4 w-4" />
            <span>Register</span>
          </Link>

          <Link
            href="/privacy"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/privacy" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Lock className="h-4 w-4" />
            <span>Privacy &amp; Security</span>
          </Link>

          <Link
            href="/terms"
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${pathname === "/terms" ? "bg-[#22c55e] text-white font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <FileText className="h-4 w-4" />
            <span>Terms &amp; Conditions</span>
          </Link>
        </nav>

        {/* sidebar footer containing decorative widgets and system options */}
        <div className="sidebar-widgets px-4 py-4 shrink-0 border-t space-y-4">
          {/* banner image displaying medical and heart monitoring graphics */}
          <div className="w-full flex justify-center items-center overflow-hidden border border-border bg-black">
            <img
              src="/assets/left-bottom.png"
              alt="Sidebar Analytics Panel"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* call-to-action widget redirecting patients to the scheduling portal */}
          <div className="p-4 bg-primary/10 border border-[#22c55e]/20 text-center rounded-none relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 bg-[#22c55e]/5 h-16 w-16 rotate-45 group-hover:scale-150 transition-all duration-300" />
            <div className="flex justify-center mb-2">
              <Sparkles className="h-7 w-7 text-[#22c55e] animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
              Make Appointment
            </h4>
            <Link
              href="/patient"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#22c55e] hover:underline mt-1.5 font-mono"
            >
              Best Health Care Here <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* copyright information at the bottom of the sidebar */}
          <div className="text-center text-[10px] text-muted-foreground font-mono leading-relaxed">
            <p className="font-bold text-foreground">AI-PHMS</p>
            <p>© 2026 All Rights Reserved</p>
          </div>
        </div>
      </aside>

      {/* backdrop overlay that dims the main content when mobile menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
