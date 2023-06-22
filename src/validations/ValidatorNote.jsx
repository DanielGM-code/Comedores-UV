import Validator from "./Validator"

const ValidatorNote = (note) => {
    const validatorNote = Validator(note)

    if(validatorNote.isEmpty()) return 'Nota requerida'
    if(!validatorNote.isCorrectMaxLength(200)) return 'La nota debe tener menos de 200 caracteres'
    return ''
}

export default ValidatorNote