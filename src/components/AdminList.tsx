import { useAdmins } from "@/hooks/useAdmins";

export default function AdminList(): React.ReactNode {
    const { admins, loading, error } = useAdmins();

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div>Cargando administradores...</div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-4">
            Error: {error}
        </div>
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {admins.map((admin) => (
                <div key={admin.id} className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <span className="text-blue-600 font-semibold">#{admin.id}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{admin.username}</h3>
                            <p className="text-sm text-gray-600">Administrador</p>
                        </div>
                    </div>
                </div>
            ))}
            {admins.length === 0 && (
                <div className="text-center text-gray-500 mt-8 col-span-full">
                    No hay administradores registrados
                </div>
            )}
        </div>
    );
}
