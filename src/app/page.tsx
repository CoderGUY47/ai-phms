"use client";

import { useEffect, useState } from "react";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Import extracted components
import BioDataChannels from "@/components/dashboard/BioDataChannels";
import NeuralAnatomyRadar from "@/components/dashboard/NeuralAnatomyRadar";
import CaloricPerformance from "@/components/dashboard/CaloricPerformance";
import TherapeuticEngine from "@/components/dashboard/TherapeuticEngine";
import DepartmentStatistics from "@/components/dashboard/DepartmentStatistics";
import LiveTriage from "@/components/dashboard/LiveTriage";
import PrescriptionIngestionFeed from "@/components/dashboard/PrescriptionIngestionFeed";
import ActiveConsultationCard from "@/components/dashboard/ActiveConsultationCard";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import SchedulesList from "@/components/dashboard/SchedulesList";
import QuickStatsPanel from "@/components/dashboard/QuickStatsPanel";
import TodayMedicinesChecklist from "@/components/dashboard/TodayMedicinesChecklist";

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
          <ActiveConsultationCard />

          {/* calendar box */}
          <CalendarWidget
            calendarMonth={calendarMonth}
            selectedCalendarDay={selectedCalendarDay}
            setSelectedCalendarDay={setSelectedCalendarDay}
            handleMonthPrev={handleMonthPrev}
            handleMonthNext={handleMonthNext}
            handleSelectToday={handleSelectToday}
            getDaysArray={getDaysArray}
          />

          {/* schedule list */}
          <SchedulesList
            calendarMonth={calendarMonth}
            selectedCalendarDay={selectedCalendarDay}
            setSelectedCalendarDay={setSelectedCalendarDay}
            setCalendarMonth={setCalendarMonth}
          />

          {/* quick health stats panel */}
          <QuickStatsPanel />

          {/* today's medicines checklist */}
          <TodayMedicinesChecklist />

        </div>

      </div>
    </div>
  );
}
