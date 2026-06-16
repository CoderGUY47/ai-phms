"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Organ {
  percentage: number;
  color: string;
  desc: string;
  icon: string;
  status: string;
  aiDiagnosis: string;
}

interface BioDataChannelsProps {
  organsInfo: Record<string, Organ>;
  selectedOrgan: string;
  setSelectedOrgan: (organ: string) => void;
  setActiveTab: (tab: "composition" | "anatomy") => void;
}

export default function BioDataChannels({
  organsInfo,
  selectedOrgan,
  setSelectedOrgan,
  setActiveTab,
}: BioDataChannelsProps) {
  if (!organsInfo) return null;

  return (
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
              <div className="h-8 w-8 bg-muted flex items-center justify-center text-xs shrink-0 rounded-none">
                {organ.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="tracking-wide">{key.toUpperCase()}</span>
                  <span className="text-[#22c55e]">{organ.percentage}%</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-none overflow-hidden">
                  <div
                    className="bg-[#22c55e] h-full transition-all duration-500"
                    style={{ width: `${organ.percentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
