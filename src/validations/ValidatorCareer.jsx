import Validator from "./Validator"

const ValidatorCareer = (career) => {
    const validatorCareer = Validator(career)

    if(validatorCareer.isEmpty()) return 'Carrera requerida'
    if(validatorCareer.isCorrectLength(9, 101)) return 'La carrera debe contener máximo 100 caracteres'
    return ''
}

export default ValidatorCareer