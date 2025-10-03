"use client";

import { useAdminLogin } from "@/hooks/auth.hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardPage() {
  const { logout, isLoggedIn } = useAdminLogin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ModeToggle />
        <Button onClick={handleLogout} variant="default">
          Logout
        </Button>
      </div>
    </div>
  );
}

