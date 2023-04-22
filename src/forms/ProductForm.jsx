import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import ComboBox from '../components/ComboBox'
import { createProductMutation, CREATE_MUTATION_OPTIONS, updateProductMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import Validator from '../components/Validator'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'

const ProductForm = ({ cancelAction, productUpdate }) => {
	const [product, setproduct] = useState(productUpdate ?? {
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
		name: [],
		description: [],
		purchase_price: [],
		sale_price: [],
		preferred_price: [],
		stock: [],
		product_type: []
	})

	const validateAll = () => {
		const { name, description, purchase_price, sale_price, preferred_price, stock } = product
		const validations = { name: '', description: '', purchase_price: '', sale_price: '', preferred_price: '', stock: ''}

		validations.name = validateName(name)
		validations.description = validateDescription(description)
		validations.purchase_price = validatePrice(purchase_price)
		validations.preferred_price = validatePrice(preferred_price)
		validations.sale_price = validatePrice(sale_price)
		validations.stock = validateStock(stock)

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage.length > 0
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
		let message = ''

		if(name === 'name') message = validateName(value)
		if(name === 'purchase_price') message = validatePrice(value)
		if(name === 'preferred_price') message = validatePrice(value)
		if(name === 'sale_price') message = validatePrice(value)
		if(name === 'stock') message = validateStock(value)

		setValidations({ ...validations, [name]: [message] })
	}

	const validateName = (name) => {
		const validatorName = Validator(name)
		
		if(validatorName.isEmpty()) return 'Nombre requerido'
		if(!validatorName.isCorrectLength(2, 51)) return 'El nombre debe contener entre 3 y 50 caracteres'
		return ''
	}

	const validateDescription = (description) => {
		const validatorDescription = Validator(description)

		if(!validatorDescription.isCorrectLength(-1, 60000)) return 'La descripción debe contener entre 1 y 60,000 cracateres'
		return ''
	}

	const validatePrice = (price) => {
		const validatorPrice = Validator(price)

		if(validatorPrice.isEmpty()) return 'Precio requerido'
		if(validatorPrice.isOutOfMinQuantityRange(0)) return 'El precio no debe ser menor a cero'
		if(validatorPrice.isOutOfDecimalRange()) return 'El precio debe tener máximo 2 decimales'
		if(validatorPrice.isOutOfMaxQuantityRange(9999999999)) return 'El precio debe ser menor a 100,000,000.00'
		return ''
	}

	const validateStock = (stock) => {
		const validatorStock = Validator(stock)

		if(validatorStock.isEmpty()) return 'Stock requerido'
		if(validatorStock.isOutOfMinQuantityRange(0)) return 'El stock no debe ser menor a cero'
		if(validatorStock.isOutOfMaxQuantityRange(999)) return 'El stock debe ser menor a 1000'
		return ''
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

	const listTypes = [
		{ label: 'Alimentos', value:'Alimentos' },
		{ label: 'Dulcería', value:'Dulcería' },
		{ label: 'Bebidas', value:'Bebidas' }
	]

	function handleInputChange(event) {
		setproduct(prevProduct => {
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
		setTypeModal(product.id ? 3 : 2)
		setIsShowingModal(true)
	}

	const {
		name: nameValidation,
		description: descriptionValidation,
		purchase_price: purchasePriceValidation,
		preferred_price: preferredPriceValidation,
		sale_price: salePriceValidation,
		stock: stockValidation
	} = validations

	return (
		<>
			<form>
				<FormField
					name='name'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre del Producto'
					value={product.name}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={nameValidation}/>
				<div className='input-group mb-3'>
					<span className='input-group-text' id='basic-addon1'>
						<i className='fa-solid fa-i-cursor'></i>
					</span>
					<textarea 
						name='description' 
						className='formControl' 
						placeholder='Descripción'
						value={product.description}
						maxLength={60000} 
						rows={3}
						cols={78}
						onChange={handleInputChange} 
						onBlur={validateOne}
					></textarea>
				</div>
				<ErrorMessage validation={descriptionValidation}/>
				<FormField
					name='purchase_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Compra'
					value={product.purchase_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={purchasePriceValidation}/>
				<FormField
					name='sale_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Venta'
					value={product.sale_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={salePriceValidation}/>
				<FormField
					name='preferred_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio Preferencial'
					value={product.preferred_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={preferredPriceValidation}/>
				<FormField
					name='stock'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Stock'
					value={product.stock}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={stockValidation}/>
				Tipo de producto
				<ComboBox
					name='product_type'
					iconClasses='fa-solid fa-utensils'
					value={product.product_type}
					onChange={handleInputChange}
					options={listTypes}
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