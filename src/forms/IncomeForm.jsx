import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS, updateIncomeMutation } from '../utils/mutations'
import '../utils/formatting'
import AutocompleteInput from '../components/AutocompleteField'
import Alert from '../components/Alert'
import IncomeFormValidator from '../validations/IncomeFormValidator'

const IncomeForm = ({ cancelAction, incomeUpdate, scholarships }) => {
	document.body.style.overflow = 'hidden'
	
	const [income, setIncome] = useState(incomeUpdate ? {
		...incomeUpdate,
		date: new Date(incomeUpdate.date).formatted()
	} : {
		scholarship_id: null,
		user_id: null,
		note: '',
		total: '',
		date: new Date().formatted()
	})
	
	const [validations, setValidations] = useState({
		scholarship: null,
		note: null
	})

	const validateAll = () => {
		const { scholarship_id, note } = income
		const validations = { scholarship: null, note: null }

		validations.scholarship = IncomeFormValidator(scholarship_id).scholarshipIdValidator(scholarships)
		validations.note = IncomeFormValidator(note).noteValidator()

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
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
		let message = null

		if(name === 'note') message = IncomeFormValidator(value).noteValidator()

		setValidations({ ...validations, [name]: message })
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
		cancelAction()
		document.body.style.overflow = null
	}

	return (
		<>
			<form>
				<AutocompleteInput
					name='scholarship_id'
					iconClasses='fa-solid fa-industry'
					options={scholarships}
					selectedOption={() => {
						return scholarships.find(scholarship => scholarship.id === income.scholarship_id)
					}}
					placeholder='Nombre del becado'
					searchable={true}
					onChange={(selectedScholarship) => {
						setIncome(prevIncome => {
							return {
								...prevIncome,
								scholarship_id: selectedScholarship.id
							}
						})
					}}
					clearable={false}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.scholarship}
                />
				<FormField
					name='note'
					inputType='text'
					iconClasses='fa-solid fa-tag'
					placeholder='Notas'
					value={income.note}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.note}
                />
				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => {
							cancelAction()
							document.body.style.position = null
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
		</>
	)
}

export default IncomeForm