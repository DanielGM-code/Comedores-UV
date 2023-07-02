import Validator from "./Validator"

const ValidatorScholarship = (isScholarship, id, scholarships) => {
    const validatorScholarship = Validator(id)
    
    if(isScholarship && validatorScholarship.isEmpty()) return 'Becado requerido'
    //if(validatorScholarship.isScholarship())
    return null
}

export default ValidatorScholarship