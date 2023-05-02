import Validator from "./Validator"

const ValidatorPhone = (phone) => {
    const validatorPhone = Validator(phone)

    if(validatorPhone.isEmpty()) return 'Teléfono requerido'
    if(!validatorPhone.isCorrectPhoneDigits()) return 'El teléfono debe contener 10 dígitos'
    if(!validatorPhone.isCorrectPhoneFormat()) return 'El teléfono debe tener un formato válido'
    return ''
}

export default ValidatorPhone