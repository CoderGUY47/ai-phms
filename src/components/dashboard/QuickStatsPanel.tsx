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
      <CardHeader className="p-3 pb-2 border-b">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">
          Today&apos;s Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-3 bg-muted flex items-center gap-2 rounded-none"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-none" style={{ fontSize: "20px" }}>
              {stat.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-bold leading-tight" style={{ color: stat.color, fontSize: "14px" }}>
                {stat.value}
              </div>
              <div className="text-muted-foreground font-semibold uppercase tracking-wider mt-0.5 leading-tight" style={{ fontSize: "10px" }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
