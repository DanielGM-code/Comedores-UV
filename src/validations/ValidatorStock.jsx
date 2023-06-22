import Validator from "./Validator"

const ValidatorStock = (stock) => {
    const validatorStock = Validator(stock)

    if(validatorStock.isEmpty()) return 'Stock requerido'
    if(!validatorStock.isCorrectStockRange(1, 1000)) return 'El stock debe estar entre cero y 1,000'
    return ''
}

export default ValidatorStock