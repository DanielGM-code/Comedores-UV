import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import ComboBox from '../components/ComboBox'
import { createProductMutation, CREATE_MUTATION_OPTIONS, updateProductMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'

const ProductForm = ({ cancelAction, productUpdate }) => {
	const [product, setproduct] = useState(productUpdate ?? {
		nombre: '',
		precioCompra: '',
		precioVenta: '',
		precioPreferencial: '',
		stock: '',
		tipo: 'Alimentos'
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
		<form>
			<FormField
				name='nombre'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Nombre del Producto'
				value={product.nombre}
				onChange={handleInputChange}
			/>
			<FormField
				name='precioCompra'
				inputType='number'
				iconClasses='fa-solid fa-dollar'
				placeholder='Precio de Compra'
				value={product.precioCompra}
				onChange={handleInputChange}
			/>
			<FormField
				name='precioVenta'
				inputType='number'
				iconClasses='fa-solid fa-dollar'
				placeholder='Precio de Venta'
				value={product.precioVenta}
				onChange={handleInputChange}
			/>
			<FormField
				name='precioPreferencial'
				inputType='number'
				iconClasses='fa-solid fa-dollar'
				placeholder='Precio Preferencial'
				value={product.precioPreferencial}
				onChange={handleInputChange}
			/>
			<FormField
				name='stock'
				inputType='number'
				iconClasses='fa-solid fa-dollar'
				placeholder='Stock'
				value={product.stock}
				onChange={handleInputChange}
			/>
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
					onClick={cancelAction}
				>
					Cancelar
				</button>
				<button
					type='button'
					className='btn btn-primary'
					onClick={submitProduct}
				>
					{`${product.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
		</form>
	)
}

export default ProductForm