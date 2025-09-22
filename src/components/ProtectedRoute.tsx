import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
	const token = localStorage.getItem('accessToken');

	let isAuthenticated = false;
	if (token) {
		try {
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			if (decoded.exp && decoded.exp > currentTime) {
				isAuthenticated = true;
			}
		} catch (err) {
			console.error("Token inválido", err);
		}
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

