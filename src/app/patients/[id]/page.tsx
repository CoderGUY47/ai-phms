"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Patient, MedicalRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Phone, FileSpreadsheet, Activity, Calendar, Pill, FlaskConical, Stethoscope, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PatientProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { patients, isLoaded } = useMedicalRecords();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const match = patients.find((p) => p.id === id);
      if (match) {
        setPatient(match);
      }
    }
  }, [id, patients, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground font-mono text-base">
        Resolving Patient dossier...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-6 text-center max-w-md mx-auto py-20 font-mono">
        <Users className="h-16 w-16 mx-auto text-destructive animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground">Patient Folder Not Found</h2>
        <p className="text-sm text-muted-foreground font-normal">
          The requested identifier "{id}" does not correspond to any registered patient folder.
        </p>
        <Button variant="outline" className="rounded-none font-bold" onClick={() => router.push("/patients")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Button>
      </div>
    );
  }

  // calculate stats
  const totalConsultations = patient.history.length;
  const allMeds = patient.history.flatMap((r) => r.medicines);
  const allTests = patient.history.flatMap((r) => r.testResults);

  // extract vitals history
  const bpHistory = patient.history
    .filter((h) => h.bloodPressure)
    .map((h) => ({ date: h.date, bp: h.bloodPressure! }));
  const rrHistory = patient.history
    .filter((h) => h.respiratoryRate)
    .map((h) => ({ date: h.date, rr: h.respiratoryRate! }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto font-mono">
      {/* breadcrumb header */}
      <div>
        <Button
          variant="ghost"
          className="rounded-none hover:bg-muted text-muted-foreground hover:text-foreground mb-4 pl-0 font-bold"
          onClick={() => router.push("/patients")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
              {patient.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{patient.id}</span>
              <span>·</span>
              <span>{patient.age} years old</span>
              <span>·</span>
              <span>{patient.gender}</span>
            </div>
          </div>
          <Badge variant={patient.status === "Active" ? "default" : "destructive"} className="rounded-none text-sm px-3 py-1">
            Status: {patient.status}
          </Badge>
        </div>
      </div>

      {/* grid of key info & vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* quick contact & details */}
        <Card className="border shadow-none rounded-none bg-card">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold">Contact Directory</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-[#22c55e]" />
              <span className="font-bold text-foreground">Phone:</span>
              <span>{patient.phone || "Not recorded"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-[#22c55e]" />
              <span className="font-bold text-foreground">Registered:</span>
              <span>Since {patient.history[patient.history.length - 1]?.date || "June 2026"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 text-[#22c55e]" />
              <span className="font-bold text-foreground">File Status:</span>
              <span className="text-[#22c55e] font-bold">Active Ledger</span>
            </p>
          </CardContent>
        </Card>

        {/* vital signs: blood pressure */}
        <Card className="border shadow-none rounded-none bg-card">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-[#22c55e]" /> BP Readings History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            {bpHistory.length > 0 ? (
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
                {bpHistory.map((b, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{b.date}:</span>
                    <span className="font-bold text-[#22c55e]">{b.bp} mmHg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-4">No blood pressure vitals logged.</p>
            )}
          </CardContent>
        </Card>

        {/* vital signs: respiratory rate */}
        <Card className="border shadow-none rounded-none bg-card">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-[#22c55e]" /> Resp. Rate Readings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            {rrHistory.length > 0 ? (
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
                {rrHistory.map((r, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">{r.date}:</span>
                    <span className="font-bold text-[#22c55e]">{r.rr} bpm</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-4">No respiratory rate vitals logged.</p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* structured ledger summary: medications and lab tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* cumulative medications */}
        <Card className="border shadow-none rounded-none bg-card">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Pill className="h-5 w-5 text-[#22c55e]" /> Prescribed Medications Registry
            </CardTitle>
            <CardDescription className="text-xs font-normal">Accumulated medication ledger history.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {allMeds.length > 0 ? (
              <div className="space-y-3">
                {allMeds.map((med, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 border border-border/60 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-foreground">{med.name} ({med.dosage})</p>
                      <p className="text-muted-foreground mt-0.5">Duration: {med.duration}</p>
                    </div>
                    <Badge variant="outline" className="rounded-none">
                      {med.classification}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-10">No medications logged in this patient file.</p>
            )}
          </CardContent>
        </Card>

        {/* cumulative diagnostic tests */}
        <Card className="border shadow-none rounded-none bg-card">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#22c55e]" /> Diagnostic &amp; Lab Tests
            </CardTitle>
            <CardDescription className="text-xs font-normal">Chronological test result records.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {allTests.length > 0 ? (
              <div className="space-y-3">
                {allTests.map((t, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 border border-border/60 flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">{t.testName}</span>
                    <span className="font-bold text-[#22c55e]">{t.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-10">No diagnostic tests logged in this patient file.</p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* detailed chronological history logs */}
      <div className="space-y-6">
        <Separator />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Chronological Consultation History ({totalConsultations})</h2>
          <p className="text-base text-muted-foreground mt-1 font-normal">Past prescription logs, symptoms and practitioner notes.</p>
        </div>

        {patient.history.length > 0 ? (
          <div className="space-y-4">
            {[...patient.history]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => {
                const isExpanded = expandedRecord === record.recordId;
                return (
                  <Card key={record.recordId} className="border shadow-sm rounded-none bg-card">
                    <CardHeader className="py-4 cursor-pointer" onClick={() => setExpandedRecord(isExpanded ? null : record.recordId)}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Stethoscope className="h-5 w-5 text-[#22c55e]" />
                          <div>
                            <h3 className="text-base font-bold text-foreground">{record.doctorName}</h3>
                            <p className="text-xs text-muted-foreground">{record.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-[#22c55e] font-bold">
                            {record.medicines.length} Meds · {record.testResults.length} Tests
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="border-t pt-4 space-y-4 text-xs">
                        {/* case summary */}
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground uppercase font-bold">Case Symptoms Summary</span>
                          <p className="text-sm font-normal text-foreground whitespace-pre-wrap">{record.patientCase}</p>
                        </div>

                        {/* vitals summary */}
                        {(record.bloodPressure || record.respiratoryRate) && (
                          <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 border border-border/60">
                            {record.bloodPressure && (
                              <div>
                                <span className="text-muted-foreground block">Blood Pressure:</span>
                                <span className="font-bold text-foreground">{record.bloodPressure} mmHg</span>
                              </div>
                            )}
                            {record.respiratoryRate && (
                              <div>
                                <span className="text-muted-foreground block">Respiratory Rate:</span>
                                <span className="font-bold text-foreground">{record.respiratoryRate} bpm</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* prescribed medicines */}
                        {record.medicines.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase font-bold">Prescribed Medicines</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {record.medicines.map((m, idx) => (
                                <div key={idx} className="p-2 border bg-muted/10 rounded-none flex justify-between">
                                  <span>{m.name} · {m.dosage} ({m.duration})</span>
                                  <Badge variant="outline" className="text-[10px] scale-90">{m.classification}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* diagnostic tests */}
                        {record.testResults.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase font-bold">Lab & Diagnostic Tests</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {record.testResults.map((t, idx) => (
                                <div key={idx} className="p-2 border bg-muted/10 rounded-none flex justify-between">
                                  <span>{t.testName}</span>
                                  <span className="font-bold text-[#22c55e]">{t.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
          </div>
        ) : (
          <Card className="border border-dashed py-16 text-center rounded-none bg-card">
            <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-lg font-bold text-foreground">No Records Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto font-normal">
              No historical prescriptions have been indexed for this patient folder yet.
            </p>
          </Card>
        )}
      </div>

    </div>
  );
}
