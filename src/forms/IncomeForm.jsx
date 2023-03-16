import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import ErrorMessage from '../components/ErrorMessage'
import Validator from '../components/Validator'
import FormField from '../components/FormField'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS, updateIncomeMutation } from '../utils/mutations'

const IncomeForm = ({ cancelAction, incomeUpdate }) => {
	const [income, setIncome] = useState(incomeUpdate ?? {
		concepto: '',
		monto: '',
		referencia: ''
	})

	const [validations, setValidations] = useState({
		concepto: [],
		monto: [],
		referencia: []
	})

	const validateAll = () => {
		const { concepto, monto, referencia } = income
		const validations = { firstName: '', lastName: '', carrera: '', credito: '', fechaInicio: '', fechaFin: '' }

		validations.concepto = validateConcept(concepto)
		validations.monto = validateAmount(monto)
		validations.referencia = validateReference(referencia)

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

		if(!value){

			if(name === 'concepto') message = `Concepto requerido`

			if(name === 'monto') message = `Monto requerido`

			if(name === 'referencia') message = `Referencia requerida`
			
		}else{
			//falta validar longitud
			if(name === 'concepto' && (value.length < 3 || value.length > 50)){
				message = 'El concepto debe contener entre ...'
			}

			//falta validar longitud
			if(name === 'referencia' && (value.length < 3 || value.length > 50)){
				message = 'Laa referencia debe contener entre 3 y 50 caracteres'
			}
			
			//falta limite superior
			if(name === 'monto' && value < 0){
				message = 'El monto no debe ser un saldo negativo'
			}
		}

		setValidations({ ...validations, [name]: [message] })
	}

	const validateConcept = (concepto) => {
		const validatorConcept = new Validator(concepto)
		return validatorConcept
			.isNotEmpty('Concepto requerido').result
	}

	const validateAmount = (monto) => {
		const validatorAmount = new Validator(monto)
		return validatorAmount
			.isNotEmpty('Monto requerido')
			.isNegativeBalance('El monto no debe tener saldo negativo').result
	}

	const validateReference = (referencia) => {
		const validatorCarrera = new Validator(referencia)
		return validatorCarrera
			.isNotEmpty('Referencia requerida').result
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
	}

	const { concepto: conceptoVal, 
		monto: montoVal,
		referencia: referenciaVal
	} = validations

	return (
		<form>
			<FormField
				name='concepto'
				inputType='text'
				iconClasses='fa-solid fa-tag'
				placeholder='Concepto'
				value={income.concepto}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={conceptoVal}/>
			<FormField
				name='monto'
				inputType='text'
				iconClasses='fa-solid fa-coins'
				placeholder='Monto'
				value={income.monto}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={montoVal}/>
			<FormField
				name='referencia'
				inputType='text'
				iconClasses='fa-solid fa-money-check'
				placeholder='Referencia'
				value={income.referencia}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={referenciaVal}/>
			<div className='modal-footer'>
				<button
					type='button'
					className='btn btn-danger'
					onClick={cancelAction}
				>
					Cancelar
				</button>
				<button
					type='button'
					className='btn btn-primary'
					onClick={submitIncome}
				>
					{`${income.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
		</form>
	)
}

export default IncomeForm