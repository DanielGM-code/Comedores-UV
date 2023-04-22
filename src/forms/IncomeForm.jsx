import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import ErrorMessage from '../components/ErrorMessage'
import Validator from '../components/Validator'
import FormField from '../components/FormField'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS, updateIncomeMutation } from '../utils/mutations'
import '../utils/formatting'
import ConfirmModal from '../components/ConfirmModal'

const IncomeForm = ({ cancelAction, incomeUpdate }) => {
	const [income, setIncome] = useState(incomeUpdate ? {
		...incomeUpdate,
		date: new Date(incomeUpdate.date).formatted()
	} : {
		note: '',
		total: '',
		date: new Date().formatted()
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		note: [],
		total: []
	})

	const validateAll = () => {
		const { note, total } = income
		const validations = { note: '', total: '' }

		validations.note = validateNote(note)
		validations.total = validateTotal(total)

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
		const { name } = e.target
		const value = income[name]
		let message = ''

		if(name === 'note') message = validateNote(value)
		if(name === 'total') message = validateTotal(value)

		setValidations({ ...validations, [name]: [message] })
	}

	const validateNote = (note) => {
		const validatorNote = Validator(note)

		if(validatorNote.isEmpty()) return 'Concepto requerido'
		if(!validatorNote.isCorrectLength(4, 201)) return 'El concepto debe contener entre 5 y 200 caracteres'
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

	const queryClient = useQueryClient()
	const createMutation = useMutation(createIncomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('incomes')
		}
	})

	const updateMutation = useMutation(updateIncomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('incomes')
		}
	})

	function handleInputChange(event) {
		setIncome(prevIncome => {
			return {
				...prevIncome,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitIncome() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}

		if (income.id) {
			await updateMutation.mutateAsync(income)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(income)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		setTypeModal(income.id ? 3 : 2)
		setIsShowingModal(true)
	}

	const { note: noteValidation, 
		total: totalValidation
	} = validations

	return (
		<>
			<form>
				<FormField
					name='note'
					inputType='text'
					iconClasses='fa-solid fa-tag'
					placeholder='Notas'
					value={income.note}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={noteValidation}/>
				<FormField
					name='total'
					inputType='number'
					iconClasses='fa-solid fa-coins'
					placeholder='Total'
					value={income.total}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={totalValidation}/>
				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => {
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
							submitIncome()
						}}
					>
						{`${income.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>

			<ConfirmModal
				objectClass={incomeUpdate}
				cancelAction={cancelAction}
				typeModal={typeModal}
				isShowingModal={isShowingModal}
				setIsShowingModal={setIsShowingModal}
				typeClass={'ingreso'}
			/>
		</>
	)
}

export default IncomeForm