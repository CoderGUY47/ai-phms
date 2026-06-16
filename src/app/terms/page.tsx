"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto font-mono text-left">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Terms &amp; Conditions</h1>
        <p className="text-muted-foreground mt-1 text-base font-normal">Rules and guidelines for using the clinic health portal.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#22c55e]" /> User Agreement
            </CardTitle>
            <CardDescription className="text-xs font-normal">Acceptance of terms of use.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-3 font-normal text-muted-foreground">
            <p>By registering or using this application, you agree to these rules and conditions.</p>
            <p>You agree to provide true and accurate information when registering profiles or submitting medical records.</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#22c55e]" /> Allowed Portal Use
            </CardTitle>
            <CardDescription className="text-xs font-normal">Guidelines for patients and clinic staff.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-4 font-normal text-muted-foreground">
            <div className="flex gap-2">
              <span className="text-[#22c55e] font-bold font-mono shrink-0">1.</span>
              <p>Patients can view their prescriptions, test results, and schedule consultations with active doctors.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#22c55e] font-bold font-mono shrink-0">2.</span>
              <p>Doctors can log patient diagnostics, prescribe medicine, and check appointment calendars.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#22c55e] font-bold font-mono shrink-0">3.</span>
              <p>Any misuse or attempt to read other patients' files without authority will lead to account suspension.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Medical Disclaimer
            </CardTitle>
            <CardDescription className="text-xs font-normal">Important notice about health diagnostics.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-2 font-normal text-muted-foreground">
            <p className="font-bold text-foreground">This system is an analytics tool to support clinical workflow.</p>
            <p>Always talk to a qualified medical doctor in person for critical care, emergencies, or detailed clinical advice.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
