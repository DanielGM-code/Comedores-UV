import React from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQueryClient } from 'react-query'
import { createExpenseMutation, CREATE_MUTATION_OPTIONS, updateExpenseMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../validations/Validator'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import AutocompleteField from '../components/AutocompleteField'
import ValidatorProviderId from '../validations/ValidatorProviderId'
import ValidatorTotal from '../validations/ValidatorTotal'
import ValidatorBill from '../validations/ValidatorBill'
import ValidatorDeparture from '../validations/ValidatorDeparture'

const ExpenseForm = ({ cancelAction, expenseUpdate, providers }) => {
	const [expense, setExpense] = useState(expenseUpdate ? {
		...expenseUpdate,
		date: new Date(expenseUpdate.date).formatted()
	} : {
		provider_id: null,
		date: new Date().formatted(),
		description: '',
		total: '',
		bill: '',
		departure: ''
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		provider: '',
		description: '',
		total: '',
		bill: '',
		departure: ''
	})

	const validateAll = () => {
		const { provider_id, total, bill, description, departure } = expense
		let validations = { provider: '', description: '', total: '', bill: '', departure: '' }

		validations.provider = ValidatorProviderId(provider_id)
		validations.description = validateDescription(description)
		validations.total = ValidatorTotal(total)
		validations.bill = ValidatorBill(bill)
		validations.departure = ValidatorDeparture(departure)

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage.length > 0
		)
		let isValid = !validationMessages.length

		if(!isValid) setValidations(validations)

		return isValid
	}

	const validateOne = (event) => {
		const {name} = event.target
		const value = expense[name]
		let message = ''

		if(name === 'total') message = ValidatorTotal(value)
		if(name === 'bill') message = ValidatorBill(value)
		if(name === 'description') message = validateDescription(value)
		if(name === 'departure') message = ValidatorDeparture(value)

		setValidations({ ...validations, [name]: message })
	}

	const validateDescription = (description) => {
		const validatorDescription = Validator(description)

		if(validatorDescription.isEmpty()) return 'Descripción requerida'
		if(!validatorDescription.isCorrectLength(0, 251)) return 'La descripción debe tener entre 1 y 250 caracteres'
		return ''
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
		setTypeModal(expense.id ? 3 : 2)
		setIsShowingModal(true)
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
				<ErrorMessage validation={validations.provider}/>
				<FormField
					name='bill'
					inputType='text'
					iconClasses='fa-solid fa-receipt'
					placeholder='Factura'
					value={expense.bill}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.bill}/>
				<FormField
					name='total'
					inputType='number'
					iconClasses='fa-solid fa-circle-dollar-to-slot'
					placeholder='Total'
					value={expense.total}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.total}/>
				<FormField
					name='description'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Descripción'
					value={expense.description}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.description}/>
				<FormField
					name='departure'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Partida'
					value={expense.departure}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.departure}/>
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