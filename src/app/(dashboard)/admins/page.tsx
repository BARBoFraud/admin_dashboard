"use client";
import AdminsList from "@/components/features/AdminsList";
import CreateAdminForm from "@/components/features/CreateAdminForm";
import { useAdminsApi } from "@/api/Admins.api";
import { AdminProfile, AdminType } from "@/types/admin.types";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { PersonStanding } from "lucide-react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAdminsList } = useAdminsApi();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { getProfile } = useAuth();

  const fetchAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedAdmins = await getAdminsList();
      setAdmins(fetchedAdmins);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching admins');
    } finally {
      setIsLoading(false);
    }
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
    fetchAdmins();
    setProfileData();
  }, [getProfile]);

  const handleAdminCreated = () => {
    fetchAdmins();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {profileError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {profileError}
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Administradores</h1>
        <p >
          Panel de control para gestionar los accesos administrativos
        </p>
      </div>

      <Card className="rounded-lg border p-4 mb-8">
        <h3 className="text-sm font-medium mb-2">Sesión Activa</h3>
        {profile ? (
          <div className="flex items-center gap-2">
            <PersonStanding className="w-5 h-5 text-green-500" />
            <p>
              {profile.username} - <span>Administrador</span>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            <p className="text-gray-500">Cargando información de sesión...</p>
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-8">
            <h2 className="text-xl font-semibold pb-6">Registra un nuevo administrador</h2>
            <CreateAdminForm onAdminCreated={handleAdminCreated} />
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <AdminsList 
            admins={admins}
            isLoading={isLoading}
            error={error}
            onDeleteSuccess={fetchAdmins}
          />
        </div>
      </div>
    </div>
  );
}