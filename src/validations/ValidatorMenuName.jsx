import Validator from "./Validator"

const ValidatorMenuName = (isScholarship, name) => {
    const validatorName = Validator(name)

    if(!isScholarship && validatorName.isEmpty()) return 'Nombre requerido'
    if(name.length > 100) return 'El nombre debe tener máximo 100 caracteres'
    return ''
}

export default ValidatorMenuName