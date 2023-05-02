import Validator from "./Validator";

const ValidatorProductId = (id, products) => {
    const validatorProduct = Validator(id)

    if(validatorProduct.isEmpty()) return 'Producto no seleccionado'
    let foundProduct = products.find(product => product.id === id)
    if(!foundProduct) return `Ya no existe el producto con id = ${id}`
}

export default ValidatorProductId