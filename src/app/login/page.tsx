"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill in all fields.");
      return;
    }
    toast.success("Login successful!");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] font-mono animate-in fade-in duration-500">
      <Card className="w-full max-w-md border-2 border-border bg-card/60 backdrop-blur-md rounded-none shadow-md">
        <CardHeader className="border-b border-border/60 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#22c55e]/10 p-2.5">
              <Activity className="h-6 w-6 text-[#22c55e]" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">Account Login</CardTitle>
          <CardDescription className="text-xs font-normal">
            Enter details to access health records.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-[#22c55e]" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@hospital.com"
                className="rounded-none font-normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold uppercase flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-[#22c55e]" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="rounded-none font-normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full rounded-none bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold h-10 text-sm">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
