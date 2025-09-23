import axios from 'axios';

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

interface RefreshResponse {
	accessToken: string;
}

export async function login(email: string, password: string) {
	const response = await axios.post<LoginResponse>('http://localhost:3000/v1/auth/admins/login', {
		email,
		password
	})
	localStorage.setItem('accessToken', response.data.accessToken)
	localStorage.setItem('refreshToken', response.data.refreshToken)
	return response.data
}

export async function refreshToken() {
	const refreshToken = localStorage.getItem('refreshToken')
	if (!refreshToken) throw new Error('No refresh token found')

	const response = await axios.post<RefreshResponse>("http://localhost:3000/v1/auth/admins/refresh", {
		token: refreshToken
	})
	localStorage.setItem('accessToken', response.data.accessToken)
	return response.data.accessToken
}
