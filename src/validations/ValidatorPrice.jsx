import Validator from "./Validator"

const ValidatorPrice = (price) => {
    const validatorPrice = Validator(price)

    if(validatorPrice.isEmpty()) return 'Precio requerido'
    if(validatorPrice.isOutOfMinQuantityRange(0)) return 'El precio no debe ser menor a cero'
    if(validatorPrice.isOutOfDecimalRange()) return 'El precio debe tener máximo 2 decimales'
    if(validatorPrice.isOutOfMaxQuantityRange(9999999999)) return 'El precio debe ser menor a 100,000,000.00'
    return ''
}

export default ValidatorPrice