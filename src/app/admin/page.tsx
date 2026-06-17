"use client";

import { useState } from "react";
import { useMedicalRecords, useDoctors, useAuditLogs } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { ShieldAlert, Database, Users, Stethoscope, Activity, PlusCircle, UserX, UserCheck, Trash2, ClipboardList } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function AdminPortal() {
  const { patients, records, suspendPatient, activatePatient, deletePatient, registerPatient, clearAllData, isLoaded } = useMedicalRecords();
  const { doctors, suspendDoctor, activateDoctor, deleteDoctor, registerDoctor } = useDoctors();
  const auditLogs = useAuditLogs();

  const totalActive = patients.filter((p) => p.status === "Active").length;
  const totalSuspended = patients.filter((p) => p.status === "Suspended").length;
  const totalActiveDoctors = doctors.filter((d) => d.status === "Active").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-muted-foreground mt-1">Manage users, monitor AI audit logs, and configure system variables.</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Patients" value={totalActive} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={Stethoscope} label="Active Doctors" value={totalActiveDoctors} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" />
        <StatCard icon={Activity} label="Docs Parsed (AI)" value={records.length} color="text-amber-600 bg-amber-50 dark:bg-amber-900/20" />
        <StatCard icon={ClipboardList} label="Audit Events" value={auditLogs.length} color="text-purple-600 bg-purple-50 dark:bg-purple-900/20" />
      </div>

      <Tabs defaultValue="patients">
        <TabsList className="w-full sm:w-auto grid grid-cols-4">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        {/* ── patients tab ── */}
        <TabsContent value="patients" className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">Patient Directory</h2>
              <p className="text-sm text-muted-foreground">{patients.length} total · {totalActive} active · {totalSuspended} suspended</p>
            </div>
            <RegisterPatientDialog onRegister={(p) => { registerPatient(p); toast.success(`Patient ${p.name} registered!`); }} />
          </div>
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-5">Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age / Gender</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{isLoaded ? "No patients found." : "Loading..."}</TableCell></TableRow>
                  )}
                  {patients.map((p) => (
                    <TableRow key={p.id} className={p.status === "Suspended" ? "opacity-60" : ""}>
                      <TableCell className="pl-5 font-mono text-sm">{p.id}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.age} / {p.gender}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.phone ?? "—"}</TableCell>
                      <TableCell>{p.history.length}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "Active" ? "default" : "destructive"}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <div className="flex justify-end gap-1">
                          {p.status === "Active" ? (
                            <Button size="sm" variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => { suspendPatient(p.id); toast.warning(`${p.name} suspended`); }}>
                              <UserX className="h-3.5 w-3.5 mr-1" />Suspend
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50" onClick={() => { activatePatient(p.id); toast.success(`${p.name} activated`); }}>
                              <UserCheck className="h-3.5 w-3.5 mr-1" />Activate
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { if (confirm(`Delete ${p.name}? This removes all their records.`)) { deletePatient(p.id); toast.error(`${p.name} deleted`); } }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── doctors tab ── */}
        <TabsContent value="doctors" className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">Doctor Directory</h2>
              <p className="text-sm text-muted-foreground">{doctors.length} total · {totalActiveDoctors} active</p>
            </div>
            <RegisterDoctorDialog onRegister={(d) => { registerDoctor(d); toast.success(`Dr. ${d.name} registered!`); }} />
          </div>
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-5">Doctor ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading doctors...</TableCell></TableRow>
                  )}
                  {doctors.map((d) => (
                    <TableRow key={d.id} className={d.status === "Suspended" ? "opacity-60" : ""}>
                      <TableCell className="pl-5 font-mono text-sm">{d.id}</TableCell>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.specialty}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{d.hospital}</TableCell>
                      <TableCell>{d.experience}</TableCell>
                      <TableCell><Badge variant={d.status === "Active" ? "default" : "destructive"}>{d.status}</Badge></TableCell>
                      <TableCell className="pr-5 text-right">
                        <div className="flex justify-end gap-1">
                          {d.status === "Active" ? (
                            <Button size="sm" variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => { suspendDoctor(d.id); toast.warning(`${d.name} suspended`); }}>
                              <UserX className="h-3.5 w-3.5 mr-1" />Suspend
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50" onClick={() => { activateDoctor(d.id); toast.success(`${d.name} activated`); }}>
                              <UserCheck className="h-3.5 w-3.5 mr-1" />Activate
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { if (confirm(`Remove ${d.name}?`)) { deleteDoctor(d.id); toast.error(`${d.name} removed`); } }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── audit logs tab ── */}
        <TabsContent value="audit" className="mt-5 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">System Audit Logs</h2>
            <p className="text-sm text-muted-foreground">Chronological record of all system actions</p>
          </div>
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-5">Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5">Performed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No audit events recorded yet.</TableCell></TableRow>
                  )}
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="pl-5 text-xs text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs font-mono">{log.action}</Badge></TableCell>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell className="font-mono text-xs">{log.entityId.slice(0, 12)}...</TableCell>
                      <TableCell><Badge variant={log.status === "SUCCESS" ? "default" : "destructive"} className="text-xs">{log.status}</Badge></TableCell>
                      <TableCell className="pr-5 text-sm">{log.performedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── config tab ── */}
        <TabsContent value="config" className="mt-5">
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border border-destructive/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><ShieldAlert className="h-5 w-5" />Danger Zone</CardTitle>
                <CardDescription>Irreversible — clears all browser localStorage data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full" onClick={() => { if (confirm("Clear ALL data? This cannot be undone.")) clearAllData(); }}>
                  Clear All Local Storage
                </Button>
              </CardContent>
            </Card>
            <Card className="border border-blue-200 dark:border-blue-900/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2"><Database className="h-5 w-5" />Dev Tools</CardTitle>
                <CardDescription>Reload seed data from public JSON files.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" onClick={() => { toast.info("Refreshing page to reload seed data..."); setTimeout(() => window.location.reload(), 800); }}>
                  Reload Seed Data from JSON
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── stat card ── */
function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className="border shadow-sm p-5 bg-card flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 ${color}`}><Icon className="h-6 w-6" /></div>
    </div>
  );
}

