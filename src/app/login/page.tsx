"use client";
import { LoginForm } from "@/components/features/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center text-foreground min-h-screen justify-center">
      <div className="absolute top-4 right-4"></div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

