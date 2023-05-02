import Validator from "./Validator"

const ValidatorFirstName = (first_name) => {
    const validatorFirstName = Validator(first_name)

    if(validatorFirstName.isEmpty()) return 'Nombre requerido'
    if(!validatorFirstName.isCorrectLength(2, 51)) return 'El nombre debe contener entre 3 y 50 caracteres'
    return ''
}

export default ValidatorFirstName