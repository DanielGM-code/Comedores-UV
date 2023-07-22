import React from 'react'

const SearchField = ({ 
	placeholder, 
	value, 
	onChange, 
	onBlur,
    onSearch,
    onReset
}) => {

	return (
		<div className='input-group mb-3'>
			<span 
				className='input-group-text' 
				id='basic-addon1'
			>
				<i className='fa-solid fa-magnifying-glass'></i>
			</span>

			<input 
				name='search' 
				type='text'
				className='form-control' 
				placeholder={placeholder} 
				aria-describedby="basic-addon1" 
				onChange={onChange} 
				value={value} 
				onBlur={onBlur} 
			/>

            <div className='input-group-append'>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={onSearch}
                >
                    Buscar
                </button>

                <button
                    type='button'
                    className='btn btn-danger'
                    onClick={onReset}
                >
                    Reiniciar
                </button>
            </div>
		</div>
	)
}

export default SearchField