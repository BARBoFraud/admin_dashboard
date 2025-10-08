"use client";

import { useAdminLogin } from "@/hooks/auth.hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/constants/mode-toggle";
import logo from "@/components/assets/imgMaluma.jpeg";
import { Menu } from "lucide-react";
import { SideMenu } from "@/components/constants/side-menu";

export function DashboardHeader() {
  const { isLoggedIn } = useAdminLogin();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  return (
    <header className="w-full bg-sidebar text-sidebar-foreground shadow-lg border-b border-sidebar-border">
      <div className="max-w-7xl mx-auto px-0 py-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <img src={logo.src} alt="Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-5xl font-bold">oFraud</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
      <SideMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
