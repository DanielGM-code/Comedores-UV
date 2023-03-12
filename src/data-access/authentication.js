import { API_HOST, processResponse } from "./dataAccessUtils"

const API_SERVICE = 'login'

export const login = (user) => {
	return new Promise(async (resolve, reject) => {
		try {
			/*
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			})
			let token = await processResponse(response)
			resolve(token)
			*/
			resolve('token')
		} catch (error) {
			reject(error.message)
		}
	})
}