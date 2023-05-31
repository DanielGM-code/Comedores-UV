import Validator from "./Validator"

const ValidatorRfc = (rfc) => {
    const validatorRfc = Validator(rfc)

    if(validatorRfc.isEmpty()) return 'RFC requerido'
    if(rfc.length !== 12) return 'El RFC debe ser de 12 dígitos'
    if(!validatorRfc.isCorrectRfcName()) return 'El RFC debe contener 3 letras mayúsculas iniciales'
    if(!validatorRfc.isCorrectRfcDate()) return 'El RFC debe tener una fecha válida. Consulte "Ayuda" para más información'
    if(!validatorRfc.isCorrectRfcHomoclaveFirstLetter()) return 'El primer carácter de la homoclave debe ser una letra o un dígito. Consulte "Ayuda" para más información'
    if(!validatorRfc.isCorrectRfcHomoclaveSecondLetter()) return 'El segundo carácter de la homoclave debe ser una letra o un dígito. Consulte "Ayuda" para más información'
    if(!validatorRfc.isCorrectRfcValidatorDigit()) return 'El dígito verificador debe ser la letra A o un dígito. Consulte "Ayuda" para más información'
    return ''
}

export default ValidatorRfc