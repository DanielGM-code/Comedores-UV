import Validator from "./Validator"

const ValidatorMenuName = (isScholarship, name) => {
    const validatorName = Validator(name)

    if(!isScholarship && validatorName.isEmpty()) return 'Nombre requerido'
    if(!validatorName.isCorrectMaxLength(100)) return 'El nombre debe tener menos de 100 caracteres'
    return ''
}

export default ValidatorMenuName