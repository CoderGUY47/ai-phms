"use client";

import { useEffect, useState } from "react";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Heart,
  Activity,
  Sparkles,
  Terminal,
  User,
  Clock,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import extracted components
import BioDataChannels from "@/components/dashboard/BioDataChannels";
import NeuralAnatomyRadar from "@/components/dashboard/NeuralAnatomyRadar";
import CaloricPerformance from "@/components/dashboard/CaloricPerformance";
import TherapeuticEngine from "@/components/dashboard/TherapeuticEngine";
import DepartmentStatistics from "@/components/dashboard/DepartmentStatistics";
import LiveTriage from "@/components/dashboard/LiveTriage";
import PrescriptionIngestionFeed from "@/components/dashboard/PrescriptionIngestionFeed";

export default function Dashboard() {
  const { records, patients } = useMedicalRecords();
  const [selectedOrgan, setSelectedOrgan] = useState<string>("Lungs");
  const [isHoveredProgress, setIsHoveredProgress] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"composition" | "anatomy">("anatomy");

  // new interactive section states
  const [chartMode, setChartMode] = useState<"both" | "doctors" | "patients">("both");
  const [triageFilter, setTriageFilter] = useState<string>("All");
  const [searchScanQuery, setSearchScanQuery] = useState<string>("");

  // interactive calendar state
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(15);
  const [calendarMonth, setCalendarMonth] = useState<string>("June 2026");

  // states for dynamic api data
  const [bodyCompositionData, setBodyCompositionData] = useState<any[]>([]);
  const [caloriesStatsData, setCaloriesStatsData] = useState<any[]>([]);
  const [subTargetsData, setSubTargetsData] = useState<any[]>([]);
  const [deptStatsData, setDeptStatsData] = useState<any[]>([]);
  const [triageLogs, setTriageLogs] = useState<any[]>([]);
  const [prescriptionScanLogs, setPrescriptionScanLogs] = useState<any[]>([]);
  const [organsInfo, setOrgansInfo] = useState<any>({});

  // fetch data from api route handler using fetch().then()
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((resData) => {
        setBodyCompositionData(resData.bodyCompositionData || []);
        setCaloriesStatsData(resData.caloriesStatsData || []);
        setSubTargetsData(resData.subTargetsData || []);
        setDeptStatsData(resData.deptStatsData || []);
        setTriageLogs(resData.triageLogs || []);
        setPrescriptionScanLogs(resData.prescriptionScanLogs || []);
        setOrgansInfo(resData.organsInfo || {});
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  const handleMonthPrev = () => {
    if (calendarMonth === "June 2026") {
      setCalendarMonth("May 2026");
      setSelectedCalendarDay(1);
    } else if (calendarMonth === "July 2026") {
      setCalendarMonth("June 2026");
      setSelectedCalendarDay(15);
    }
  };

  const handleMonthNext = () => {
    if (calendarMonth === "June 2026") {
      setCalendarMonth("July 2026");
      setSelectedCalendarDay(1);
    } else if (calendarMonth === "May 2026") {
      setCalendarMonth("June 2026");
      setSelectedCalendarDay(15);
    }
  };

  const handleSelectToday = () => {
    setCalendarMonth("June 2026");
    setSelectedCalendarDay(15);
  };

  // helper to render correct number of days per month
  const getDaysArray = () => {
    if (calendarMonth === "May 2026") return [...Array(31)].map((_, i) => i + 1);
    if (calendarMonth === "July 2026") return [...Array(31)].map((_, i) => i + 1);
    return [...Array(30)].map((_, i) => i + 1); // june 2026
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 home-dashboard-page">
      
      {/* hud header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#22c55e]" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">AI-PHMS COMMAND CENTER</h1>
          </div>
          <p className="text-sm text-muted-foreground font-mono mt-1">Real-time physiological diagnostics & neural synthesis node.</p>
        </div>
        
        <div className="flex gap-2">
          {/* quick ai diagnostics confidence bar */}
          <div className="hidden lg:flex flex-col text-right justify-center border-l pl-4 border-muted">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">AI Processing Power</span>
            <span className="text-sm font-mono font-bold text-[#22c55e]">99.8% Sync Rate</span>
          </div>
          <Link href="/patient">
            <Button className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-medium text-xs font-mono px-4 h-10">
              + INGEST PRESCRIPTION
            </Button>
          </Link>
        </div>
      </div>

      {/* main grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* left columns (col span 9) */}
        <div className="xl:col-span-9 space-y-6">
          
          {/* top row: interactive vitals & hud anatomy scan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* high-tech organ status hud list */}
            <BioDataChannels
              organsInfo={organsInfo}
              selectedOrgan={selectedOrgan}
              setSelectedOrgan={setSelectedOrgan}
              setActiveTab={setActiveTab}
            />

            {/* neural anatomy screen using body.png */}
            <NeuralAnatomyRadar
              organsInfo={organsInfo}
              selectedOrgan={selectedOrgan}
              setSelectedOrgan={setSelectedOrgan}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bodyCompositionData={bodyCompositionData}
            />

          </div>

          {/* bottom row: calories stats chart & monthly progress panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* calories stats area chart */}
            <CaloricPerformance
              caloriesStatsData={caloriesStatsData}
            />

            {/* monthly progress widget with added sub-target breakdown features */}
            <TherapeuticEngine
              subTargetsData={subTargetsData}
              isHoveredProgress={isHoveredProgress}
              setIsHoveredProgress={setIsHoveredProgress}
            />

          </div>

          {/* new section 1: department statistics (interactive bar chart) & live triage queue */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* interactive bar chart card */}
            <DepartmentStatistics
              deptStatsData={deptStatsData}
              chartMode={chartMode}
              setChartMode={setChartMode}
            />

            {/* interactive live triage queue list */}
            <LiveTriage
              triageLogs={triageLogs}
              triageFilter={triageFilter}
              setTriageFilter={setTriageFilter}
            />

          </div>

          {/* new section 2: interactive prescription ingestion feed */}
          <PrescriptionIngestionFeed
            prescriptionScanLogs={prescriptionScanLogs}
            searchScanQuery={searchScanQuery}
            setSearchScanQuery={setSearchScanQuery}
          />

          {/* coded by antigravity credit section */}
          <Card className="border shadow-none rounded-none border-primary/20 bg-primary/5 p-5 font-mono flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#22c55e] text-white p-2 shrink-0">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground">SYSTEM LOG: CREATION PROVENANCE</h4>
                <p className="text-xs text-muted-foreground">
                  Designed & handcrafted with medical-grade precision by <span className="text-[#22c55e] font-extrabold">Antigravity</span> (Google DeepMind Team).
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-[#22c55e] font-bold border border-[#22c55e]/30 px-4 py-1.5 bg-[#22c55e]/15">
              <span>HUMAN-AI PAIR CODED</span>
            </div>
          </Card>

        </div>

        {/* right columns (col span 3) — calendar, profile and schedule list */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* active check-in patient profile */}
          <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
            <CardHeader className="p-3 pb-1 border-b flex flex-row items-center justify-between">
              <span className="text-[10px] font-mono text-[#22c55e] uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-ping" />
                Active Consultation
              </span>
              <Dialog>
                <DialogTrigger render={
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:bg-muted/40">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }>
                  <MoreHorizontal className="h-4 w-4" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[320px] rounded-none border border-border bg-card p-4 font-mono">
                  <DialogHeader>
                    <DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Manage Consultation
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button variant="outline" className="w-full text-xs rounded-none border-primary/20 hover:bg-primary/5 text-foreground flex items-center justify-center gap-1.5 h-8">
                      Edit Record
                    </Button>
                    <Button variant="destructive" className="w-full text-xs rounded-none flex items-center justify-center gap-1.5 h-8">
                      Delete Record
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-3 pt-3">
              <div className="flex items-center gap-3 mb-2.5">
                <Avatar className="h-12 w-12 rounded-none border border-[#22c55e]/30">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                    alt="Andrien Bertrand" 
                    className="rounded-none object-cover" 
                  />
                  <AvatarFallback className="bg-[#22c55e]/15 text-[#22c55e] font-bold text-base rounded-none">AB</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs font-bold text-foreground font-mono leading-tight">Andrien Bertrand</h4>
                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Last Checkin: 04 Jan 2026</p>
                </div>
              </div>
              
              <div className="space-y-1.5 text-xs font-mono bg-black/5 dark:bg-black/30 p-2.5 border border-muted/20">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground uppercase text-[9px] tracking-wide">Date</span>
                  <span className="font-bold text-foreground">15 Jun 2026</span>
                </div>
                <div className="flex justify-between items-center border-t border-muted/10 pt-1 py-0.5">
                  <span className="text-muted-foreground uppercase text-[9px] tracking-wide">Time</span>
                  <span className="font-bold text-foreground">11:45 AM</span>
                </div>
                <div className="flex justify-between items-center border-t border-muted/10 pt-1 py-0.5">
                  <span className="text-muted-foreground uppercase text-[9px] tracking-wide">Physician</span>
                  <span className="inline-block px-1.5 py-0.5 border border-[#22c55e]/30 text-[#22c55e] bg-[#22c55e]/5 font-bold text-[9px] rounded-none">
                    PROF. DR. MD. MAHBUBUR RAHMAN
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* calendar box */}
          <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4 font-mono">
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-muted" onClick={handleMonthPrev}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-muted" onClick={handleMonthNext}><ChevronRight className="h-4 w-4" /></Button>
                </div>
                <span className="font-extrabold text-sm text-foreground">{calendarMonth}</span>
                <div className="flex border text-[10px] font-bold">
                  <span className="bg-muted px-2 py-1 cursor-pointer hover:bg-muted/80" onClick={handleSelectToday}>Today</span>
                </div>
              </div>

              {/* calendar days */}
              <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 text-center text-xs font-mono">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="font-extrabold text-muted-foreground uppercase text-[10px]">{d}</div>
                ))}
                {calendarMonth === "June 2026" && <div className="text-muted-foreground/30 py-1.5">31</div>}
                {calendarMonth === "July 2026" && (
                  <>
                    <div className="text-muted-foreground/30 py-1.5">28</div>
                    <div className="text-muted-foreground/30 py-1.5">29</div>
                    <div className="text-muted-foreground/30 py-1.5">30</div>
                  </>
                )}
                {getDaysArray().map((day) => {
                  const isSelected = selectedCalendarDay === day;
                  const is15 = calendarMonth === "June 2026" && day === 15;
                  const is24 = calendarMonth === "June 2026" && day === 24;
                  const is8 = calendarMonth === "June 2026" && day === 8;
                  const hasSchedule = is15 || is24 || is8;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedCalendarDay(day)}
                      className={`py-1.5 cursor-pointer transition-all border relative flex flex-col items-center justify-center ${
                        isSelected 
                          ? "border-primary bg-primary/10 text-foreground font-bold" 
                          : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="block">{day}</span>
                      {hasSchedule && (
                        <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-none bg-[#22c55e]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* schedule list */}
          <div className="space-y-4 font-mono">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Schedules</h4>
              <span className="text-[10px] text-primary font-bold">Selected: {calendarMonth.split(" ")[0]} {selectedCalendarDay}</span>
            </div>

            {/* render schedule dynamically based on selectedcalendarday */}
            {calendarMonth === "June 2026" && selectedCalendarDay === 15 ? (
              <div className="bg-[#22c55e] text-white p-5 rounded-none space-y-3.5 shadow-sm border border-transparent animate-in fade-in duration-300">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4 shrink-0" />
                      Physiotherapy
                    </h4>
                    <div className="flex flex-col gap-1 text-xs opacity-90 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-white/80" />
                        15 June 2026
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 shrink-0 text-white/80" />
                        Dr. Anastasia Lindsey
                      </span>
                    </div>
                  </div>
                  <Link href="/doctor">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10 rounded-none">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-white/20 pt-3 space-y-2">
                  <h5 className="text-xs font-bold">Electrical transcutaneous nerve stimulation</h5>
                  <p className="text-xs opacity-90 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-white/80" />
                    08:00 - 09:00 AM
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white hover:underline cursor-pointer mt-3 font-semibold">
                    <Download className="h-4 w-4" /> Physiotherapy_report.pdf
                  </div>
                </div>
              </div>
            ) : calendarMonth === "June 2026" && selectedCalendarDay === 24 ? (
              <div className="bg-amber-500 text-white p-5 rounded-none space-y-3.5 shadow-sm border border-transparent animate-in fade-in duration-300">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4 shrink-0" />
                      Medical Checkup
                    </h4>
                    <div className="flex flex-col gap-1 text-xs opacity-90 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-white/80" />
                        24 June 2026
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 shrink-0 text-white/80" />
                        Dr. Minerva Tingey
                      </span>
                    </div>
                  </div>
                  <Link href="/doctor">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10 rounded-none">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-white/20 pt-3 space-y-2">
                  <h5 className="text-xs font-bold">Standard physiological vital signs scan</h5>
                  <p className="text-xs opacity-90 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-white/80" />
                    10:00 - 11:30 AM
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white hover:underline cursor-pointer mt-3 font-semibold">
                    <Download className="h-4 w-4" /> checkup_metrics.csv
                  </div>
                </div>
              </div>
            ) : calendarMonth === "June 2026" && selectedCalendarDay === 8 ? (
              <div className="bg-rose-500 text-white p-5 rounded-none space-y-3.5 shadow-sm border border-transparent animate-in fade-in duration-300">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="h-4 w-4 shrink-0" />
                      Heart Checkup
                    </h4>
                    <div className="flex flex-col gap-1 text-xs opacity-90 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-white/80" />
                        08 June 2026
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 shrink-0 text-white/80" />
                        Dr. Minerva Tingey
                      </span>
                    </div>
                  </div>
                  <Link href="/doctor">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10 rounded-none">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-white/20 pt-3 space-y-2">
                  <h5 className="text-xs font-bold">Sinus rhythm & echocardiogram telemetry review</h5>
                  <p className="text-xs opacity-90 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-white/80" />
                    02:00 - 03:00 PM
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white hover:underline cursor-pointer mt-3 font-semibold">
                    <Download className="h-4 w-4" /> ecg_telemetry_scan.pdf
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed p-6 text-center text-xs text-muted-foreground space-y-3 bg-card/40 animate-in fade-in duration-300">
                <p>No consultations scheduled for {calendarMonth.split(" ")[0]} {selectedCalendarDay}.</p>
                <Button size="sm" className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white rounded-none text-xs h-8 px-4 font-bold">
                  + Add Consultation
                </Button>
              </div>
            )}

            {/* list all general scheduled events for overview */}
            <div className="border-t pt-4 space-y-2">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">Month Events Quickview</span>
              
              <div 
                onClick={() => {
                  setCalendarMonth("June 2026");
                  setSelectedCalendarDay(8);
                }}
                className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  calendarMonth === "June 2026" && selectedCalendarDay === 8 ? "border-rose-500 bg-rose-500/5" : "bg-card hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-none border border-rose-500/30 bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Heart Checkup</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">08 June 2026 | Dr. Minerva</p>
                  </div>
                </div>
                <div className="text-rose-500 text-xs font-bold font-sans">~~v~~v~~</div>
              </div>

              <div 
                onClick={() => {
                  setCalendarMonth("June 2026");
                  setSelectedCalendarDay(15);
                }}
                className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  calendarMonth === "June 2026" && selectedCalendarDay === 15 ? "border-[#22c55e] bg-[#22c55e]/5" : "bg-card hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-none border border-[#22c55e]/30 bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Physiotherapy</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">15 June 2026 | Dr. Anastasia</p>
                  </div>
                </div>
                <div className="text-[#22c55e] text-xs font-bold font-sans">~~v~~v~~</div>
              </div>

              <div 
                onClick={() => {
                  setCalendarMonth("June 2026");
                  setSelectedCalendarDay(24);
                }}
                className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  calendarMonth === "June 2026" && selectedCalendarDay === 24 ? "border-amber-500 bg-amber-500/5" : "bg-card hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-none border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Medical Checkup</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">24 June 2026 | Dr. Minerva</p>
                  </div>
                </div>
                <div className="text-amber-500 text-xs font-bold font-sans">~~v~~v~~</div>
              </div>
            </div>

          </div>

          {/* quick health stats panel */}
          <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md font-mono">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">Today&apos;s Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Total Patients", value: "124", icon: "🧑‍🤝‍🧑", color: "#3b82f6" },
                { label: "Doctors On Duty", value: "12", icon: "🩺", color: "#22c55e" },
                { label: "Appointments", value: "38", icon: "📅", color: "#a855f7" },
                { label: "Scans Done", value: "5", icon: "📋", color: "#f59e0b" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 border border-border/60 bg-[#1f2937] text-white flex items-center gap-3 rounded-none">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-black/30 text-lg rounded-none">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-black leading-tight" style={{ color: stat.color }}>{stat.value}</span>
                    <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider mt-0.5 leading-tight">{stat.label}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* today's medicines checklist */}
          <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md font-mono">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">Today&apos;s Medicines</CardTitle>
              <CardDescription className="text-[10px] font-normal">Andrien Bertrand — active prescription</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {[
                { name: "Atorvastatin 20mg", time: "08:00 AM", done: true },
                { name: "Metformin 500mg", time: "01:00 PM", done: true },
                { name: "Losartan 50mg", time: "06:00 PM", done: false },
                { name: "Aspirin 75mg", time: "09:00 PM", done: false },
              ].map((med, i) => (
                <div key={i} className={`flex items-center justify-between p-2 border-b border-border/30 text-xs ${med.done ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 border flex-shrink-0 flex items-center justify-center ${med.done ? "bg-[#22c55e] border-[#22c55e]" : "border-muted-foreground"}`}>
                      {med.done && <span className="text-white text-[8px] font-black">✓</span>}
                    </div>
                    <span className={`font-semibold ${med.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{med.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{med.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
