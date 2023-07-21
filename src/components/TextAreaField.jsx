const TextAreaField = ({ 
    name, 
    placeholder, 
    value, 
    onChange, 
    onBlur 
}) => {
    return(
        <div className="input-group mb-3">
            <span 
				className='input-group-text' 
				id='basic-addon1'
			>
				<i className='fa-solid fa-comment-dots'></i>
			</span>
            <textarea
                name={name}
                className="form-control"
                rows="5"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            ></textarea>
        </div>
    )
}

export default TextAreaField