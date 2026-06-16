"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface DeptStatsItem {
  name: string;
  Doctors: number;
  Patients: number;
}

interface DepartmentStatisticsProps {
  deptStatsData: DeptStatsItem[];
  chartMode: "both" | "doctors" | "patients";
  setChartMode: (mode: "both" | "doctors" | "patients") => void;
}

export default function DepartmentStatistics({
  deptStatsData,
  chartMode,
  setChartMode,
}: DepartmentStatisticsProps) {
  if (!deptStatsData) return null;

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-7 flex flex-col justify-between">
      <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-foreground font-mono">
            DEPARTMENT STATISTICS
          </CardTitle>
          <CardDescription className="text-xs font-normal font-mono">
            Active doctor and patient distribution.
          </CardDescription>
        </div>
        <div className="flex border text-[10px] font-bold font-mono">
          {(["both", "doctors", "patients"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setChartMode(mode)}
              className={`px-2 py-1 transition-colors uppercase ${
                chartMode === mode ? "bg-[#22c55e] text-white" : "hover:bg-muted"
              }`}
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
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="font-mono"
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              className="font-mono"
            />
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
  );
}
