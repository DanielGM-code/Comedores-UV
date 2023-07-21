import Validator from "./Validator"

const ProductFormValidator = (value) => {
    return {
        nameValidator(){
            const nameValidator = Validator(value)
            
            if(nameValidator.isEmpty()) return <>Nombre requerido</>
            if(!nameValidator.isCorrectMaxLength(100)) return <>El nombre debe menos de 100 caracteres</>
            return null
        },
        descriptionValidator(){
            const descriptionValidator = Validator(value)

            if(!descriptionValidator.isCorrectMaxLength(60000)) return <>La descripción debe tener menos de 60,000 cracateres</>
            return null
        },
        priceValidator(){
            const priceValidator = Validator(value)

            if(isNaN(value) || value === "") return <>Precio requerido</>
            if(priceValidator.isOutOfDecimalRange()) return <>El precio debe tener 2 decimales</>
            if(!priceValidator.isCorrectMinQuantityRange(0)) return <>El precio no debe ser menor a cero</>
            if(!priceValidator.isCorrectMaxQuantityRange(10000000000)) return <>El precio debe ser menor a 100,000,000.00</>
            return null
        },
        stockValidator(){
            const stockValidator = Validator(value)

            if(stockValidator.isEmpty()) return <>Stock requerido</>
            if(!stockValidator.isCorrectStockRange(0, 1000)) return <>El stock debe estar entre cero y 1,000</>
            return null
        },
        productTypeValidator(){
            const typeValidator = Validator(value)

            if(!typeValidator.isCorrectMaxLength(100)) return <>El tipo debe tener menos de 100 caracteres</>
            return null
        }
    }
}

export default ProductFormValidator