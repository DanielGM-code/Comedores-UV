import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import ComboBox from '../components/ComboBox'
import ErrorMessage from '../components/ErrorMessage'
import { createUserMutation, CREATE_MUTATION_OPTIONS, updateUserMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import ConfirmModal from '../components/ConfirmModal'
import ValidatorPassword from '../validations/ValidatorPassword'
import ValidatorName from '../validations/ValidatorName'
import ValidatorEmail from '../validations/ValidatorEmail'


const UserForm = ({ cancelAction, userUpdate, users }) => {
	const [user, setUser] = useState(userUpdate ?? {
		name: '',
		email: '',
		password: '',
		role: 'user'
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		name: '',
		email: '',
		password: ''
	})

	const validateAll = () => {
		const { name, email, password } = user
		const validations = { name: '', email: '', password: '' }

		validations.name = ValidatorName(name)
		validations.email = ValidatorEmail(email)
		validations.password = ValidatorPassword(password)

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

		if(name === 'name') message = ValidatorName(value)
		if(name === 'email') message = ValidatorEmail(value)
		if(name === 'password') message = ValidatorPassword(value)

		setValidations({ ...validations, [name]: [message] })
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
		{ label: 'Administrador', value: 'admin' }, 
		{ label: 'Cajero', value: 'cajero' }, 
		{ label: 'Chef', value: 'chef' },
		{ label: 'Usuario', value: 'user'}
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
				<ErrorMessage validation={validations.name}/>
				<FormField
					name='email'
					inputType='email'
					iconClasses='fa-solid fa-at'
					placeholder='Correo'
					value={user.email}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.email}/>
				<FormField
					name='password'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Contraseña'
					value={user.password}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.password}/>
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