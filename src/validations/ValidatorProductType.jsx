import Validator from "./Validator"

const ValidatorProductType = (type) => {
    const validatorType = Validator(type)

    if(!validatorType.isCorrectMaxLength(100)) return 'El tipo debe tener menos de 100 caracteres'
    return ''
}

export default ValidatorProductType