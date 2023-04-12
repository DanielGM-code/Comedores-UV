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
		nombre: '',
		precioCompra: '',
		precioVenta: '',
		precioPreferencial: '',
		stock: '',
		tipo: 'Alimentos'
	})

	const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

	const [validations, setValidations] = useState({
		nombre: [],
		precioCompra: [],
		precioVenta: [],
		precioPreferencial: [],
		stock: [],
		tipo: []
	})

	const validateAll = () => {
		const { nombre, precioCompra, precioVenta, precioPreferencial, stock } = product
		const validations = { nombre: '', precioCompra: '', precioVenta: '', precioPreferencial: '', stock: ''}

		validations.nombre = validateName(nombre)
		validations.precioCompra = validatePrice(precioCompra)
		validations.precioPreferencial = validatePrice(precioPreferencial)
		validations.precioVenta = validatePrice(precioVenta)
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

		if(!value){

			if(name === 'nombre') message = 'Nombre requerido'

			if(name === 'precioCompra') message = 'Precio requerido'

			if(name === 'precioPreferencial') message = 'Precio requerido'

			if(name === 'precioVenta') message = 'Precio requerido'

			if(name === 'stock') message = 'Stock requerido'

		}else{
			//falta validar longitud
			if(name === 'nombre' && (value.length < 10 || value.length > 50)){
				message = 'El nombre debe contener ...'
			}

			if((name === 'precioCompra' || name === 'precioPreferencial' || name === 'precioVenta') 
					&& value < 0){
				message = 'El precio no debe ser saldo negativo'
			}

			if((name === 'stock') && (value.length < 10 || value.length > 50)){
				message = 'El stock no debe ser un numero negativo'
			}
		}

		setValidations({ ...validations, [name]: [message] })
	}

	const validateName = (nombre) => {
		const validatorName = new Validator(nombre)
		return validatorName
			.isNotEmpty('Nombre requerido').result
	}

	const validatePrice = (precio) => {
		const validatorPrice = new Validator(precio)
		return validatorPrice
			.isNotEmpty('Precio requerido')
			.isNegativeBalance('El precio no debe tener saldo negativo').result
	}

	const validateStock = (stock) => {
		const validatorStock = new Validator(stock)
		return validatorStock
			.isNotEmpty('Stock requerido')
			.isNegativeBalance('El stock no debe ser un número negativo').result
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

	const typesProduct = [
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
	}

	const {
		nombre: nombreVal,
		precioCompra: precioCompraVal,
		precioPreferencial: precioPreferencialVal,
		precioVenta: precioVentaVal,
		stock: stockVal
	} = validations

	return (
		<>
			<form>
				<FormField
					name='nombre'
					inputType='text'
					iconClasses='fa-solid fa-i-cursor'
					placeholder='Nombre del Producto'
					value={product.nombre}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={nombreVal}/>
				<FormField
					name='precioCompra'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Compra'
					value={product.precioCompra}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={precioCompraVal}/>
				<FormField
					name='precioVenta'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio de Venta'
					value={product.precioVenta}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={precioVentaVal}/>
				<FormField
					name='precioPreferencial'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Precio Preferencial'
					value={product.precioPreferencial}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={precioPreferencialVal}/>
				<FormField
					name='stock'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Stock'
					value={product.stock}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={stockVal}/>
				Tipo de producto
				<ComboBox
					name='tipo'
					iconClasses='fa-solid fa-utensils'
					value={product.tipo}
					onChange={handleInputChange}
					options={typesProduct}
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
							setTypeModal(product.id ? 3 : 2)
							setIsShowingModal(true)
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