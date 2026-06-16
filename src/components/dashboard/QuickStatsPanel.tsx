"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function QuickStatsPanel() {
  const stats = [
    { label: "Total Patients", value: "124", icon: "🧑‍🤝‍🧑", color: "#3b82f6" },
    { label: "Doctors On Duty", value: "12", icon: "🩺", color: "#22c55e" },
    { label: "Appointments", value: "38", icon: "📅", color: "#a855f7" },
    { label: "Scans Done", value: "5", icon: "📋", color: "#f59e0b" },
  ];

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">
          Today&apos;s Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-3 border border-border/60 bg-muted/30 flex items-center gap-3 rounded-none"
          >
            <div className="h-10 w-10 shrink-0 flex items-center justify-center text-lg rounded-none">
              {stat.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-[12px] font-normal leading-tight" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[8px] text-muted-foreground font-normal uppercase tracking-wider mt-0.5 leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
