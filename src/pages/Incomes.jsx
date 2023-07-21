import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { readAllIncomes } from '../data-access/incomesDataAccess'
import $ from 'jquery'
import { datatableOptions } from '../utils/datatables'
import { deleteIncomeMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations'
import { QUERY_OPTIONS } from '../utils/useQuery'
import Modal from '../components/Modal'
import IncomeForm from '../forms/IncomeForm'
import DeleteModal from '../components/DeleteModal'
import { readAllScholarships } from '../data-access/scholarshipsDataAccess'

const Incomes = () => {
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)
	const [selectedIncome, setSelectedIncome] = useState(null)

	const { data: incomes, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'incomes',
		queryFn: readAllIncomes,
	})
	const { data: scholarships } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'scholarships',
		queryFn: readAllScholarships
	})

	const deleteMutation = useMutation(
		deleteIncomeMutation, DELETE_MUTATION_OPTIONS
	)

	const tableRef = useRef()

	const scholarshipsNames = useMemo(() => {
		return scholarships ? scholarships.map((scholarship) => {
			return {
				id: scholarship.id, 
				label: `${scholarship.first_name} ${scholarship.last_name}`
			}
		}) : []
	}, [scholarships])

	function getScholarshipName(id){
		if(scholarshipsNames.length > 0){
			let foundScholarship = scholarshipsNames.find(
				scholarship => scholarship.id === id
			)

			if(!foundScholarship) return ''

			return foundScholarship.label
		}

		return ''
	}

	useEffect(() => {
		document.title = 'ComedorUV - Ingresos'
		$('#tableIncome tfoot th').each( function (i) {
            var title = $('#tableIncome thead th').eq( $(this).index() ).text()
            $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' )
        } )
		$('#tableIncome #notShow input').prop('hidden', true)
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
		$( table.table().container() ).on( 'keyup', 'tfoot input', function () {
            table
                .column( $(this).data('index') )
                .search( this.value )
                .draw()
        } )
	}, [incomes])

	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Ingresos'
			/>

			{isLoading ? 'Cargando...' :
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

						<table 
							id='tableIncome' 
							width='100%' 
							ref={tableRef} 
							className='table table-hover table-borderless'
						>
							<thead>
								<tr>
									<th className='leading-row'>Notas</th>

									<th>Becario</th>

									<th>Total</th>

									<th>Fecha</th>

									<th className='trailing-row'>Opciones</th>
								</tr>
							</thead>

							<tbody className='table-group-divider'>
								{incomes.map(income =>
									<tr key={income.id}>
										<td className='leading-row'>
											{income.note}
										</td>

										<td>{getScholarshipName(income.scholarship_id)}</td>

										<td>${income.total.priceFormat()}</td>

										<td>
											{new Date(income.date).formatted()}
										</td>

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
									<th>Notas</th>

									<th>Becario</th>

									<th>Total</th>

									<th>Fecha</th>

									<th id='notShow'>Opciones</th>
								</tr>
							</tfoot>
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
					scholarships={scholarshipsNames}
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
				isDelete={true}
			/>
		</>
	)
}

export default Incomes