import Validator from "./Validator"

const ValidatorStock = (stock) => {
    const validatorStock = Validator(stock)

    if(validatorStock.isEmpty()) return 'Stock requerido'
    if(validatorStock.isOutOfMinQuantityRange(0)) return 'El stock no debe ser menor a cero'
    if(validatorStock.isOutOfMaxQuantityRange(999)) return 'El stock debe ser menor a 1000'
    return ''
}

export default ValidatorStock