const TabMenu = ({
    selectedCategory,
    setSelectedCategory
}) => {

    function onTabElementClicked(event) {
		setSelectedCategory(event.target.innerHTML)
	}

    return (
        <div className='tab-bar'>
            <h3 
                className={`tab-element ${
                    selectedCategory === 'Alimentos' && 'active'
                }`} 
                onClick={onTabElementClicked} 
            >
                Alimentos
            </h3>

            <h3>|</h3>

            <h3 
                className={`tab-element ${
                    selectedCategory === 'Dulcería' && 'active'
                }`} 
                onClick={onTabElementClicked} 
            >
                Dulcería
            </h3>

            <h3>|</h3>

            <h3 
                className={`tab-element ${
                    selectedCategory === 'Bebidas' && 'active'
                }`} 
                onClick={onTabElementClicked} 
            >
                Bebidas
            </h3>
        </div>
    )
}

export default TabMenu