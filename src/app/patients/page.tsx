"use client";

import { useState } from "react";
import Link from "next/link";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  Phone,
  FileSpreadsheet,
  UserPlus,
  Trash2,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "react-toastify";

export default function PatientsDirectory() {
  const { patients, isLoaded, registerPatient, suspendPatient, activatePatient, deletePatient } = useMedicalRecords();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [ptToDelete, setPtToDelete] = useState<string | null>(null);

  // form state
  const [ptName, setPtName] = useState("");
  const [ptAge, setPtAge] = useState("");
  const [ptGender, setPtGender] = useState<"Male" | "Female" | "Other">("Male");
  const [ptPhone, setPtPhone] = useState("");

  const activePatients = patients.filter((p) => p.status === "Active");
  const suspendedPatients = patients.filter((p) => p.status === "Suspended");

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone && p.phone.includes(searchQuery))
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ptName || !ptAge || !ptPhone) {
      toast.warning("Please fill in all registration fields.");
      return;
    }

    const nextId = `PT-${1000 + patients.length + 1}`;
    registerPatient({
      id: nextId,
      name: ptName,
      age: parseInt(ptAge) || 30,
      gender: ptGender,
      phone: ptPhone
    });

    toast.success(`Patient registered successfully with ID: ${nextId}`);
    setIsRegisterOpen(false);
    setPtName("");
    setPtAge("");
    setPtGender("Male");
    setPtPhone("");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground font-mono text-base">
        Synchronizing Clinical Patient Registry...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto font-mono">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Patient Registry</h1>
          <p className="text-muted-foreground mt-1 text-base font-normal">Active medical records ledger and demographics.</p>
        </div>
        <Button
          className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold"
          onClick={() => setIsRegisterOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" /> Register Patient
        </Button>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Total Patient Files</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{patients.length}</h3>
              </div>
              <Users className="h-10 w-10 text-[#22c55e] opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Active Intake</p>
                <h3 className="text-3xl font-bold text-[#22c55e] mt-1">{activePatients.length}</h3>
              </div>
              <CheckCircle className="h-10 w-10 text-[#22c55e] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-none rounded-none bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Suspended Ledger</p>
                <h3 className="text-3xl font-bold text-destructive mt-1">{suspendedPatients.length}</h3>
              </div>
              <ShieldAlert className="h-10 w-10 text-destructive opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* filter and search bar */}
      <Card className="border shadow-none rounded-none bg-muted/20">
        <CardContent className="pt-5 pb-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, patient ID, phone contact..."
              className="pl-10 h-11 rounded-none text-base font-normal bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* grid of patient cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.map((p) => (
          <Card key={p.id} className={`border-2 rounded-none bg-card/60 backdrop-blur-md shadow-md flex flex-col justify-between ${p.status === "Suspended" ? "border-destructive/30" : "border-border"}`}>
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">{p.name}</CardTitle>
                  <CardDescription className="text-xs font-normal mt-0.5">{p.id} · {p.age} years old · {p.gender}</CardDescription>
                </div>
                <Badge variant={p.status === "Active" ? "default" : "destructive"} className="rounded-none text-[10px]">
                  {p.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-3 flex-1">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-[#22c55e]" />
                <span>Phone Contact: {p.phone || "Not recorded"}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4 text-[#22c55e]" />
                <span>Consultation Ledger: {p.history.length} records</span>
              </p>
            </CardContent>
            
            {/* action buttons */}
            <div className="p-4 border-t border-border/60 bg-muted/10 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Link href={`/patients/${p.id}`}>
                  <Button size="sm" variant="outline" className="rounded-none font-bold text-xs">
                    View Details
                  </Button>
                </Link>
                <Link href={`/patient?search=${p.id}`}>
                  <Button size="sm" variant="secondary" className="rounded-none font-bold text-xs bg-muted hover:bg-muted/80">
                    Clinical Portal
                  </Button>
                </Link>
              </div>
              <div className="flex gap-1">
                {p.status === "Active" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-none text-xs font-bold text-amber-500 hover:bg-amber-500/10"
                    onClick={() => {
                      suspendPatient(p.id);
                      toast.info(`Patient ${p.id} status set to Suspended.`);
                    }}
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-none text-xs font-bold text-[#22c55e] hover:bg-[#22c55e]/10"
                    onClick={() => {
                      activatePatient(p.id);
                      toast.success(`Patient ${p.id} activated successfully.`);
                    }}
                  >
                    Activate
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-none text-xs font-bold text-destructive hover:bg-destructive/10"
                  onClick={() => setPtToDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full border border-dashed py-20 text-center rounded-none bg-card">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold text-foreground">No Patients Located</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto font-normal">
              No matching records for "{searchQuery}". Register them to get started.
            </p>
          </div>
        )}
      </div>

      {/* register patient modal */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-none bg-card text-foreground border-2 border-border">
          <form onSubmit={handleRegister}>
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-[#22c55e]" /> Patient Registration
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter demographic details to create a local clinical file folder.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="regName" className="text-xs font-bold uppercase">Patient Full Name *</Label>
                <Input
                  id="regName"
                  required
                  placeholder="e.g. John Doe"
                  className="rounded-none font-normal"
                  value={ptName}
                  onChange={(e) => setPtName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="regAge" className="text-xs font-bold uppercase">Age (years) *</Label>
                  <Input
                    id="regAge"
                    type="number"
                    required
                    placeholder="e.g. 35"
                    className="rounded-none font-normal"
                    value={ptAge}
                    onChange={(e) => setPtAge(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="regGender" className="text-xs font-bold uppercase">Gender *</Label>
                  <Select value={ptGender} onValueChange={(val: any) => setPtGender(val)}>
                    <SelectTrigger id="regGender" className="rounded-none font-normal">
                      <SelectValue placeholder="Gender..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Male" className="font-normal">Male</SelectItem>
                      <SelectItem value="Female" className="font-normal">Female</SelectItem>
                      <SelectItem value="Other" className="font-normal">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="regPhone" className="text-xs font-bold uppercase">Phone Contact Number *</Label>
                <Input
                  id="regPhone"
                  required
                  placeholder="e.g. +880 1712-345678"
                  className="rounded-none font-normal"
                  value={ptPhone}
                  onChange={(e) => setPtPhone(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-none font-bold"
                onClick={() => setIsRegisterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold"
              >
                Create File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* delete confirmation modal */}
      <Dialog open={ptToDelete !== null} onOpenChange={(open) => !open && setPtToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-none bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Purge Patient Record
            </DialogTitle>
            <DialogDescription className="font-normal text-sm text-muted-foreground mt-2">
              Are you sure you want to permanently delete patient file folder {ptToDelete}? This will erase their entire consultation history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="rounded-none font-normal"
              onClick={() => setPtToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-none font-bold bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                if (ptToDelete) {
                  deletePatient(ptToDelete);
                  toast.success("Patient file folder successfully purged.");
                  setPtToDelete(null);
                }
              }}
            >
              Confirm Purge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
