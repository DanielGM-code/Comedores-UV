import Validator from "./Validator"

const ValidatorEndDate = (end_date, start_date) => {
    const validatorDate = Validator(end_date)

    if(validatorDate.isEmpty()) return 'Fecha de fin requerida'
    if(!validatorDate.isCorrectMaxDateRange(start_date)) return 'La fecha de fin debe ser mayor a la fecha de inicio'
    return ''
}

export default ValidatorEndDate