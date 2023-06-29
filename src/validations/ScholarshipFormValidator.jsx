import Validator from "./Validator"

const ScholarshipFormValidator = (value) => {
    return {
        nameValidator(){
            const nameValidator = Validator(value)
            
            if(nameValidator.isEmpty()) return <>Nombre requerido</>
            if(!nameValidator.isCorrectMaxLength(100)) return <>El nombre debe menos de 100 caracteres</>
            return null
        },
        lastNameValidator(){
            const lastNameValidator = Validator(value)

            if(lastNameValidator.isEmpty()) return <>Apellido requerido</>
            if(!lastNameValidator.isCorrectMaxLength(100)) return <>El apellido debe tener menos de 100 caracteres</>
            return null
        },
        careerValidator(){
            const careerValidator = Validator(value)

            if(careerValidator.isEmpty()) return <>Carrera requerida</>
            if(!careerValidator.isCorrectMaxLength(100)) return <>La carrera debe tener menos de 100 caracteres</>
            return null
        },
        startDateValidator(end_date){
            const dateValidator = Validator(value)

            if(dateValidator.isEmpty()) return <>Fecha de inicio requerida</>
            if(!dateValidator.isCorrectMinDateRange(end_date)) return <>La fecha de inicio debe ser menor a la fecha de fin</>
            return null
        },
        endDateValidator(start_date){
            const dateValidator = Validator(value)

            if(dateValidator.isEmpty()) return <>Fecha de fin requerida</>
            if(!dateValidator.isCorrectMaxDateRange(start_date)) return <>La fecha de fin debe ser mayor a la fecha de inicio</>
            return null
        }
    }
}

export default ScholarshipFormValidator