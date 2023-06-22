import Validator from "./Validator"

const ValidatorAddress = (address) => {
    let validatorAddress = Validator(address)

    if(validatorAddress.isEmpty()) return 'Dirección requerida'
    if(!validatorAddress.isCorrectMaxLength(100)) return 'La dirección debe tener menos de 100 caracteres'
    return ''
}

export default ValidatorAddress