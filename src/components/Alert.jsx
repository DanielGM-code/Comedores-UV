import React from 'react'

const Alert = ({ 
    typeAlert, 
    validation 
}) => {

    return (
        <>
            {
                validation &&
                <div 
                    className={typeAlert} 
                    role='alert'
                >
                    {validation}
                </div>
            }
        </>
    )
}

export default Alert