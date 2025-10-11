"use client";
import AdminsList from "@/components/features/AdminsList";
import CreateAdminForm from "@/components/features/CreateAdminForm";
import { useAdminsApi } from "@/api/Admins.api";
import { AdminType } from "@/types/admin.types";
import { useEffect, useState } from "react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAdminsList } = useAdminsApi();

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

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdminCreated = () => {
    fetchAdmins();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Administradores</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Crear un nuevo administrador</h2>
            <CreateAdminForm onAdminCreated={handleAdminCreated} />
          </div>
        </div>

        <div className="lg:col-span-2">
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