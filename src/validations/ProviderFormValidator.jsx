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
            if(!phoneValidator.isCorrectPhoneFormat()) return <>El teléfono debe tener un formato válido. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
            return null
        },
        rfcValidator(){
            const rfcValidator = Validator(value)

            if(!rfcValidator.isEmpty()){
                if(value.length < 12 || value.length > 13) return <>El RFC debe ser de 12 o 13 dígitos. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                if(value.length === 12){
                    if(!rfcValidator.isCorrectRfcMoralName(value.length)) return <>El RFC debe contener 3 letras mayúsculas iniciales. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcDate()) return <>El RFC debe tener una fecha válida. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcMoralHomoclaveFirstLetter(value.length)) return <>El primer carácter de la homoclave debe ser una letra o un dígito. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcMoralHomoclaveSecondLetter(value.length)) return <>El segundo carácter de la homoclave debe ser una letra o un dígito. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcMoralValidatorDigit(value.length)) return <>El dígito verificador debe ser la letra A o un dígito. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                }else if(value.length === 13){
                    if(!rfcValidator.isCorrectRfcPhysicalName(value.length)) return <>El RFC debe contener 4 letras mayúsculas iniciales. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectWord()) return <>El RFC contiene una palabra inadecuada. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcDate()) return <>El RFC debe tener una fecha válida. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcPhysicalHomoclaveFirstLetter(value.length)) return <>El primer carácter de la homoclave debe ser una letra o un dígito. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcPhysicalHomoclaveSecondLetter(value.length)) return <>El segundo carácter de la homoclave debe ser una letra o un dígito. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                    if(!rfcValidator.isCorrectRfcPhysicalValidatorDigit(value.length)) return <>El dígito verificador debe ser la letra A o un dígito. Consulte <a href="/help" className="alert-link">Ayuda</a> para más información</>
                }
            }
            return null
        }
    }
}

export default ProviderFormValidator