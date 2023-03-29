import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createSupplierMutation, CREATE_MUTATION_OPTIONS, updateSupplierMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'

const SupplierForm = ({ cancelAction, supplierUpdate}) => {
    const [supplier, setSupplier] = useState(supplierUpdate ?? {
        nombre: '',
        direccion: '',
        telefono: '',
        rfc: ''
    })

    const [validations, setValidations] = useState({
        nombre: [],
        direccion: [],
        telefono: [],
        rfc: []
    })

    const validateAll = () => {
        const { nombre, direccion, telefono, rfc } = supplier
        const validations = { nombre, direccion, telefono, rfc }

        validations.nombre = validateName(nombre)
        validations.direccion = validateAddress(direccion)
        validations.telefono = validatePhone(telefono)
        validations.rfc = validateRfc(rfc)

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
        const value = supplier[name]
        let message = ''

        if(!value){

            if(name === 'nombre') message = 'Nombre requerido'

            if(name === 'direccion') message = 'Dirección requerida'

            if(name === 'telefono') message = 'Telefono requerido'

            if(name === 'rfc') message = 'RFC requerido'

        }else{

            if(name === 'nombre' && (value.length < 10 || value.length > 50)){
				message = 'El nombre debe contener ...'
			}

            if(name === 'direccion' && (value.length < 10 || value.length > 50)){
				message = 'La dirección debe contener ...'
			}

            if(name === 'telefono' && (value.length < 10 || value.length > 50)){
				message = 'El telefono debe contener ...'
			}

            if(name === 'rfc' && (value.length < 10 || value.length > 50)){
				message = 'El RFC debe contener ...'
			}
        }

        setValidations({ ...validations, [name]: [message] })
    }

    const validateName = (nombre) => {
        const validatorName = new Validator(nombre)
        return validatorName
            .isNotEmpty('Nombre requerido').result
    }

    const validateAddress = (direccion) => {
        const validatorAddress = new Validator(direccion)
        return validatorAddress
            .isNotEmpty('Dirección requerida').result
    }

    const validatePhone = (telefono) => {
        const validatorPhone = new Validator (telefono)
        return validatorPhone
            .isNotEmpty('Telefono requerido').result
    }

    const validateRfc = (rfc) => {
        const validatorRfc = new Validator(rfc)
        return validatorRfc
            .isNotEmpty('RFC requerido').result
    }

    const queryClient = useQueryClient()
    const createMutation = useMutation(createSupplierMutation, {
        ...CREATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('suppliers')
        }
    })

    const updateMutation = useMutation(updateSupplierMutation, {
        ...UPDATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('suppliers')
        }
    })

    function handleInputChange(event) {
        setSupplier(prevSupplier => {
            return {
                ...prevSupplier,
                [event.target.name]: event.target.value
            }
        })
    }

    async function submitSupplier() {
        const isValid = validateAll();

		if(!isValid){
			return false
		}

        if(supplier.id) {
            await updateMutation.mutateAsync(supplier)
            updateMutation.reset()
        }else{
            await createMutation.mutateAsync(supplier)
            createMutation.reset()
        }
        await queryClient.resetQueries()
        cancelAction()
    }

    const {
        nombre: nombreVal,
        direccion: direccionVal,
        telefono: telefonoVal,
        rfc: rfcVal
    } = validations

    return (
        <form>
            <FormField
				name='nombre'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Nombre'
				value={supplier.name}
				onChange={handleInputChange}
                onBlur={validateOne}
			/>
            <ErrorMessage validation={nombreVal}/>
            <FormField
				name='direccion'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Dirección'
				value={supplier.address}
				onChange={handleInputChange}
                onBlur={validateOne}
			/>
            <ErrorMessage validation={direccionVal}/>
            <FormField
				name='telefono'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Teléfono'
				value={supplier.phone}
				onChange={handleInputChange}
                onBlur={validateOne}
			/>
            <ErrorMessage validation={telefonoVal}/>
            <FormField
				name='rfc'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='RFC'
				value={supplier.rfc}
				onChange={handleInputChange}
                onBlur={validateOne}
			/>
            <ErrorMessage validation={rfcVal}/>
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
					onClick={submitSupplier}
				>
					{`${supplier.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
        </form>
    )
}

export default SupplierForm