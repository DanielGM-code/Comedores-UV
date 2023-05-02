import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createProviderMutation, CREATE_MUTATION_OPTIONS, updateProviderMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import ValidatorName from '../validations/ValidatorName'
import ValidatorAddress from '../validations/ValidatorAddress'
import ValidatorPhone from '../validations/ValidatorPhone'
import ValidatorRfc from '../validations/ValidatorRfc'

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
        name: '',
        address: '',
        phone: '',
        rfc: ''
    })

    const validateAll = () => {
        const { name, address, phone, rfc } = provider
        const validations = { name: '', address: '', phone: '', rfc: '' }

        validations.name = ValidatorName(name)
        validations.address = ValidatorAddress(address)
        validations.phone = ValidatorPhone(phone)
        validations.rfc = ValidatorRfc(rfc)

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

        if(name ===  'name') message = ValidatorName(value)
        if(name === 'address') message = ValidatorAddress(value)
        if(name === 'phone') message = ValidatorPhone(value)
        if(name === 'rfc') message = ValidatorRfc(value)

        setValidations({ ...validations, [name]: [message] })
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
                <ErrorMessage validation={validations.name}/>
                <FormField
                    name='address'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Dirección'
                    value={provider.address}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={validations.address}/>
                <FormField
                    name='phone'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='Teléfono'
                    value={provider.phone}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={validations.phone}/>
                <FormField
                    name='rfc'
                    inputType='text'
                    iconClasses='fa-solid fa-i-cursor'
                    placeholder='RFC'
                    value={provider.rfc}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <ErrorMessage validation={validations.rfc}/>
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