import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import DateField from '../components/DateField'
import { createScholarshipMutation, CREATE_MUTATION_OPTIONS, updateScholarshipMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import '../utils/formatting'
import ConfirmModal from '../components/ConfirmModal'
import ValidatorFirstName from '../validations/ValidatorFirstame'
import ValidatorLastName from '../validations/ValidatorLastName'
import ValidatorCareer from '../validations/ValidatorCareer'
import ValidatorStartDate from '../validations/ValidatorStartDate'
import ValidatorEndDate from '../validations/ValidatorEndDate'

const ScholarshipForm = ({ cancelAction, scholarshipUpdate }) => {
	const [scholarship, setScholarship] = useState(scholarshipUpdate ? {
		...scholarshipUpdate,
		start_date: new Date(scholarshipUpdate.start_date).formatted(),
		end_date: new Date(scholarshipUpdate.end_date).formatted(),
	} : {
		user_id: null,
		first_name: '',
		last_name: '',
		paid_meals: '',
		career: '',
		start_date: new Date().formatted(),
		end_date: new Date().formatted()
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		first_name: '',
		last_name: '',
		career: '',
		start_date: '',
		end_date: ''
	})

	const validateAll = () => {
		const { first_name, last_name, career, start_date, end_date } = scholarship
		const validations = { first_name: '', last_name: '', career: '', start_date: '', end_date: '' }

		validations.first_name = ValidatorFirstName(first_name)
		validations.last_name = ValidatorLastName(last_name)
		validations.career = ValidatorCareer(career)
		validations.start_date = ValidatorStartDate(start_date, end_date)
		validations.end_date = ValidatorEndDate(end_date, start_date)

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
		const value = scholarship[name]
		let message = ''

		if(name === 'first_name') message = ValidatorFirstName(value)
		if(name === 'last_name') message = ValidatorLastName(value)
		if(name === 'career') message = ValidatorCareer(value)
		if(name === 'start_date') message = ValidatorStartDate(value)
		if(name === 'end_date') message = ValidatorEndDate(value)

		setValidations({ ...validations, [name]: [message] })
	}

	const queryClient = useQueryClient()
	const createMutation = useMutation(createScholarshipMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('scholarship')
		}
	})

	const updateMutation = useMutation(updateScholarshipMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('scholarship')
		}
	})

	function handleInputChange(event) {
		setScholarship(prevScholarship => {
			return {
				...prevScholarship,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitScholarship() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}

		if (scholarship.id) {
			await updateMutation.mutateAsync(scholarship)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(scholarship)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		setTypeModal(scholarship.id ? 3 : 2)
		setIsShowingModal(true)
	}

	const today1 = new Date()
	today1.setFullYear(today1.getFullYear() - 1)
	const min = today1.formatted()
	const today2 = new Date()
	today2.setFullYear(today2.getFullYear() + 1)
	const max = today2.formatted()

	return (
		<>
			<form>
				<FormField
					name='first_name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre'
					value={scholarship.first_name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.first_name}/>
				<FormField
					name='last_name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Apellido'
					value={scholarship.last_name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.last_name}/>
				<FormField
					name='career'
					inputType='text'
					iconClasses='fa-solid fa-user-graduate'
					placeholder='Carrera'
					value={scholarship.career}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.career}/>
				Fecha de inicio:
				<DateField
					name='start_date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de Inicio'
					value={scholarship.start_date}
					min={min}
					max={max}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.start_date}/>
				Fecha de fin:
				<DateField
					name='end_date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de Fin'
					value={scholarship.end_date}
					min={min}
					max={max}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.end_date}/>
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
							submitScholarship()
						}}
					>
						{`${scholarship.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>

			<ConfirmModal
				cancelAction={cancelAction}
				typeModal={typeModal}
				isShowingModal={isShowingModal}
				setIsShowingModal={setIsShowingModal}
				typeClass={'becado'}
			/>
		</>
	)
}

export default ScholarshipForm