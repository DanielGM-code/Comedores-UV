import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { readAllIncomes } from '../data-access/incomesDataAccess'
import $ from 'jquery'
import { datatableOptions } from '../utils/datatables'
import { deleteIncomeMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import { QUERY_OPTIONS } from '../utils/useQuery'
import Modal from '../components/Modal'
import IncomeForm from '../forms/IncomeForm'
import 'datatables.net-buttons/js/buttons.colVis'
import 'datatables.net-buttons/js/buttons.print'
import DeleteModal from '../components/DeleteModal'

const Incomes = () => {
	const { data: incomes, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'incomes',
		queryFn: readAllIncomes,
	})
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [selectedIncome, setSelectedIncome] = useState(null)
	const tableRef = useRef()

	const deleteMutation = useMutation(deleteIncomeMutation, DELETE_MUTATION_OPTIONS)

	useEffect(() => {
		document.title = 'ComedorUV - Ingresos'
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
	}, [incomes])

	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Ingresos'
			/>
			{isLoading ? 'Loading...' :
				<>
					<button
						type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModal(true)}
					>
						<i className='fa-solid fa-plus'></i> Nuevo ingreso
					</button>
					<div className='contenedor-tabla'>
						<h3>Ingresos</h3>
						<table ref={tableRef} className='table table-hover table-borderless'>
							<thead>
								<tr>
									<th className='leading-row'>Notas</th>
									<th>Total</th>
									<th>Fecha</th>
									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{incomes.map(income =>
									<tr key={income.id}>
										<td className='leading-row'>{income.note}</td>
										<td>{income.total}</td>
										<td>{new Date(income.date).formatted()}</td>
										<td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedIncome(income)
													setIsShowingModal(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
											<button 
												type='button' 
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedIncome(income)
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
				title={`${selectedIncome ? 'Actualizar' : 'Registrar Nuevo'} Ingreso`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedIncome(null)
				}}
			>
				<IncomeForm
					cancelAction={() => {
						setSelectedIncome(null)
						setIsShowingModal(false)
					}}
					incomeUpdate={selectedIncome}
				/>
			</Modal>

			<DeleteModal
				objectClass={selectedIncome}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedIncome(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'ingreso'}
			/>
		</>
	)
}

export default Incomes