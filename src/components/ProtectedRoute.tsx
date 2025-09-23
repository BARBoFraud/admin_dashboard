import { Navigate, Outlet } from 'react-router-dom';

const isTokenValid = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    return true
};

const ProtectedRoute = () => {
    const isAuthenticated = isTokenValid();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
