"use client";

import { useState, useEffect } from "react";
import { useMedicalRecords, useDoctors } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, Stethoscope, FileClock, ClipboardList, Trash2, CheckCircle2, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  symptoms: string;
  status: string;
}

export default function AppointmentsPage() {
  const { isLoaded } = useMedicalRecords();
  const { doctors } = useDoctors();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // redesigned form state
  const [patientName, setPatientName] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointDate, setAppointDate] = useState("");
  const [appointTime, setAppointTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  useEffect(() => {
    const localData = localStorage.getItem("ai-phms-appointments");
    if (localData) {
      setAppointments(JSON.parse(localData));
    } else {
      // mock seed appointments matching our ibn sina doctors list
      const seed = [
        {
          id: "app-1",
          patientName: "Hridoy Rahman",
          doctorName: "Prof. Dr. M. Touhidul Haque",
          specialty: "Cardiology",
          date: "2026-06-16",
          time: "06:30 PM",
          symptoms: "Mild chest tightness during exercise",
          status: "Scheduled"
        },
        {
          id: "app-2",
          patientName: "Sarah Begum",
          doctorName: "Prof. Dr. Md. Mahbubur Rahman",
          specialty: "Neurology",
          date: "2026-06-17",
          time: "07:00 PM",
          symptoms: "Recurrent migraines with aura",
          status: "Completed"
        }
      ];
      setAppointments(seed);
      localStorage.setItem("ai-phms-appointments", JSON.stringify(seed));
    }
  }, []);

  // set default doctor selection to the first doctor once loaded
  useEffect(() => {
    if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [doctors, selectedDoctorId]);

  const saveAppointments = (list: Appointment[]) => {
    setAppointments(list);
    localStorage.setItem("ai-phms-appointments", JSON.stringify(list));
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.warning("Please enter the patient full name.");
      return;
    }

    const docMatch = doctors.find((d) => d.id === selectedDoctorId);
    if (!docMatch) {
      toast.warning("Please select a practitioner from the specialists list.");
      return;
    }

    if (!appointDate || !appointTime) {
      toast.warning("Please select a date and time slot.");
      return;
    }

    const newApp: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      patientName: patientName.trim(),
      doctorName: docMatch.name,
      specialty: docMatch.specialty,
      date: appointDate,
      time: appointTime,
      symptoms: symptoms.trim(),
      status: "Scheduled"
    };

    const updated = [newApp, ...appointments];
    saveAppointments(updated);
    toast.success(`Appointment successfully booked with ${docMatch.name}!`);

    // reset form (keep doctor selected)
    setPatientName("");
    setAppointDate("");
    setAppointTime("");
    setSymptoms("");
  };

  const handleDelete = (id: string) => {
    const updated = appointments.filter((app) => app.id !== id);
    saveAppointments(updated);
    toast.info("Appointment record deleted.");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground font-mono text-base">
        Resolving Clinical Ledger schedules...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Appointments Manager</h1>
        <p className="text-muted-foreground mt-1 text-base font-normal">Schedule and monitor active clinic consultation slots.</p>
      </div>

      {/* grid changed to a 12-column layout to allow wider right sidebar and custom widths */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* column 1: schedule new appointment form (manual typing) - span 4/12 */}
        <div className="lg:col-span-4">
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#22c55e]" /> Book Consultation
                </CardTitle>
                <CardDescription className="text-xs font-normal">Add consultation logs to clinic schedule.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSchedule} className="space-y-4 text-left">
                  
                  {/* manual patient name field */}
                  <div className="space-y-1.5">
                    <Label htmlFor="ptNameInput" className="text-xs font-bold uppercase flex items-center gap-1">
                      <UserPlus className="h-3.5 w-3.5 text-[#22c55e]" /> Patient Full Name *
                    </Label>
                    <Input
                      id="ptNameInput"
                      required
                      placeholder="Type patient full name manually..."
                      className="rounded-none font-normal"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  {/* selected doctor indicator (selected from column 3) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase">Assigned Doctor *</Label>
                    {selectedDoctorId ? (
                      (() => {
                        const activeDoc = doctors.find((d) => d.id === selectedDoctorId);
                        return activeDoc ? (
                          <div className="p-3 border-2 border-[#22c55e] bg-[#22c55e]/5 flex justify-between items-start">
                            <div>
                              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                <Stethoscope className="h-4 w-4 text-[#22c55e]" />
                                <span>{activeDoc.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {activeDoc.designation || activeDoc.specialty}
                              </div>
                              <div className="text-[10px] text-[#22c55e] font-bold mt-1.5 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {activeDoc.counsellingTime || "Mon - Fri"}
                              </div>
                            </div>
                            <Badge className="bg-[#22c55e] hover:bg-[#22c55e] text-white rounded-none text-[9px]">ACTIVE</Badge>
                          </div>
                        ) : (
                          <div className="p-3 border-2 border-dashed border-border text-center text-xs text-muted-foreground">
                            Please select a doctor from the Doctors List.
                          </div>
                        );
                      })()
                    ) : (
                      <div className="p-3 border-2 border-dashed border-border text-center text-xs text-muted-foreground">
                        Please select a doctor from the Doctors List.
                      </div>
                    )}
                  </div>

                  {/* date */}
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

                  {/* time slot */}
                  <div className="space-y-1.5">
                    <Label htmlFor="appTime" className="text-xs font-bold uppercase">Time Slot / Serial *</Label>
                    <Input
                      id="appTime"
                      placeholder="e.g. 06:30 PM"
                      required
                      className="rounded-none font-normal"
                      value={appointTime}
                      onChange={(e) => setAppointTime(e.target.value)}
                    />
                  </div>

                  {/* symptoms */}
                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-bold uppercase">Symptoms / Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Brief concerns..."
                      className="rounded-none font-normal"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold"
                  >
                    Schedule Appointment
                  </Button>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* column 2: appointment list - span 4/12 */}
        <div className="lg:col-span-4">
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-border/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-[#22c55e]" /> Appointment List
                  </CardTitle>
                  <CardDescription className="text-xs font-normal">List of scheduled patient appointments.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-none text-xs">
                  {appointments.length} scheduled
                </Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="max-h-[520px] overflow-y-auto pr-1 space-y-4">
                  {appointments.length > 0 ? (
                    <div className="divide-y divide-border/40">
                      {appointments.map((app) => (
                        <div key={app.id} className="py-3.5 flex justify-between items-start text-xs group">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-foreground">{app.patientName}</p>
                              <Badge variant={app.status === "Scheduled" ? "default" : "secondary"} className="rounded-none text-[9px] scale-90">
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Stethoscope className="h-3.5 w-3.5 text-[#22c55e]" />
                              <span>Assigned: {app.doctorName}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-[#22c55e]" />
                              <span>Slot: {app.date} · {app.time}</span>
                            </p>
                            {app.symptoms && (
                              <p className="text-[10px] bg-muted/40 p-1.5 border border-border/40 mt-1 max-w-[280px] text-muted-foreground font-sans">
                                <span className="font-bold font-mono text-[9px]">Notes: </span> {app.symptoms}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-none text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDelete(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-muted-foreground">
                      <FileClock className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm font-bold">No active appointments scheduled.</p>
                      <p className="text-xs mt-1 font-normal">Fill in the scheduling form to create a slot.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* column 3: doctors list (right sidebar) - span 4/12 */}
        <div className="lg:col-span-4">
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md h-full flex flex-col justify-between">
            <div>
              {/* reduced padding in header */}
              <CardHeader className="border-b border-border/60 px-3 py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-[#22c55e]" /> Doctors List
                </CardTitle>
                <CardDescription className="text-xs font-normal">Click a doctor to choose them for booking.</CardDescription>
              </CardHeader>
              
              {/* reduced padding in content to increase usable width */}
              <CardContent className="pt-6 px-3">
                {/* fixed height div with custom scrolling */}
                <div className="h-[520px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-primary">
                  {doctors.map((d) => {
                    const isSelected = selectedDoctorId === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDoctorId(d.id)}
                        className={`p-3 border-2 text-xs transition-all cursor-pointer relative ${
                          isSelected
                            ? "border-[#22c55e] bg-[#22c55e]/5"
                            : "border-border/60 bg-card/40 hover:border-border hover:bg-muted/30"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-4.5 w-4.5 text-[#22c55e]" />
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground pr-6">{d.name}</p>
                          
                          {/* designation */}
                          <div className="text-xs text-[#22c55e] font-semibold">
                            {d.designation || "Senior Doctor"}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1 font-sans">
                            Dept: <span className="font-mono text-foreground font-bold">{d.specialty}</span>
                          </p>

                          {/* visiting hours */}
                          <div className="mt-2 pt-2 border-t border-border/40 flex items-center gap-1.5 text-muted-foreground text-[10px]">
                            <Clock className="h-3.5 w-3.5 text-[#22c55e]" />
                            <span>Visiting Hours: <strong className="text-foreground font-mono">{d.counsellingTime || "N/A"}</strong></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
