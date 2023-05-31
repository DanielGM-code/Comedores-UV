import Validator from "./Validator"

const ValidatorProductType = (type) => {
    const validatorType = Validator(type)

    if(!validatorType.isCorrectLength(0, 100)) return 'El tipo debe tener máximo 100 caracteres'
    return ''
}

export default ValidatorProductType