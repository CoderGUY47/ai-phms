"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function TodayMedicinesChecklist() {
  const medicines = [
    { name: "Atorvastatin 20mg", time: "08:00 AM", done: true },
    { name: "Metformin 500mg", time: "01:00 PM", done: true },
    { name: "Losartan 50mg", time: "06:00 PM", done: false },
    { name: "Aspirin 75mg", time: "09:00 PM", done: false },
  ];

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md font-mono">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">
          Today&apos;s Medicines
        </CardTitle>
        <CardDescription className="text-[10px] font-normal">
          Andrien Bertrand — active prescription
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3 space-y-2">
        {medicines.map((med, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-2 border-b border-border/30 text-xs ${
              med.done ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 border flex-shrink-0 flex items-center justify-center ${
                  med.done ? "bg-[#22c55e] border-[#22c55e]" : "border-muted-foreground"
                }`}
              >
                {med.done && <span className="text-white text-[8px] font-black">✓</span>}
              </div>
              <span
                className={`font-semibold ${
                  med.done ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {med.name}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{med.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
