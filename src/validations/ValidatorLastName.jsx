import Validator from "./Validator"

const ValidatorLastName = (last_name) => {
    const validatorLastName = Validator(last_name)

    if(validatorLastName.isEmpty()) return 'Apellido requerido'
    if(!validatorLastName.isCorrectMaxLength(100)) return 'El apellido debe tener menos de 100 caracteres'
    return ''
}

export default ValidatorLastName