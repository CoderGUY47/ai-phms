"use client";

import { useState } from "react";
import { useMedicalRecords, useAuditLogs } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Database,
  ShieldAlert,
  FileText,
  CheckCircle,
  Clock,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ReportsPage() {
  const { patients, records, isLoaded, clearAllData } = useMedicalRecords();
  const auditLogs = useAuditLogs();
  const [searchLog, setSearchLog] = useState("");

  const filteredLogs = auditLogs.filter((log) =>
    log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.entityName.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchLog.toLowerCase())
  );

  // group and calculate statistics
  const totalRecordsCount = records.length;
  const activeCount = patients.filter((p) => p.status === "Active").length;
  const suspendedCount = patients.filter((p) => p.status === "Suspended").length;

  // medicine classifications
  const classificationCounts: { [key: string]: number } = {};
  records.flatMap((r) => r.medicines).forEach((med) => {
    const cls = med.classification || "General";
    classificationCounts[cls] = (classificationCounts[cls] || 0) + 1;
  });

  const handleClearSystem = () => {
    if (confirm("WARNING: Are you absolutely sure you want to wipe out all local storage registry data? This cannot be undone.")) {
      clearAllData();
      toast.error("Clinical local database storage registry wiped successfully.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground font-mono text-base">
        Resolving Clinical Metrics &amp; Audit Trail...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto font-mono">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Clinical Metrics &amp; Audit Logs</h1>
        <p className="text-muted-foreground mt-1 text-base font-normal">Real-time statistics dashboard, medication classification logs, and system audit trail.</p>
      </div>

      {/* stats summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Total Patient Files</p>
                <h3 className="text-3xl font-bold text-[#22c55e] mt-1">{patients.length}</h3>
              </div>
              <CheckCircle className="h-9 w-9 text-[#22c55e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Total Consultations</p>
                <h3 className="text-3xl font-bold text-[#22c55e] mt-1">{totalRecordsCount}</h3>
              </div>
              <FileText className="h-9 w-9 text-[#22c55e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Active Demographics</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{activeCount}</h3>
              </div>
              <HeartHandshake className="h-9 w-9 text-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Suspended Accounts</p>
                <h3 className="text-3xl font-bold text-destructive mt-1">{suspendedCount}</h3>
              </div>
              <ShieldAlert className="h-9 w-9 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* middle row: drug distribution chart list and administrative actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* medicine classifications distribution */}
        <div className="md:col-span-2">
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#22c55e]" /> Pharmacological Drug Classifications
              </CardTitle>
              <CardDescription className="text-xs font-normal">Accumulated dosage ledger counts by class.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {Object.keys(classificationCounts).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(classificationCounts).map(([cls, count]) => {
                    const pct = Math.max(5, Math.min(100, (count / totalRecordsCount) * 100));
                    return (
                      <div key={cls} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span>{cls}</span>
                          <span>{count} prescriptions</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted border border-border/40">
                          <div className="h-full bg-[#22c55e]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-center py-10">No medications logged to build distributions.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* administrative tools */}
        <div className="md:col-span-1">
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Database className="h-5 w-5 text-destructive" /> Local Registry Tools
                </CardTitle>
                <CardDescription className="text-xs font-normal">Clear cache and reset clinical simulation data.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 text-xs text-muted-foreground font-sans leading-relaxed">
                <p>
                  These diagnostic tools will wipe out all consultation histories, mock schedules, and custom patient files created inside your browser local storage.
                </p>
                <p className="font-bold text-destructive font-mono">
                  This action is irreversible. Use with caution.
                </p>
              </CardContent>
            </div>
            <div className="p-6 border-t border-border/60 bg-muted/10">
              <Button
                variant="destructive"
                className="w-full rounded-none font-bold bg-destructive hover:bg-destructive/90 text-white"
                onClick={handleClearSystem}
              >
                Reset Local Database
              </Button>
            </div>
          </Card>
        </div>

      </div>

      {/* lower row: audit logs trail */}
      <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
        <CardHeader className="border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#22c55e]" /> Clinical Audit Trail Logs
            </CardTitle>
            <CardDescription className="text-xs font-normal">Regulatory security audit events logs.</CardDescription>
          </div>
          <Input
            placeholder="Search action logs..."
            className="max-w-xs rounded-none h-9 text-xs"
            value={searchLog}
            onChange={(e) => setSearchLog(e.target.value)}
          />
        </CardHeader>
        <CardContent className="pt-6">
          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground pb-2">
                    <th className="py-2 font-bold uppercase">Timestamp</th>
                    <th className="py-2 font-bold uppercase">Operator</th>
                    <th className="py-2 font-bold uppercase">Action Event</th>
                    <th className="py-2 font-bold uppercase">Entity Type</th>
                    <th className="py-2 font-bold uppercase">Entity Descriptor</th>
                    <th className="py-2 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/10">
                      <td className="py-2 text-[11px] text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 font-bold text-foreground">{log.performedBy}</td>
                      <td className="py-2 font-bold text-[#22c55e]">{log.action}</td>
                      <td className="py-2 text-muted-foreground">{log.entityType}</td>
                      <td className="py-2 text-muted-foreground truncate max-w-[150px]" title={log.entityName}>
                        {log.entityName}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline" className="text-[10px] scale-90 border-emerald-500 text-emerald-500 rounded-none bg-emerald-500/5">
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm font-bold">No system event logs found.</p>
              <p className="text-xs mt-1 font-normal">Event tracking registers when actions occur.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
