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
    const [isShowingModal, setIsShowingModal] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState(null)
    const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)

    const { data: providers, isLoading } = useQuery({
        ...QUERY_OPTIONS,
        queryKey: 'providers',
        queryFn: readAllProviders,
    })

    const deleteMutation = useMutation(
        deleteProviderMutation, DELETE_MUTATION_OPTIONS
    )

    const tableRef = useRef()

    useEffect(() => {
        document.title = 'ComedorUV - Proveedores'
        $('#tableProvider tfoot th').each( function (i) {
            var title = $('#tableProvider thead th').eq( $(this).index() ).text()
            $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' )
        } )
        $('#tableProvider #notShow input').prop('hidden', true)
        const table = $(tableRef.current).DataTable(datatableOptions)
        table.draw()
        $( table.table().container() ).on( 'keyup', 'tfoot input', function () {
            table
                .column( $(this).data('index') )
                .search( this.value )
                .draw()
        } )
    }, [providers])

    return(
        <>
			<NavigationTitle
				menu='Inicio'
                submenu='Proveedores'
			/>

            {isLoading ? 'Cargando...' :
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

                        <table 
                            id='tableProvider' 
                            width='100%' 
                            ref={tableRef} 
                            className='table table-hover table-borderless'
                        >
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
                                        <td className='leading-row'>
                                            {provider.name}
                                        </td>

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
                                                    document.body.style.overflow = 'hidden'
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

									<th>Dirección</th>

									<th>Teléfono</th>

									<th>RFC</th>
                                    
									<th id='notShow'>Opciones</th>
                                </tr>
                            </tfoot>
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
                isDelete={true}
            />

		</>
    )
}

export default Providers