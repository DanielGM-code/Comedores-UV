import Validator from "./Validator"

const ValidatorIncomeId = (id, incomes) => {
    const validatorIncome = Validator(id)

    if(validatorIncome.isEmpty()) return 'Ingreso requerido'
    let foundIncome = incomes.find(income => income.id === id)
    if(!foundIncome) return `El ingreso ya no existe`
}

export default ValidatorIncomeId