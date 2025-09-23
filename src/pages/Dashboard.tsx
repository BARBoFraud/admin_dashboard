import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface Admin {
  id: number;
  username: string;
}

const Dashboard: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const adminData = await adminService.getAdmins();
        setAdmins(adminData);
      } catch (err) {
        setError('Error al cargar los administradores');
        console.error('Error fetching admins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div>Cargando administradores...</div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );

  return (
    <div className="dashboard p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Administradores</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>


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
      </div>
      
      {admins.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No hay administradores registrados
        </div>
      )}
    </div>
  );
};

export default Dashboard;
