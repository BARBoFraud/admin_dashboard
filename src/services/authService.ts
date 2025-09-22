import axios from "axios";

const API_URL = 'http://localhost:3000/v1/auth/admins'

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

export default { login };

