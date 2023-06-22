import Validator from "./Validator"

const ValidatorPassword = (password) => {
    const validatorPassword = Validator(password)

    if(validatorPassword.isEmpty()) return 'Contraseña requerida'
    if(validatorPassword.isPasswordWithWhitespace()) return 'La contraseña no debe tener espacios en blanco'
    if(!validatorPassword.isCorrectMaxLength(16) || !validatorPassword.isCorrectMinLength(8)) return 'La contraseña debe contener entre 8 y 16 caracteres'
    if(!validatorPassword.isPasswordWithLowerCase()) return 'La contraseña debe tener al menos una letra minúscula'
    if(!validatorPassword.isWithNumbers()) return 'La contraseña debe tener al menos un número'
    if(!validatorPassword.isPasswordWithUpperCase()) return 'La contraseña debe tener al menos una letra mayúscula'
    return ''
}

export default ValidatorPassword