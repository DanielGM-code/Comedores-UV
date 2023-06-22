import Validator from "./Validator"

const ValidatorEmail = (isUpdate, email, users) => {
    const validatorEmail = Validator(email)

    if(validatorEmail.isEmpty()) return 'Correo requerido'
    if(!validatorEmail.isCorrectMaxLength(100)) return 'El correo debe tener menos de 100 caracteres'
    if(!validatorEmail.isEmail()) return 'El correo debe cumplir al menos con el formato ejemplo@ejemplo.com. Consulte Ayuda para más información'
    if(isUpdate){
        let filteredList = users.filter(user => user.email === email)
        if(filteredList.length > 1) return 'El correo no debe repetirse'
    }else{
        let foundUser = users.find(user => user.email === email)
        if(foundUser !== undefined) return 'El correo no debe repetirse'
    }
    return ''
}

export default ValidatorEmail