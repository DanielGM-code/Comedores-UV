import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import DateField from '../components/DateField'
import { createScholarshipMutation, CREATE_MUTATION_OPTIONS, updateScholarshipMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import '../utils/formatting'
import ConfirmModal from '../components/ConfirmModal'

const ScholarshipForm = ({ cancelAction, scholarshipUpdate }) => {
	const [scholarship, setScholarship] = useState(scholarshipUpdate ? {
		...scholarshipUpdate,
		start_date: new Date(scholarshipUpdate.start_date).formatted(),
		end_date: new Date(scholarshipUpdate.end_date).formatted(),
	} : {
		user_id: '',
		first_name: '',
		last_name: '',
		paid_meals: 0,
		career: '',
		start_date: new Date().formatted(),
		end_date: new Date().formatted()
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		first_name: [],
		last_name: [],
		career: [],
		start_date: [],
		end_date: []
	})

	const validateAll = () => {
		const { first_name, last_name, career, start_date, end_date } = scholarship
		const validations = { first_name: '', last_name: '', career: '', start_date: '', end_date: '' }

		validations.first_name = validateFirstName(first_name)
		validations.last_name = validateLastName(last_name)
		validations.career = validateCareer(career)
		validations.start_date = validateStartDate(start_date, end_date)
		validations.end_date = validateEndDate(end_date, start_date)

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

		if(name === 'first_name') message = validateFirstName(value)
		if(name === 'last_name') message = validateLastName(value)
		if(name === 'career') message = validateCareer(value)
		if(name === 'start_date') message = validateStartDate(value)
		if(name === 'end_date') message = validateEndDate(value)

		setValidations({ ...validations, [name]: [message] })
	}

	const validateFirstName = (first_name) => {
		const validatorFirstName = Validator(first_name)

		if(validatorFirstName.isEmpty()) return 'Nombre requerido'
		if(!validatorFirstName.isCorrectLength(2, 51)) return 'El nombre debe contener entre 3 y 50 caracteres'
		return ''
	}

	const validateLastName = (last_name) => {
		const validatorLastName = Validator(last_name)

		if(validatorLastName.isEmpty()) return 'Apellido requerido'
		if(!validatorLastName.isCorrectLength(2, 51)) return 'El apellido deb contener entre 3 y 50 caracteres'
		return ''
	}

	const validateCareer = (career) => {
		const validatorCareer = Validator(career)

		if(validatorCareer.isEmpty()) return 'Carrera requerida'
		if(validatorCareer.isCorrectLength(9, 101)) return 'La carrera debe contener entre 10 y 100 caracteres'
		return ''
	}

	const validateStartDate = (start_date, end_date) => {
		const validatorDate = Validator(start_date)

		if(validatorDate.isEmpty()) return 'Fecha de inicio requerida'
		if(validatorDate.isOutOfMaxDateRange(end_date)) return 'La fecha de inicio debe ser menor a la fecha de fin'
		return ''
	}

	const validateEndDate = (end_date, start_date) => {
		const validatorDate = Validator(end_date)

		if(validatorDate.isEmpty()) return 'Fecha de fin requerida'
		if(validatorDate.isOutOfMinDateRange(start_date)) return 'La fecha de fin debe ser mayor a la fecha de inicio'
		return ''
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

	const { first_name: firstNameValidation, 
		last_name: lastNameValidation,
		career: careerValidation,
		start_date: startDateValidation,
		end_date: endDateValidation
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
				<FormField
					name='first_name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre'
					value={scholarship.first_name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={firstNameValidation}/>
				<FormField
					name='last_name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Apellido'
					value={scholarship.last_name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={lastNameValidation}/>
				<FormField
					name='career'
					inputType='text'
					iconClasses='fa-solid fa-user-graduate'
					placeholder='Carrera'
					value={scholarship.career}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={careerValidation}/>
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
				<ErrorMessage validation={startDateValidation}/>
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
				<ErrorMessage validation={endDateValidation}/>
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