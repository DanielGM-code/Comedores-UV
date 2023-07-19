import React from 'react'

const FormField = ({ 
	name, 
	inputType, 
	iconClasses, 
	placeholder, 
	value, 
	onChange, 
	onBlur 
}) => {

	return (
		<div className='input-group mb-3'>
			<span 
				className='input-group-text' 
				id='basic-addon1'
			>
				<i className={iconClasses}></i>
			</span>

			<input 
				name={name} 
				type={inputType} 
				className='form-control' 
				placeholder={placeholder} 
				aria-describedby="basic-addon1" 
				onChange={onChange} 
				value={value} 
				onBlur={onBlur} 
			/>
		</div>
	)
}

export default FormField