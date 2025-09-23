import axios from "axios";

export interface ListResponse {
	id: number;
	username: string;
}

export async function getList() {
	const accessToken = localStorage.getItem('accessToken')
	const config = {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	};

	const response = await axios.get<ListResponse[]>('http://localhost:3000/v1/admins/list', config)
	return response.data
}
