import Validator from "./Validator"

const ValidatorEmail = (email, users) => {
    const validatorEmail = Validator(email)

    if(validatorEmail.isEmpty()) return 'Correo requerido'
    if(!validatorEmail.isCorrectLength(9, 31)) return 'El correo debe estar tener máximo 30 caracteres'
    if(!validatorEmail.isEmail()) return 'El correo debe tener el formato e-jem_pl.o@correo.com'
    let foundUser = users.find(user => user.email === email)
    if(foundUser !== undefined) return 'El correo no debe repetirse'
    return ''
}

export default ValidatorEmail