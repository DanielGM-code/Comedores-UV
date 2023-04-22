import React from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQueryClient } from 'react-query'
import { createExpenseMutation, CREATE_MUTATION_OPTIONS, updateExpenseMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import DateField from '../components/DateField'
import ConfirmModal from '../components/ConfirmModal'


const ExpenseForm = ({ cancelAction, expenseUpdate }) => {
	const [expense, setExpense] = useState(expenseUpdate ? {
		...expenseUpdate,
		date: new Date(expenseUpdate.date).formatted()
	} : {
		provider_id: '',
		date: new Date().formatted(),
		description: '',
		total: '',
		bill: '',
		departure: ''
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		date: '',
		description: '',
		total: '',
		bill: '',
		departure: ''
	})

	const validateAll = () => {
		const { date, total, bill, description, departure } = expense
		const validations = { date: '', total: '', bill: '', description: '', departure: '' }

		validations.date = validateDate(date)
		validations.total = validateTotal(total)
		validations.bill = validateBill(bill)
		validations.description = validateDescription(description)
		validations.departure = validateDeparture(departure)

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage.length > 0
		)
		let isValid = !validationMessages.length

		if(!isValid){
			setValidations(validations)
		}

		return isValid
	}

	const validateOne = (e) => {
		const {name} = e.target
		const value = expense[name]
		let message = ''

		if(name === 'date') message = validateDate(value)
		if(name === 'total') message = validateTotal(value)
		if(name === 'bill') message = validateBill(value)
		if(name === 'description') message = validateBill(value)
		if(name === 'departure') message = validateDeparture(value)

		setValidations({ ...validations, [name]: [message] })
	}

	const validateDate = (date) => {
		const validatorDate = Validator(date)

		if(validatorDate.isEmpty()) return 'Fecha requerida'
		return ''
	}

	const validateTotal = (total) => {
		const validatorTotal = Validator(total)

		if(validatorTotal.isEmpty()) return 'Total requerido'
		if(validatorTotal.isOutOfMinQuantityRange(0)) return 'El total no debe ser menor a cero'
		if(!validatorTotal.isInOfDecimalRange()) return 'El total debe tener máximo 2 decimales'
		if(validatorTotal.isOutOfMaxQuantityRange(99999999)) return 'El total debe ser menor a 1,000,000.00'
		return ''
	}

	const validateBill = (factura) => {
		const validatorBill = Validator(factura)

		if(validatorBill.isEmpty()) return 'Factura requerida'
		if(!validatorBill.isCorrectLength(0, 256)) return 'La factura debe tener entre 1 y 255 caracteres'
		return ''
	}

	const validateDescription = (description) => {
		const validatorDescription = Validator(description)

		if(validatorDescription.isEmpty()) return 'Descripción requerida'
		if(!validatorDescription.isCorrectLength(0, 256)) return 'La descripción debe tener entre 1 y 255 caracteres'
		return ''
	}

	const validateDeparture = (departure) => {
		const validatorDeparture = Validator(departure)

		if(validatorDeparture.isEmpty()) return 'Partida requerida'
		if(!validatorDeparture.isCorrectLength(0, 256)) return 'La partida debe tener entre 1 y 255 caracteres'
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

	const { 
		date: dateValidation,
		bill: billValidation,
		total: totalValidation,
		description: descriptionValidation,
		departure:  departureValidation
	} = validations

	const today1 = new Date()
	today1.setFullYear(today1.getFullYear() - 1)
	const min = today1.formatted()
	const today2 = new Date()
	today2.setFullYear(today2.getFullYear() + 1)
	const max = today2.formatted()

	return (
		<>
			<form>
				Fecha:
				<DateField
					name='date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha'
					value={expense.date}
					min={min}
					max={max}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={dateValidation}/>
				<FormField
					name='bill'
					inputType='text'
					iconClasses='fa-solid fa-receipt'
					placeholder='Factura'
					value={expense.bill}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={billValidation}/>
				<FormField
					name='total'
					inputType='number'
					iconClasses='fa-solid fa-circle-dollar-to-slot'
					placeholder='Total'
					value={expense.total}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={totalValidation}/>
				<FormField
					name='description'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Descripción'
					value={expense.description}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={descriptionValidation}/>
				<FormField
					name='departure'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Partida'
					value={expense.departure}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={departureValidation}/>
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