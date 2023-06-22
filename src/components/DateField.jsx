import React from 'react'

const DateField = ({ name, inputType, iconClasses, placeholder, value, onChange, min, max, label, onBlur }) => {

	return (
		<>
			<label htmlFor={name}>
				{label}
			</label>
			<div className='input-group mb-3'>
				<span className='input-group-text' id='basic-addon2'>
					<i className={iconClasses}></i>
				</span>
				<input id={name} name={name} type={inputType} min={min} max={max}  pattern='\d{4}-\d{2}-\d{2}' className='form-control' placeholder={placeholder} aria-describedby="basic-addon2" onChange={onChange} value={value} onBlur={onBlur} />
			</div>
		</>
	)
}

export default DateField