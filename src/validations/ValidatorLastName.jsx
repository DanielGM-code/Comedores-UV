import Validator from "./Validator"

const ValidatorLastName = (last_name) => {
    const validatorLastName = Validator(last_name)

    if(validatorLastName.isEmpty()) return 'Apellido requerido'
    if(!validatorLastName.isCorrectLength(2, 101)) return 'El apellido debe contener máximo 100 caracteres'
    return ''
}

export default ValidatorLastName