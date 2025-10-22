"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@/public/logo_red.png";
import { Menu } from "lucide-react";
import { SideMenu } from "@/components/layout/SideMenu";
import { ModeToggle } from "./ModeToggle";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
  <header className="fixed top-0 left-0 right-0 z-50 w-full bg-sidebar text-sidebar-foreground shadow-lg border-b border-sidebar-border">
      <div className="w-full flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Menu className="h-7 w-7" />
          </Button>
          <img src={logo.src} alt="Logo" className="w-16 h-16" />
          <h1 className="text-6xl font-bold">oFraud</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">
            <ModeToggle />
          </div>
        </div>
      </div>
      <SideMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
