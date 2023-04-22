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
		name: '',
		email: '',
		password: '',
		role: 'Cajero'
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		name: [],
		email: [],
		password: []
	})

	const validateAll = () => {
		const { name, email, password } = user
		const validations = { name: '', email: '', password: '' }

		validations.name = validateName(name)
		validations.email = validateEmail(email)
		validations.password = validatePassword(password)

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

		if(name === 'name') message = validateName(value)
		if(name === 'email') message = validateEmail(value)
		if(name === 'password') message = validatePassword(value)

		setValidations({ ...validations, [name]: [message] })
	}

	const validateName = (name) => {
		const validatorName = Validator(name)
		
		if(validatorName.isEmpty()) return 'Nombre requerido'
		if(!validatorName.isCorrectLength(2, 51)) return 'El nombre debe contener entre 3 y 50 caracteres'
		return ''
	}

	const validateEmail = (email) => {
		const validatorEmail = Validator(email)

		if(validatorEmail.isEmpty()) return 'Correo requerido'
		if(!validatorEmail.isCorrectLength(9, 31)) return 'El correo debe estar entre 10 y 30 caracteres'
		if(!validatorEmail.isEmail()) return 'El correo debe tener el formato e-jem_pl.o@correo.com'
		return ''
	}

	const validatePassword = (password) => {
		const validatorPassword = Validator(password)

		if(validatorPassword.isEmpty()) return 'Contraseña requerido'
		if(validatorPassword.isPasswordWithWhitespace()) return 'La contraseña no debe tener espacios en blanco'
		if(!validatorPassword.isCorrectLength(5, 15)) return 'La contraseña debe contener entre 6 y 14 caracteres'
		if(!validatorPassword.isPasswordWithLowerCase()) return 'La contraseña debe tener al menos una letra minúscula'
		if(!validatorPassword.isPasswordWithNumbers()) return 'La contraseña debe tener al menos un número'
		if(!validatorPassword.isPasswordWithUpperCase()) return 'La contraseña debe tener al menos una letra mayúscula'
		return ''
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
		setTypeModal(user.id ? 3 : 2)
		setIsShowingModal(true)
	}

	const { name: nameValidation,  
		email: emailValidation, 
		password: passwordValidation
		} = validations

	return (
		<>
			<form>
				<FormField
					name='name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre'
					value={user.name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={nameValidation}/>
				<FormField
					name='email'
					inputType='email'
					iconClasses='fa-solid fa-at'
					placeholder='Correo'
					value={user.email}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={emailValidation}/>
				<FormField
					name='password'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Contraseña'
					value={user.password}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={passwordValidation}/>
				<ComboBox
					name='rol'
					options={roles}
					iconClasses='fa-solid fa-address-book'
					value={user.role}
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