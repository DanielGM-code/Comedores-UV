import Validator from "./Validator"

const ValidatorAddress = (address) => {
    let validatorAddress = Validator(address)

    if(validatorAddress.isEmpty()) return 'Dirección requerida'
    if(!validatorAddress.isCorrectLength(4, 101)) return 'La dirección debe tener máximo 100 caracteres'
    return ''
}

export default ValidatorAddress