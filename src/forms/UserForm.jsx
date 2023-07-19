import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createUserMutation, CREATE_MUTATION_OPTIONS, updateUserMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import AutocompleteField from '../components/AutocompleteField'
import Alert from '../components/Alert'
import UserFormValidator from '../validations/UserFormValidator'


const UserForm = ({ cancelAction, userUpdate, users, roles }) => {
	document.body.style.overflow = 'hidden'
	
	const isUpdate = userUpdate !== null ? true : false
	const [user, setUser] = useState(userUpdate ?? {
		name: '',
		email: '',
		password: '',
		role: 'admin'
	})
	const [validations, setValidations] = useState({
		name: null,
		email: null,
		password: null
	})

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

	const validateAll = () => {
		const { name, email, password } = user
		const validations = { name: null, email: null, password: null }

		validations.name = UserFormValidator(name).nameValidator()
		validations.email = UserFormValidator(email).emailValidator(users, isUpdate)
		validations.password = UserFormValidator(password).passwordValidator()

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
		)
		let isValid = !validationMessages.length

		if(!isValid) setValidations(validations)

		return isValid
	}

	const validateOne = (e) => {
		const { name } = e.target
		const value = user[name]
		let message = null

		if(name === 'name') message = UserFormValidator(value).nameValidator()
		if(name === 'email') message = UserFormValidator(value).emailValidator(users, isUpdate)
		if(name === 'password') message = UserFormValidator(value).passwordValidator()

		setValidations({ ...validations, [name]: message })
	}

	function showPassword(){
		var inputPassword = document.getElementsByName('password')[0]

		if(inputPassword.type === 'password') inputPassword.type = 'text'
		else inputPassword.type = 'password'
	}

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

		if(!isValid) return false

		if (user.id) {
			await updateMutation.mutateAsync(user)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(user)
			createMutation.reset()
		}
		
		await queryClient.resetQueries()
		cancelAction()
		document.body.style.overflow = null
	}

	return (
		<>
			<form>
				<FormField
					name='name'
					inputType='text'
					iconClasses='fa-solid fa-user'
					placeholder='Nombre'
					value={user.name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.name}
                />

				<FormField
					name='email'
					inputType='email'
					iconClasses='fa-solid fa-at'
					placeholder='Correo'
					value={user.email}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.email}
                />

				<FormField
					name='password'
					inputType='password'
					iconClasses='fa-solid fa-key'
					placeholder='Contraseña'
					value={user.password}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.password}
                />

				<div>
					<input id='show' type='checkbox' aria-describedby='show' onClick={showPassword}/>
					<label id='show'>Mostrar contraseña</label>
				</div>

				<label htmlFor='role'>Rol:</label>
				<AutocompleteField
					name='role'
					iconClasses='fa-solid fa-address-book'
					options={roles}
					selectedOption={() => {
						return roles.find(rol => rol.id === user.role)
					}}
					placeholder='Rol del usuario'
					searchable={false}
					onChange={(selectedRole) => {
						setUser(prevUser => {
							return {
								...prevUser,
								role: selectedRole.id
							}
						})
					}}
					clearable={false}
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
							submitUser()
						}}
					>
						{`${user.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>
		</>
	)
}

export default UserForm