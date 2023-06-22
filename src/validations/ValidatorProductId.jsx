import Validator from "./Validator";

const ValidatorProductId = (id, products) => {
    const validatorProduct = Validator(id)

    if(validatorProduct.isEmpty()) return 'Producto requerido'
    let foundProduct = products.find(product => product.id === id)
    if(!foundProduct) return 'El producto ya no existe'
}

export default ValidatorProductId