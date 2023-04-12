import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import DateField from '../components/DateField'
import Modal from '../components/Modal'
import { createInternMutation, CREATE_MUTATION_OPTIONS, updateInternMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import '../utils/formatting'
import ConfirmModal from '../components/ConfirmModal'

const InternForm = ({ cancelAction, internUpdate }) => {
	const [intern, setIntern] = useState(internUpdate ? {
		...internUpdate,
		fechaInicio: new Date(internUpdate.fechaInicio).formatted(),
		fechaFin: new Date(internUpdate.fechaFin).formatted(),
	} : {
		firstName: '',
		lastName: '',
		carrera: '',
		credito: '',
		fechaInicio: new Date().formatted(),
		fechaFin: new Date().formatted()
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		firstName: [],
		lastName: [],
		carrera: [],
		credito: [],
		fechaInicio: [],
		fechaFin: []
	})

	const validateAll = () => {
		const { firstName, lastName, carrera, credito, fechaInicio, fechaFin } = intern
		const validations = { firstName: '', lastName: '', carrera: '', credito: '', fechaInicio: '', fechaFin: '' }

		validations.firstName = validateFirstName(firstName)
		validations.lastName = validateLastName(lastName)
		validations.carrera = validateCarrera(carrera)
		validations.credito = validateCredito(credito)
		validations.fechaInicio = validateStartDate(fechaInicio, fechaFin)
		validations.fechaFin = validateEndDate(fechaFin, fechaInicio)

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
		const value = intern[name]
		let message = ''

		if(!value){

			if(name === 'firstName') message = `Nombre requerido`

			if(name === 'lastName') message = `Apellido requerido`

			if(name === 'carrera') message = `Carrera requerida`

			if(name === 'credito') message = `Crédito requerido`

			if(name === 'fechaInicio') message = `Fecha de inicio requerido`

			if(name === 'fechaFin') message = `Fecha de fin requerido`
			
		}else{
			//falta validar longitud
			if(name === 'firstName' && (value.length < 3 || value.length > 50)){
				message = 'El nombre debe contener entre ...'
			}

			//falta validar longitud
			if(name === 'lastName' && (value.length < 3 || value.length > 50)){
				message = 'El apellido debe contener entre 3 y 50 caracteres'
			}

			//falta validar longitud
			if(name === 'carrera' && (value.length < 10 || value.length > 50)){
				message = 'La carrera debe estar entre 10 y 50 caracteres'
			}
			
			//falta limite superior
			if(name === 'credito' && value < 0){
				message = 'El crédito no debe ser un saldo negativo'
			}

			if(name === 'fechaInicio' && (value < intern['fechaFin'])){
				message = 'La fecha de inicio debe ser mayor a la fecha de fin'
			}

			if(name === 'fechaFin' && (value > intern['fechaInicio'])){
				message = 'La fecha de fin debe ser menor a la fecha de inicio'
			}
		}

		setValidations({ ...validations, [name]: [message] })
	}

	const validateFirstName = (firstName) => {
		const validatorFirstName = new Validator(firstName)
		return validatorFirstName
			.isNotEmpty('Nombre requerido').result
	}

	const validateLastName = (lastName) => {
		const validatorLastName = new Validator(lastName)
		return validatorLastName
			.isNotEmpty('Apellido requerido').result
	}

	const validateCarrera = (carrera) => {
		const validatorCarrera = new Validator(carrera)
		return validatorCarrera
			.isNotEmpty('Carrera requerida').result
	}

	const validateCredito = (credito) => {
		const validatorCredito = new Validator(credito)
		return validatorCredito
			.isNotEmpty('Crédito requerido')
			.isNegativeBalance('El crédito no debe ser saldo negativo').result
	}

	const validateStartDate = (startDate, endDate) => {
		const validatorFecha = new Validator(startDate)
		return validatorFecha
			.isNotEmpty('Fecha requerida')
			.isMaxValueDate('La fecha de inicio debe ser mayor a la fecha de fin', endDate).result
	}

	const validateEndDate = (endDate, startDate) => {
		const validatorFecha = new Validator(endDate)
		return validatorFecha
			.isNotEmpty('Fecha requerida')
			.isMinValueDate('La fecha de fin debe ser menor a la fecha de inicio', startDate).result
	}

	const queryClient = useQueryClient()
	const createMutation = useMutation(createInternMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('interns')
		}
	})

	const updateMutation = useMutation(updateInternMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('interns')
		}
	})

	function handleInputChange(event) {
		setIntern(prevIntern => {
			return {
				...prevIntern,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitIntern() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}

		if (intern.id) {
			await updateMutation.mutateAsync(intern)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(intern)
			createMutation.reset()
		}
		await queryClient.resetQueries()
	}

	const { firstName: firstNameVal, 
		lastName: lastNameVal,
		carrera: carreraVal,
		credito: creditoVal,
		fechaInicio: fechaInicioVal,
		fechaFin: fechaFinVal
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
					name='firstName'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre'
					value={intern.firstName}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={firstNameVal}/>
				<FormField
					name='lastName'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Apellido'
					value={intern.lastName}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={lastNameVal}/>
				<FormField
					name='carrera'
					inputType='text'
					iconClasses='fa-solid fa-user-graduate'
					placeholder='Carrera'
					value={intern.carrera}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={carreraVal}/>
				<FormField
					name='credito'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Crédito'
					value={intern.credito}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={creditoVal}/>
				Fecha de inicio:
				<DateField
					name='fechaInicio'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de Inicio'
					value={intern.fechaInicio}
					min={min}
					max={max}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={fechaInicioVal}/>
				Fecha de fin:
				<DateField
					name='fechaFin'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de Fin'
					value={intern.fechaFin}
					min={min}
					max={max}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={fechaFinVal}/>
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
							submitIntern()
							setTypeModal(intern.id ? 3 : 2)
							setIsShowingModal(true)
						}}
					>
						{`${intern.id ? 'Actualizar' : 'Guardar'}`}
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

export default InternForm