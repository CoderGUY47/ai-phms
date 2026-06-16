"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  Calendar,
  Pill,
  FlaskConical,
  Activity,
  Edit,
  Trash2,
  Plus,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMedicalRecords, useDoctors } from "@/hooks/useMedicalRecords";
import { processDocument } from "@/app/actions/process-document";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecord, Doctor } from "@/types";
import {
  Building,
  Phone,
  Mail,
  Clock,
  CalendarDays,
} from "lucide-react";

export default function PatientPortal() {
  const { patients, addRecord, deleteRecord, updateRecord, isLoaded } = useMedicalRecords();
  const { doctors: doctorsList } = useDoctors();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // doctor detail / booking states
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [appointDoc, setAppointDoc] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState("");
  const [appointDate, setAppointDate] = useState("");
  const [appointTime, setAppointTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const handleMakeAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !appointDate || !appointTime) {
      toast.warning("Please fill in all required appointment fields.");
      return;
    }
    const newAppointment = {
      id: Math.random().toString(36).substring(2, 9),
      patientName,
      doctorName: appointDoc?.name,
      specialty: appointDoc?.specialty,
      date: appointDate,
      time: appointTime,
      symptoms,
      status: "Scheduled"
    };
    const existing = JSON.parse(localStorage.getItem("ai-phms-appointments") || "[]");
    localStorage.setItem("ai-phms-appointments", JSON.stringify([newAppointment, ...existing]));
    toast.success(`Appointment scheduled successfully with ${appointDoc?.name}!`);
    setAppointDoc(null);
    setPatientName("");
    setAppointDate("");
    setAppointTime("");
    setSymptoms("");
  };

  const activePatients = patients.filter((p) => p.status === "Active");
  const selectedPatient = patients.find((p) => p.id === (selectedPatientId || activePatients[0]?.id));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => res((reader.result as string).split(",")[1]);
      reader.onerror = rej;
    });

  const handleProcess = async () => {
    if (!file) return;
    const patientId = selectedPatientId || activePatients[0]?.id || "PT-1001";
    setIsProcessing(true);
    setSuccess(false);
    try {
      const base64 = await fileToBase64(file);
      const result = await processDocument(base64, file.type, file.name);
      if (result.success && result.data) {
        addRecord({ recordId: uuidv4(), patientId, ...result.data });
        setSuccess(true);
        toast.success("Document processed and saved successfully!");
      } else {
        toast.error(result.error || "Failed to process document");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Patient Portal</h1>
        <p className="text-muted-foreground mt-1 text-base font-normal">Upload prescriptions for AI extraction and secure local storage.</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none max-w-md bg-muted/40 mb-6">
          <TabsTrigger value="upload" className="rounded-none text-sm font-bold">Prescription Hub</TabsTrigger>
          <TabsTrigger value="doctors" className="rounded-none text-sm font-bold">Our Specialists Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* redesigned to occupy full width */}
          <div className="space-y-6">
        
        {/* document ingestion card */}
        <Card className="border shadow-sm rounded-none bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Document Upload Center</CardTitle>
            <CardDescription className="text-base font-normal">Drag and drop your prescription or medical report (PNG, JPEG, PDF).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* patient selector */}
            <div className="space-y-2">
              <label className="text-base font-bold text-muted-foreground block">Select Patient Profile</label>
              <Select
                value={selectedPatientId}
                onValueChange={(v) => setSelectedPatientId(v || "")}
              >
                <SelectTrigger className="w-full h-11 text-base rounded-none font-normal">
                  <SelectValue placeholder={isLoaded ? "Choose a patient..." : "Loading patients..."} />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {activePatients.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-base font-normal">
                      {p.name} — {p.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* drop zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors rounded-none ${
                isDragActive ? "border-[#22c55e] bg-[#22c55e]/5" : "border-muted-foreground/25 hover:border-[#22c55e]/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="bg-[#22c55e]/10 p-5 mb-4 rounded-none">
                <UploadCloud className="h-10 w-10 text-[#22c55e]" />
              </div>
              <h3 className="text-xl font-bold mb-1">Click to upload or drag and drop</h3>
              <p className="text-base text-muted-foreground font-normal">PDF, PNG, JPG (max 10MB)</p>
            </div>

            {/* file list item */}
            {file && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 border bg-muted/30 rounded-none justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2.5 border rounded-none">
                    <FileText className="h-6 w-6 text-[#22c55e]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground font-normal">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive font-bold text-base hover:bg-destructive/10 rounded-none shrink-0" onClick={() => { setFile(null); setPreviewUrl(null); setSuccess(false); }}>
                  Remove File
                </Button>
              </div>
            )}

            {/* inline preview */}
            {previewUrl && file?.type.startsWith("image/") && (
              <div className="border p-4 bg-muted/20 rounded-none">
                <h4 className="text-base font-bold mb-3">Document Preview</h4>
                <div className="max-h-[450px] overflow-hidden flex justify-center bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="max-h-[430px] object-contain py-2" />
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* process button / status */}
        {file && (
          <Card className={`border shadow-sm rounded-none bg-card ${success ? "border-[#22c55e]" : ""}`}>
            <CardContent className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              {isProcessing ? (
                <>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-[#22c55e]/15 blur-xl animate-pulse" />
                    <Loader2 className="h-12 w-12 text-[#22c55e] animate-spin relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Engine Analyzing...</h3>
                    <p className="text-base text-muted-foreground mt-1 font-normal">Extracting medicines, dosages, and vital signs</p>
                  </div>
                </>
              ) : success ? (
                <>
                  <div className="bg-[#22c55e]/15 p-4 rounded-none">
                    <CheckCircle2 className="h-10 w-10 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#22c55e]">Extraction Complete!</h3>
                    <p className="text-base text-muted-foreground mt-1 font-normal">Saved to local ledger under {selectedPatient?.name ?? "patient"}.</p>
                  </div>
                  <Button className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold px-6 h-11 text-base" onClick={() => { setFile(null); setSuccess(false); }}>
                    Upload Another
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="w-full sm:w-auto px-10 h-12 bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold text-base rounded-none" onClick={handleProcess}>
                    Process with AI Engine
                  </Button>
                  <p className="text-sm text-muted-foreground font-normal">Document sent securely via Server Action.</p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* past records timeline */}
      {selectedPatient && selectedPatient.history.length > 0 && (
        <div className="space-y-6">
          <Separator />
          <div>
            <h2 className="text-2xl font-bold">Consultation History — {selectedPatient.name}</h2>
            <p className="text-base text-muted-foreground mt-1 font-normal">Records sorted newest first, stored in local ledger.</p>
          </div>
          <div className="space-y-4">
            {[...selectedPatient.history]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <RecordTimelineCard
                  key={record.recordId}
                  record={record}
                  doctorsList={doctorsList}
                  onDelete={() => deleteRecord(record.recordId, selectedPatient.id)}
                  onUpdate={(upd) => updateRecord(upd)}
                />
              ))}
          </div>
        </div>
      )}
        </TabsContent>

        <TabsContent value="doctors" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Specialists Directory</h2>
            <p className="text-base text-muted-foreground mt-1 font-normal">Active medical specialists registered in our clinical ledger.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            {doctorsList.map((d) => (
              <Card key={d.id} className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md flex flex-col justify-between">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      {/* doctor name - size 2xl bold */}
                      <CardTitle className="text-2xl font-bold text-foreground leading-tight tracking-tight">{d.name}</CardTitle>
                      <Badge className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 rounded-none text-xs mt-2 font-normal">
                        {d.specialty}
                      </Badge>
                    </div>
                    <Badge variant={d.status === "Active" ? "default" : "destructive"} className="rounded-none text-[10px]">
                      {d.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 text-sm space-y-3 font-normal text-muted-foreground flex-1">
                  {/* hospital - size xl normal */}
                  <p className="text-xl font-normal text-foreground flex items-center gap-1.5">
                    <Building className="h-4.5 w-4.5 text-[#22c55e]" />
                    <span>{d.hospital}</span>
                  </p>
                  <p><strong className="text-foreground">Experience:</strong> {d.experience}</p>
                  <p><strong className="text-foreground">Phone:</strong> {d.phone}</p>
                  <p><strong className="text-foreground">Email:</strong> {d.email}</p>
                  <div className="pt-2.5 border-t border-border/40 flex justify-between items-center text-xs font-bold text-[#22c55e]">
                    <span>Lifetime Patient Intake:</span>
                    <span>{d.totalPatients} patients</span>
                  </div>
                </CardContent>
                
                {/* actions */}
                <div className="p-4 border-t border-border/60 bg-muted/10 grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-none font-bold text-xs"
                    onClick={() => setSelectedDoc(d)}
                  >
                    View Details
                  </Button>
                  <Button
                    className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold text-xs"
                    onClick={() => setAppointDoc(d)}
                  >
                    Appointment
                  </Button>
                  <Link href={`/doctors/${d.id}`} className="w-full">
                    <Button variant="secondary" className="w-full rounded-none font-bold text-xs">
                      Full Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* 1. view details modal - size xl and 2xl with bold/normal font */}
          <Dialog open={selectedDoc !== null} onOpenChange={(open) => !open && setSelectedDoc(null)}>
            {selectedDoc && (
              <DialogContent className="sm:max-w-[550px] rounded-none bg-card text-foreground font-mono border-2 border-border">
                <DialogHeader className="border-b pb-4">
                  {/* doctor name heading - 2xl bold */}
                  <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Stethoscope className="h-6 w-6 text-[#22c55e]" /> {selectedDoc.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground font-normal">
                    Clinical specialist registration records and details
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                  {/* specialty details */}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Specialization & Dept</Label>
                    <div className="text-xl font-normal text-foreground">{selectedDoc.specialty} Department</div>
                  </div>

                  {/* hospital affiliation - xl normal */}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Primary Hospital Affiliation</Label>
                    <div className="text-xl font-normal text-[#22c55e]">{selectedDoc.hospital}</div>
                  </div>

                  {/* grid with statistics */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-b py-4 border-border/40">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase font-bold">Professional Experience</Label>
                      <div className="text-lg font-bold text-foreground">{selectedDoc.experience}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground uppercase font-bold">Lifetime Record Intake</Label>
                      <div className="text-lg font-bold text-foreground">{selectedDoc.totalPatients} registered patients</div>
                    </div>
                  </div>

                  {/* contact information */}
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Clinical Contact Points</Label>
                    <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#22c55e]" />
                        <span>Phone: {selectedDoc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#22c55e]" />
                        <span>Email: {selectedDoc.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#22c55e]" />
                        <span>Schedule: Mon - Fri (09:00 AM - 04:00 PM)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    className="rounded-none font-bold w-full sm:w-auto"
                    onClick={() => setSelectedDoc(null)}
                  >
                    Close Profile
                  </Button>
                  <Button
                    className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold w-full sm:w-auto"
                    onClick={() => {
                      setAppointDoc(selectedDoc);
                      setSelectedDoc(null);
                    }}
                  >
                    Book Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>

          {/* 2. make appointment modal */}
          <Dialog open={appointDoc !== null} onOpenChange={(open) => !open && setAppointDoc(null)}>
            {appointDoc && (
              <DialogContent className="sm:max-w-[500px] rounded-none bg-card text-foreground font-mono border-2 border-border">
                <form onSubmit={handleMakeAppointment}>
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      <CalendarDays className="h-6 w-6 text-[#22c55e]" /> Schedule Appointment
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Booking slot with {appointDoc.name} ({appointDoc.specialty})
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4 space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label htmlFor="ptName" className="text-xs font-bold uppercase">Patient Full Name *</Label>
                      <Input
                        id="ptName"
                        required
                        placeholder="Enter patient name..."
                        className="rounded-none font-normal"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="appDate" className="text-xs font-bold uppercase">Select Date *</Label>
                        <Input
                          id="appDate"
                          type="date"
                          required
                          className="rounded-none font-normal"
                          value={appointDate}
                          onChange={(e) => setAppointDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="appTime" className="text-xs font-bold uppercase">Select Time Slot *</Label>
                        <Input
                          id="appTime"
                          type="time"
                          required
                          className="rounded-none font-normal"
                          value={appointTime}
                          onChange={(e) => setAppointTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sympt" className="text-xs font-bold uppercase">Symptoms / Notes (Optional)</Label>
                      <Input
                        id="sympt"
                        placeholder="Brief description of symptoms..."
                        className="rounded-none font-normal"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                      />
                    </div>
                  </div>

                  <DialogFooter className="border-t pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none font-bold"
                      onClick={() => setAppointDoc(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold"
                    >
                      Confirm Appointment
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            )}
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RecordTimelineCardProps {
  record: MedicalRecord;
  doctorsList: Doctor[];
  onDelete: () => void;
  onUpdate: (updatedRecord: MedicalRecord) => void;
}

function RecordTimelineCard({ record, doctorsList, onDelete, onUpdate }: RecordTimelineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // form state
  const [docName, setDocName] = useState(record.doctorName);
  const [date, setDate] = useState(record.date);
  const [patientCase, setPatientCase] = useState(record.patientCase);
  const [bp, setBp] = useState(record.bloodPressure || "");
  const [rr, setRr] = useState(record.respiratoryRate || "");
  const [medicines, setMedicines] = useState(record.medicines);
  const [tests, setTests] = useState(record.testResults);

  const resetForm = () => {
    setDocName(record.doctorName);
    setDate(record.date);
    setPatientCase(record.patientCase);
    setBp(record.bloodPressure || "");
    setRr(record.respiratoryRate || "");
    setMedicines([...record.medicines]);
    setTests([...record.testResults]);
  };

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetForm();
    setIsEditOpen(true);
  };

  const handleSave = () => {
    onUpdate({
      ...record,
      doctorName: docName,
      date: date,
      patientCase: patientCase,
      bloodPressure: bp || undefined,
      respiratoryRate: rr || undefined,
      medicines: medicines,
      testResults: tests
    });
    setIsEditOpen(false);
    toast.success("Consultation record updated successfully.");
  };

  // medicine mutations
  const handleAddMed = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", classification: "Other" }]);
  };
  
  const handleRemoveMed = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedFieldChange = (index: number, field: keyof typeof medicines[0], value: any) => {
    const updated = medicines.map((m, i) => {
      if (i === index) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setMedicines(updated);
  };

  // test mutations
  const handleAddTest = () => {
    setTests([...tests, { testName: "", value: "" }]);
  };

  const handleRemoveTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleTestFieldChange = (index: number, field: keyof typeof tests[0], value: string) => {
    const updated = tests.map((t, i) => {
      if (i === index) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setTests(updated);
  };

  return (
    <Card className="border shadow-sm rounded-none bg-card">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-bold text-foreground">{record.doctorName}</span>
            <Badge variant="secondary" className="text-sm rounded-none font-normal">{record.date}</Badge>
            {record.bloodPressure && (
              <Badge variant="outline" className="text-sm gap-1 rounded-none font-normal">
                <Activity className="h-4 w-4 text-[#22c55e]" />BP: {record.bloodPressure}
              </Badge>
            )}
          </div>
          <p className="text-base text-muted-foreground line-clamp-2 max-w-3xl font-normal">{record.patientCase}</p>
          <div className="flex gap-4 text-sm text-muted-foreground font-normal">
            <span className="flex items-center gap-1.5"><Pill className="h-4 w-4 text-amber-500" />{record.medicines.length} medicines</span>
            <span className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4 text-purple-500" />{record.testResults.length} tests</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-blue-500" />{record.date}</span>
          </div>
        </div>
        
        {/* actions panel */}
        <div className="mt-4 md:mt-0 flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="text-base font-bold rounded-none h-10 px-4">
            {expanded ? "Collapse" : "View Details"}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenEdit}
            className="h-10 w-10 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 rounded-none shrink-0"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
            className="h-10 w-10 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t p-6 space-y-6 bg-muted/10">
          <div>
            <p className="text-sm font-bold uppercase text-primary tracking-wider mb-2">Case Summary</p>
            <p className="text-base leading-relaxed font-normal">{record.patientCase}</p>
          </div>
          {record.medicines.length > 0 && (
            <div>
              <p className="text-sm font-bold uppercase text-primary tracking-wider mb-2">Medicines Prescribed</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {record.medicines.map((m, i) => (
                  <div key={i} className="border p-4 bg-card flex justify-between items-start gap-2 rounded-none">
                    <div>
                      <p className="font-bold text-base">{m.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 font-normal">{m.dosage} · {m.duration}</p>
                    </div>
                    <Badge variant="outline" className="text-xs rounded-none font-normal shrink-0">{m.classification}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          {record.testResults.length > 0 && (
            <div>
              <p className="text-sm font-bold uppercase text-primary tracking-wider mb-2">Test Results</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {record.testResults.map((t, i) => (
                  <div key={i} className="border p-4 bg-card rounded-none">
                    <p className="text-sm text-muted-foreground font-normal">{t.testName}</p>
                    <p className="font-bold text-base mt-1">{t.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(record.respiratoryRate || record.bloodPressure) && (
            <div>
              <p className="text-sm font-bold uppercase text-primary tracking-wider mb-2">Vital Signs</p>
              <div className="flex gap-3">
                {record.bloodPressure && (
                  <div className="border p-4 bg-card rounded-none">
                    <p className="text-sm text-muted-foreground font-normal">Blood Pressure</p>
                    <p className="font-bold text-base mt-1">{record.bloodPressure}</p>
                  </div>
                )}
                {record.respiratoryRate && (
                  <div className="border p-4 bg-card rounded-none">
                    <p className="text-sm text-muted-foreground font-normal">Respiratory Rate</p>
                    <p className="font-bold text-base mt-1">{record.respiratoryRate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* delete confirmation dialog modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-none bg-card text-foreground font-mono">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Delete Record
            </DialogTitle>
            <DialogDescription className="font-normal text-sm text-muted-foreground mt-2">
              Are you sure you want to permanently delete this prescription record from {record.doctorName} on {record.date}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="rounded-none font-normal"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-none font-bold bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                onDelete();
                setIsDeleteOpen(false);
                toast.success("Record deleted successfully.");
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit record dialog modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-none max-h-[90vh] overflow-y-auto bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Consultation Record</DialogTitle>
            <DialogDescription className="font-normal text-sm text-muted-foreground">
              Modify the doctor details, symptoms, medicines, and tests for this record.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* primary details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <Label className="text-sm font-bold text-muted-foreground">Doctor Name</Label>
                <Select value={docName} onValueChange={(val) => setDocName(val || "")}>
                  <SelectTrigger className="w-full rounded-none font-normal h-10 text-xs bg-background">
                    <SelectValue placeholder="Select doctor..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {doctorsList.map((d) => (
                      <SelectItem key={d.id} value={d.name} className="text-xs font-normal">
                        {d.name} ({d.specialty})
                      </SelectItem>
                    ))}
                    {!doctorsList.some(d => d.name === docName) && docName && (
                      <SelectItem value={docName} className="text-xs font-normal">
                        {docName} (Custom)
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-muted-foreground">Consultation Date</Label>
                <Input
                  type="date"
                  className="rounded-none font-normal"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* case summary */}
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-muted-foreground">Case Summary / Symptoms</Label>
              <Textarea
                className="rounded-none min-h-[80px] font-normal"
                value={patientCase}
                onChange={(e) => setPatientCase(e.target.value)}
              />
            </div>

            {/* vital signs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-muted-foreground">Blood Pressure (BP)</Label>
                <Input
                  className="rounded-none font-normal"
                  value={bp}
                  placeholder="e.g. 120/80 mmHg"
                  onChange={(e) => setBp(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-muted-foreground">Respiratory Rate (RR)</Label>
                <Input
                  className="rounded-none font-normal"
                  value={rr}
                  placeholder="e.g. 18 breaths/min"
                  onChange={(e) => setRr(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* medicines editor */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold text-muted-foreground">Medicines Prescribed</Label>
                <Button variant="outline" size="sm" onClick={handleAddMed} className="h-8 text-xs font-bold rounded-none gap-1 border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/10">
                  <Plus className="h-3.5 w-3.5" /> Add Medicine
                </Button>
              </div>

              <div className="space-y-2">
                {medicines.map((m, index) => (
                  <div key={index} className="flex gap-2 items-center border p-3 bg-muted/20 relative">
                    <div className="grid grid-cols-12 gap-2 w-full">
                      <div className="col-span-4">
                        <Input
                          placeholder="Medicine Name"
                          className="rounded-none h-9 text-xs font-normal"
                          value={m.name}
                          onChange={(e) => handleMedFieldChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="Dosage"
                          className="rounded-none h-9 text-xs font-normal"
                          value={m.dosage}
                          onChange={(e) => handleMedFieldChange(index, "dosage", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Duration"
                          className="rounded-none h-9 text-xs font-normal"
                          value={m.duration}
                          onChange={(e) => handleMedFieldChange(index, "duration", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Select
                          value={m.classification}
                          onValueChange={(v) => handleMedFieldChange(index, "classification", v)}
                        >
                          <SelectTrigger className="rounded-none h-9 text-xs font-normal bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none text-xs font-normal">
                            {["Antibiotic", "Vitamin", "Calcium", "Gastric", "Painkiller", "Other"].map((cls) => (
                              <SelectItem key={cls} value={cls} className="text-xs font-normal">{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-none shrink-0"
                      onClick={() => handleRemoveMed(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {medicines.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center font-normal">No medicines added.</p>
                )}
              </div>
            </div>

            <Separator />

            {/* test results editor */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold text-muted-foreground">Test Results</Label>
                <Button variant="outline" size="sm" onClick={handleAddTest} className="h-8 text-xs font-bold rounded-none gap-1 border-purple-500/30 text-purple-500 hover:bg-purple-500/10">
                  <Plus className="h-3.5 w-3.5" /> Add Test
                </Button>
              </div>

              <div className="space-y-2">
                {tests.map((t, index) => (
                  <div key={index} className="flex gap-2 items-center border p-3 bg-muted/20">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Input
                        placeholder="Test Name"
                        className="rounded-none h-9 text-xs font-normal"
                        value={t.testName}
                        onChange={(e) => handleTestFieldChange(index, "testName", e.target.value)}
                      />
                      <Input
                        placeholder="Result Value"
                        className="rounded-none h-9 text-xs font-normal"
                        value={t.value}
                        onChange={(e) => handleTestFieldChange(index, "value", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-none shrink-0"
                      onClick={() => handleRemoveTest(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {tests.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center font-normal">No diagnostic tests added.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-none text-sm font-bold h-10 px-4">
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-none text-sm font-bold bg-[#22c55e] hover:bg-[#22c55e]/90 text-white h-10 px-4">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
