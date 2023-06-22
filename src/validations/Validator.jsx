const rfcNameRegex = /[A-ZÑ&]{3}/
const rfcDateRegex =  /^([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\d])|[3][01])|([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\d])|[3][0])|([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\d])|([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])$/m
const rfcHomoclaveFirstLetterRegex = /^\w{9}[A-V1-9]\w{2}$/
const rfcHomoclaveSecondLetterRegex =/\w{10}[A-Z1-9]\w/
const rfcValidatorDigitRegex = /\w{11}[\dA]/
const emailRegex = /^([a-zA-Z0-9.!#$%&*+/=?^_~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)$/
const phoneRegex = /^([0-9]{2,3})([\s.-]?)([0-9]{3,4})([\s.-]?)([0-9]{4})$/
const numbersRegex = /^(.+?[0-9])|([0-9].+?)$/
const passwordLowerCaseRegex = /^(.+?[a-z])|([a-z].+?)$/
const passwordUpperCaseRegex = /^(.+?[A-Z])|([A-Z].+?)$/
const passwordWhitespaceRegex = /^(.+?[\s])|([\s].+?)$/
const decimalRegex = /^\d+\.\d{3,}?$/
const skipRegex = /^[?]+$/

const Validator = function(value) {

    return {
        isCorrectMaxDateRange(date){
            if(value <= date) return true
            return false
        },
        isCorrectMinDateRange(date){
            if(value >= date) return true
            return false
        },
        isCorrectMaxLength(maxLength){
            if(value.length < maxLength) return true
            return false
        },
        isCorrectMinLength(minLength){
            if(value.length < minLength) return true
            return false
        },
        isCorrectMaxQuantityRange(maxValue){
            const valueInteger = value * 100

            if(valueInteger <= maxValue) return true
            return false
        },
        isCorrectMinQuantityRange(minValue){
            const valueInteger = value * 100

            if(valueInteger >= minValue) return true
            return false
        },
        isCorrectPhoneDigits(){
            const phoneLength = value.replace(/[\s.-]?/g, '').length

            if(phoneLength === 10) return true
            return false
        },
        isCorrectPhoneFormat(){
            if(phoneRegex.test(value)) return true
            return false
        },
        isCorrectRfcName(){
            if(rfcNameRegex.test(value)) return true
            return false
        },
        isCorrectRfcDate(){
            if(rfcDateRegex.test(value)) return true
            return false
        },
        isCorrectRfcHomoclaveFirstLetter(){
            if(rfcHomoclaveFirstLetterRegex.test(value)) return true
            return false
        },
        isCorrectRfcHomoclaveSecondLetter(){
            if(rfcHomoclaveSecondLetterRegex.test(value)) return true
            return false
        },
        isCorrectRfcValidatorDigit(){
            if(rfcValidatorDigitRegex.test(value)) return true
            return false
        },
        isCorrectStockRange(minValue, maxValue){
            if(value >= minValue || value <= maxValue) return true
            return false
        },
        isEmail(){
            if(emailRegex.test(value)) return true
            return false
        },
        isEmpty(){
            if(!value) return true
            return false
        },
        isPasswordWithLowerCase(){
            if(passwordLowerCaseRegex.test(value)) return true
            return false
        },
        isPasswordWithUpperCase(){
            if(passwordUpperCaseRegex.test(value)) return true
            return false
        },
        isPasswordWithWhitespace(){
            if(passwordWhitespaceRegex.test(value)) return true
            return false
        },
        isOmitted(){
            if(skipRegex.test(value)) return true
            return false
        },
        isOutOfDecimalRange(){
            if(decimalRegex.test(value)) return true
            return false
        },
        isWithNumbers(){
            if(numbersRegex.test(value)) return true
            return false
        }
    }
}

export default Validator