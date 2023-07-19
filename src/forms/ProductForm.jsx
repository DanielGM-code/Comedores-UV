import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import TextAreaField from '../components/TextAreaField'
import { createProductMutation, CREATE_MUTATION_OPTIONS, updateProductMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Alert from '../components/Alert'
import '../utils/formatting'
import ProductFormValidator from '../validations/ProductFormValidator'

const ProductForm = ({ cancelAction, productUpdate }) => {
	document.body.style.overflow = 'hidden'
	
	const [product, setProduct] = useState(productUpdate ?? {
		name: '',
		description: '',
		purchase_price: '',
		sale_price: '',
		preferred_price: '',
		stock: '',
		product_type: ''
	})
	const [validations, setValidations] = useState({
		name: null,
		description: null,
		purchase_price: null,
		sale_price: null,
		preferred_price: null,
		stock: null,
		product_type: null
	})

	const queryClient = useQueryClient()
	
	const createMutation = useMutation(createProductMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('products')
		}
	})
	const updateMutation = useMutation(updateProductMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('products')
		}
	})

	const validateAll = () => {
		const { name, description, purchase_price, sale_price, preferred_price, stock, product_type } = product
		const validations = { name: null, description: null, purchase_price: null, sale_price: null, preferred_price: null, stock: null, product_type: null}

		validations.name = ProductFormValidator(name).nameValidator()
		validations.description = ProductFormValidator(description).descriptionValidator()
		validations.purchase_price = ProductFormValidator(purchase_price).priceValidator()
		validations.preferred_price = ProductFormValidator(preferred_price).priceValidator()
		validations.sale_price = ProductFormValidator(sale_price).priceValidator()
		validations.stock = ProductFormValidator(stock).stockValidator()
		validations.product_type = ProductFormValidator(product_type).productTypeValidator()

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
		)
		let isValid = !validationMessages.length

		if(!isValid) setValidations(validations)

		return isValid
	}

	const validateOne = (e) => {
		const { name } = e.target
		const value = product[name]
		let numberPrice = 0
		let message = null

		if(name === 'name') message = ProductFormValidator(value).nameValidator()
		if(name === 'description') message = ProductFormValidator(value).descriptionValidator()
		if(name === 'purchase_price' || name === 'sale_price' || 
			name === 'preferred_price'
		) {
			numberPrice = parseFloat(Number(value).priceFormat())
			product[name] = numberPrice
			message = ProductFormValidator(numberPrice).priceValidator()
		}
		if(name === 'stock') {
			numberPrice = parseFloat(Number(value).priceFormat())
			product[name] = numberPrice
			message = ProductFormValidator(value).stockValidator()
		}
		if(name === 'product_type') message = ProductFormValidator(value).productTypeValidator()

		setValidations({ ...validations, [name]: message })
	}

	function handleInputChange(event) {
		setProduct(prevProduct => {
			return {
				...prevProduct,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitProduct() {
		const isValid = validateAll();

		if(!isValid) return false

		if (product.id) {
			await updateMutation.mutateAsync(product)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(product)
			createMutation.reset()
		}

		await queryClient.resetQueries()
		cancelAction()
		document.body.style.overflow = null
	}

	return (
		<>
			<form>
				<FormField
					name='name'
					inputType='text'
					iconClasses='fa-brands fa-shopify'
					placeholder='Nombre del Producto'
					value={product.name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.name}
                />

				<TextAreaField
					name='description'
					placeholder='Descripción'
					value={product.description}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.description}
                />

				<FormField
					name='purchase_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Compra'
					value={product.purchase_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.purchase_price}
                />

				<FormField
					name='sale_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Venta'
					value={product.sale_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.sale_price}
                />

				<FormField
					name='preferred_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio Preferencial'
					value={product.preferred_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.preferred_price}
                />

				<FormField
					name='stock'
					inputType='number'
					iconClasses='fa-solid fa-cart-arrow-down'
					placeholder='Stock'
					value={product.stock}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.stock}
                />

				<FormField 
					name='product_type'
					inputType='text'
					iconClasses='fa-solid fa-bowl-food'
					placeholder='Tipo de Producto'
					value={product.product_type}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.product_type}
                />

				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => {
							cancelAction()
							document.body.style.position = null
						}}
					>
						Cancelar
					</button>

					<button
						type='button'
						className='btn btn-primary'
						onClick={() => {
							submitProduct()
						}}
					>
						{`${product.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>
		</>
	)
}

export default ProductForm