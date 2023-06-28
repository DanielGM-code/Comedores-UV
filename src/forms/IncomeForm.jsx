import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS, updateIncomeMutation } from '../utils/mutations'
import '../utils/formatting'
import ConfirmModal from '../components/ConfirmModal'
import AutocompleteInput from '../components/AutocompleteField'
import ValidatorScholarshipId from '../validations/ValidatorScholarshipId'
import ValidatorNote from '../validations/ValidatorNote'
import ValidatorTotal from '../validations/ValidatorTotal'
import MessageAlert from '../components/MessageAlert'

const IncomeForm = ({ cancelAction, incomeUpdate, scholarships }) => {
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
	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [validations, setValidations] = useState({
		scholarship: '',
		user: '',
		note: '',
		total: ''
	})

	const validateAll = () => {
		const { scholarship_id, user_id, note, total } = income
		const validations = { scholarship: '', user: '', note: '', total: '' }

		validations.scholarship = ValidatorScholarshipId(scholarship_id, scholarships)
		validations.note = ValidatorNote(note)
		validations.total = ValidatorTotal(total)

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

		if(name === 'note') message = ValidatorNote(value)
		if(name === 'total') message = ValidatorTotal(value)

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
		setTypeModal(income.id ? 3 : 2)
		setIsShowingModal(true)
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
				<MessageAlert 
                    typeAlert='warning'
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
				<MessageAlert 
                    typeAlert='warning'
                    validation={validations.note}
                />
				<FormField
					name='total'
					inputType='number'
					iconClasses='fa-solid fa-coins'
					placeholder='Total'
					value={income.total}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<MessageAlert 
                    typeAlert='warning'
                    validation={validations.total}
                />
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