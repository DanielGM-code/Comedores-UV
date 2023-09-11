import Validator from "./Validator"

const ExpenseFormValidator = (value) => {
    return {
        providerIdValidator(providers){
            const providerValidator = Validator(value)

            if(providerValidator.isEmpty()) return <>Proveedor requerido</>
            let foundProvider = providers.find(provider => provider.id === value)
            if(!foundProvider) return <>El proveedor ya no existe</>
            return null
        },
        typeValidator(){
            const typeValidator = Validator(value)

            if(typeValidator.isEmpty()) return <>Tipo de egreso requerido</>
            return null
        },
        descriptionValidator(){
            const descriptionValidator = Validator(value)

            if(descriptionValidator.isEmpty()) return <>Descripción requerida</>
            if(!descriptionValidator.isCorrectMaxLength(250)) return <>La descripción debe tener máximo 250 caracteres</>
            return null
        },
        billValidator(type){
            const billValidator = Validator(value)

            if(type === 'Con factura'){
                if(billValidator.isEmpty()) return <>Factura requerida</>
                if(!billValidator.isCorrectMaxLength(200)) return <>La factura debe tener menos de 200 caracteres</>
            }
            return null
        },
        dateValidator(){
            const dateValidator = Validator(value)

            if(dateValidator.isEmpty()) return <>Fecha requerida</>
            return null
        },
        departureValidator(){
            const validatorDeparture = Validator(value)

            if(validatorDeparture.isEmpty()) return <>Partida requerida</>
            if(!validatorDeparture.isCorrectMaxLength(200)) return <>La partida debe tener menos de 200 caracteres</>
            return null
        },
        orderValidator(){
            if(value.length === 0) return <>Aún no ha agregado ningún producto a los detalles</>
            return null
        }
    }
}

export default ExpenseFormValidator