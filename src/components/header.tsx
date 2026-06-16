"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  SlidersHorizontal,
  Calendar,
  User,
  UserCheck,
  Check,
  UserRound,
  Stethoscope,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMedicalRecords, useDoctors } from "@/hooks/useMedicalRecords";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeDept, setActiveDept] = useState(searchParams.get("dept") || "All");
  const [activeGender, setActiveGender] = useState(searchParams.get("gender") || "All");
  const [activeAge, setActiveAge] = useState(searchParams.get("age") || "All");

  // autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { patients } = useMedicalRecords();
  const { doctors } = useDoctors();

  // build suggestions by filtering patients and doctors that match the typed query
  const q = searchQuery.trim().toLowerCase();
  const suggestedPatients = q
    ? patients
        .filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
        .slice(0, 5)
    : [];
  const suggestedDoctors = q
    ? doctors
        .filter((d) => d.name.toLowerCase().includes(q) || (d.specialty && d.specialty.toLowerCase().includes(q)))
        .slice(0, 4)
    : [];
  const totalSuggestions = suggestedPatients.length + suggestedDoctors.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setActiveIndex(-1);
    applyFilters(searchQuery, activeDept, activeGender, activeAge);
  };

  const applyFilters = (query: string, dept: string, gender: string, age: string) => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (dept !== "All") params.set("dept", dept);
    if (gender !== "All") params.set("gender", gender);
    if (age !== "All") params.set("age", age);

    if (pathname === "/") {
      router.push(`/doctor?${params.toString()}`);
    } else {
      router.push(`${pathname}?${params.toString()}`);
    }
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveDept("All");
    setActiveGender("All");
    setActiveAge("All");
    router.push(pathname);
    setShowFilters(false);
  };

  const handleSuggestionClick = (type: "patient" | "doctor", id: string, name: string) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    if (type === "patient") {
      setSearchQuery(id);
      router.push(`/doctor?search=${encodeURIComponent(id)}`);
    } else {
      setSearchQuery(name);
      router.push(`/doctors?search=${encodeURIComponent(name)}`);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <span className="text-primary font-bold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </span>
    );
  };

  return (
    <header className="hidden md:flex flex-col w-full border-b bg-card sticky top-0 z-40">
      <div className="flex h-24 w-full items-center justify-between px-8 py-4 gap-4">
        {/* search input with autocomplete */}
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-[900px] relative">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-[14px] h-5 w-5 text-muted-foreground pointer-events-none z-10" />
            <Input
              type="search"
              placeholder="Search patients, doctors, medical logs..."
              className="pl-11 pr-[130px] h-12 w-full bg-muted/40 text-base rounded-lg font-mono focus-visible:ring-1 focus-visible:ring-primary"
              style={{ border: "1px solid color-mix(in srgb, var(--primary) 60%, transparent)" }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.trim().length > 0);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSuggestions(true);
              }}
              autoComplete="off"
            />

            {/* absolute controls inside the input box on the right */}
            <div className="absolute right-1.5 top-2 flex items-center gap-1.5 z-20">
              {/* clear button - clears the search query */}
              {searchQuery && (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* dialog trigger button for advanced filters */}
              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-md transition-colors ${showFilters ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                    title="Advanced search filters"
                  />
                }>
                  <SlidersHorizontal className="h-4 w-4" />
                </DialogTrigger>

              <DialogContent style={{ width: "900px", maxWidth: "95vw" }} className="w-full rounded-xl font-mono border border-border bg-card/95 backdrop-blur-md p-6">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle className="text-base font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" /> Advanced Search Filters
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 text-sm">
                  {/* department / category filter */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                      <UserCheck className="h-4 w-4" /> Department
                    </h5>
                    <div className="flex flex-col gap-1.5">
                      {["All", "Cardiology", "Neurology", "Medicine", "Surgery"].map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => { setActiveDept(dept); }}
                          className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                            activeDept === dept ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <span>{dept}</span>
                          {activeDept === dept && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* gender filter */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                      <User className="h-4 w-4" /> Gender
                    </h5>
                    <div className="flex flex-col gap-1.5">
                      {["All", "Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => { setActiveGender(g); }}
                          className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                            activeGender === g ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <span>{g}</span>
                          {activeGender === g && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* age range filter */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                      <Calendar className="h-4 w-4" /> Age range
                    </h5>
                    <div className="flex flex-col gap-1.5">
                      {["All", "Under 30", "30 - 50", "Over 50"].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => { setActiveAge(a); }}
                          className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                            activeAge === a ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <span>{a}</span>
                          {activeAge === a && <Check className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* footer controls */}
                <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs text-muted-foreground text-center sm:text-left">
                    <span className="font-semibold text-foreground">Query matches:</span> {searchQuery ? `"${searchQuery}"` : "all reports"} | {activeDept} | {activeGender} | {activeAge}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 sm:flex-none rounded-lg text-sm text-destructive border-destructive/20 hover:bg-destructive/5 h-10 px-4"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 sm:flex-none rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm h-10 px-6"
                      onClick={() => applyFilters(searchQuery, activeDept, activeGender, activeAge)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Search button inside */}
            <Button type="submit" className="rounded-md bg-primary hover:bg-primary/90 h-8 px-3 text-primary-foreground text-xs font-semibold font-mono">
              Search
            </Button>
          </div>

            {/* ── AUTOCOMPLETE DROPDOWN ── */}
            {/* backdrop to close suggestions when clicking outside */}
            {showSuggestions && (
              <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
            )}

            {/* ── AUTOCOMPLETE DROPDOWN ── */}
            {showSuggestions && totalSuggestions > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden">

                {/* patients section */}
                {suggestedPatients.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                      <UserRound className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Patients</span>
                    </div>
                    {suggestedPatients.map((p, i) => {
                      const globalIdx = i;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                            activeIndex === globalIdx ? "bg-primary/10" : "hover:bg-muted/60"
                          }`}
                          onClick={() => handleSuggestionClick("patient", p.id, p.name)}
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <UserRound className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              {highlightMatch(p.name, searchQuery)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {highlightMatch(p.id, searchQuery)} · {p.gender} · Age {p.age}
                            </div>
                          </div>
                          <Badge
                            className={`text-[10px] px-2 py-0 h-5 shrink-0 ${
                              p.status === "Active"
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {p.status}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* separator */}
                {suggestedPatients.length > 0 && suggestedDoctors.length > 0 && (
                  <div className="mx-4 my-1 border-t border-border/50" />
                )}

                {/* doctors section */}
                {suggestedDoctors.length > 0 && (
                  <div>
                    <div className="px-4 pt-2 pb-1 flex items-center gap-2">
                      <Stethoscope className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Doctors</span>
                    </div>
                    {suggestedDoctors.map((d, i) => {
                      const globalIdx = suggestedPatients.length + i;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                            activeIndex === globalIdx ? "bg-primary/10" : "hover:bg-muted/60"
                          }`}
                          onClick={() => handleSuggestionClick("doctor", d.id, d.name)}
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Stethoscope className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              {highlightMatch(d.name, searchQuery)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {d.specialty} · {d.hospital}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* no results state */}
            {showSuggestions && searchQuery.trim().length > 0 && totalSuggestions === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4 flex items-center gap-3">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm text-foreground">No matches for <span className="font-semibold text-primary">&ldquo;{searchQuery}&rdquo;</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">Press Enter to run a full search</p>
                </div>
              </div>
            )}
          </div>

          {/* active filter chips */}
          {(activeDept !== "All" || activeGender !== "All" || activeAge !== "All") && (
            <div className="flex gap-2 items-center flex-wrap shrink-0">
              {activeDept !== "All" && (
                <button
                  type="button"
                  onClick={() => { setActiveDept("All"); applyFilters(searchQuery, "All", activeGender, activeAge); }}
                  className="px-2 py-0.5 text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all rounded-lg"
                >
                  {activeDept} ✕
                </button>
              )}
              {activeGender !== "All" && (
                <button
                  type="button"
                  onClick={() => { setActiveGender("All"); applyFilters(searchQuery, activeDept, "All", activeAge); }}
                  className="px-2 py-0.5 text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all rounded-lg"
                >
                  {activeGender} ✕
                </button>
              )}
              {activeAge !== "All" && (
                <button
                  type="button"
                  onClick={() => { setActiveAge("All"); applyFilters(searchQuery, activeDept, activeGender, "All"); }}
                  className="px-2 py-0.5 text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all rounded-lg"
                >
                  {activeAge} ✕
                </button>
              )}
            </div>
          )}

        </form>

        {/* right section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`relative hover:bg-muted rounded-lg h-11 w-11 ${showNotifications ? "bg-muted" : ""}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-6 w-6 text-muted-foreground" />
              <Badge className="absolute top-1 right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-destructive text-white border-2 border-card rounded-full">3</Badge>
            </Button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border p-4 shadow-xl z-50 rounded-xl font-mono">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="text-sm font-bold uppercase tracking-wider text-primary">Notifications</span>
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">3 New</Badge>
                  </div>
                  <div className="space-y-3 text-xs text-left">
                    <div className="border-l-2 border-red-500 pl-2.5 py-1 bg-red-500/5 rounded-r-lg">
                      <p className="font-bold text-foreground">Clinical Anomaly Warning</p>
                      <p className="text-muted-foreground mt-0.5 font-normal">LDL cholesterol elevated (138 mg/dL) for Rakibul Hasan.</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block font-normal">10 mins ago</span>
                    </div>
                    <div className="border-l-2 border-primary pl-2.5 py-1 bg-primary/5 rounded-r-lg">
                      <p className="font-bold text-foreground">AI Scanning Ingestion</p>
                      <p className="text-muted-foreground mt-0.5 font-normal">Scanned prescription (3).jpg successfully for Fatema Khanam.</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block font-normal">2 hours ago</span>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-2.5 py-1 bg-blue-500/5 rounded-r-lg">
                      <p className="font-bold text-foreground">Doctor Portal Update</p>
                      <p className="text-muted-foreground mt-0.5 font-normal">Dr. Farhan Hossain registered new prescription for Sabbir Ahmed.</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block font-normal">1 day ago</span>
                    </div>
                  </div>
                  <div className="border-t pt-2.5 mt-3 text-center">
                    <button
                      className="text-[11px] font-bold text-primary hover:underline"
                      onClick={() => setShowNotifications(false)}
                    >
                      Dismiss all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator orientation="vertical" className="h-10 mx-2" />

          <div className="flex items-center gap-3.5 cursor-pointer group">
            <div className="flex flex-col text-right">
              <span className="text-base font-semibold leading-tight group-hover:text-primary transition-colors font-mono">Prof. Dr. Md. Mahbubur Rahman</span>
              <span className="text-xs text-muted-foreground font-mono">Neurologist</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-primary/20 rounded-full">
              <AvatarImage src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80" alt="Prof. Dr. Md. Mahbubur Rahman" className="rounded-full" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm rounded-full">MR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

