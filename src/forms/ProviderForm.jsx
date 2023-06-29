import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createProviderMutation, CREATE_MUTATION_OPTIONS, updateProviderMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Alert from '../components/Alert'
import ConfirmModal from '../components/ConfirmModal'
import ProviderFormValidator from '../validations/ProviderFormValidator'

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
        name: null,
        address: null,
        phone: null,
        rfc: null
    })

    const validateAll = () => {
        const { name, address, phone, rfc } = provider
        const validations = { name: null, address: null, phone: null, rfc: null }

        validations.name = ProviderFormValidator(name).nameValidator()
        validations.address = ProviderFormValidator(address).addressValidator()
        validations.phone = ProviderFormValidator(phone).phoneValidator()
        validations.rfc = ProviderFormValidator(rfc).rfcValidator()

        const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
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
        let message = null

        if(name ===  'name') message = ProviderFormValidator(value).nameValidator()
        if(name === 'address') message = ProviderFormValidator(value).addressValidator()
        if(name === 'phone') message = ProviderFormValidator(value).phoneValidator()
        if(name === 'rfc') message = ProviderFormValidator(value).rfcValidator()

        setValidations({ ...validations, [name]: message })
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
                    iconClasses='fa-solid fa-person'
                    placeholder='Nombre'
                    value={provider.name}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.name}
                />
                <FormField
                    name='address'
                    inputType='text'
                    iconClasses='fa-solid fa-compass'
                    placeholder='Dirección'
                    value={provider.address}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.address}
                />
                <FormField
                    name='phone'
                    inputType='text'
                    iconClasses='fa-solid fa-phone'
                    placeholder='Teléfono'
                    value={provider.phone}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.phone}
                />
                <FormField
                    name='rfc'
                    inputType='text'
                    iconClasses='fa-solid fa-id-card'
                    placeholder='RFC'
                    value={provider.rfc}
                    onChange={handleInputChange}
                    onBlur={validateOne}
                />
                <Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.rfc}
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