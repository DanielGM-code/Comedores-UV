import Validator from "./Validator"

const ProviderFormValidator = (value) => {
    return {
        nameValidator(){
            const nameValidator = Validator(value)
            
            if(nameValidator.isEmpty()) return <>Nombre requerido</>
            if(!nameValidator.isCorrectMaxLength(100)) return <>El nombre debe menos de 100 caracteres</>
            return null
        },
        addressValidator(){
            let addressValidator = Validator(value)

            if(addressValidator.isEmpty()) return <>Dirección requerida</>
            if(!addressValidator.isCorrectMaxLength(100)) return <>La dirección debe tener menos de 100 caracteres</>
            return null
        },
        phoneValidator(){
            const phoneValidator = Validator(value)

            if(phoneValidator.isEmpty()) return <>Teléfono requerido</>
            if(!phoneValidator.isCorrectPhoneDigits()) return <>El teléfono debe contener 10 dígitos</>
            if(!phoneValidator.isCorrectPhoneFormat()) return <>El teléfono debe tener un formato válido</>
            return null
        },
        rfcValidator(){
            const rfcValidator = Validator(value)

            if(rfcValidator.isEmpty()) return <>RFC requerido</>
            if(!rfcValidator.isOmitted()) {
                if(value.length !== 12) return <>El RFC debe ser de 12 dígitos</>
                if(!rfcValidator.isCorrectRfcName()) return <>El RFC debe contener 3 letras mayúsculas iniciales</>
                if(!rfcValidator.isCorrectRfcDate()) return <>El RFC debe tener una fecha válida. Consulte <a href="/help" class="alert-link">Ayuda</a> para más información</>
                if(!rfcValidator.isCorrectRfcHomoclaveFirstLetter()) return <>El primer carácter de la homoclave debe ser una letra o un dígito. Consulte <a href="/help" class="alert-link">Ayuda</a> para más información</>
                if(!rfcValidator.isCorrectRfcHomoclaveSecondLetter()) return <>El segundo carácter de la homoclave debe ser una letra o un dígito. Consulte <a href="/help" class="alert-link">Ayuda</a> para más información</>
                if(!rfcValidator.isCorrectRfcValidatorDigit()) return <>El dígito verificador debe ser la letra A o un dígito. Consulte <a href="/help" class="alert-link">Ayuda</a> para más información</>
            }
            return null
        }
    }
}

export default ProviderFormValidator