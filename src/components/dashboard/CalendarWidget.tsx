"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarWidgetProps {
  calendarMonth: string;
  selectedCalendarDay: number;
  setSelectedCalendarDay: (day: number) => void;
  handleMonthPrev: () => void;
  handleMonthNext: () => void;
  handleSelectToday: () => void;
  getDaysArray: () => number[];
}

export default function CalendarWidget({
  calendarMonth,
  selectedCalendarDay,
  setSelectedCalendarDay,
  handleMonthPrev,
  handleMonthNext,
  handleSelectToday,
  getDaysArray,
}: CalendarWidgetProps) {
  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4 font-mono">
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-muted"
              onClick={handleMonthPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-muted"
              onClick={handleMonthNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="font-extrabold text-sm text-foreground">{calendarMonth}</span>
          <div className="flex border text-[10px] font-bold">
            <span className="bg-muted px-2 py-1 cursor-pointer hover:bg-muted/80" onClick={handleSelectToday}>
              Today
            </span>
          </div>
        </div>

        {/* calendar days */}
        <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 text-center text-xs font-mono">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="font-extrabold text-muted-foreground uppercase text-[10px]">
              {d}
            </div>
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
                {hasSchedule && <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-none bg-[#22c55e]" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
