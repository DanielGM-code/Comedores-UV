import Validator from "./Validator"
import ValidatorScholarshipId from "./ValidatorScholarshipId"

const ValidatorScholarship = (isScholarship, id, scholarships) => {
    const validatorScholarship = Validator(id)
    
    if(isScholarship && validatorScholarship.isEmpty()) return 'Becado requerido'
    return ValidatorScholarshipId(id, scholarships)
}

export default ValidatorScholarship