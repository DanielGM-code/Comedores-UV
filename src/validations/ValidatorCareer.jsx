import Validator from "./Validator"

const ValidatorCareer = (career) => {
    const validatorCareer = Validator(career)

    if(validatorCareer.isEmpty()) return 'Carrera requerida'
    if(!validatorCareer.isCorrectMaxLength(100)) return 'La carrera debe tener menos de 100 caracteres'
    return ''
}

export default ValidatorCareer