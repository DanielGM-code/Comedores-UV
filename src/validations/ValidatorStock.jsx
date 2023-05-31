import Validator from "./Validator"

const ValidatorStock = (stock) => {
    const validatorStock = Validator(stock)

    if(validatorStock.isEmpty()) return 'Stock requerido'
    if(validatorStock.isOutOfStockRange(0, 999)) return 'El stock debe estar entre cero y 999'
    return ''
}

export default ValidatorStock