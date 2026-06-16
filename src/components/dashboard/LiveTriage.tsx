"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TriageLogItem {
  id: string;
  patient: string;
  dept: string;
  priority: string;
  time: string;
  status: string;
}

interface LiveTriageProps {
  triageLogs: TriageLogItem[];
  triageFilter: string;
  setTriageFilter: (filter: string) => void;
}

export default function LiveTriage({ triageLogs, triageFilter, setTriageFilter }: LiveTriageProps) {
  if (!triageLogs) return null;

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md md:col-span-5 flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-bold text-foreground font-mono">
              LIVE PATIENT TRIAGE
            </CardTitle>
            <CardDescription className="text-xs font-normal font-mono">
              Real-time check-in and severity log.
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {["All", "Emergency", "Urgent", "Routine"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setTriageFilter(lvl)}
              className={`text-[9px] font-bold px-2 py-0.5 border transition-all ${
                triageFilter === lvl
                  ? "bg-foreground text-background border-foreground font-black"
                  : "bg-background text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 py-2 font-mono">
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {triageLogs
            .filter((log) => triageFilter === "All" || log.priority === triageFilter)
            .map((log) => (
              <div
                key={log.id}
                className="p-2 border-b border-border/40 flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-bold text-foreground">{log.patient}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {log.dept} · {log.time}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 ${
                      log.priority === "Emergency"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : log.priority === "Urgent"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                    }`}
                  >
                    {log.priority.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">{log.status}</span>
                </div>
              </div>
            ))}
          {triageLogs.filter((log) => triageFilter === "All" || log.priority === triageFilter).length ===
            0 && (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No patients matching filter.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
