const TextAreaField = ({ 
    name, 
    placeholder, 
    value, 
    onChange, 
    onBlur 
}) => {
    return(
        <textarea
            name={name}
            cols="30"
            rows="5"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        ></textarea>
    )
}

export default TextAreaField