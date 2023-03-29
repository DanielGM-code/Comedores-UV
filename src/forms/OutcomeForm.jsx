import React from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQueryClient } from 'react-query'
import { createOutcomeMutation, CREATE_MUTATION_OPTIONS, updateOutcomeMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import DateField from '../components/DateField'


const OutcomeForm = ({ cancelAction, outcomeUpdate }) => {
	const [outcome, setOutcome] = useState(outcomeUpdate ? {
		...outcomeUpdate,
		fecha: new Date(outcomeUpdate.fecha).formatted()
	} : {
		proveedor: '',
		fecha: new Date().formatted(),
		factura: '',
		total: ''
	})

	const [validations, setValidations] = useState({
		proveedor: [],
		fecha: [],
		factura: [],
		total: []
	})

	const validateAll = () => {
		const { proveedor, fecha, factura, total } = outcome
		const validations = { proveedor: '', fecha: '', factura: '', total: ''}

		validations.proveedor = validateSupplier(proveedor)
		validations.fecha = validateDate(fecha)
		validations.factura = validateInvoice(factura)
		validations.total = validateTotal(total)

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
		const {name} = e.target
		const value = outcome[name]
		let message = ''

		if(!value){

			if(name === 'proveedor') message = 'Nombre del proveedor requerido'

			if(name === 'fecha') message = 'Fecha requerida'

			if(name === 'factura') message = 'Factura requerida'

			if(name === 'total') message = 'Total requerido'

		}else{
			//falta validar longitud
			if(name === 'proveedor' && (value.length < 3 || value.length > 50)){
				return 'El nombre del proveedor debe contener ...'
			}

			if(name === 'factura' && (value.length < 3 || value.length > 50)){
				return 'La factura debe contener ...'
			}

			if(name === 'total' && value < 0){
				return 'El total no debe ser un saldo negativo'
			}
		}

		setValidations({ ...validations, [name]: [message] })
	}

	const validateSupplier = (proveedor) => {
		const validatorSupplier = new Validator(proveedor)
		return validatorSupplier
			.isNotEmpty('Nombre del proveedor requerido').result
	}

	const validateDate = (fecha) => {
		const validatorDate = new Validator(fecha)
		return validatorDate.isNotEmpty('Fecha requerida').result
	}

	const validateInvoice = (factura) => {
		const validatorInvoice = new Validator(factura)
		return validatorInvoice
			.isNotEmpty('Factura requerida').result
	}

	const validateTotal = (total) => {
		const validatorTotal = new Validator(total)
		return validatorTotal
			.isNotEmpty('Total requerido')
			.isNegativeBalance('El monto no debe tener saldo negativo').result
	}

	const queryClient = useQueryClient()
	const createMutation = useMutation(createOutcomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('outcomes')
		}
	})

	const updateMutation = useMutation(updateOutcomeMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('outcomes')
		}
	})

	function handleInputChange(event) {
		setOutcome(prevOutcome => {
			return {
				...prevOutcome,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitOutcome() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}
		
		if (outcome.id) {
			await updateMutation.mutateAsync(outcome)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(outcome)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		
		cancelAction()
	}

	const { proveedor: proveedorVal, 
		fecha: fechaVal,
		factura: facturaVal,
		total: totalVal
	} = validations

	const today1 = new Date()
	today1.setFullYear(today1.getFullYear() - 1)
	const min = today1.formatted()
	const today2 = new Date()
	today2.setFullYear(today2.getFullYear() + 1)
	const max = today2.formatted()

	return (
		<form>
			<FormField
				name='proveedor'
				inputType='text'
				iconClasses='fa-solid fa-user-tie'
				placeholder='Nombre del proveedor'
				value={outcome.proveedor}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={proveedorVal}/>
			Fecha:
			<DateField
				name='fecha'
				inputType='date'
				iconClasses='fa-solid fa-calendar-days'
				placeholder='Fecha'
				value={outcome.fecha}
				min={min}
				max={max}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={fechaVal}/>
			<FormField
				name='factura'
				inputType='text'
				iconClasses='fa-solid fa-receipt'
				placeholder='Factura'
				value={outcome.factura}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={facturaVal}/>
			<FormField
				name='total'
				inputType='number'
				iconClasses='fa-solid fa-circle-dollar-to-slot'
				placeholder='Total'
				value={outcome.total}
				onChange={handleInputChange}
				onBlur={validateOne}
			/>
			<ErrorMessage validation={totalVal}/>
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
					onClick={submitOutcome}
				>
					{`${outcome.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
		</form>
	)
}

export default OutcomeForm