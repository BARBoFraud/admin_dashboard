"use client";
import { useAdminsApi } from "@/api/Admins.api";
import { AdminType } from "@/types/admin.types";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

export default function AdminsList() {
    const [admins, setAdmins] = useState<AdminType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getAdminsList } = useAdminsApi();

    useEffect(() => {
        const fetchAdmins = async () => {
            if (isLoading) return;
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

        fetchAdmins();
    }, [getAdminsList]);

    return (
        <div>
            <h1>Admins List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {admins.length === 0 ? <p>No admins found.</p> : (
                        <ul>
                            {admins.map(admin => (
                                <Card key={admin.id}>{admin.username}</Card>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}