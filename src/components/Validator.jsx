class Validator {
    constructor(value){
        this.value = value
        this.result = []
    }

    isNotEmpty(msg){
        if(!this.value){
            this.result.push(msg)
        }

        return this
    }

    isLength(minLength, maxLength, msg){
        if(this.value.length < minLength || this.value.length > maxLength){
            this.result.push(msg)
        }

        return this
    }

    isEmail(msg){
        if(!/.+@.+\.[A-Za-z]+$/.test(this.value)){
            this.result.push(msg)
        }

        return this
    }

    isNegativeBalance(msg){
        if(this.value < 0){
            this.result.push(msg)
        }

        return this
    }

    isMinValueDate(msg, date){
        if(this.value > date){
            this.result.push(msg)
        }

        return this
    }

    isMaxValueDate(msg, min){
        if(this.value < min){
            this.result.push(msg)
        }

        return this
    }
}

export default Validator