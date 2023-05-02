import Validator from "./Validator"

const ValidatorName = (name) => {
    const validatorName = Validator(name)
    
    if(validatorName.isEmpty()) return 'Nombre requerido'
    if(!validatorName.isCorrectLength(2, 51)) return 'El nombre debe contener entre 3 y 50 caracteres'
    return ''
}

export default ValidatorName