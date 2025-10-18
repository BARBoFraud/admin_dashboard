"use client";
import { AdminType } from "@/types/admin.types";
import { Card } from "../ui/card";
import { useAdminsApi } from "@/api/Admins.api";
import { Button, buttonVariants } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { Shield } from "lucide-react";

interface AdminsListProps {
  admins: AdminType[];
  isLoading: boolean;
  error: string | null;
  onDeleteSuccess: () => void;
}

export default function AdminsList({
  admins,
  isLoading,
  error,
  onDeleteSuccess,
}: AdminsListProps) {
  const { deleteAdmin } = useAdminsApi();
  const [adminToDelete, setAdminToDelete] = useState<AdminType | null>(null);

  const handleDelete = async () => {
    if (!adminToDelete) return;

    try {
      await deleteAdmin(adminToDelete.id);
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting admin:", error);
    } finally {
      setAdminToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Lista de administradores</h2>
          <div className="px-2 py-1 text-xs bg-accent text-primary rounded-full">
            {admins.length} activos
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Cargando administradores...</p>
        </div>
      ) : (
        <>
          {admins.length === 0 ? (
            <div className="text-center p-8 bg-card rounded-lg">
              <p className="text-gray-500">
                No hay administradores registrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admins.map((admin) => (
                <Card key={admin.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{admin.username}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setAdminToDelete(admin)}
                      size="sm"
                      className="group-hover:opacity-100 transition-opacity"
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <AlertDialog
        open={!!adminToDelete}
        onOpenChange={() => setAdminToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              administrador: <strong>{adminToDelete?.username}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
