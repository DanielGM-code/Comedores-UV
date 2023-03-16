import React from 'react'

const ComboBox = ({name, options, iconClasses, value, onChange}) => {

    return (
        <div className='input-group mb-0'>
            <span className='input-group-text'>
                <i className={iconClasses}></i>
            </span>
            <select
                name={name}
                value={value}
                onChange={onChange}
            >
                {options.map((option, index)=> (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    )
}

export default ComboBox