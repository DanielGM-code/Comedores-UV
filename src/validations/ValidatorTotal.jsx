import Validator from "./Validator"

const ValidatorTotal = (total) => {
    const validatorTotal = Validator(total)

    if(validatorTotal.isEmpty()) return 'Total requerido'
    if(validatorTotal.isOutOfMinQuantityRange(0)) return 'El total no debe ser menor a cero'
    if(validatorTotal.isOutOfDecimalRange()) return 'El total debe tener máximo 2 decimales'
    if(validatorTotal.isOutOfMaxQuantityRange(99999999)) return 'El total debe ser menor a 1,000,000.00'
    return ''
}

export default ValidatorTotal