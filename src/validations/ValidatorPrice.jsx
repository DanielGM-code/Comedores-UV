import Validator from "./Validator"

const ValidatorPrice = (price) => {
    const validatorPrice = Validator(price)

    if(validatorPrice.isEmpty()) return 'Precio requerido'
    if(!validatorPrice.isCorrectMinQuantityRange(0)) return 'El precio no debe ser menor a cero'
    if(!validatorPrice.isCorrectMaxQuantityRange(9999999999)) return 'El precio debe ser menor a 100,000,000.00'
    return ''
}

export default ValidatorPrice