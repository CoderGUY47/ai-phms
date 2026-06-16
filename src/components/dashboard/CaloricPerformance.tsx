"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";

interface CaloriesStatsItem {
  month: string;
  calories: number;
}

interface CaloricPerformanceProps {
  caloriesStatsData: CaloriesStatsItem[];
}

export default function CaloricPerformance({ caloriesStatsData }: CaloricPerformanceProps) {
  if (!caloriesStatsData) return null;

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-7">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-foreground font-mono">
          CALORIC PERFORMANCE TRACKING
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={caloriesStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="caloriesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
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
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#caloriesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
