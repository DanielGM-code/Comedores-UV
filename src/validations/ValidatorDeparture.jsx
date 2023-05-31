import Validator from "./Validator"

const ValidatorDeparture = (departure) => {
    const validatorDeparture = Validator(departure)

    if(validatorDeparture.isEmpty()) return 'Partida requerida'
    if(!validatorDeparture.isCorrectLength(0, 256)) return 'La partida debe tener entre máximo 255 caracteres'
    return ''
}

export default ValidatorDeparture