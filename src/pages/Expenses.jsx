import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import { readAllProviders } from '../data-access/providersDataAccess'
import DetailsExpenseForm from '../forms/DetailsExpenseForm'
import { findDetailsExpense } from '../data-access/detailsExpenseDataAccess'

const Expenses = () => {
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [isShowingDetailsModal, setIsShowingDetailsModal] = useState(false)
	const [selectedExpense, setSelectedExpense] = useState(null)
	const tableRef = useRef()
	
	const { data: expenses, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'expenses', 
		queryFn: readAllExpenses
	})
	const { data: providers } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'providers',
		queryFn: readAllProviders
	})
	const { data: expenseDetails } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'expenses_details',
		queryFn: findDetailsExpense(selectedExpense === null ? 0 : selectedExpense.id)
	})

	const providersNames = useMemo(() => {
		return providers ? providers.map((provider) => {
			return {id: provider.id, label: provider.name}
		}) : []
	})

	const deleteMutation = useMutation(deleteExpenseMutation, DELETE_MUTATION_OPTIONS)

	function getProviderName(id){
		if(providersNames.length > 0){
			let foundProvider =providersNames.find(provider => provider.id === id)
			if(!foundProvider) return ''
			return foundProvider.label
		}
	}

	useEffect(() => {
		document.title = 'ComedorUV - Egresos'
		$('#tableExpense tfoot th').each( function (i) {
            var title = $('#tableExpense thead th').eq( $(this).index() ).text()
            $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' )
        } )
		$('#tableExpense #notShow input').prop('hidden', true)
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
		$( table.table().container() ).on( 'keyup', 'tfoot input', function () {
            table
                .column( $(this).data('index') )
                .search( this.value )
                .draw()
        } )
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
						<table id='tableExpense' width='100%' ref={tableRef} className='table table-hover table-borderless'>
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
										<td className='leading-row'>{getProviderName(expense.provider_id)}</td>
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
													setIsShowingDetailsModal(true)
												}}
											>
												<i className='fa-solid fa-eye'></i>
											</button>
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
							<tfoot>
								<tr>
									<th>Proveedor</th>
									<th>Fecha</th>
									<th>Descripción</th>
									<th>Total</th>
									<th>Factura</th>
									<th>Partida</th>
									<th id='notShow'>Opciones</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</>
			}

			<Modal
				title={'Detalles del egreso'}
				isShowing={isShowingDetailsModal}
				setIsShowing={setIsShowingDetailsModal}
				onClose={() => {
					setSelectedExpense(null)
				}}
			>
				<DetailsExpenseForm
					cancelAction={() => {
						setSelectedExpense(null)
						setIsShowingDetailsModal(false)
					}}
					expenseDetails={expenseDetails}
				/>
			</Modal>

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
					providers={providersNames}
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



