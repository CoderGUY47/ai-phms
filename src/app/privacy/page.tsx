"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Eye, Lock, Key } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto font-mono text-left">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Privacy &amp; Security</h1>
        <p className="text-muted-foreground mt-1 text-base font-normal">How we protect your medical records and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#22c55e]" /> Data Encryption
            </CardTitle>
            <CardDescription className="text-xs font-normal">Protection during storage and transfer.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-2 font-normal text-muted-foreground">
            <p>We use standard encryption protocols to protect your medical details and personal records.</p>
            <p>No third party can access your health data without your direct permission.</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#22c55e]" /> Access Audits
            </CardTitle>
            <CardDescription className="text-xs font-normal">Tracking account views.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-2 font-normal text-muted-foreground">
            <p>Every view, edit, or search query is logged to prevent unauthorized access.</p>
            <p>Only registered doctors and authorized clinicians can search or read patient profiles.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#22c55e]" /> Security Best Practices
          </CardTitle>
          <CardDescription className="text-xs font-normal">Actions you can take to stay secure.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-sm space-y-4 font-normal text-muted-foreground">
          <div className="flex gap-3 items-start">
            <Key className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Use Strong Passwords</p>
              <p>Keep your password unique to this hospital portal. Never share it with anyone.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <ShieldCheck className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Log Out on Shared Computers</p>
              <p>Always log out of your session when accessing the portal from public or shared devices.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
