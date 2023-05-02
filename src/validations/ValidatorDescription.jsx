import Validator from "./Validator"

const ValidatorDescription = (description) => {
    const validatorDescription = Validator(description)

    if(!validatorDescription.isCorrectLength(-1, 60000)) return 'La descripción debe contener entre 1 y 60,000 cracateres'
    return ''
}

export default ValidatorDescription