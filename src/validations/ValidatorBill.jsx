import Validator from "./Validator"

const ValidatorBill = (factura) => {
    const validatorBill = Validator(factura)

    if(validatorBill.isEmpty()) return 'Factura requerida'
    if(!validatorBill.isCorrectMaxLength(200)) return 'La factura debe tener menos de 200 caracteres'
    return ''
}

export default ValidatorBill