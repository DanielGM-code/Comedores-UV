import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { datatableOptions } from '../utils/datatables'
import { readAllProviders } from '../data-access/providersDataAccess'
import $ from 'jquery'
import Modal from '../components/Modal'
import ProviderForm from '../forms/ProviderForm'
import { QUERY_OPTIONS } from '../utils/useQuery'
import { deleteProviderMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import DeleteModal from '../components/DeleteModal'

const Providers = () => {
    const { data: providers, isLoading } = useQuery({
        ...QUERY_OPTIONS,
        queryKey: 'providers',
        queryFn: readAllProviders,
    })
    const [isShowingModal, setIsShowingModal] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState(null)
    const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
    const tableRef = useRef()

    const deleteMutation = useMutation(deleteProviderMutation, DELETE_MUTATION_OPTIONS)

    useEffect(() => {
        document.title = 'ComedorUV - Proveedores'
        const table = $(tableRef.current).DataTable(datatableOptions)
        table.draw()
    }, [providers])

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
                                {providers.map(provider =>
                                    <tr key={provider.id}>
                                        <td className='leading-row'>{provider.name}</td>
                                        <td>{provider.address}</td>
                                        <td>{provider.phone}</td>
                                        <td>{provider.rfc}</td>
                                        <td className='trailing-row'>
                                            <button
                                                type='button'
                                                className='btn-opciones p-1'
                                                onClick={() => {
                                                    setSelectedProvider(provider)
                                                    setIsShowingModal(true)
                                                }}
                                            >
                                                <i className='fa-solid fa-pen-to-square'></i>
                                            </button>
                                            <button
                                                type='button'
                                                className='btn-opciones p-1'
                                                onClick={() => {
                                                    setSelectedProvider(provider)
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
				title={`${selectedProvider ? 'Actualizar' : 'Registrar Nuevo'} Proveedor`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedProvider(null)
				}}
			>
				<ProviderForm
					cancelAction={() => {
						setSelectedProvider(null)
						setIsShowingModal(false)
					}}
					providerUpdate={selectedProvider}
				/>
			</Modal>

            <DeleteModal
                objectClass={selectedProvider}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedProvider(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'proveedor'}
            />

		</>
    )
}

export default Providers