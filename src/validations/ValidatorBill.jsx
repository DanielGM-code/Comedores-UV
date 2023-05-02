import Validator from "./Validator"

const ValidatorBill = (factura) => {
    const validatorBill = Validator(factura)

    if(validatorBill.isEmpty()) return 'Factura requerida'
    if(!validatorBill.isCorrectLength(0, 256)) return 'La factura debe tener entre 1 y 255 caracteres'
    return ''
}

export default ValidatorBill