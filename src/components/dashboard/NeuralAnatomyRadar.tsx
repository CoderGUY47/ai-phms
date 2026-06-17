"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Cpu } from "lucide-react";

interface Organ {
  percentage: number;
  color: string;
  desc: string;
  icon: string;
  status: string;
  aiDiagnosis: string;
}

interface BodyCompositionItem {
  name: string;
  value: number;
  color: string;
}

interface NeuralAnatomyRadarProps {
  organsInfo: { [key: string]: Organ };
  selectedOrgan: string;
  setSelectedOrgan: (organ: string) => any;
  activeTab: "composition" | "anatomy";
  setActiveTab: (tab: "composition" | "anatomy") => any;
  bodyCompositionData: BodyCompositionItem[];
}

export default function NeuralAnatomyRadar({
  organsInfo,
  selectedOrgan,
  setSelectedOrgan,
  activeTab,
  setActiveTab,
  bodyCompositionData,
}: NeuralAnatomyRadarProps) {
  if (!organsInfo) return null;

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-2">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground font-mono">
            NEURAL ANATOMY RADAR
          </CardTitle>
        </div>
        <div className="flex border text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab("anatomy")}
            className={`px-3 py-1.5 transition-colors ${
              activeTab === "anatomy" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            ANATOMY RADAR
          </button>
          <button
            onClick={() => setActiveTab("composition")}
            className={`px-3 py-1.5 transition-colors ${
              activeTab === "composition" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            COMPOSITION
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col justify-between md:h-[390px] h-auto min-h-[390px]">
        {activeTab === "composition" ? (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="relative flex items-center justify-center" style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={bodyCompositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {bodyCompositionData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center font-mono">
                <p className="text-3xl font-black text-foreground font-sans">16%</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hydrogen</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground border-t pt-4 font-mono">
              {bodyCompositionData?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0" style={{ backgroundColor: item.color }} />
                  <span>{item.value}% {item.name.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full items-center w-full">
            {/* diagnostic outline body.png overlay */}
            <div className="relative col-span-1 md:col-span-7 h-full w-full flex justify-center items-center bg-black border border-muted/20 overflow-hidden">
              <img
                src="/assets/body.png"
                alt="Anatomical Body Outline"
                className="h-full max-h-[310px] object-contain transition-all py-2"
              />

              {/* brain hotspot */}
              <button
                onClick={() => setSelectedOrgan("Brain")}
                className="absolute top-[9%] left-[50%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
              >
                <span
                  className={`absolute h-6 w-6 rounded-none bg-purple-500/25 ${
                    selectedOrgan === "Brain" ? "animate-ping" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`h-3 w-3 rounded-none border border-white transition-all ${
                    selectedOrgan === "Brain"
                      ? "bg-purple-500 scale-125 shadow-[0_0_8px_#a855f7]"
                      : "bg-purple-300"
                  }`}
                />
              </button>
              <div
                onClick={() => setSelectedOrgan("Brain")}
                className={`absolute top-[8%] left-[62%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                  selectedOrgan === "Brain"
                    ? "bg-purple-500 text-white border-purple-600 shadow-[0_0_8px_#a855f7]"
                    : "bg-card text-muted-foreground border-muted"
                }`}
              >
                BRAIN {organsInfo.Brain?.percentage}%
              </div>

              {/* lungs hotspot */}
              <button
                onClick={() => setSelectedOrgan("Lungs")}
                className="absolute top-[28%] left-[50%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
              >
                <span
                  className={`absolute h-6 w-6 rounded-none bg-[#22c55e]/25 ${
                    selectedOrgan === "Lungs" ? "animate-ping" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`h-3 w-3 rounded-none border border-white transition-all ${
                    selectedOrgan === "Lungs"
                      ? "bg-[#22c55e] scale-125 shadow-[0_0_8px_#22c55e]"
                      : "bg-emerald-300"
                  }`}
                />
              </button>
              <div
                onClick={() => setSelectedOrgan("Lungs")}
                className={`absolute top-[27%] left-[62%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                  selectedOrgan === "Lungs"
                    ? "bg-[#22c55e] text-white border-[#22c55e] shadow-[0_0_8px_#22c55e]"
                    : "bg-card text-muted-foreground border-muted"
                }`}
              >
                LUNGS {organsInfo.Lungs?.percentage}%
              </div>

              {/* heart hotspot */}
              <button
                onClick={() => setSelectedOrgan("Heart")}
                className="absolute top-[32%] left-[45%] h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
              >
                <span
                  className={`absolute h-6 w-6 rounded-none bg-blue-500/25 ${
                    selectedOrgan === "Heart" ? "animate-ping" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`h-3 w-3 rounded-none border border-white transition-all ${
                    selectedOrgan === "Heart"
                      ? "bg-blue-500 scale-125 shadow-[0_0_8px_#3b82f6]"
                      : "bg-blue-300"
                  }`}
                />
              </button>
              <div
                onClick={() => setSelectedOrgan("Heart")}
                className={`absolute top-[31%] left-[16%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                  selectedOrgan === "Heart"
                    ? "bg-blue-500 text-white border-blue-600 shadow-[0_0_8px_#3b82f6]"
                    : "bg-card text-muted-foreground border-muted"
                }`}
              >
                HEART {organsInfo.Heart?.percentage}%
              </div>

              {/* stomach hotspot */}
              <button
                onClick={() => setSelectedOrgan("Stomach")}
                className="absolute top-[43%] left-[50%] -translate-x-1/2 h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
              >
                <span
                  className={`absolute h-6 w-6 rounded-none bg-[#22c55e]/25 ${
                    selectedOrgan === "Stomach" ? "animate-ping" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`h-3 w-3 rounded-none border border-white transition-all ${
                    selectedOrgan === "Stomach"
                      ? "bg-[#22c55e] scale-125 shadow-[0_0_8px_#22c55e]"
                      : "bg-emerald-300"
                  }`}
                />
              </button>
              <div
                onClick={() => setSelectedOrgan("Stomach")}
                className={`absolute top-[42%] left-[62%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                  selectedOrgan === "Stomach"
                    ? "bg-[#22c55e] text-white border-[#22c55e] shadow-[0_0_8px_#22c55e]"
                    : "bg-card text-muted-foreground border-muted"
                }`}
              >
                STOMACH {organsInfo.Stomach?.percentage}%
              </div>

              {/* liver hotspot */}
              <button
                onClick={() => setSelectedOrgan("Liver")}
                className="absolute top-[40%] left-[45%] h-8 w-8 rounded-none flex items-center justify-center group focus:outline-none z-10"
              >
                <span
                  className={`absolute h-6 w-6 rounded-none bg-amber-500/25 ${
                    selectedOrgan === "Liver" ? "animate-ping" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span
                  className={`h-3 w-3 rounded-none border border-white transition-all ${
                    selectedOrgan === "Liver"
                      ? "bg-amber-500 scale-125 shadow-[0_0_8px_#f59e0b]"
                      : "bg-amber-300"
                  }`}
                />
              </button>
              <div
                onClick={() => setSelectedOrgan("Liver")}
                className={`absolute top-[39%] left-[16%] text-[10px] font-mono font-bold px-2 py-0.5 border cursor-pointer transition-all rounded-none ${
                  selectedOrgan === "Liver"
                    ? "bg-amber-500 text-white border-amber-600 shadow-[0_0_8px_#f59e0b]"
                    : "bg-card text-muted-foreground border-muted"
                }`}
              >
                LIVER {organsInfo.Liver?.percentage}%
              </div>
            </div>

            {/* hud active diagnostics details panel */}
            <div className="col-span-1 md:col-span-5 flex flex-col justify-between h-full bg-muted/20 p-4 border border-muted/50 font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#22c55e] block mb-1">
                  SYNTHETIC INFERENCE
                </span>
                <h4 className="text-base font-black text-foreground flex items-center gap-1.5">
                  <span>{organsInfo[selectedOrgan]?.icon}</span> {selectedOrgan?.toUpperCase()} CHANNEL
                </h4>
              </div>

              <div className="space-y-3 my-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-muted-foreground">SCAN RATING</span>
                    <span className="text-[#22c55e]">{organsInfo[selectedOrgan]?.status?.toUpperCase()}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-none overflow-hidden">
                    <div
                      className="bg-[#22c55e] h-full"
                      style={{ width: `${organsInfo[selectedOrgan]?.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed bg-black/5 dark:bg-black/35 p-3 border border-muted/40 font-mono">
                {organsInfo[selectedOrgan]?.desc}
              </div>

              <div className="text-xs text-[#22c55e] leading-relaxed bg-[#22c55e]/5 p-3 border border-[#22c55e]/25 mt-2">
                {organsInfo[selectedOrgan]?.aiDiagnosis}
              </div>

              <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold">
                <Cpu className="h-4 w-4 text-[#22c55e] animate-spin" />
                <span>NEURAL MATRIX REAL-TIME INGESTION</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
