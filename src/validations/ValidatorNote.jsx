import Validator from "./Validator"

const ValidatorNote = (note) => {
    const validatorNote = Validator(note)

    if(validatorNote.isEmpty()) return 'Nota requerido'
    if(!validatorNote.isCorrectLength(0, 201)) return 'La nota debe contener máximo 200 caracteres'
    return ''
}

export default ValidatorNote