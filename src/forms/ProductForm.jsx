import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createProductMutation, CREATE_MUTATION_OPTIONS, updateProductMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import ConfirmModal from '../components/ConfirmModal'
import Alert from '../components/Alert'
import '../utils/formatting'
import ProductFormValidator from '../validations/ProductFormValidator'

const ProductForm = ({ cancelAction, productUpdate }) => {
	const [product, setProduct] = useState(productUpdate ?? {
		name: '',
		description: '',
		purchase_price: '',
		sale_price: '',
		preferred_price: '',
		stock: '',
		product_type: ''
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		name: null,
		description: null,
		purchase_price: null,
		sale_price: null,
		preferred_price: null,
		stock: null,
		product_type: null
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

		if(!isValid){
			setValidations(validations)
		}

		return isValid
	}

	const validateOne = (e) => {
		const { name } = e.target
		const value = product[name]
		let numberPrice = 0
		let message = null

		if(name === 'name') message = ProductFormValidator(value).nameValidator()
		if(name === 'description') message = ProductFormValidator(value).descriptionValidator()
		if(name === 'purchase_price' || name === 'preferred_price' || 
			name === 'sale_price'
		) {
			numberPrice = Number(Number(value).priceFormat())
			product[name] = numberPrice
			message = ProductFormValidator(numberPrice).priceValidator()
		}
		if(name === 'stock') message = ProductFormValidator(value).stockValidator()
		if(name === 'product_type') message = ProductFormValidator(value).productTypeValidator()

		setValidations({ ...validations, [name]: message })
	}

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

		if(!isValid){
			return false
		}

		if (product.id) {
			await updateMutation.mutateAsync(product)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(product)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		cancelAction()
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
				<div className='input-group mb-3'>
					<span className='input-group-text' id='basic-addon1'>
						<i className='fa-solid fa-pencil'></i>
					</span>
					<textarea 
						name='description' 
						className='formControl' 
						placeholder='Descripción'
						value={product.description}
						maxLength={60000} 
						rows={3}
						cols={77}
						aria-describedby='basic-addon1'
						onChange={handleInputChange} 
						onBlur={validateOne}
					></textarea>
				</div>
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
							setTypeModal(1)
							setIsShowingModal(true)
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

			<ConfirmModal
				objectClass={productUpdate}
				cancelAction={cancelAction}
				typeModal={typeModal}
				isShowingModal={isShowingModal}
				setIsShowingModal={setIsShowingModal}
				typeClass={'producto'}
			/>
		</>
	)
}

export default ProductForm