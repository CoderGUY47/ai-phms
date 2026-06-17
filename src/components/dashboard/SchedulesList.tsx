"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Activity, Calendar, User, Clock, Stethoscope, Heart } from "lucide-react";

interface SchedulesListProps {
  calendarMonth: string;
  selectedCalendarDay: number;
  setSelectedCalendarDay: (day: number) => any;
  setCalendarMonth: (month: string) => any;
}

export default function SchedulesList({
  calendarMonth,
  selectedCalendarDay,
  setSelectedCalendarDay,
  setCalendarMonth,
}: SchedulesListProps) {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Schedules</h4>
        <span className="text-[10px] text-primary font-bold">
          Selected: {calendarMonth.split(" ")[0]} {selectedCalendarDay}
        </span>
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
          <p>
            No consultations scheduled for {calendarMonth.split(" ")[0]} {selectedCalendarDay}.
          </p>
          <Button
            size="sm"
            className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white rounded-none text-xs h-8 px-4 font-bold"
          >
            + Add Consultation
          </Button>
        </div>
      )}

      {/* list all general scheduled events for overview */}
      <div className="border-t pt-4 space-y-2">
        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
          Month Events Quickview
        </span>

        <div
          onClick={() => {
            setCalendarMonth("June 2026");
            setSelectedCalendarDay(8);
          }}
          className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between gap-3 ${
            calendarMonth === "June 2026" && selectedCalendarDay === 8
              ? "border-rose-500 bg-rose-500/5"
              : "bg-card hover:bg-muted/40"
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
            calendarMonth === "June 2026" && selectedCalendarDay === 15
              ? "border-[#22c55e] bg-[#22c55e]/5"
              : "bg-card hover:bg-muted/40"
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
            calendarMonth === "June 2026" && selectedCalendarDay === 24
              ? "border-amber-500 bg-amber-500/5"
              : "bg-card hover:bg-muted/40"
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
  );
}
