import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import DateField from '../components/DateField'
import { createScholarshipMutation, CREATE_MUTATION_OPTIONS, updateScholarshipMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import '../utils/formatting'
import Alert from '../components/Alert'
import ScholarshipFormValidator from '../validations/ScholarshipFormValidator'

const ScholarshipForm = ({ cancelAction, scholarshipUpdate }) => {
	document.body.style.overflow = 'hidden'
	
	const [scholarship, setScholarship] = useState(scholarshipUpdate ? {
		...scholarshipUpdate,
		start_date: new Date(scholarshipUpdate.start_date).formatted(),
		end_date: new Date(scholarshipUpdate.end_date).formatted(),
	} : {
		user_id: null,
		first_name: '',
		last_name: '',
		paid_meals: 0,
		career: '',
		start_date: new Date().formatted(),
		end_date: new Date().formatted()
	})

	const [validations, setValidations] = useState({
		first_name: null,
		last_name: null,
		career: null,
		start_date: null,
		end_date: null
	})

	const validateAll = () => {
		const { first_name, last_name, career, start_date, end_date } = scholarship
		const validations = { first_name: null, last_name: null, career: null, start_date: null, end_date: null }

		validations.first_name = ScholarshipFormValidator(first_name).nameValidator()
		validations.last_name = ScholarshipFormValidator(last_name).lastNameValidator()
		validations.career = ScholarshipFormValidator(career).careerValidator()
		validations.start_date = ScholarshipFormValidator(start_date).startDateValidator(end_date)
		validations.end_date = ScholarshipFormValidator(end_date).endDateValidator(start_date)

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
		const value = scholarship[name]
		let message = null

		if(name === 'first_name') message = ScholarshipFormValidator(value).nameValidator()
		if(name === 'last_name') message = ScholarshipFormValidator(value).lastNameValidator()
		if(name === 'career') message = ScholarshipFormValidator(value).careerValidator()
		if(name === 'start_date') message = ScholarshipFormValidator(value).startDateValidator(scholarship['end_date'])
		if(name === 'end_date') message = ScholarshipFormValidator(value).endDateValidator(scholarship['start_date'])

		setValidations({ ...validations, [name]: message })
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
		cancelAction()
		document.body.style.overflow = null
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
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.first_name}
                />
				<FormField
					name='last_name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Apellido'
					value={scholarship.last_name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.last_name}
                />
				<FormField
					name='career'
					inputType='text'
					iconClasses='fa-solid fa-user-graduate'
					placeholder='Carrera'
					value={scholarship.career}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.career}
                />
				<DateField
					name='start_date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de Inicio'
					value={scholarship.start_date}
					min={min}
					max={max}
					label='Fecha de inicio:'
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.start_date}
                />
				<DateField
					name='end_date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de Fin'
					value={scholarship.end_date}
					min={min}
					max={max}
					label='Fecha de fin:'
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.end_date}
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
							submitScholarship()
						}}
					>
						{`${scholarship.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>
		</>
	)
}

export default ScholarshipForm