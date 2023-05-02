import Validator from "./Validator"

const ValidatorProviderId = (id, providers) => {
    const validatorProvider = Validator(id)

    if(validatorProvider.isEmpty()) return 'Provedor requerido'
    let foundProvider = providers.find(provider => provider.id === id)
    if(!foundProvider) return 'El proveedor seleccionado ya no existe'
    return ''
}

export default ValidatorProviderId