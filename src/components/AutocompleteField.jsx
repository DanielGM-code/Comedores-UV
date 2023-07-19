import Select from "react-select"

const AutocompleteInput = ({ 
    name, 
    iconClasses, 
    options, 
    selectedOption, 
    placeholder, 
    onChange, 
    searchable, 
    clearable 
}) => {

    return (
        <>
            <div className='input-group mb-3'>
                <span 
                    className='input-group-text' 
                    id='basic-addon1'
                >
                    <i className={iconClasses}></i>
                </span>
                
                <Select
                    id={name}
                    name={name}
                    aria-labelledby='basic-addon1'
                    placeholder={placeholder}
                    options={options}
                    defaultValue={selectedOption}
                    onChange={onChange}
                    getOptionValue={(option) => `${option['id']}`}
                    isSearchable={searchable}
                    isClearable={clearable}
                />
            </div>
        </>
    )
}

export default AutocompleteInput