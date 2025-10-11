"use client";

import React, { useEffect, useState } from "react";
import { X, Users, LogOut, GitGraph, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminProfile } from "@/types/admin.types";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const router = useRouter();
  const { logout, getProfile } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const setProfileData = async () => {
    setProfileError(null);
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (err) {
      setProfileError('No se pudo cargar el perfil del administrador');
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    setProfileData();
  }, [getProfile]);

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <aside
        aria-hidden={!open}
        className={`fixed left-0 top-0 bottom-0 z-50 w-80 transform bg-sidebar text-sidebar-foreground shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="text-lg font-semibold justify-between">Menú - <PersonStanding className="inline h-4 w-4 mx-1 text-green-500" />{profile?.username}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigateTo("/admins")}
          >
            <Users className="mr-2 h-4 w-4" /> Administrar cuentas de
            administradores
          </Button>

          <Button
            variant={"ghost"}
            className="w-full justify-start"
            onClick={() => navigateTo("/dashboard")}
          >
            <GitGraph className="mr-2 h-4 w-4" /> Ir a Dashboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
          <div className="fixed bottom-0 left-0 right-0 p-4 text-sm text-muted-foreground">
            &copy; 2025 oFraud. Todos los derechos reservados.
          </div>
        </nav>
      </aside>
    </>
  );
}
