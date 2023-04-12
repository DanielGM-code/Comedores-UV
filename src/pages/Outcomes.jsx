import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { datatableOptions } from '../utils/datatables'
import { readAllOutcomes } from '../data-access/outcomesDataAccess'
import $ from 'jquery'
import Modal from '../components/Modal'
import OutcomeForm from '../forms/OutcomeForm'
import Articles from './Articles'
import { deleteOutcomeMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import { QUERY_OPTIONS } from '../utils/useQuery'
import DeleteModal from '../components/DeleteModal'

const Outcomes = () => {
	const { data: outcomes, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'outcomes', 
		queryFn: readAllOutcomes
	})
	const [isShowingModalOutcomeForm, setIsShowingModalOutcomeForm] = useState(false)
	const [isShowingModalArticles, setIsShowingModalArticles] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [selectedOutcome, setSelectedOutcome] = useState(null)
	const tableRef = useRef()

	const deleteMutation = useMutation(deleteOutcomeMutation, DELETE_MUTATION_OPTIONS)


	useEffect(() => {
		document.title = 'ComedorUV - Egresos'
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
	}, [outcomes])

	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Lista de egresos'
			/>
			{isLoading ? 'Loading' :
				<>
					<button
						type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModalOutcomeForm(true)}
					>
						<i className='fa-solid fa-plus'></i> Nuevo egreso
					</button>
					<div className='contenedor-tabla'>
						<h3>Egresos</h3>
						<table ref={tableRef} className='table table-hover table-borderless'>
							<thead>
								<tr>
									<th className='leading-row'>Proveedor</th>
									<th>Fecha</th>
									<th>Factura</th>
									<th>Total</th>
									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{outcomes.map(outcome =>
									<tr key={outcome.id}
										onClick={() => {
											setSelectedOutcome(outcome)
											setIsShowingModalArticles(true)
										}}
									>
										<td className='leading-row'>{outcome.proveedor}</td>
										<td>{outcome.fecha}</td>
										<td>{outcome.factura}</td>
										<td>{outcome.total}</td>
										<td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedOutcome(outcome)
													setIsShowingModalOutcomeForm(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedOutcome(outcome)
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
				title={`${selectedOutcome ? 'Actualizar' : 'Registrar Nuevo'} Egreso`}
				isShowing={isShowingModalOutcomeForm}
				setIsShowing={setIsShowingModalOutcomeForm}
				onClose={() => {
					setSelectedOutcome(null)
				}}
			>
				<OutcomeForm
					cancelAction={() => {
						setSelectedOutcome(null)
						setIsShowingModalOutcomeForm(false)
					}}
					outcomeUpdate={selectedOutcome}
				/>
			</Modal>

			<Modal
				title={'Artículos'}
				isShowing={isShowingModalArticles}
				setIsShowing={setIsShowingModalArticles}
				onClose={() => {
					setSelectedOutcome(null)
				}}
			>
				<Articles
					cancelAction={() => {
						setSelectedOutcome(null)
						setIsShowingModalArticles(false)
					}}
					
				/>
				
			</Modal>

			<DeleteModal
				objectClass={selectedOutcome}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedOutcome(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'egreso'}
			/>

		</>
	)
}

export default Outcomes



