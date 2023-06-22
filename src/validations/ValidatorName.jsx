import Validator from "./Validator"

const ValidatorName = (name) => {
    const validatorName = Validator(name)
    
    if(validatorName.isEmpty()) return 'Nombre requerido'
    if(!validatorName.isCorrectMaxLength(100)) return 'El nombre debe menos de 100 caracteres'
    return ''
}

export default ValidatorName