import axios from "axios";
import authService from "@/services/authService"

const API_URL = 'http://localhost:3000/v1/admins'

const getAdmins = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken')
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const response = await axios.get(API_URL + "/list", config)
        console.log(response.data)
        return response.data
    } catch (error: any) {
        if (error.response?.status === 401) {
            try {
                await authService.refreshToken()

                const newAccessToken = localStorage.getItem('accessToken')
                const newConfig = {
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                };
                const retryResponse = await axios.get(API_URL + "/list", newConfig)
                return retryResponse.data
            } catch (refreshError: any) {
                authService.logout()
                window.location.href = '/login'
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
            }
        }
        throw error
    }
}

export default { getAdmins }
