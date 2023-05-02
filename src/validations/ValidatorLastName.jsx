import Validator from "./Validator"

const ValidatorLastName = (last_name) => {
    const validatorLastName = Validator(last_name)

    if(validatorLastName.isEmpty()) return 'Apellido requerido'
    if(!validatorLastName.isCorrectLength(2, 51)) return 'El apellido deb contener entre 3 y 50 caracteres'
    return ''
}

export default ValidatorLastName