import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { datatableOptions } from '../utils/datatables'
import { readAllExpenses } from '../data-access/expensesDataAccess'
import $ from 'jquery'
import Modal from '../components/Modal'
import ExpenseForm from '../forms/ExpenseForm'
import { deleteExpenseMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import { QUERY_OPTIONS } from '../utils/useQuery'
import DeleteModal from '../components/DeleteModal'

const Expenses = () => {
	const { data: expenses, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'expenses', 
		queryFn: readAllExpenses
	})
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [selectedExpense, setSelectedExpense] = useState(null)
	const tableRef = useRef()

	const deleteMutation = useMutation(deleteExpenseMutation, DELETE_MUTATION_OPTIONS)


	useEffect(() => {
		document.title = 'ComedorUV - Egresos'
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
	}, [expenses])

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
						onClick={() => setIsShowingModal(true)}
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
									<th>Descripción</th>
									<th>Total</th>
									<th>Factura</th>
									<th>Partida</th>
									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>
							<tbody className='table-group-divider'>
								{expenses.map(expense =>
									<tr key={expense.id}
										onClick={() => {
											setSelectedExpense(expense)
										}}
									>
										<td className='leading-row'>{expense.provider_id}</td>
										<td>{expense.date}</td>
										<td>{expense.description}</td>
										<td>{expense.total}</td>
										<td>{expense.bill}</td>
										<td>{expense.departure}</td>
										<td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedExpense(expense)
													setIsShowingModal(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedExpense(expense)
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
				title={`${selectedExpense ? 'Actualizar' : 'Registrar Nuevo'} Egreso`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedExpense(null)
				}}
			>
				<ExpenseForm
					cancelAction={() => {
						setSelectedExpense(null)
						setIsShowingModal(false)
					}}
					expenseUpdate={selectedExpense}
				/>
			</Modal>

			<DeleteModal
				objectClass={selectedExpense}
				deleteMutation={deleteMutation}
				cancelAction={() => {
					setSelectedExpense(null)
					setIsShowingDeleteModal(false)
				}}
				isShowingModal={isShowingDeleteModal}
				setIsShowingModal={setIsShowingDeleteModal}
				typeClass={'egreso'}
			/>

		</>
	)
}

export default Expenses



