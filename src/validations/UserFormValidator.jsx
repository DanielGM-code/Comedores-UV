import Validator from "./Validator"

const UserFormValidator = (value) => {
    return {
        nameValidator(){
            const nameValidator = Validator(value)
            
            if(nameValidator.isEmpty()) return <>Nombre requerido</>
            if(!nameValidator.isCorrectMaxLength(100)) return <>El nombre debe menos de 100 caracteres</>
            return null
        },
        emailValidator(users, isUpdate){
            const emailValidator = Validator(value)

            if(emailValidator.isEmpty()) return <>Correo requerido</>
            if(!emailValidator.isCorrectMaxLength(100)) return <>El correo debe tener menos de 100 caracteres</>
            if(!emailValidator.isEmail()) return <>El correo debe cumplir al menos con el formato ejemplo@ejemplo.com. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
            if(isUpdate){
                let filteredList = users.filter(user => user.email === value)
                if(filteredList.length > 1) return <>El correo no debe repetirse</>
            }else{
                let foundUser = users.find(user => user.email === value)
                if(foundUser !== undefined) return <>El correo no debe repetirse</>
            }
            return null
        },
        passwordValidator(){
            const passwordValidator = Validator(value)

            if(passwordValidator.isEmpty()) return <>Contraseña requerida</>
            if(passwordValidator.isPasswordWithWhitespace()) return <>La contraseña no debe tener espacios en blanco</>
            if(!passwordValidator.isCorrectMaxLength(16) || !passwordValidator.isCorrectMinLength(8)) return <>La contraseña debe contener entre 8 y 16 caracteres</>
            if(!passwordValidator.isPasswordWithLowerCase()) return <>La contraseña debe tener al menos una letra minúscula</>
            if(!passwordValidator.isWithNumbers()) return <>La contraseña debe tener al menos un número</>
            if(!passwordValidator.isPasswordWithUpperCase()) return <>La contraseña debe tener al menos una letra mayúscula</>
            return null
        }
    }
}

export default UserFormValidator