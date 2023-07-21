import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { datatableOptions } from '../utils/datatables'
import { readAllUsers } from '../data-access/usersDataAccess'
import { updateUserMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import { useMutation } from 'react-query'
import $ from 'jquery'
import Modal from '../components/Modal'
import UserForm from '../forms/UserForm'
import { QUERY_OPTIONS } from '../utils/useQuery'
import DeleteModal from '../components/DeleteModal'

const Users = () => {
	const roles = [
		{ label: 'Administrador', id: 'admin' }, 
		{ label: 'Cajero', id: 'cajero' }, 
		{ label: 'Chef', id: 'chef' }
	]

	const [isShowingModal, setIsShowingModal] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)

	const { data: users, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'users',
		queryFn: readAllUsers,
	})

	const queryClient = useQueryClient()

	const updateMutation = useMutation(updateUserMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('users')
		}
	})

	const tableRef = useRef()

	const activeUsers = useMemo(() => {
		return users ? users.filter((user) => user.role !== 'inactivo') : []
	}, [users])

	function getUserRole(roleId){
		let foundRole = roles.find(role => role.id === roleId)
		if(!foundRole) return ''
		return foundRole.label
	}

	useEffect(() => {
		document.title = 'ComedorUV - Usuarios'
		$('#tableUser tfoot th').each( function (i) {
            var title = $('#tableUser thead th').eq( $(this).index() ).text()
            $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' )
        } )
		$('#tableUser #notShow input').prop('hidden', true)
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
		$( table.table().container() ).on( 'keyup', 'tfoot input', function () {
            table
                .column( $(this).data('index') )
                .search( this.value )
                .draw()
        } )
	}, [users])

	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Usuarios'
			/>

			{isLoading ? 'Cargando...' :
				<>
					<button
						type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModal(true)}
					>
						<i className='fa-solid fa-plus'></i> Nuevo usuario
					</button>

					<div className='contenedor-tabla'>
						<h3>Usuarios</h3>

						<table 
							id='tableUser' 
							width='100%' 
							ref={tableRef} 
							className='table table-hover table-borderless'
						>
							<thead>
								<tr>
									<th className='leading-row'>
										Nombre completo
									</th>

									<th>Correo</th>

									<th>Rol</th>

									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>

							<tbody className='table-group-divider'>
								{activeUsers.map(user =>
									<tr key={user.id}>
										<td className='leading-row'>
											{user.name}
										</td>

										<td>{user.email}</td>

										<td>{getUserRole(user.role)}</td>

										<td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedUser(user)
													setIsShowingModal(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>

											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedUser(user)
													setSelectedUser(prevUser => {
														return {
															...prevUser,
															role: 'inactivo'
														}
													})
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
									<th>Nombre completo</th>

									<th>Correo</th>

									<th>Rol</th>
									
									<th id='notShow'>Opciones</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</>
			}

			<Modal
				title={`${selectedUser ? 'Actualizar' : 'Registrar Nuevo'} Usuario`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedUser(null)
				}}
			>
				<UserForm
					cancelAction={() => {
						setSelectedUser(null)
						setIsShowingModal(false)
					}}
					userUpdate={selectedUser}
					users={users}
					roles={roles}
				/>
			</Modal>

			<DeleteModal
				objectClass={selectedUser}
				deleteMutation={updateMutation}
				cancelAction={() => {
					setSelectedUser(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'usuario'}
				isDelete={false}
			/>
		</>
	)
}

export default Users