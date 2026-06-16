"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

export default function ActiveConsultationCard() {
  return (
    <Card className="border shadow-none rounded-none bg-card/60 backdrop-blur-md">
      <CardHeader className="p-3 pb-1 border-b flex flex-row items-center justify-between">
        <span className="text-[10px] font-mono text-[#22c55e] uppercase tracking-wider flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-ping" />
          Active Consultation
        </span>
        <Dialog>
          <DialogTrigger render={
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:bg-muted/40">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }>
            <MoreHorizontal className="h-4 w-4" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[320px] rounded-none border border-border bg-card p-4 font-mono">
            <DialogHeader>
              <DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Manage Consultation
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="outline" className="w-full text-xs rounded-none border-primary/20 hover:bg-primary/5 text-foreground flex items-center justify-center gap-1.5 h-8">
                Edit Record
              </Button>
              <Button variant="destructive" className="w-full text-xs rounded-none flex items-center justify-center gap-1.5 h-8">
                Delete Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-3 pt-3">
        <div className="flex items-center gap-3 mb-2.5">
          <Avatar className="h-12 w-12 rounded-none border border-[#22c55e]/30">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
              alt="Andrien Bertrand" 
              className="rounded-none object-cover" 
            />
            <AvatarFallback className="bg-[#22c55e]/15 text-[#22c55e] font-bold text-base rounded-none">AB</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xs font-bold text-foreground font-mono leading-tight">Andrien Bertrand</h4>
            <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Last Checkin: 04 Jan 2026</p>
          </div>
        </div>
        
        <div className="space-y-1.5 text-xs font-mono bg-black/5 dark:bg-black/30 p-2.5 border border-muted/20">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-muted-foreground uppercase text-[9px] tracking-wide">Date</span>
            <span className="font-bold text-foreground">15 Jun 2026</span>
          </div>
          <div className="flex justify-between items-center border-t border-muted/10 pt-1 py-0.5">
            <span className="text-muted-foreground uppercase text-[9px] tracking-wide">Time</span>
            <span className="font-bold text-foreground">11:45 AM</span>
          </div>
          <div className="flex justify-between items-center border-t border-muted/10 pt-1 py-0.5">
            <span className="text-muted-foreground uppercase text-[9px] tracking-wide">Physician</span>
            <span className="inline-block px-1.5 py-0.5 border border-[#22c55e]/30 text-[#22c55e] bg-[#22c55e]/5 font-bold text-[9px] rounded-none">
              PROF. DR. MD. MAHBUBUR RAHMAN
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
