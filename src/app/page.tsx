"use client";

import { useState } from "react";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Heart,
  Brain,
  CheckCircle2,
  Activity,
  Sparkles,
  Terminal,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

// data matching original html
const bodyCompositionData = [
  { name: "Oxygen", value: 45, color: "#22c55e" },
  { name: "Carbon", value: 20, color: "#f59e0b" },
  { name: "Hydrogen", value: 16, color: "#a855f7" },
  { name: "Nitrogen", value: 10, color: "#3b82f6" },
  { name: "Calcium", value: 7, color: "#ec4899" },
  { name: "Other", value: 5, color: "#10b981" },
];

const caloriesStatsData = [
  { month: "Jan", calories: 4.5 },
  { month: "Feb", calories: 8.2 },
  { month: "Mar", calories: 5.1 },
  { month: "Apr", calories: 7.8 },
  { month: "May", calories: 6.2 },
  { month: "Jun", calories: 9.0 },
  { month: "Jul", calories: 4.8 },
  { month: "Aug", calories: 7.1 },
  { month: "Sep", calories: 5.5 },
  { month: "Oct", calories: 8.5 },
  { month: "Nov", calories: 6.0 },
  { month: "Dec", calories: 7.5 },
];

const subTargetsData = [
  { name: "Dietary Plan", value: 80, color: "#22c55e" },
  { name: "Physical Exercise", value: 90, color: "#3b82f6" },
  { name: "Medication Adherence", value: 95, color: "#a855f7" },
  { name: "Sleep Quality Pattern", value: 75, color: "#f59e0b" },
  { name: "Hydration Intake", value: 85, color: "#06b6d4" },
  { name: "Mental Balance", value: 88, color: "#ec4899" },
];

const deptStatsData = [
  { name: "Cardiology", Doctors: 4, Patients: 32 },
  { name: "Neurology", Doctors: 3, Patients: 18 },
  { name: "Medicine", Doctors: 2, Patients: 45 },
  { name: "Surgery", Doctors: 3, Patients: 24 },
];

const triageLogs = [
  { id: "1", patient: "Rakibul Hasan", dept: "Cardiology", priority: "Emergency", time: "10:15 AM", status: "In Consultation" },
  { id: "2", patient: "Fatema Khanam", dept: "Medicine", priority: "Urgent", time: "11:00 AM", status: "Waiting" },
  { id: "3", patient: "Sabbir Ahmed", dept: "Neurology", priority: "Routine", time: "11:30 AM", status: "Completed" },
  { id: "4", patient: "Andrien Bertrand", dept: "Cardiology", priority: "Emergency", time: "11:45 AM", status: "In Consultation" },
  { id: "5", patient: "Hridoy Hossain", dept: "Surgery", priority: "Routine", time: "12:15 PM", status: "Waiting" },
];

const prescriptionScanLogs = [
  { id: "scan-101", name: "Ibn Sina Rx Scan #4920", patient: "Rakibul Hasan", parsedMeds: "Atorvastatin, Metformin", status: "Analyzed", matchRate: "98%" },
  { id: "scan-102", name: "Prescription Scan #4921", patient: "Fatema Khanam", parsedMeds: "Losartan, Omeprazole", status: "Analyzed", matchRate: "95%" },
  { id: "scan-103", name: "Rx Diagnostic #4922", patient: "Sabbir Ahmed", parsedMeds: "Gabapentin, Amitriptyline", status: "Review Required", matchRate: "88%" },
  { id: "scan-104", name: "Clinical Report #4923", patient: "Andrien Bertrand", parsedMeds: "Clopidogrel, Aspirin", status: "Analyzed", matchRate: "99%" },
  { id: "scan-105", name: "Ibn Sina Rx Scan #4924", patient: "Hridoy Hossain", parsedMeds: "Amoxicillin, Paracetamol", status: "Analyzed", matchRate: "94%" },
];

