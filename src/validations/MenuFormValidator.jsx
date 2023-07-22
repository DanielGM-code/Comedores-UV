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

                if(scholarshipValidator.isEmpty()) return <>Becario requerido</>
                let foundScholarship = scholarships.find(scholarship => scholarship.id === value)
                if(!foundScholarship) return <>El becario seleccionado ya no existe</>
            }
            return null
        },
        orderValidator(){
            if(value.length === 0) return <>Aún no ha agregado ningún producto a la orden</>
            return null
        },
        paymentValidator(totalPrice){
            const paymentValidator = Validator(value)
            
            if(isNaN(value) || value === "") return <>Pago requerido</>
            if(paymentValidator.isOutOfDecimalRange()) return <>El pago debe tener 2 decimales</>
            if(!paymentValidator.isCorrectMinQuantityRange(0)) return <>El pago no debe ser menor a cero</>
            if(value < totalPrice) return <>El pago no cubre el precio total</>
            return null
        }
    }
}

export default MenuFormValidator