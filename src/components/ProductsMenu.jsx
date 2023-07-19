const ProductsMenu = ({ 
    title, 
    total, 
    filteredProducts, 
    order, 
    isLoading, 
    setOrder, 
    children 
}) => {

    function addToOrder(product) {
		if(product.stock < 1) return

		let found = order.find(
            orderItem => orderItem.product.id === product.id
        )

		if (!found) {
			setOrder(prevOrder => {
				return [
					...prevOrder,
					{
						product: product,
						amount: 1
					}
				]
			})

			return
		}

		let rest = product.stock - found.amount

		if(rest < 1) return

		setOrder(prevOrder => {
			let newOrder = prevOrder.filter(
                orderItem => orderItem !== found
            )

			newOrder.push({
				...found,
				amount: found.amount + 1
			})

			return newOrder
		})
	}

    function countProduct(product) {
		let found = order.find(
            orderItem => orderItem.product.id === product.id
        )

		if (!found) return 0

		return found.amount
	}

    function removeFromOrder(product) {
		let found = order.find(
            orderItem => orderItem.product.id === product.id
        )

		if (!found) return

		setOrder(prevOrder => {
			let newOrder = prevOrder.filter(
                orderItem => orderItem !== found
            )

			if (found.amount > 1) {
				newOrder.push({
					...found,
					amount: found.amount - 1
				})
			}

			return newOrder
		})
	}

    return (
        <div className='main-container'>
            <div className='products-container'>
                {isLoading ? 'Cargando...' :
                    filteredProducts.map(product => {
                        return (
                            <div 
                                key={product.id} 
                                className='menu-item'
                            >
                                <img 
                                    className='menu-item-image' 
                                    src="/resources/comida-generico.jpg" 
                                    alt="empanadas" 
                                />

                                <div className='menu-item-content'>
                                    <p className='menu-item-nombre'>
                                        {product.name}
                                    </p>

                                    <p className='menu-item-precio'>
                                        ${product.sale_price}
                                    </p>

                                    <p className='menu-item-stock'>
                                        Existencia: {product.stock}
                                    </p>
                                </div>

                                <div className='stepper-container'>
                                    <i
                                        className='fa-solid fa-minus stepper-button'
                                        onClick={() => {
                                            removeFromOrder(product)
                                        }}
                                    ></i>

                                    <div className='stepper-count'>
                                        {countProduct(product)}
                                    </div>

                                    <i
                                        className='fa-solid fa-plus stepper-button'
                                        onClick={() => {
                                            addToOrder(product)
                                        }}
                                    ></i>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className='order-card'>
                <h4>{title}</h4>

                <div className='table-productos'>
                    {order.length > 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <td>Cantidad</td>

                                    <td>Descripción</td>

                                    <td>Subtotal</td>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {order.map(orderItem => {
                                    return (
                                        <tr key={orderItem.product.id}>
                                            <td>{orderItem.amount}</td>

                                            <td>{orderItem.product.name}</td>
                                            
                                            <td>${(orderItem.product.sale_price * orderItem.amount).priceFormat()}</td>
                                        </tr>
                                    )
                                })}

                                <tr>
                                    <td className='blank-td'></td>

                                    <td className='blank-td'>Total</td>

                                    <td className='blank-td'>
                                        ${total ? total.priceFormat() : 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        :
                        'Aún no ha agregado ningún producto a la orden'
                    }
                </div>

                {children}
            </div>
        </div>
    )
}

export default ProductsMenu