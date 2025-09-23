import { useEffect, useState } from "react";
import { getList } from "@/api/adminService";
import type { ListResponse } from "@/api/adminService";

export function useAdmins() {
    const [admins, setAdmins] = useState<ListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getList();
            setAdmins(data);
        } catch (err) {
            setError('Error al cargar los administradores');
            console.error('Error fetching admins:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return {
        admins,
        loading,
        error,
        refetch: fetchAdmins
    };
}