const organsInfo: Record<string, { percentage: number; color: string; desc: string; icon: string; status: string; aiDiagnosis: string }> = {
  Brain: { 
    percentage: 85, 
    color: "#a855f7", 
    desc: "Cognitive functions and neural reflex speeds are within normal variance.", 
    icon: "🧠", 
    status: "Optimal",
    aiDiagnosis: "AI Inference: Synaptic network transmission speed normal. 0 anomalies detected in frontal lobe pattern recognition."
  },
  Lungs: { 
    percentage: 90, 
    color: "#22c55e", 
    desc: "Respiratory volumes normal. Oxygen perfusion rate remains at 98%.", 
    icon: "🫁", 
    status: "Optimal",
    aiDiagnosis: "AI Inference: Clear pulmonary fields. Residual capacity measured at 3.2L. Respiration cycle depth nominal."
  },
  Heart: { 
    percentage: 89, 
    color: "#3b82f6", 
    desc: "Sinus rhythm stable. Ejection fraction recorded at 62%.", 
    icon: "❤️", 
    status: "Stable",
    aiDiagnosis: "AI Inference: QRS complex duration 94ms. Average stroke volume 70mL. Minimal valvular calcification detected."
  },
  Stomach: { 
    percentage: 99, 
    color: "#22c55e", 
    desc: "Digestion rates normal. Gastric secretions and motility are excellent.", 
    icon: "🥣", 
    status: "Excellent",
    aiDiagnosis: "AI Inference: Gastrointestinal motility index at 9.8. Microbial microbiome balance index stands at 94% optimal."
  },
  Liver: { 
    percentage: 95, 
    color: "#22c55e", 
    desc: "Hepatic enzymes optimal. Complete clearance and toxin filtration operational.", 
    icon: "🪵", 
    status: "Healthy",
    aiDiagnosis: "AI Inference: Alkaline phosphatase (ALP) at 68 U/L. Hepatic vascular perfusion rate stands at 1.2L/min."
  },
};

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
            <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#22c55e] font-mono flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-red-500 animate-pulse" /> BIO-DATA CHANNELS
                  </h4>
                  <span className="text-xs border border-primary/20 text-primary px-2 py-0.5 font-mono">ACTIVE SCAN</span>
                </div>
                
                {Object.keys(organsInfo).map((key) => {
                  const organ = organsInfo[key];
                  const isSelected = selectedOrgan === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedOrgan(key);
                        setActiveTab("anatomy");
                      }}
                      className={`w-full text-left p-2.5 transition-all flex items-center gap-2.5 border font-mono ${
                        isSelected ? "border-[#22c55e] bg-[#22c55e]/5" : "border-transparent hover:bg-muted/30"
                      }`}
                    >
                      <div className="h-8 w-8 bg-muted flex items-center justify-center text-xs shrink-0 rounded-none">{organ.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="tracking-wide">{key.toUpperCase()}</span>
                          <span className="text-[#22c55e]">{organ.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted h-1 rounded-none overflow-hidden">
                          <div className="bg-[#22c55e] h-full transition-all duration-500" style={{ width: `${organ.percentage}%` }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* neural anatomy screen using body.png */}
            <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-2">
              <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground font-mono">NEURAL ANATOMY RADAR</CardTitle>
                </div>
                {/* visual view toggles */}
                <div className="flex border text-xs font-bold font-mono">
                  <button
                    onClick={() => setActiveTab("anatomy")}
                    className={`px-3 py-1.5 transition-colors ${activeTab === "anatomy" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    ANATOMY RADAR
                  </button>
                  <button
                    onClick={() => setActiveTab("composition")}
                    className={`px-3 py-1.5 transition-colors ${activeTab === "composition" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    COMPOSITION
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 flex flex-col justify-between h-[390px]">
                {activeTab === "composition" ? (
                  <div className="flex flex-col justify-between h-full">
                    <div className="relative flex items-center justify-center" style={{ height: "220px" }}>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={bodyCompositionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {bodyCompositionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute text-center font-mono">
                        <p className="text-3xl font-black text-foreground font-sans">16%</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hydrogen</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground border-t pt-4 font-mono">
                      {bodyCompositionData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="h-3 w-3 shrink-0" style={{ backgroundColor: item.color }} />
                          <span>{item.value}% {item.name.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // advanced ai hud anatomy interface
                  <div className="grid grid-cols-12 gap-4 h-full items-center">
                    
                    {/* diagnostic outline body.png overlay */}
                    <div className="relative col-span-7 h-full w-full flex justify-center items-center bg-black border border-muted/20 overflow-hidden">
                      <img 
                        src="/assets/body.png" 
                        alt="Anatomical Body Outline" 
                        className="h-full max-h-[310px] object-contain transition-all py-2"
                      />

                      {/* interactive cybernetic medical pins */}
                      
                      {/* brain hotspot */}
                      <button
                        onClick={() => setSelectedOrgan("Brain")}
                        className="absolute top-[9%] left-[50%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
                      >
                        <span className={`absolute h-6 w-6 rounded-none bg-purple-500/25 ${selectedOrgan === "Brain" ? "animate-ping" : "opacity-0 group-hover:opacity-100"}`} />
                        <span className={`h-3 w-3 rounded-none border border-white transition-all ${selectedOrgan === "Brain" ? "bg-purple-500 scale-125 shadow-[0_0_8px_#a855f7]" : "bg-purple-300"}`} />
                      </button>
                      <div 
                        onClick={() => setSelectedOrgan("Brain")}
                        className={`absolute top-[8%] left-[62%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                          selectedOrgan === "Brain" ? "bg-purple-500 text-white border-purple-600 shadow-[0_0_8px_#a855f7]" : "bg-card text-muted-foreground border-muted"
                        }`}
                      >
                        BRAIN {organsInfo.Brain.percentage}%
                      </div>

                      {/* lungs hotspot */}
                      <button
                        onClick={() => setSelectedOrgan("Lungs")}
                        className="absolute top-[28%] left-[50%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
                      >
                        <span className={`absolute h-6 w-6 rounded-none bg-[#22c55e]/25 ${selectedOrgan === "Lungs" ? "animate-ping" : "opacity-0 group-hover:opacity-100"}`} />
                        <span className={`h-3 w-3 rounded-none border border-white transition-all ${selectedOrgan === "Lungs" ? "bg-[#22c55e] scale-125 shadow-[0_0_8px_#22c55e]" : "bg-emerald-300"}`} />
                      </button>
                      <div 
                        onClick={() => setSelectedOrgan("Lungs")}
                        className={`absolute top-[27%] left-[62%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                          selectedOrgan === "Lungs" ? "bg-[#22c55e] text-white border-[#22c55e] shadow-[0_0_8px_#22c55e]" : "bg-card text-muted-foreground border-muted"
                        }`}
                      >
                        LUNGS {organsInfo.Lungs.percentage}%
                      </div>

                      {/* heart hotspot */}
                      <button
                        onClick={() => setSelectedOrgan("Heart")}
                        className="absolute top-[32%] left-[44%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
                      >
                        <span className={`absolute h-6 w-6 rounded-none bg-blue-500/25 ${selectedOrgan === "Heart" ? "animate-ping" : "opacity-0 group-hover:opacity-100"}`} />
                        <span className={`h-3 w-3 rounded-none border border-white transition-all ${selectedOrgan === "Heart" ? "bg-blue-500 scale-125 shadow-[0_0_8px_#3b82f6]" : "bg-blue-300"}`} />
                      </button>
                      <div 
                        onClick={() => setSelectedOrgan("Heart")}
                        className={`absolute top-[31%] left-[16%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                          selectedOrgan === "Heart" ? "bg-blue-500 text-white border-blue-600 shadow-[0_0_8px_#3b82f6]" : "bg-card text-muted-foreground border-muted"
                        }`}
                      >
                        HEART {organsInfo.Heart.percentage}%
                      </div>

                      {/* stomach hotspot */}
                      <button
                        onClick={() => setSelectedOrgan("Stomach")}
                        className="absolute top-[43%] left-[50%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
                      >
                        <span className={`absolute h-6 w-6 rounded-none bg-rose-500/25 ${selectedOrgan === "Stomach" ? "animate-ping" : "opacity-0 group-hover:opacity-100"}`} />
                        <span className={`h-3 w-3 rounded-none border border-white transition-all ${selectedOrgan === "Stomach" ? "bg-rose-500 scale-125 shadow-[0_0_8px_#ef4444]" : "bg-rose-300"}`} />
                      </button>
                      <div 
                        onClick={() => setSelectedOrgan("Stomach")}
                        className={`absolute top-[44%] left-[62%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                          selectedOrgan === "Stomach" ? "bg-rose-500 text-white border-rose-600 shadow-[0_0_8px_#ef4444]" : "bg-card text-muted-foreground border-muted"
                        }`}
                      >
                        STOMACH {organsInfo.Stomach.percentage}%
                      </div>

                      {/* liver hotspot */}
                      <button
                        onClick={() => setSelectedOrgan("Liver")}
                        className="absolute top-[40%] left-[56%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
                      >
                        <span className={`absolute h-6 w-6 rounded-none bg-amber-500/25 ${selectedOrgan === "Liver" ? "animate-ping" : "opacity-0 group-hover:opacity-100"}`} />
                        <span className={`h-3 w-3 rounded-none border border-white transition-all ${selectedOrgan === "Liver" ? "bg-amber-500 scale-125 shadow-[0_0_8px_#f59e0b]" : "bg-amber-300"}`} />
                      </button>
                      <div 
                        onClick={() => setSelectedOrgan("Liver")}
                        className={`absolute top-[39%] left-[16%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                          selectedOrgan === "Liver" ? "bg-amber-500 text-white border-amber-600 shadow-[0_0_8px_#f59e0b]" : "bg-card text-muted-foreground border-muted"
                        }`}
                      >
                        LIVER {organsInfo.Liver.percentage}%
                      </div>

                    </div>

                    {/* hud active diagnostics details panel */}
                    <div className="col-span-5 flex flex-col justify-between h-full bg-muted/20 p-4 border border-muted/50 font-mono">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#22c55e] block mb-1">SYNTHETIC INFERENCE</span>
                        <h4 className="text-base font-black text-foreground flex items-center gap-1.5">
                          <span>{organsInfo[selectedOrgan]?.icon}</span> {selectedOrgan.toUpperCase()} CHANNEL
                        </h4>
                      </div>
                      
                      <div className="space-y-3 my-3">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-muted-foreground">SCAN RATING</span>
                            <span className="text-[#22c55e]">{organsInfo[selectedOrgan]?.status.toUpperCase()}</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-none overflow-hidden">
                            <div className="bg-[#22c55e] h-full" style={{ width: `${organsInfo[selectedOrgan]?.percentage}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground leading-relaxed bg-black/5 dark:bg-black/35 p-3 border border-muted/40 font-mono">
                        {organsInfo[selectedOrgan]?.desc}
                      </div>

                      <div className="text-xs text-[#22c55e] leading-relaxed bg-[#22c55e]/5 p-3 border border-[#22c55e]/25 mt-2">
                        {organsInfo[selectedOrgan]?.aiDiagnosis}
                      </div>

                      <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold">
                        <Cpu className="h-4 w-4 text-[#22c55e] animate-spin" />
                        <span>NEURAL MATRIX REAL-TIME INGESTION</span>
                      </div>
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* bottom row: calories stats chart & monthly progress panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* calories stats area chart */}
            <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-7">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground font-mono">CALORIC PERFORMANCE TRACKING</CardTitle>
              </CardHeader>
              <CardContent className="h-64 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caloriesStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="caloriesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} className="font-mono" />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} className="font-mono" />
                    <Tooltip contentStyle={{ borderRadius: "0px", fontSize: "12px", fontFamily: "monospace" }} />
                    <Area type="monotone" dataKey="calories" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#caloriesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* monthly progress widget with added sub-target breakdown features */}
            <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-5 flex flex-col gap-0 py-0">
              <CardHeader className="p-3 pb-2 border-b">
                <CardTitle className="text-sm font-bold text-foreground font-mono">THERAPEUTIC ENGINE PROGRESS</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-3 space-y-3">
                
                {/* svg progress circle */}
                <div className="flex items-center gap-6 justify-center my-1">
                  <div 
                    className="relative w-36 h-36 flex items-center justify-center shrink-0 cursor-pointer group"
                    onMouseEnter={() => setIsHoveredProgress(true)}
                    onMouseLeave={() => setIsHoveredProgress(false)}
                  >
                    <svg className="w-full h-full -rotate-90 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="5" className="text-muted/20" fill="transparent" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="#22c55e" 
                        strokeWidth="7" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * 85) / 100} 
                        fill="transparent" 
                        strokeLinecap="round" 
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                      />
                    </svg>
                    <div className="absolute text-center font-mono flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-[#22c55e]">
                        {isHoveredProgress ? "85%" : "85%"}
                      </span>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5 group-hover:text-foreground">
                        {isHoveredProgress ? "COMPLETE" : "COMPLY"}
                      </span>
                    </div>
                  </div>

                  {/* summary of target achieved */}
                  <div className="space-y-1 font-mono">
                    <div className="flex items-center gap-1.5 text-[#22c55e] font-bold text-sm">
                      <CheckCircle2 className="h-4 w-4" /> <span>TARGET COMPLIANCE</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The patient has reached <span className="text-[#22c55e] font-black">85%</span> of the therapeutic target set by AI-PHMS.
                    </p>
                  </div>
                </div>

                {/* sub-targets breakdown metrics */}
                <div className="border-t pt-4 space-y-3 mt-2 font-mono">
                  <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-[#22c55e]">TARGET METRICS BREAKDOWN</h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {subTargetsData.map((tgt, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                          <span>{tgt.name.toUpperCase()}</span>
                          <span className="text-foreground">{tgt.value}%</span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-none overflow-hidden">
                          <div className="h-full" style={{ width: `${tgt.value}%`, backgroundColor: tgt.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* new section 1: department statistics (interactive bar chart) & live triage queue */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* interactive bar chart card */}
            <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-7 flex flex-col justify-between">
              <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground font-mono">DEPARTMENT STATISTICS</CardTitle>
                  <CardDescription className="text-xs font-normal">Active doctor and patient distribution.</CardDescription>
                </div>
                {/* interactivity: toggle view mode */}
                <div className="flex border text-[10px] font-bold font-mono">
                  {(["both", "doctors", "patients"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setChartMode(mode)}
                      className={`px-2 py-1 transition-colors uppercase ${chartMode === mode ? "bg-[#22c55e] text-white" : "hover:bg-muted"}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="h-64 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} className="font-mono" />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} className="font-mono" />
                    <Tooltip contentStyle={{ borderRadius: "0px", fontSize: "12px", fontFamily: "monospace" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "10px" }} />
                    {(chartMode === "both" || chartMode === "doctors") && (
                      <Bar dataKey="Doctors" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    )}
                    {(chartMode === "both" || chartMode === "patients") && (
                      <Bar dataKey="Patients" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* interactive live triage queue list */}
            <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-5 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground font-mono">LIVE PATIENT TRIAGE</CardTitle>
                    <CardDescription className="text-xs font-normal font-mono">Real-time check-in and severity log.</CardDescription>
                  </div>
                </div>
                {/* interactivity: filter list by triage level */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {["All", "Emergency", "Urgent", "Routine"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setTriageFilter(lvl)}
                      className={`text-[9px] font-bold px-2 py-0.5 border transition-all ${
                        triageFilter === lvl
                          ? "bg-foreground text-background border-foreground font-black"
                          : "bg-background text-muted-foreground hover:text-foreground border-border"
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-2 font-mono">
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {triageLogs
                    .filter((log) => triageFilter === "All" || log.priority === triageFilter)
                    .map((log) => (
                      <div key={log.id} className="p-2 border-b border-border/40 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-foreground">{log.patient}</div>
                          <div className="text-[10px] text-muted-foreground">{log.dept} · {log.time}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 ${
                            log.priority === "Emergency"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : log.priority === "Urgent"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}>
                            {log.priority.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-muted-foreground hidden sm:inline">{log.status}</span>
                        </div>
                      </div>
                    ))}
                  {triageLogs.filter((log) => triageFilter === "All" || log.priority === triageFilter).length === 0 && (
                    <div className="text-center py-10 text-xs text-muted-foreground">
                      No patients matching filter.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* new section 2: interactive prescription ingestion feed */}
          <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
            <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-sm font-bold text-foreground font-mono">PRESCRIPTION INGESTION FEED</CardTitle>
                <CardDescription className="text-xs font-normal">Real-time status of scanned doctor prescriptions.</CardDescription>
              </div>
              {/* interactivity: text filter input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter by patient or status..."
                  value={searchScanQuery}
                  onChange={(e) => setSearchScanQuery(e.target.value)}
                  className="w-full text-xs font-mono border border-border px-3 py-1.5 bg-background text-foreground rounded-none outline-none focus:border-[#22c55e]"
                />
              </div>
            </CardHeader>
            <CardContent className="font-mono">
              <div className="overflow-x-auto">
                <Table className="w-full text-xs border-collapse">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="font-bold text-left py-2 px-3">SCAN ID</TableHead>
                      <TableHead className="font-bold text-left py-2 px-3">SOURCE FILE</TableHead>
                      <TableHead className="font-bold text-left py-2 px-3">PATIENT</TableHead>
                      <TableHead className="font-bold text-left py-2 px-3">PARSED INGREDIENTS</TableHead>
                      <TableHead className="font-bold text-center py-2 px-3">CONFIDENCE</TableHead>
                      <TableHead className="font-bold text-right py-2 px-3">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptionScanLogs
                      .filter(
                        (scan) =>
                          scan.patient.toLowerCase().includes(searchScanQuery.toLowerCase()) ||
                          scan.status.toLowerCase().includes(searchScanQuery.toLowerCase()) ||
                          scan.parsedMeds.toLowerCase().includes(searchScanQuery.toLowerCase())
                      )
                      .map((scan) => (
                        <TableRow key={scan.id} className="hover:bg-muted/10 border-b border-border/40">
                          <TableCell className="py-2.5 px-3 font-semibold text-muted-foreground">{scan.id}</TableCell>
                          <TableCell className="py-2.5 px-3 font-semibold text-foreground">{scan.name}</TableCell>
                          <TableCell className="py-2.5 px-3 text-foreground">{scan.patient}</TableCell>
                          <TableCell className="py-2.5 px-3 text-muted-foreground">{scan.parsedMeds}</TableCell>
                          <TableCell className="py-2.5 px-3 text-center text-[#22c55e] font-bold">{scan.matchRate}</TableCell>
                          <TableCell className="py-2.5 px-3 text-right">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                              scan.status === "Analyzed" 
                                ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25" 
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/25"
                            }`}>
                              {scan.status.toUpperCase()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    {prescriptionScanLogs.filter(
                      (scan) =>
                        scan.patient.toLowerCase().includes(searchScanQuery.toLowerCase()) ||
                        scan.status.toLowerCase().includes(searchScanQuery.toLowerCase()) ||
                        scan.parsedMeds.toLowerCase().includes(searchScanQuery.toLowerCase())
                    ).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No scans found matching "{searchScanQuery}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

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
                    DR. GREGORY HOUSE
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
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider">Physiotherapy</h4>
                    <p className="text-xs opacity-90 mt-0.5">15 June 2026</p>
                    <p className="text-xs opacity-90">Dr. Anastasia Lindsey</p>
                  </div>
                  <Link href="/doctor">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10 rounded-none">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <h5 className="text-xs font-bold">Electrical transcutaneous nerve stimulation</h5>
                  <p className="text-xs opacity-90 mt-1">08:00 - 09:00 AM</p>
                  <div className="flex items-center gap-1.5 text-xs text-white hover:underline cursor-pointer mt-3 font-semibold">
                    <Download className="h-4 w-4" /> Physiotherapy_report.pdf
                  </div>
                </div>
              </div>
            ) : calendarMonth === "June 2026" && selectedCalendarDay === 24 ? (
              <div className="bg-amber-500 text-white p-5 rounded-none space-y-3.5 shadow-sm border border-transparent animate-in fade-in duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider">Medical Checkup</h4>
                    <p className="text-xs opacity-90 mt-0.5">24 June 2026</p>
                    <p className="text-xs opacity-90">Dr. Minerva Tingey</p>
                  </div>
                  <Link href="/doctor">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10 rounded-none">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <h5 className="text-xs font-bold">Standard physiological vital signs scan</h5>
                  <p className="text-xs opacity-90 mt-1">10:00 - 11:30 AM</p>
                  <div className="flex items-center gap-1.5 text-xs text-white hover:underline cursor-pointer mt-3 font-semibold">
                    <Download className="h-4 w-4" /> checkup_metrics.csv
                  </div>
                </div>
              </div>
            ) : calendarMonth === "June 2026" && selectedCalendarDay === 8 ? (
              <div className="bg-rose-500 text-white p-5 rounded-none space-y-3.5 shadow-sm border border-transparent animate-in fade-in duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wider">Heart Checkup</h4>
                    <p className="text-xs opacity-90 mt-0.5">08 June 2026</p>
                    <p className="text-xs opacity-90">Dr. Minerva Tingey</p>
                  </div>
                  <Link href="/doctor">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10 rounded-none">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <h5 className="text-xs font-bold">Sinus rhythm & echocardiogram telemetry review</h5>
                  <p className="text-xs opacity-90 mt-1">02:00 - 03:00 PM</p>
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
                className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between ${
                  calendarMonth === "June 2026" && selectedCalendarDay === 8 ? "border-rose-500 bg-rose-500/5" : "bg-card hover:bg-muted/40"
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-foreground">Heart Checkup</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">08 June 2026 | Dr. Minerva</p>
                </div>
                <div className="text-rose-500 text-xs font-bold font-sans">~~v~~v~~</div>
              </div>

              <div 
                onClick={() => {
                  setCalendarMonth("June 2026");
                  setSelectedCalendarDay(15);
                }}
                className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between ${
                  calendarMonth === "June 2026" && selectedCalendarDay === 15 ? "border-[#22c55e] bg-[#22c55e]/5" : "bg-card hover:bg-muted/40"
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-foreground">Physiotherapy</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">15 June 2026 | Dr. Anastasia</p>
                </div>
                <div className="text-[#22c55e] text-xs font-bold font-sans">~~v~~v~~</div>
              </div>

              <div 
                onClick={() => {
                  setCalendarMonth("June 2026");
                  setSelectedCalendarDay(24);
                }}
                className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between ${
                  calendarMonth === "June 2026" && selectedCalendarDay === 24 ? "border-amber-500 bg-amber-500/5" : "bg-card hover:bg-muted/40"
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-foreground">Medical Checkup</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">24 June 2026 | Dr. Minerva</p>
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
            <CardContent className="pt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Total Patients", value: "124", icon: "🧑‍🤝‍🧑", color: "#3b82f6" },
                { label: "Doctors On Duty", value: "12", icon: "🩺", color: "#22c55e" },
                { label: "Appointments", value: "38", icon: "📅", color: "#a855f7" },
                { label: "Scans Done", value: "5", icon: "📋", color: "#f59e0b" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 border border-border/60 bg-muted/20 flex flex-col gap-1">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-base font-black text-foreground" style={{ color: stat.color }}>{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase leading-tight">{stat.label}</span>
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
