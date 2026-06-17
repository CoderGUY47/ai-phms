"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PrescriptionScanItem {
  id: string;
  name: string;
  patient: string;
  parsedMeds: string;
  status: string;
  matchRate: string;
}

interface PrescriptionIngestionFeedProps {
  prescriptionScanLogs: PrescriptionScanItem[];
  searchScanQuery: string;
  setSearchScanQuery: (query: string) => any;
}

export default function PrescriptionIngestionFeed({
  prescriptionScanLogs,
  searchScanQuery,
  setSearchScanQuery,
}: PrescriptionIngestionFeedProps) {
  if (!prescriptionScanLogs) return null;

  const filteredLogs = prescriptionScanLogs.filter(
    (scan) =>
      scan.patient.toLowerCase().includes(searchScanQuery.toLowerCase()) ||
      scan.status.toLowerCase().includes(searchScanQuery.toLowerCase()) ||
      scan.parsedMeds.toLowerCase().includes(searchScanQuery.toLowerCase())
  );

  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <CardTitle className="text-sm font-bold text-foreground font-mono">
            PRESCRIPTION INGESTION FEED
          </CardTitle>
          <CardDescription className="text-xs font-normal">
            Real-time status of scanned doctor prescriptions.
          </CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter by patient or status..."
            value={searchScanQuery}
            onChange={(e) => setSearchScanQuery(e.target.value)}
            className="w-full text-xs font-mono border border-border px-3 py-1.5 bg-background text-foreground rounded-none outline-none focus:border-[#22c55e]"
            suppressHydrationWarning
          />
        </div>
      </CardHeader>
      <CardContent className="font-mono">
        <div className="overflow-x-auto">
          <Table className="w-full text-xs border-collapse">
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-bold text-left py-2 px-3">SCAN ID</TableHead>
                <TableHead className="font-bold text-left py-2 px-3">SOURCE FILE</TableHead>
                <TableHead className="font-bold text-left py-2 px-3">PATIENT</TableHead>
                <TableHead className="font-bold text-left py-2 px-3">PARSED INGREDIENTS</TableHead>
                <TableHead className="font-bold text-center py-2 px-3">CONFIDENCE</TableHead>
                <TableHead className="font-bold text-right py-2 px-3">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((scan) => (
                <TableRow key={scan.id} className="hover:bg-muted/10 border-b border-border/40">
                  <TableCell className="py-2.5 px-3 font-semibold text-muted-foreground">{scan.id}</TableCell>
                  <TableCell className="py-2.5 px-3 font-semibold text-foreground">{scan.name}</TableCell>
                  <TableCell className="py-2.5 px-3 text-foreground">{scan.patient}</TableCell>
                  <TableCell className="py-2.5 px-3 text-muted-foreground">{scan.parsedMeds}</TableCell>
                  <TableCell className="py-2.5 px-3 text-center text-[#22c55e] font-bold">{scan.matchRate}</TableCell>
                  <TableCell className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                        scan.status === "Analyzed"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/25"
                      }`}
                    >
                      {scan.status.toUpperCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No scans found matching "{searchScanQuery}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
