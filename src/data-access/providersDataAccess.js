import { API_HOST, processResponse } from "./dataAccessUtils"

const API_SERVICE = 'providers'

export const createProvider = (provider) => {
    return new Promise(async(resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(provider)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
    })
}

export const readAllProviders = () => {
    return new Promise(async (resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url)
			let providers = await processResponse(response)
			resolve(providers)
		} catch (error) {
			reject(error.message)
		}
    })
}

export const updateProvider = (provider) => {
    const { id } = provider
    return new Promise(async (resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}/${id}`
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(provider)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
    })
}

export const deleteProvider = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}/${id}`
			const response = await fetch(url, {
				method: 'DELETE',
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
    })
}