import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import ComboBox from '../components/ComboBox'
import { createProductMutation, CREATE_MUTATION_OPTIONS, updateProductMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import ValidatorName from '../validations/ValidatorName'
import ValidatorDescription from '../validations/ValidatorDescription'
import ValidatorPrice from '../validations/ValidatorPrice'
import ValidatorStock from '../validations/ValidatorStock'

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
		name: '',
		description: '',
		purchase_price: '',
		sale_price: '',
		preferred_price: '',
		stock: '',
		product_type: ''
	})

	const validateAll = () => {
		const { name, description, purchase_price, sale_price, preferred_price, stock } = product
		const validations = { name: '', description: '', purchase_price: '', sale_price: '', preferred_price: '', stock: ''}

		validations.name = ValidatorName(name)
		validations.description = ValidatorDescription(description)
		validations.purchase_price = ValidatorPrice(purchase_price)
		validations.preferred_price = ValidatorPrice(preferred_price)
		validations.sale_price = ValidatorPrice(sale_price)
		validations.stock = ValidatorStock(stock)

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

		if(name === 'name') message = ValidatorName(value)
		if(name === 'description') message = ValidatorDescription(value)
		if(name === 'purchase_price') message = ValidatorPrice(value)
		if(name === 'preferred_price') message = ValidatorPrice(value)
		if(name === 'sale_price') message = ValidatorPrice(value)
		if(name === 'stock') message = ValidatorStock(value)

		setValidations({ ...validations, [name]: [message] })
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
		setTypeModal(product.id ? 3 : 2)
		setIsShowingModal(true)
	}

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
				<ErrorMessage validation={validations.name}/>
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
				<ErrorMessage validation={validations.description}/>
				<FormField
					name='purchase_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Compra'
					value={product.purchase_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.purchase_price}/>
				<FormField
					name='sale_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Venta'
					value={product.sale_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.sale_price}/>
				<FormField
					name='preferred_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio Preferencial'
					value={product.preferred_price}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.preferred_price}/>
				<FormField
					name='stock'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Stock'
					value={product.stock}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={validations.stock}/>
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