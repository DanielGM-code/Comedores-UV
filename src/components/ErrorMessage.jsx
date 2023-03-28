import React from 'react'

const ErrorMessage = ({validation}) => {

    return (
        <div className='text-danger'>
            {validation.length > 0 && validation.map((msg, index) => <div key={index}>{msg}</div>)}
        </div>
    )
}

export default ErrorMessage