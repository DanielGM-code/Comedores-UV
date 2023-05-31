import Validator from "./Validator"

const ValidatorName = (name) => {
    const validatorName = Validator(name)
    
    if(validatorName.isEmpty()) return 'Nombre requerido'
    if(!validatorName.isCorrectLength(2, 101)) return 'El nombre debe contener máximo 100 caracteres'
    return ''
}

export default ValidatorName