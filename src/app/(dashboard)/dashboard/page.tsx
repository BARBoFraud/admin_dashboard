"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();
  return (
    <div>
      <h1>HOla amigos</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
