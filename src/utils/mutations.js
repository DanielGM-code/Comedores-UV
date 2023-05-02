import { toast } from "react-toastify"
import { createIncome, deleteIncome, updateIncome } from "../data-access/incomesDataAccess"
import { createScholarship, deleteScholarship, updateScholarship } from "../data-access/scholarshipsDataAccess"
import { createExpense, deleteExpense, updateExpense } from "../data-access/expensesDataAccess"
import { createProduct, deleteProduct, updateProduct } from "../data-access/productsDataAccess"
import { createUser, deleteUser, updateUser } from "../data-access/usersDataAccess"
import { createProvider, deleteProvider, updateProvider } from "../data-access/providersDataAccess"
import { createDetailsExpense, deleteDetailsExpense, updateDetailsExpense } from "../data-access/detailsExpenseDataAccess"

export const CREATE_MUTATION_OPTIONS = {
	onMutate: async () => {
		toast('Guardando...', {
			type: 'info'
		})
	},
	onSuccess: () => {
		toast('Guardado!', {
			type: 'success'
		})
	},
	onError: (error) => {
		console.error(error);
		toast('Error', {
			type: 'error'
		})
	}
}

export const UPDATE_MUTATION_OPTIONS = {
	onMutate: async () => {
		toast('Actualizando... 💾', {
			type: 'info'
		})
	},
	onSuccess: () => {
		toast('Actualizado! ✅', {
			type: 'success'
		})
	},
	onError: (error) => {
		toast('Error ❌', {
			type: 'error'
		})
	}
}

export const DELETE_MUTATION_OPTIONS = {
	onMutate: async () => {
		toast('Eliminando... 🗑️', {
			type: 'info'
		})
	},
	onSuccess: () => {
		toast('Eliminado! ✅', {
			type: 'success'
		})
	},
	onError: (error) => {
		console.error(error);
		toast('Error ❌', {
			type: 'error'
		})
	}
}

// Expense Mutations
export const createExpenseMutation = (expense) => {
	createExpense(expense)
}

export const updateExpenseMutation = (expense) => {
	updateExpense(expense)
}

export const deleteExpenseMutation = (id) => {
	deleteExpense(id)
}

//Details expense Mutations
export const createDetailsExpenseMutation = (details_expense) => {
	createDetailsExpense(details_expense)
}

export const updateDetailsExpenseMutation = (details_expense) => {
	updateDetailsExpense(details_expense)
}

export const deleteDetailsExpenseMutation = (id) => {
	deleteDetailsExpense(id)
}

// User Mutations
export const createUserMutation = (user) => {
	createUser(user)
}

export const updateUserMutation = (user) => {
	updateUser(user)
}

export const deleteUserMutation = (id) => {
	deleteUser(id)
}

// Income Mutations
export const createIncomeMutation = (income) => {
	createIncome(income)
}

export const updateIncomeMutation = (income) => {
	updateIncome(income)
}

export const deleteIncomeMutation = (id) => {
	deleteIncome(id)
}

// Scholarship Mutations
export const createScholarshipMutation = (scholarship) => {
	createScholarship(scholarship)
}

export const updateScholarshipMutation = (scholarship) => {
	updateScholarship(scholarship)
}

export const deleteScholarshipMutation = (id) => {
	deleteScholarship(id)
}

// Product Mutations
export const createProductMutation = (product) => {
	createProduct(product)
}

export const updateProductMutation = (product) => {
	updateProduct(product)
}

export const deleteProductMutation = (id) => {
	deleteProduct(id)
}

//Provider Mutations
export const createProviderMutation = (provider) => {
	createProvider(provider)
}

export const updateProviderMutation = (provider) => {
	updateProvider(provider)
}

export const deleteProviderMutation = (id) => {
	deleteProvider(id)
}