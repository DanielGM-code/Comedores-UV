import Validator from "./Validator"

const ValidatorDescription = (description) => {
    const validatorDescription = Validator(description)

    if(!validatorDescription.isCorrectMaxLength(60000)) return 'La descripción debe tener menos de 60,000 cracateres'
    return ''
}

export default ValidatorDescription