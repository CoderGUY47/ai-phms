"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Doctor } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Stethoscope,
  Phone,
  Mail,
  Building,
  Award,
  CalendarDays,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function DoctorsDirectory() {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [appointDoc, setAppointDoc] = useState<Doctor | null>(null);
  
  // appointment form state
  const [patientName, setPatientName] = useState("");
  const [appointDate, setAppointDate] = useState("");
  const [appointTime, setAppointTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  useEffect(() => {
    fetch("/data/doctors.json")
      .then((res) => res.json())
      .then((data: Doctor[]) => {
        setDoctorsList(data);
      })
      .catch((err) => console.error("Error loading doctors directory:", err));
  }, []);

  const filteredDocs = doctorsList.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMakeAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !appointDate || !appointTime) {
      toast.warning("Please fill in all required appointment fields.");
      return;
    }
    
    // save to local storage for appointments page consistency
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Specialists Directory</h1>
        <p className="text-muted-foreground mt-1 text-base font-normal">Browse and request appointments with hospital department leads.</p>
      </div>

      {/* filter and search bar */}
      <Card className="border shadow-none rounded-none bg-muted/20">
        <CardContent className="pt-5 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, specialty, or hospital affiliation..."
              className="pl-10 h-11 rounded-none text-base font-normal bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* grid of doctor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((d) => (
          <Card key={d.id} className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md flex flex-col justify-between">
            <CardHeader className="pb-4 border-b border-border/60">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  {/* doctor name - size 2xl bold */}
                  <h2 className="text-2xl font-bold text-foreground leading-tight tracking-tight font-mono">
                    {d.name}
                  </h2>
                  <Badge className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 rounded-none text-sm font-normal px-2.5 py-0.5 mt-2">
                    {d.specialty}
                  </Badge>
                </div>
                <Badge variant={d.status === "Active" ? "default" : "destructive"} className="rounded-none text-xs font-mono">
                  {d.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5 text-base space-y-4 font-mono flex-1">
              {/* hospital - size xl normal */}
              <p className="text-xl font-normal text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-[#22c55e] shrink-0" />
                <span>{d.hospital}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground pt-1 border-t border-border/40">
                <p className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#22c55e]" />
                  <span>{d.experience} Exp</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <HeartHandshake className="h-4 w-4 text-[#22c55e]" />
                  <span>{d.totalPatients} Patients</span>
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground pt-3 border-t border-border/40">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#22c55e]" />
                  <span>{d.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#22c55e] truncate" />
                  <span>{d.email}</span>
                </p>
              </div>
            </CardContent>
            
            {/* card footer actions */}
            <div className="p-5 border-t border-border/60 bg-muted/10 grid grid-cols-3 gap-2">
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

        {filteredDocs.length === 0 && (
          <div className="col-span-full border border-dashed py-20 text-center rounded-none bg-card font-mono">
            <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold text-foreground">No Specialists Found</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto font-normal">
              Try modifying your search query or check back later.
            </p>
          </div>
        )}
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
    </div>
  );
}
