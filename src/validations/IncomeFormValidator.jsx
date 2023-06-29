import Validator from "./Validator"

const IncomeFormValidator = (value) => {
    return {
        scholarshipIdValidator(scholarships){
            const scholarshipValidator = Validator(value)

            if(!scholarshipValidator.isEmpty()){
                let foundScholarship = scholarships.find(scholarship => scholarship.id === value)
                if(!foundScholarship) return <>El becado seleccionado ya no existe</>
            }
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