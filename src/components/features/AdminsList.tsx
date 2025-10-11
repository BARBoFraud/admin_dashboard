"use client";
import { AdminType } from "@/types/admin.types";
import { Card } from "../ui/card";

interface AdminsListProps {
  admins: AdminType[];
  isLoading: boolean;
  error: string | null;
}

export default function AdminsList({ admins, isLoading, error }: AdminsListProps) {
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