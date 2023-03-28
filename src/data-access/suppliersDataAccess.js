import { API_HOST, processResponse } from "./dataAccessUtils"

const API_SERVICE = 'suppliers'

export const createSupplier = (supplier) => {
    return new Promise(async(resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(supplier)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
    })
}

export const readAllSuppliers = () => {
    return new Promise(async (resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url)
			let suppliers = await processResponse(response)
			resolve(suppliers)
		} catch (error) {
			reject(error.message)
		}
    })
}

export const updateSupplier = (supplier) => {
    const { id } = supplier
    return new Promise(async (resolve, reject) => {
        try {
			const url = `${API_HOST}/${API_SERVICE}/${id}`
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(supplier)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
    })
}

export const deleteSupplier = (id) => {
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