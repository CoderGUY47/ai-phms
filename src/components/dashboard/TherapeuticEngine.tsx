"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SubTargetItem {
  name: string;
  value: number;
  color: string;
}

interface TherapeuticEngineProps {
  subTargetsData: SubTargetItem[];
  isHoveredProgress: boolean;
  setIsHoveredProgress: (hovered: boolean) => any;
}

export default function TherapeuticEngine({
  subTargetsData,
  isHoveredProgress,
  setIsHoveredProgress,
}: TherapeuticEngineProps) {
  if (!subTargetsData) return null;

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-5 flex flex-col gap-0 py-0">
      <CardHeader className="p-3 pb-2 border-b">
        <CardTitle className="text-sm font-bold text-foreground font-mono">
          THERAPEUTIC ENGINE PROGRESS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-3 space-y-3">
        {/* svg progress circle */}
        <div className="flex items-center gap-6 justify-center my-1">
          <div
            className="relative w-36 h-36 flex items-center justify-center shrink-0 cursor-pointer group"
            onMouseEnter={() => setIsHoveredProgress(true)}
            onMouseLeave={() => setIsHoveredProgress(false)}
          >
            <svg
              className="w-full h-full -rotate-90 transition-transform duration-500 group-hover:scale-105"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="5"
                className="text-muted/20"
                fill="transparent"
              />
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
              The patient has reached <span className="text-[#22c55e] font-black">85%</span> of the therapeutic
              target set by AI-PHMS.
            </p>
          </div>
        </div>

        {/* sub-targets breakdown metrics */}
        <div className="border-t pt-4 space-y-3 mt-2 font-mono">
          <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-[#22c55e]">
            TARGET METRICS BREAKDOWN
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {subTargetsData?.map((tgt, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>{tgt.name.toUpperCase()}</span>
                  <span className="text-foreground">{tgt.value}%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-none overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${tgt.value}%`, backgroundColor: tgt.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
