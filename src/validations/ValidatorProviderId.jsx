import Validator from "./Validator"

const ValidatorProviderId = (id, providers) => {
    const validatorProvider = Validator(id)

    if(validatorProvider.isEmpty()) return 'Proveedor requerido'
    let foundProvider = providers.find(provider => provider.id === id)
    if(!foundProvider) return 'El proveedor ya no existe'
    return ''
}

export default ValidatorProviderId