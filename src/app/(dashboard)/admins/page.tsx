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
      console.log('Fetched admins:', fetchedAdmins);
      setAdmins(fetchedAdmins);
    } catch (err) {
      console.error('Error fetching admins:', err);
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
    <div>
      <h1>HOla admins</h1>
      <AdminsList 
        admins={admins}
        isLoading={isLoading}
        error={error}
      />
      <CreateAdminForm onAdminCreated={handleAdminCreated} />
    </div>
  );
}