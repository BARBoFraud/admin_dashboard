"use client";
import ReportsList from "@/components/features/ReportsList";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div>
      <h1>HOla amigos</h1>
      <button onClick={logout}>Logout</button>
      <ReportsList />
    </div>
  );
}
