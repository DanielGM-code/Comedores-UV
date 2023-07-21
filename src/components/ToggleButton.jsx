const ToggleButton = ({ title, isChecked, onChange }) => {
    return (
        <div className='ticket-toggle'>
            <label className="form-check-label" >{title}</label>
            
            <label className="switch">
                <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={onChange} 
                />

                <span className="slider round"></span>
            </label>
        </div>
    )
}

export default ToggleButton