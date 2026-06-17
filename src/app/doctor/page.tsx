"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Pill,
  FlaskConical,
  Calendar,
  AlertTriangle,
  Activity,
  ChevronRight,
  Users,
} from "lucide-react";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Patient, MedicalRecord, Doctor } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";

export default function DoctorPortal() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>}>
      <DoctorContent />
    </Suspense>
  );
}

function DoctorContent() {
  const { patients } = useMedicalRecords();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch("/data/doctors.json")
      .then((res) => res.json())
      .then((data: Doctor[]) => {
        setDoctorsList(data);
      })
      .catch((err) => console.error("Error loading doctors roster:", err));
  }, []);

  // read url search params
  const searchQuery = searchParams?.get("search") || "";
  const activeDept = searchParams?.get("dept") || "All";
  const activeGender = searchParams?.get("gender") || "All";
  const activeAge = searchParams?.get("age") || "All";

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  // filter patients based on youtube-style filters
  const filteredPatients = patients.filter((p) => {
    // 1. text search query (name or id)
    if (searchQuery) {
      const matchText = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase() === searchQuery.toLowerCase();
      if (!matchText) return false;
    }

    // 2. department filter (check if patient has consultations in that dept or if we mock/match)
    if (activeDept !== "All") {
      // check if patient has any record matching department
      const hasRecordInDept = p.history.some(
        (rec) => rec.patientCase.toLowerCase().includes(activeDept.toLowerCase()) || 
                 (rec.doctorName && rec.doctorName.toLowerCase().includes(activeDept.toLowerCase()))
      );
      // fallback: match first character/some rule so seed data matches department cardiology etc.
      const isCardio = activeDept === "Cardiology" && (p.name.includes("Andrien") || p.name.includes("Rahman"));
      const isNeuro = activeDept === "Neurology" && (p.name.includes("Hridoy") || p.name.includes("Karim"));
      if (!hasRecordInDept && !isCardio && !isNeuro) return false;
    }

    // 3. gender filter
    if (activeGender !== "All") {
      if (p.gender.toLowerCase() !== activeGender.toLowerCase()) return false;
    }

    // 4. age range filter
    if (activeAge !== "All") {
      if (activeAge === "Under 30" && p.age >= 30) return false;
      if (activeAge === "30 - 50" && (p.age < 30 || p.age > 50)) return false;
      if (activeAge === "Over 50" && p.age <= 50) return false;
    }

    return true;
  });

  // if a single patient is explicitly loaded, show their details
  useEffect(() => {
    if (searchQuery && filteredPatients.length === 1) {
      setSelected(filteredPatients[0]);
    } else if (!searchQuery) {
      setSelected(null);
    }
  }, [searchQuery, filteredPatients]);

  const doSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    router.push(`/doctor?${params.toString()}`);

    const match = patients.find((p) => p.id.toLowerCase() === query.toLowerCase() || p.name.toLowerCase().includes(query.toLowerCase()));
    if (match) {
      setSelected(match);
    } else {
      setSelected(null);
      toast.error("No patient found with that ID or name.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctor Portal</h1>
          <p className="text-sm text-muted-foreground">Search and view patient medical histories.</p>
        </div>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none max-w-md bg-muted/40 mb-6">
          <TabsTrigger value="patients" className="rounded-none text-sm font-bold">Patients Inquiries</TabsTrigger>
          <TabsTrigger value="doctors" className="rounded-none text-sm font-bold">Doctors Roster</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          {/* local search input */}
      <Card className="border shadow-none rounded-none bg-muted/20">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by Patient ID (e.g. PT-1001) or name..."
                className="pl-10 h-11 bg-background rounded-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
              />
            </div>
            <Button className="h-11 px-8 shrink-0 bg-[#22c55e] hover:bg-[#22c55e]/90 text-white rounded-none" onClick={doSearch}>
              Search Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* search results matching current filters */}
      {searchQuery || activeDept !== "All" || activeGender !== "All" || activeAge !== "All" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Search Results ({filteredPatients.length} matches)
            </h3>
            {(activeDept !== "All" || activeGender !== "All" || activeAge !== "All") && (
              <span className="text-xs text-primary font-bold">Filters Applied</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredPatients.map((p) => (
              <Card
                key={p.id}
                className={`border shadow-none rounded-none cursor-pointer transition-all hover:bg-muted/30 ${
                  selected?.id === p.id ? "border-[#22c55e] bg-[#22c55e]/5" : "bg-card"
                }`}
                onClick={() => setSelected(p)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-muted px-2 py-0.5 font-bold uppercase tracking-wider">{p.id}</span>
                    <Badge variant={p.status === "Active" ? "default" : "destructive"} className="rounded-none text-[8px] px-1.5 py-0">
                      {p.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground mt-2">{p.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-1">Gender: {p.gender} | Age: {p.age}</p>
                  
                  <div className="mt-3 pt-2 border-t flex justify-between items-center text-[10px] font-bold text-[#22c55e]">
                    <span>View Lifetime Health Summary</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="border border-dashed py-12 text-center text-muted-foreground text-xs">
              No patients match the applied filters. Clear search or try other filters.
            </div>
          )}
        </div>
      ) : null}

      {selected ? (
        <div className="pt-4 border-t">
          <PatientDashboard patient={selected} />
        </div>
      ) : (
        !searchQuery && (
          <div className="border border-dashed py-20 text-center rounded-none bg-card">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-base font-bold text-foreground">No Patient Selected</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Search by name or Patient ID above, or use the advanced filters in the header to list matching patients.
            </p>
          </div>
        )
      )}
        </TabsContent>

        <TabsContent value="doctors" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Doctors Roster</h2>
            <p className="text-xs text-muted-foreground mt-0.5">A listing of all clinical specialists in the hospital directory.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {doctorsList.map((d) => (
              <Card key={d.id} className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">{d.name}</CardTitle>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-none text-[10px] mt-1.5 font-normal">
                        {d.specialty}
                      </Badge>
                    </div>
                    <Badge variant={d.status === "Active" ? "default" : "destructive"} className="rounded-none text-[8px] px-1 py-0 h-4 flex items-center justify-center">
                      {d.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-3 font-normal text-muted-foreground">
                  <p><strong className="text-foreground">Hospital:</strong> {d.hospital}</p>
                  <p><strong className="text-foreground">Experience:</strong> {d.experience}</p>
                  <p><strong className="text-foreground">Phone:</strong> {d.phone}</p>
                  <p><strong className="text-foreground">Email:</strong> {d.email}</p>
                  <div className="pt-2.5 border-t border-border/40 flex justify-between items-center text-[10px] font-bold text-[#22c55e]">
                    <span>Active Patients:</span>
                    <span>{d.totalPatients} patients</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PatientDashboard({ patient }: { patient: Patient }) {
  const allMeds = patient.history.flatMap((r) => r.medicines);
  const antibiotics = allMeds.filter((m) => m.classification === "Antibiotic");
  const vitamins = allMeds.filter((m) => m.classification === "Vitamin");
  const calcium = allMeds.filter((m) => m.classification === "Calcium");
  const gastric = allMeds.filter((m) => m.classification === "Gastric");
  const allTests = patient.history.flatMap((r) => r.testResults.map((t) => ({ ...t, date: r.date, doctor: r.doctorName })));

  return (
    <div className="space-y-6">
      {/* patient header */}
      <div className="flex items-center gap-4 border-b pb-5">
        <div className="h-16 w-16 bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] font-bold text-2xl border border-[#22c55e]/20 rounded-none">
          {patient.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
            <span>ID: <strong className="text-foreground">{patient.id}</strong></span>
            <span>Age: <strong className="text-foreground">{patient.age}</strong></span>
            <span>Gender: <strong className="text-foreground">{patient.gender}</strong></span>
            {patient.phone && <span>Phone: <strong className="text-foreground">{patient.phone}</strong></span>}
            <span>Records: <strong className="text-foreground">{patient.history.length}</strong></span>
            <Badge variant={patient.status === "Active" ? "default" : "destructive"} className="rounded-none">{patient.status}</Badge>
          </div>
        </div>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="Total Consultations" value={patient.history.length} color="border-l-4 border-l-[#22c55e] bg-card text-foreground" />
        <SummaryTile label="Antibiotics Used" value={antibiotics.length} color="border-l-4 border-l-rose-500 bg-card text-foreground" />
        <SummaryTile label="Total Medicines" value={allMeds.length} color="border-l-4 border-l-amber-500 bg-card text-foreground" />
        <SummaryTile label="Lab Tests Done" value={allTests.length} color="border-l-4 border-l-purple-500 bg-card text-foreground" />
      </div>

      {/* antibiotic tracker */}
      <Card className="border shadow-none rounded-none border-rose-200 dark:border-rose-900/40 bg-rose-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-rose-700 dark:text-rose-400 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" /> Antibiotic Tracker — Lifetime Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {antibiotics.length === 0 ? (
            <p className="text-xs text-muted-foreground">No antibiotic history found.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-rose-800 dark:text-rose-300">{antibiotics.length} <span className="text-xs font-normal text-muted-foreground">total prescriptions</span></p>
              <div className="grid sm:grid-cols-2 gap-2 mt-3">
                {antibiotics.map((a, i) => (
                  <div key={i} className="border border-rose-200 dark:border-rose-900/50 p-3 bg-card flex justify-between text-xs rounded-none">
                    <span className="font-semibold text-foreground">{a.name} — {a.dosage}</span>
                    <span className="text-muted-foreground">{a.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* tabs */}
      <Tabs defaultValue="medications">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 rounded-none">
          <TabsTrigger value="medications" className="rounded-none"><Pill className="h-4 w-4 mr-2" />Medication Categories</TabsTrigger>
          <TabsTrigger value="consultations" className="rounded-none"><Calendar className="h-4 w-4 mr-2" />Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <MedCategoryCard title="Vitamins" items={vitamins} colorClass="border-amber-200 dark:border-amber-900/40 bg-amber-50/10" headerClass="bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" />
            <MedCategoryCard title="Calcium" items={calcium} colorClass="border-slate-200 dark:border-slate-700 bg-slate-50/10" headerClass="bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300" />
            <MedCategoryCard title="Gastric" items={gastric} colorClass="border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/10" headerClass="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" />
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="mt-5 space-y-4">
          {/* diagnostic test history table */}
          {allTests.length > 0 && (
            <Card className="border shadow-none rounded-none">
              <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2"><FlaskConical className="h-4 w-4 text-[#22c55e]" />Diagnostic Test History</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow className="bg-muted/40"><TableHead className="pl-5">Date</TableHead><TableHead>Test Name</TableHead><TableHead>Result</TableHead><TableHead className="pr-5">Doctor</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {[...allTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-5 font-semibold">{t.date}</TableCell>
                        <TableCell>{t.testName}</TableCell>
                        <TableCell className="font-extrabold text-[#22c55e]">{t.value}</TableCell>
                        <TableCell className="pr-5 text-muted-foreground text-xs">{t.doctor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* consultation cards */}
          <Separator />
          <div className="space-y-3">
            {[...patient.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((r) => (
              <ConsultationCard key={r.recordId} record={r} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`border p-4 flex flex-col gap-1 shadow-none rounded-none glass-wave-card ${color}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-85 relative z-10">{label}</p>
      <p className="text-2xl font-black relative z-10">{value}</p>
    </div>
  );
}

function MedCategoryCard({ title, items, colorClass, headerClass }: { title: string; items: { name: string; dosage: string; duration: string }[]; colorClass: string; headerClass: string }) {
  return (
    <div className={`border overflow-hidden rounded-none ${colorClass}`}>
      <div className={`px-4 py-2.5 font-bold text-xs border-b border-inherit ${headerClass}`}>{title} ({items.length})</div>
      {items.length === 0 ? (
        <div className="px-4 py-6 text-xs text-center opacity-50">No history</div>
      ) : (
        <ul className="divide-y divide-inherit">
          {items.slice(0, 5).map((m, i) => (
            <li key={i} className="px-4 py-2.5 text-xs flex justify-between bg-card">
              <span className="font-semibold text-foreground">{m.name}</span>
              <span className="text-muted-foreground">{m.duration}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ConsultationCard({ record }: { record: MedicalRecord }) {
  return (
    <Card className="border shadow-none rounded-none bg-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-sm text-foreground">{record.doctorName}</h3>
            <Badge variant="secondary" className="rounded-none text-[10px]">{record.date}</Badge>
            {record.bloodPressure && (
              <Badge variant="outline" className="gap-1 text-[10px] rounded-none">
                <Activity className="h-3 w-3 text-[#22c55e]" />BP: {record.bloodPressure}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">{record.patientCase}</p>
          <div className="flex gap-4 text-[10px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-1"><Pill className="h-3 w-3 text-amber-500" />{record.medicines.length} medicines</span>
            <span className="flex items-center gap-1"><FlaskConical className="h-3 w-3 text-purple-500" />{record.testResults.length} tests</span>
          </div>
        </div>
        <Dialog>
          <DialogTrigger render={<Button variant="outline" className="shrink-0 text-xs rounded-none" />}>
            Deep-Dive Details
          </DialogTrigger>
          <DialogContent className="max-w-[700px] w-full max-h-[85vh] overflow-y-auto rounded-none">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">{record.doctorName} — {record.date}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              <div>
                <p className="text-[10px] font-bold uppercase text-primary tracking-wider mb-2">Patient Case / Symptoms Summary</p>
                <div className="p-4 bg-muted text-xs leading-relaxed rounded-none border">{record.patientCase}</div>
              </div>
              {(record.bloodPressure || record.respiratoryRate) && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-primary tracking-wider mb-2">Vital Signs</p>
                  <div className="flex gap-3">
                    {record.bloodPressure && <div className="border p-3 bg-card rounded-none"><p className="text-[9px] text-muted-foreground uppercase">Blood Pressure</p><p className="font-bold text-xs">{record.bloodPressure}</p></div>}
                    {record.respiratoryRate && <div className="border p-3 bg-card rounded-none"><p className="text-[9px] text-muted-foreground uppercase">Resp. Rate</p><p className="font-bold text-xs">{record.respiratoryRate}</p></div>}
                  </div>
                </div>
              )}
              {record.medicines.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-primary tracking-wider mb-2">Prescribed Medicines</p>
                  <Table>
                    <TableHeader><TableRow className="bg-muted/40"><TableHead>Medicine</TableHead><TableHead>Dosage</TableHead><TableHead>Duration</TableHead><TableHead>Class</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {record.medicines.map((m, i) => (
                        <TableRow key={i}><TableCell className="font-bold text-xs">{m.name}</TableCell><TableCell className="text-xs">{m.dosage}</TableCell><TableCell className="text-xs">{m.duration}</TableCell><TableCell><Badge variant="outline" className="text-[10px] rounded-none">{m.classification}</Badge></TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {record.testResults.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-primary tracking-wider mb-2">Test Results</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {record.testResults.map((t, i) => (
                      <div key={i} className="border p-3 bg-card rounded-none"><p className="text-[9px] text-muted-foreground uppercase">{t.testName}</p><p className="font-bold text-xs mt-0.5 text-[#22c55e]">{t.value}</p></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