/* ── register patient dialog ── */
function RegisterPatientDialog({ onRegister }: { onRegister: (p: { id: string; name: string; age: number; gender: "Male" | "Female" | "Other"; phone: string }) => any }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male" as "Male" | "Female" | "Other", phone: "" });
  const submit = () => {
    if (!form.name || !form.age) { toast.error("Name and age are required"); return; }
    onRegister({ id: `PT-${Date.now()}`, name: form.name, age: parseInt(form.age), gender: form.gender, phone: form.phone });
    setOpen(false);
    setForm({ name: "", age: "", gender: "Male", phone: "" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><PlusCircle className="h-4 w-4" />Register Patient</Button>} />
      <DialogContent>
        <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div><Label>Full Name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rakibul Hasan" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Age</Label><Input className="mt-1" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
            <div><Label>Gender</Label>
              <select className="mt-1 w-full border bg-background px-3 py-2 text-sm" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as "Male" | "Female" | "Other" })}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
          <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+880 17xx-xxxxxx" /></div>
          <Separator />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Register</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── register doctor dialog ── */
function RegisterDoctorDialog({ onRegister }: { onRegister: (d: { id: string; name: string; specialty: string; hospital: string; experience: string; phone: string; email: string }) => any }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", specialty: "", hospital: "", experience: "", phone: "", email: "" });
  const submit = () => {
    if (!form.name || !form.specialty) { toast.error("Name and specialty are required"); return; }
    onRegister({ id: `DR-${Date.now()}`, ...form });
    setOpen(false);
    setForm({ name: "", specialty: "", hospital: "", experience: "", phone: "", email: "" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><PlusCircle className="h-4 w-4" />Register Doctor</Button>} />
      <DialogContent>
        <DialogHeader><DialogTitle>Register New Doctor</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div><Label>Full Name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Anisur Rahman" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Specialty</Label><Input className="mt-1" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></div>
            <div><Label>Experience</Label><Input className="mt-1" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 10 years" /></div>
          </div>
          <div><Label>Hospital / Clinic</Label><Input className="mt-1" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Register</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
