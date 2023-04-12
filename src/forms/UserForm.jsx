import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import ComboBox from '../components/ComboBox'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import { createUserMutation, CREATE_MUTATION_OPTIONS, updateUserMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import ConfirmModal from '../components/ConfirmModal'

const UserForm = ({ cancelAction, userUpdate }) => {
	const [user, setUser] = useState(userUpdate ?? {
		firstName: '',
		lastName: '',
		email: '',
		username: '',
		rol: 'Cajero'
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		firstName: [],
		lastName: [],
		email: [],
		username: []
	})

	const validateAll = () => {
		const { firstName, lastName, email, username } = user
		const validations = { firstName: '', lastName: '', email: '', username: '' }

		validations.firstName = validateFirstName(firstName)
		validations.lastName = validateLastName(lastName)
		validations.email = validateEmail(email)
		validations.username = validateUsername(username)

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
		const value = user[name]
		let message = ''

		if(!value){

			if(name === 'firstName') message = `Nombre requerido`

			if(name === 'lastName') message = `Apellido requerido`

			if(name === 'email') message = `Correo requerido`

			if(name === 'username') message = `Usuario requerido`
			
		}else{
			//falta validar longitud
			if(name === 'firstName' && (value.length < 3 || value.length > 50)){
				message = 'El nombre debe contener entre ...'
			}

			//falta validar longitud
			if(name === 'lastName' && (value.length < 3 || value.length > 50)){
				message = 'El apellido debe contener entre 3 y 50 caracteres'
			}

			//falta validar formato de correo
			if(name === 'email' && (value.length < 10 || value.length > 50)){
				message = 'El correo debe estar entre 10 y 50 caracteres'
			}
			
			if(name === 'email' && !/.+@.+\.[A-Za-z]+$/.test(value)){
				message = 'El correo debe ser como ejemplo@ejemplo.com'
			}

			//falta validar logitud
			if(name === 'username' && (value.length < 6 || value.length > 20)){
				message = 'El username debe contener entre ...'
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

	const validateEmail = (email) => {
		const validatorEmail = new Validator(email)
		return validatorEmail
			.isNotEmpty('Correo requerido')
			.isEmail('El correo debe ser como ejemplo@ejemplo.com').result
	}

	const validateUsername = (username) => {
		const validatorUsername = new Validator(username)
		return validatorUsername
			.isNotEmpty('Username requerido').result
	}

	const queryClient = useQueryClient()
	const createMutation = useMutation(createUserMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('users')
		}
	})

	const updateMutation = useMutation(updateUserMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('users')
		}
	})

	const roles = [
		{ label: 'Administrador', value: 'Administrador' }, 
		{ label: 'Cajero', value: 'Cajero' }, 
		{ label: 'Chef', value: 'Chef' }
	]

	function handleInputChange(event) {
		setUser(prevUser => {
			return {
				...prevUser,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitUser() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}

		if (user.id) {
			await updateMutation.mutateAsync(user)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(user)
			createMutation.reset()
		}
		await queryClient.resetQueries()
	}

	const { firstName: firstNameVal, 
		lastName: lastNameVal, 
		email: emailVal, 
		username: usernameVal
		} = validations

	return (
		<>
			<form>
				<FormField
					name='firstName'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre'
					value={user.firstName}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={firstNameVal}/>
				<FormField
					name='lastName'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Apellido'
					value={user.lastName}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={lastNameVal}/>
				<FormField
					name='email'
					inputType='email'
					iconClasses='fa-solid fa-at'
					placeholder='E-mail'
					value={user.email}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={emailVal}/>
				<FormField
					name='username'
					inputType='text'
					iconClasses='fa-solid fa-user'
					placeholder='Apellido'
					value={user.username}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={usernameVal}/>
				<ComboBox
					name='rol'
					options={roles}
					iconClasses='fa-solid fa-address-book'
					value={user.rol}
					onChange={handleInputChange}
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
							submitUser()
							setTypeModal(user.id ? 3 : 2)
							setIsShowingModal(true)
						}}
					>
						{`${user.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>

			<ConfirmModal 
				objectClass={userUpdate} 
				cancelAction={cancelAction} 
				typeModal={typeModal} 
				isShowingModal={isShowingModal} 
				setIsShowingModal={setIsShowingModal}
				typeClass={'usuario'}
			/>
		</>
	)
}

export default UserForm