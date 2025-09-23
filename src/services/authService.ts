import axios from "axios";

const API_URL = 'http://localhost:3000/v1/auth/admins'

const refreshToken = async (): Promise<boolean> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        const requestBody = {
            refreshToken
        }

        const response = await axios.post(API_URL + "/refresh", requestBody)
        const accessToken = response.data.accessToken
        localStorage.setItem("accessToken", accessToken);
        return true;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.log('Refresh token invalido')
            logout()
            return false
        }
        console.error('Error al refrescar token:', error)
        return false
    }
};

const login = async (username: string, password: string) => {
    try {
        const requestBody = {
            username,
            password
        };

        const response = await axios.post(API_URL + "/login", requestBody);
        const { accessToken, refreshToken } = response.data;

        if (!accessToken) {
            console.error("No access token received");
            return false;
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        return true;
    } catch (err) {
        console.error("Error en login:", err);
        return false;
    }
};

const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}

export default { login, refreshToken, logout };
