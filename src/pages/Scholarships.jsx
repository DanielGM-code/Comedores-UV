import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { readAllScholarships } from '../data-access/scholarshipsDataAccess'
import $ from 'jquery'
import { datatableOptions } from '../utils/datatables'
import { deleteScholarshipMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import { QUERY_OPTIONS } from '../utils/useQuery'
import Modal from '../components/Modal'
import ScholarshipForm from '../forms/ScholarshipForm'
import DeleteModal from '../components/DeleteModal'

const Scholarships = () => {
	const { data: scholarships, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'scholarships',
		queryFn: readAllScholarships,
	})
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [selectedScholarship, setSelectedScholarship] = useState(null)
	const tableRef = useRef()

	const deleteMutation = useMutation(deleteScholarshipMutation, DELETE_MUTATION_OPTIONS)

	useEffect(() => {
		document.title = 'ComedorUV - Becarios'
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
	}, [scholarships])

	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Becarios'
			/>
			{isLoading ? 'Loading...' :
				<>
					<button
						type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModal(true)}
					>
						<i className='fa-solid fa-plus'></i> Nuevo becario
					</button>
					<div className='contenedor-tabla'>
						<h3>Becarios</h3>
						<table ref={tableRef} className='table table-hover table-borderless'>
							<thead>
								<tr>
									<th className='leading-row'>Nombre</th>
									<th>Apellido</th>
									<th>Carrera</th>
									<th>Menús pagados</th>
									<th>Fecha de Inicio</th>
									<th>Fecha de Fin</th>
									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{scholarships.map(scholarship =>
									<tr key={scholarship.id}>
										<td className='leading-row'>{scholarship.first_name}</td>
										<td>{scholarship.last_name}</td>
										<td>{scholarship.career}</td>
										<td>{scholarship.paid_meals}</td>
										<td>{new Date(scholarship.start_date).formatted()}</td>
										<td>{new Date(scholarship.end_date).formatted()}</td>
										<td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedScholarship(scholarship)
													setIsShowingModal(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedScholarship(scholarship)
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
				title={`${selectedScholarship ? 'Actualizar' : 'Registrar Nuevo'} Becario`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedScholarship(null)
				}}
			>
				<ScholarshipForm
					cancelAction={() => {
						setSelectedScholarship(null)
						setIsShowingModal(false)
					}}
					scholarshipUpdate={selectedScholarship}
				/>
			</Modal>

			<DeleteModal
				objectClass={selectedScholarship}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedScholarship(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'becado'}
			/>
		</>
	)
}

export default Scholarships