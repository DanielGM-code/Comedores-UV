import React from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQueryClient } from 'react-query'
import { createExpenseMutation, CREATE_MUTATION_OPTIONS, updateExpenseMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import ConfirmModal from '../components/ConfirmModal'
import AutocompleteField from '../components/AutocompleteField'
import Alert from '../components/Alert'
import ExpenseFormValidator from '../validations/ExpenseFormValidator'

const ExpenseForm = ({ cancelAction, expenseUpdate, providers }) => {
	const [expense, setExpense] = useState(expenseUpdate ? {
		...expenseUpdate,
		date: new Date(expenseUpdate.date).formatted()
	} : {
		provider_id: null,
		date: new Date().formatted(),
		description: '',
		total: 0,
		bill: '',
		departure: ''
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		provider: null,
		description: null,
		bill: null,
		departure: null
	})

	const validateAll = () => {
		const { provider_id, bill, description, departure } = expense
		let validations = { provider: null, description: null, bill: null, departure: null }

		validations.provider = ExpenseFormValidator(provider_id).providerIdValidator(providers)
		validations.description = ExpenseFormValidator(description).descriptionValidator()
		validations.bill = ExpenseFormValidator(bill).billValidator()
		validations.departure = ExpenseFormValidator(departure).departureValidator()

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
		)
		let isValid = !validationMessages.length

		if(!isValid) setValidations(validations)

		return isValid
	}

	const validateOne = (event) => {
		const {name} = event.target
		const value = expense[name]
		let message = null

		if(name === 'bill') message = ExpenseFormValidator(value).billValidator()
		if(name === 'description') message = ExpenseFormValidator(value).descriptionValidator()
		if(name === 'departure') message = ExpenseFormValidator(value).departureValidator()

		setValidations({ ...validations, [name]: message })
	}

	const queryClient = useQueryClient()
	const createMutation = useMutation(createExpenseMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('expenses')
		}
	})

	const updateMutation = useMutation(updateExpenseMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('expenses')
		}
	})

	function handleInputChange(event) {
		setExpense(prevExpense => {
			return {
				...prevExpense,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitExpense() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}
		
		if (expense.id) {
			await updateMutation.mutateAsync(expense)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(expense)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		cancelAction()
	}

	return (
		<>
			<form>
				<AutocompleteField
					name='provider_id'
					iconClasses='fa-solid fa-industry'
					options={providers}
					selectedOption={() => {
						return providers.find(provider => provider.id === expense.provider_id)
					}}
					placeholder='Nombre del proveedor'
					searchable={true}
					onChange={(selectedProvider) => {
						setExpense(prevExpense => {
							return {
								...prevExpense,
								provider_id: selectedProvider.id
							}
						})
					}}
					clearable={false}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.provider}
                />
				<FormField
					name='bill'
					inputType='text'
					iconClasses='fa-solid fa-receipt'
					placeholder='Factura'
					value={expense.bill}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.bill}
                />
				<FormField
					name='description'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Descripción'
					value={expense.description}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.description}
                />
				<FormField
					name='departure'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Partida'
					value={expense.departure}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.departure}
                />
				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={()=>{
							setTypeModal(1)
							setIsShowingModal(true)
						}}
					>
						Cancelar
					</button>
					<button
						type='button'
						className='btn btn-primary'
						onClick={() => {
							submitExpense()
						}}
					>
						{`${expense.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>

			<ConfirmModal
				objectClass={expenseUpdate}
				cancelAction={cancelAction}
				typeModal={typeModal}
				isShowingModal={isShowingModal}
				setIsShowingModal={setIsShowingModal}
				typeClass={'egreso'}
			/>
		</>
	)
}

export default ExpenseForm