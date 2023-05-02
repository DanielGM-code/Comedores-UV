import Validator from "./Validator"

const ValidatorScholarshipId = (id, scholarships) => {
    const validatorScholarship = Validator(id)

    if(!validatorScholarship.isEmpty()){
        let foundScholarship = scholarships.find(scholarship => scholarship.id === id)
        if(!foundScholarship) return 'El becado seleccionado ya no existe'
    }
    return ''
}

export default ValidatorScholarshipId