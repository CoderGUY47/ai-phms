"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Doctor } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Stethoscope,
  Phone,
  Mail,
  Building,
  Award,
  Clock,
  Users2,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/doctors.json")
      .then((res) => res.json())
      .then((data: Doctor[]) => {
        const doc = data.find((d) => d.id === id);
        if (doc) {
          setDoctor(doc);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading doctor profile:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground font-mono text-base">
        Resolving Doctor Dossier...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-6 text-center max-w-md mx-auto py-20 font-mono">
        <Stethoscope className="h-16 w-16 mx-auto text-destructive animate-pulse" />
        <h2 className="text-2xl font-bold text-foreground">Doctor Dossier Not Found</h2>
        <p className="text-sm text-muted-foreground font-normal">
          The requested identifier "{id}" does not correspond to any active clinical registrar.
        </p>
        <Button variant="outline" className="rounded-none font-bold" onClick={() => router.push("/doctors")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Directory
        </Button>
      </div>
    );
  }

  // mock schedule slots
  const scheduleSlots = [
    { day: "Monday", time: "09:00 AM - 01:00 PM", status: "Available" },
    { day: "Tuesday", time: "09:00 AM - 01:00 PM", status: "Fully Booked" },
    { day: "Wednesday", time: "02:00 PM - 06:00 PM", status: "Available" },
    { day: "Thursday", time: "09:00 AM - 01:00 PM", status: "Available" },
    { day: "Friday", time: "02:00 PM - 06:00 PM", status: "Surgery Slot" }
  ];

  // mock patient queue
  const patientQueue = [
    { queueNo: "01", patientName: "Hridoy Rahman", time: "09:15 AM", type: "First Consultation" },
    { queueNo: "02", patientName: "Sarah Begum", time: "09:45 AM", type: "Follow-up View" },
    { queueNo: "03", patientName: "Mohammed Kamal", time: "10:15 AM", type: "Lab Review" },
    { queueNo: "04", patientName: "Anika Tasnim", time: "11:00 AM", type: "Emergency Referral" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto font-mono">
      {/* breadcrumb header */}
      <div>
        <Button
          variant="ghost"
          className="rounded-none hover:bg-muted text-muted-foreground hover:text-foreground mb-4 pl-0 font-bold"
          onClick={() => router.push("/doctors")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Directory
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* doctor name - size 2xl bold */}
            <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
              {doctor.name}
            </h1>
            {/* specialty badge */}
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 rounded-none text-sm font-normal px-2.5 py-0.5">
                {doctor.specialty} Specialist
              </Badge>
              <Badge variant="outline" className="rounded-none text-xs">
                {doctor.id}
              </Badge>
            </div>
          </div>
          <Badge variant={doctor.status === "Active" ? "default" : "destructive"} className="rounded-none text-sm px-3 py-1">
            Status: {doctor.status}
          </Badge>
        </div>
      </div>

      {/* main profile dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* left column: quick stats & contact card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-lg font-bold text-foreground">Clinical Profile</CardTitle>
              <CardDescription className="text-xs font-normal">Primary clinical information summary.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              
              {/* hospital affiliation - xl normal */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold">Primary Facility</p>
                <p className="text-xl font-normal text-foreground flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#22c55e] shrink-0" />
                  <span>{doctor.hospital}</span>
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-border/40">
                <p className="text-xs text-muted-foreground uppercase font-bold">Years of Practice</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#22c55e]" />
                  <span>{doctor.experience} experience</span>
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-border/40">
                <p className="text-xs text-muted-foreground uppercase font-bold">Consultation Stats</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-[#22c55e]" />
                  <span>{doctor.totalPatients} Patients Intake</span>
                </p>
              </div>

              <div className="space-y-3 pt-5 border-t border-border/40">
                <p className="text-xs text-muted-foreground uppercase font-bold">Contact Directory</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#22c55e]" />
                    <span>{doctor.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-[#22c55e] shrink-0" />
                    <span>{doctor.email}</span>
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* right columns: roster calendar & queue slots */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* scheduling roster */}
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#22c55e]" /> Weekly Practice Calendar
              </CardTitle>
              <CardDescription className="text-xs font-normal">Active duty consultation slots and availability times.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="divide-y divide-border/40">
                {scheduleSlots.map((slot) => (
                  <div key={slot.day} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-foreground">{slot.day}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{slot.time}</p>
                    </div>
                    <Badge variant={slot.status === "Available" ? "default" : "outline"} className="rounded-none text-xs">
                      {slot.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* practice queue */}
          <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#22c55e]" /> Patient Queue Roster (Today)
              </CardTitle>
              <CardDescription className="text-xs font-normal">Consultation schedule for active clinics.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground pb-2">
                      <th className="py-2 font-bold uppercase w-12">No.</th>
                      <th className="py-2 font-bold uppercase">Patient</th>
                      <th className="py-2 font-bold uppercase">Scheduled Time</th>
                      <th className="py-2 font-bold uppercase">Consultation Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {patientQueue.map((q) => (
                      <tr key={q.queueNo} className="hover:bg-muted/10">
                        <td className="py-3 font-bold text-[#22c55e]">{q.queueNo}</td>
                        <td className="py-3 font-bold text-foreground">{q.patientName}</td>
                        <td className="py-3 text-muted-foreground">{q.time}</td>
                        <td className="py-3 text-muted-foreground">{q.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
