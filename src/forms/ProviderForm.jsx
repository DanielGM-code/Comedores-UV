import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createProviderMutation, CREATE_MUTATION_OPTIONS, updateProviderMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'

const ProviderForm = ({ cancelAction, providerUpdate}) => {
    const [provider, setProvider] = useState(providerUpdate ?? {
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
        const { name, address, phone, rfc } = provider
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
        const value = provider[name]
        let message = ''

        if(name ===  'name') message = validateName(value)
        if(name === 'address') message = validateAddress(value)
        if(name === 'phone') message = validatePhone(value)
        if(name === 'rfc') message = validateRfc(value)

        setValidations({ ...validations, [name]: [message] })
    }

    const validateName = (name) => {
        let validatorName = Validator(name)

        if((validatorName.isEmpty())) return 'Nombre requerido'
        if(!validatorName.isCorrectLength(4, 101)) return 'El nombre debe contener entre 5 y 100 caracteres'
        return ''
    }

    const validateAddress = (address) => {
        let validatorAddress = Validator(address)

        if(validatorAddress.isEmpty()) return 'Dirección requerida'
        if(!validatorAddress.isCorrectLength(4, 101)) return 'La dirección debe contener entre 5 y 100 caracteres'
        return ''
    }

    const validatePhone = (phone) => {
        const validatorPhone = Validator(phone)

        if(validatorPhone.isEmpty()) return 'Teléfono requerido'
        if(!validatorPhone.isCorrectPhoneDigits()) return 'El teléfono debe contener 10 dígitos'
        if(!validatorPhone.isCorrectPhoneFormat()) return 'El teléfono debe tener un formato válido'
        return ''
    }

    const validateRfc = (rfc) => {
        const validatorRfc = Validator(rfc)

        if(validatorRfc.isEmpty()) return 'RFC requerido'
        if(!validatorRfc.isCorrectRfcName()) return 'El RFC debe contener 3 letras mayúsculas iniciales'
        if(!validatorRfc.isCorrectRfcDate()) return 'El RFC debe tener una fecha válida. Consulte "Ayuda" para más información'
        if(!validatorRfc.isCorrectRfcHomoclaveFirstLetter()) return 'El primer carácter de la homoclave debe ser una letra o un dígito. Consulte "Ayuda" para más información'
        if(!validatorRfc.isCorrectRfcHomoclaveSecondLetter()) return 'El segundo carácter de la homoclave debe ser una una letra o un dígito. Consulte "Ayuda" para más información'
        if(!validatorRfc.isCorrectRfcValidatorDigit()) return 'El dígito verificador debe ser la letra A o un dígito. Consulte "Ayuda" para más información'
        return ''
    }

    const queryClient = useQueryClient()
    const createMutation = useMutation(createProviderMutation, {
        ...CREATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('providers')
        }
    })

    const updateMutation = useMutation(updateProviderMutation, {
        ...UPDATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('providers')
        }
    })

    function handleInputChange(event) {
        setProvider(prevProvider => {
            return {
                ...prevProvider,
                [event.target.name]: event.target.value
            }
        })
    }

    async function submitProvider() {
        const isValid = validateAll();

		if(!isValid){
			return false
		}

        if(provider.id) {
            await updateMutation.mutateAsync(provider)
            updateMutation.reset()
        }else{
            await createMutation.mutateAsync(provider)
            createMutation.reset()
        }
        await queryClient.resetQueries()
        setTypeModal(provider.id ? 3 : 2)
        setIsShowingModal(true)
    }

    const {
        name: nameValidation,
        address: addressValidation,
        phone: phoneValidation,
        rfc: rfcValidation
    } = validations

    return (
        <>
            <form>
                <FormField
                    name='name'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Nombre'
                    value={provider.name}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={nameValidation}/>
                <FormField
                    name='address'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Dirección'
                    value={provider.address}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={addressValidation}/>
                <FormField
                    name='phone'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Teléfono'
                    value={provider.phone}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={phoneValidation}/>
                <FormField
                    name='rfc'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='RFC'
                    value={provider.rfc}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={rfcValidation}/>
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
                            submitProvider()
                        }}
                    >
                        {`${provider.id ? 'Actualizar' : 'Guardar'}`}
                    </button>
                </div>
            </form>

            <ConfirmModal
				objectClass={providerUpdate}
				cancelAction={cancelAction}
				typeModal={typeModal}
				isShowingModal={isShowingModal}
				setIsShowingModal={setIsShowingModal}
				typeClass={'proveedor'}
			/>

        </>
    )
}

export default ProviderForm