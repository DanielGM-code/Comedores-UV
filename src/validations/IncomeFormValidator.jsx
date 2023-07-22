import Validator from "./Validator"

const IncomeFormValidator = (value) => {
    return {
        scholarshipIdValidator(isScholarship, scholarships){
            if(isScholarship){
                const scholarshipValidator = Validator(value)

                if(scholarshipValidator.isEmpty()) return <>Becario requerido</>
                let foundScholarship = scholarships.find(scholarship => scholarship.id === value)
                if(!foundScholarship) return <>El becario seleccionado ya no existe</>
            }
            return null
        },
        dateValidator(){
            const dateValidator = Validator(value)

            if(dateValidator.isEmpty()) return <>Fecha requerida</>
            return null
        },
        orderValidator(){
            if(value.length === 0) return <>Aún no ha agregado ningún producto a la orden</>
            return null
        },
        noteValidator(){
            const noteValidator = Validator(value)

            if(noteValidator.isEmpty()) return <>Nota requerida</>
            if(!noteValidator.isCorrectMaxLength(200)) return <>La nota debe tener menos de 200 caracteres</>
            return null
        }
    }
}

export default IncomeFormValidator