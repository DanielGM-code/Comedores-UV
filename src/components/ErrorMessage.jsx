import React from 'react'

const ErrorMessage = ({validation}) => {

    return (
        <div className='text-danger'>
            {validation}
        </div>
    )
}

export default ErrorMessage