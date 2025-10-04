"use client";

import { useAdminList } from "@/hooks/admins.hooks";
import { useAdminLogin } from "@/hooks/auth.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export function AdminList() {
  const { isLoggedIn } = useAdminLogin();
  const { admins, isLoading, error, fetchAdmins } = useAdminList();

  useEffect(() => {
    if (isLoggedIn) {
      fetchAdmins();
    }
  }, [isLoggedIn]);

  const handleRefresh = () => {
    fetchAdmins();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Administradores</CardTitle>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Actualizar"}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoading && !admins && (
          <div className="flex justify-center items-center p-8">
            <div className="text-muted-foreground">
              Cargando administradores...
            </div>
          </div>
        )}

        {admins && admins.length === 0 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No hay administradores registrados
          </div>
        )}

        {admins && admins.length > 0 && (
          <div className="space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-medium">{admin.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

