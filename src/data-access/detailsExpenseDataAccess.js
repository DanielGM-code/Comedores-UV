import { API_HOST, processResponse } from "./dataAccessUtils"

const API_SERVICE = 'expense_details'

export const createDetailsExpense = (details_expense) => {
    return new Promise(async (resolve, reject) => {
		try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(details_expense)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
	})
}

export const readAllDetailsExpenses = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const url = `${API_HOST}/${API_SERVICE}`
			const response = await fetch(url)
			let detailsExpenses = await processResponse(response)
			resolve(detailsExpenses)
		} catch (error) {
			reject(error.message)
		}
	})
}

export const findDetailsExpense = (id) => {
	return new Promise(async (resolve, reject) => {
		try{
			const url = `${API_HOST}/${API_SERVICE}?expense_id=${id}`
			const response = await fetch(url)
			let detailsExpense = await processResponse(response)
			resolve(detailsExpense)
		} catch (error) {
			reject(error.message)
		}
	})
}

export const updateDetailsExpense = (details_expense) => {
	const { id } = details_expense
	return new Promise(async (resolve, reject) => {
		try {
			const url = `${API_HOST}/${API_SERVICE}/${id}`
			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(details_expense)
			})
			await processResponse(response)
			resolve()
		} catch (error) {
			reject(error.message)
		}
	})
}

export const deleteDetailsExpense = (id) => {
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