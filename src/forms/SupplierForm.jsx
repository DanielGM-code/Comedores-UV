import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createSupplierMutation, CREATE_MUTATION_OPTIONS, updateSupplierMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'

const SupplierForm = ({ cancelAction, supplierUpdate}) => {
    const [supplier, setSupplier] = useState(supplierUpdate ?? {
        name: '',
        address: '',
        phone: '',
        rfc: ''
    })

    const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

    const [validations, setValidations] = useState({
        name: [],
        address: [],
        phone: [],
        rfc: []
    })

    const validateAll = () => {
        const { name, address, phone, rfc } = supplier
        const validations = { name: '', address: '', phone: '', rfc: '' }

        validations.name = validateName(name)
        validations.address = validateAddress(address)
        validations.phone = validatePhone(phone)
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

            if(name === 'name') message = 'Nombre requerido'

            if(name === 'address') message = 'Dirección requerida'

            if(name === 'phone') message = 'Telefono requerido'

            if(name === 'rfc') message = 'RFC requerido'

        }else{

            if(name === 'name' && (value.length < 3 || value.length > 50)){
				message = 'El nombre debe contener ...'
			}

            if(name === 'address' && (value.length < 3 || value.length > 50)){
				message = 'La dirección debe contener ...'
			}

            if(name === 'phone' && (value.length < 3 || value.length > 50)){
				message = 'El telefono debe contener ...'
			}

            if(name === 'rfc' && (value.length < 3 || value.length > 50)){
				message = 'El RFC debe contener ...'
			}
        }

        setValidations({ ...validations, [name]: [message] })
    }

    const validateName = (name) => {
        const validatorName = new Validator(name)
        return validatorName
            .isNotEmpty('Nombre requerido').result
    }

    const validateAddress = (address) => {
        const validatorAddress = new Validator(address)
        return validatorAddress
            .isNotEmpty('Dirección requerida').result
    }

    const validatePhone = (phone) => {
        const validatorPhone = new Validator (phone)
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
    }

    const {
        name: nombreVal,
        address: direccionVal,
        phone: telefonoVal,
        rfc: rfcVal
    } = validations

    return (
        <>
            <form>
                <FormField
                    name='name'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Nombre'
                    value={supplier.name}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={nombreVal}/>
                <FormField
                    name='address'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Dirección'
                    value={supplier.address}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={direccionVal}/>
                <FormField
                    name='phone'
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
                            submitSupplier()
                            setTypeModal(supplier.id ? 3 : 2)
                            setIsShowingModal(true)
                        }}
                    >
                        {`${supplier.id ? 'Actualizar' : 'Guardar'}`}
                    </button>
                </div>
            </form>

            <ConfirmModal
				objectClass={supplierUpdate}
				cancelAction={cancelAction}
				typeModal={typeModal}
				isShowingModal={isShowingModal}
				setIsShowingModal={setIsShowingModal}
				typeClass={'proveedor'}
			/>

        </>
    )
}

export default SupplierForm