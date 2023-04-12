import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { datatableOptions } from '../utils/datatables'
import { readAllSuppliers } from '../data-access/suppliersDataAccess'
import $ from 'jquery'
import Modal from '../components/Modal'
import SupplierForm from '../forms/SupplierForm'
import { QUERY_OPTIONS } from '../utils/useQuery'
import { deleteSupplierMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import DeleteModal from '../components/DeleteModal'

const Suppliers = () => {
    const { data: suppliers, isLoading } = useQuery({
        ...QUERY_OPTIONS,
        queryKey: 'suppliers',
        queryFn: readAllSuppliers,
    })
    const [isShowingModal, setIsShowingModal] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
    const tableRef = useRef()

    const deleteMutation = useMutation(deleteSupplierMutation, DELETE_MUTATION_OPTIONS)

    useEffect(() => {
        document.title = 'ComedorUV - Proveedores'
        const table = $(tableRef.current).DataTable(datatableOptions)
        table.draw()
    }, [suppliers])

    return(
        <>
			<NavigationTitle
				menu='Inicio'
                submenu='Proveedores'
			/>
            {isLoading ? 'Loading...' :
                <>
                    <button
                        type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModal(true)}
                    >
                        <i className='fa-solid fa-plus'></i> Nuevo proveedor
                    </button>
                    <div className='contenedor-tabla'>
                        <h3>Proveedores</h3>
                        <table ref={tableRef} className='table table-hover table-borderless'>
                            <thead>
                                <tr>
                                <th className='leading-row'>Nombre</th>
									<th>Dirección</th>
									<th>Teléfono</th>
									<th>RFC</th>
									<th className='trailing-row'>Opciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {suppliers.map(supplier =>
                                    <tr key={supplier.id}>
                                        <td className='leading-row'>{supplier.name}</td>
                                        <td>{supplier.address}</td>
                                        <td>{supplier.phone}</td>
                                        <td>{supplier.rfc}</td>
                                        <td className='trailing-row'>
                                            <button
                                                type='button'
                                                className='btn-opciones p-1'
                                                onClick={() => {
                                                    setSelectedSupplier(supplier)
                                                    setIsShowingModal(true)
                                                }}
                                            >
                                                <i className='fa-solid fa-pen-to-square'></i>
                                            </button>
                                            <button
                                                type='button'
                                                className='btn-opciones p-1'
                                                onClick={() => {
                                                    setSelectedSupplier(supplier)
                                                    setIsShowingDeleteModal(true)
                                                }}
                                            >
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            }

            <Modal
				title={`${selectedSupplier ? 'Actualizar' : 'Registrar Nuevo'} Proveedor`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedSupplier(null)
				}}
			>
				<SupplierForm
					cancelAction={() => {
						setSelectedSupplier(null)
						setIsShowingModal(false)
					}}
					supplierUpdate={selectedSupplier}
				/>
			</Modal>

            <DeleteModal
                objectClass={selectedSupplier}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedSupplier(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'proveedor'}
            />

		</>
    )
}

export default Suppliers