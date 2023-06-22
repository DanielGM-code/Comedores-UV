import Validator from "./Validator"

const ValidatorDeparture = (departure) => {
    const validatorDeparture = Validator(departure)

    if(validatorDeparture.isEmpty()) return 'Partida requerida'
    if(!validatorDeparture.isCorrectMaxLength(200)) return 'La partida debe tener menos de 200 caracteres'
    return ''
}

export default ValidatorDeparture