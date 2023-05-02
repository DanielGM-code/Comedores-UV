import { API_HOST, processResponse } from "./dataAccessUtils"

const API_SERVICE = 'income_details'

export const createDetailsIncome = (details_income) => {
    return new Promise(async (resolve, reject) => {
		try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(details_income)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
	})
}

export const readAllDetailsIncomes = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url)
			let detailsIncomes = await processResponse(response)
			resolve(detailsIncomes)
		} catch (error) {
			reject(error.message)
		}
	})
}

export const findDetailsIncome = (id) => {
	return new Promise(async (resolve, reject) => {
		try{
			const url = `${API_HOST}/${API_SERVICE}?${id}`
			const response = await fetch(url)
			let detailsIncome = await processResponse(response)
			resolve(detailsIncome)
		} catch (error) {
			reject(error.message)
		}
	})
}

export const updateDetailsIncome = (details_income) => {
	const { id } = details_income
	return new Promise(async (resolve, reject) => {
		try {
			const url = `${API_HOST}/${API_SERVICE}/${id}`
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(details_income)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
	})
}

export const deleteDetailsIncome = (id) => {
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