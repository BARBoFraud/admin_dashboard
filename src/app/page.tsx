"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { LoginForm } from "@/components/login-form";
import { useAdminLogin } from "@/hooks/auth.hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isLoggedIn } = useAdminLogin();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex flex-col items-center text-foreground min-h-screen justify-center">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

