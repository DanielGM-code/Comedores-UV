import Validator from "./Validator"

const MenuFormValidator = (value) => {
    return {
        nameValidator(isScholarship){
            if(!isScholarship){
                const nameValidator = Validator(value)

                if(nameValidator.isEmpty()) return <>Nombre requerido</>
                if(!nameValidator.isCorrectMaxLength(100)) return <>El nombre debe tener menos de 100 caracteres</>
            }
            return null
        },
        noteValidator(){
            const noteValidator = Validator(value)

            if(noteValidator.isEmpty()) return <>Nota requerida</>
            if(!noteValidator.isCorrectMaxLength(200)) return <>La nota debe tener menos de 200 caracteres</>
            return null
        },
        scholarshipIdValidator(isScholarship, scholarships){
            if(isScholarship){
                const scholarshipValidator = Validator(value)

                if(scholarshipValidator.isEmpty()) return <>Becado requerido</>
                let foundScholarship = scholarships.find(scholarship => scholarship.id === value)
                if(!foundScholarship) return <>El becado seleccionado ya no existe</>
            }
            return null
        },
        orderValidator(){
            if(value === 0) return <>Aún no ha agregado ningún producto a la orden</>
            return null
        }
    }
}

export default MenuFormValidator