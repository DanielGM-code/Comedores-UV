import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { readAllProducts } from '../data-access/productsDataAccess'
import { datatableOptions } from '../utils/datatables'
import $ from 'jquery'
import { deleteProductMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import { QUERY_OPTIONS } from '../utils/useQuery'
import Modal from '../components/Modal'
import ProductForm from '../forms/ProductForm'
import DeleteModal from '../components/DeleteModal'

const Products = () => {
	const { data: products, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'products',
		queryFn: readAllProducts
	})
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const tableRef = useRef()

	const deleteMutation = useMutation(deleteProductMutation, DELETE_MUTATION_OPTIONS)

	useEffect(() => {
		document.title = 'ComedorUV - Productos'
		$('#tableProduct tfoot th').each( function (i) {
            var title = $('#tableProduct thead th').eq( $(this).index() ).text()
            $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' )
        } )
		$('#tableProduct #notShow input').prop('hidden', true)
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
		$( table.table().container() ).on( 'keyup', 'tfoot input', function () {
            table
                .column( $(this).data('index') )
                .search( this.value )
                .draw()
        } )
	}, [products])

	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Productos'
			/>
			{isLoading ? 'Loading...' :
				<>
					<button
						type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModal(true)}
					>
						<i className='fa-solid fa-plus'></i> Nuevo producto
					</button>
					<div className='contenedor-tabla'>
						<h3>Productos</h3>
						<table id='tableProduct' width='100%' ref={tableRef} className='table table-hover table-borderless'>
							<thead>
								<tr>
									<th className='leading-row'>Nombre</th>
									<th>Precio de Compra</th>
									<th>Precio de Venta</th>
									<th>Precio Preferencial</th>
									<th>Stock</th>
									<th>Tipo</th>
									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{products.map(product =>
									<tr key={product.id}>
										<td className='leading-row'>{product.name}</td>
										<td>${product.purchase_price}</td>
										<td>${product.sale_price}</td>
										<td>${product.preferred_price}</td>
										<td>{product.stock}</td>
										<td>{product.product_type}</td>
										<td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedProduct(product)
													setIsShowingModal(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedProduct(product)
													setIsShowingDeleteModal(true)
												}}
											>
												<i className='fa-solid fa-trash'></i>
											</button>
										</td>
									</tr>
								)}
							</tbody>
							<tfoot>
								<tr>
									<th>Nombre</th>
									<th>Precio de Compra</th>
									<th>Precio de Venta</th>
									<th>Precio Preferencial</th>
									<th>Stock</th>
									<th>Tipo</th>
									<th id='notShow'>Opciones</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</>
			}

			<Modal
				title={`${selectedProduct ? 'Actualizar' : 'Registrar Nuevo'} Producto`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedProduct(null)
				}}
			>
				<ProductForm
					cancelAction={() => {
						setSelectedProduct(null)
						setIsShowingModal(null)
					}}
					productUpdate={selectedProduct}
				/>
			</Modal>

			<DeleteModal
				objectClass={selectedProduct}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedProduct(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'producto'}
				isDelete={true}
			/>

		</>
	)
}

export default Products