import Validator from "./Validator"

const ValidatorStartDate = (start_date, end_date) => {
    const validatorDate = Validator(start_date)

    if(validatorDate.isEmpty()) return 'Fecha de inicio requerida'
    if(validatorDate.isOutOfMaxDateRange(end_date)) return 'La fecha de inicio debe ser menor a la fecha de fin'
    return ''
}

export default ValidatorStartDate