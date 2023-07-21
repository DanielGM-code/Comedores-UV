import React, { useEffect, useRef } from 'react'
import IncomesExpensesChart from '../components/IncomesExpensesChart'
import NavigationTitle from '../components/NavigationTitle'
import CanvaJSReact from '../utils/canvasjs.react'
import { useQuery } from 'react-query'
import { QUERY_OPTIONS } from '../utils/useQuery'
import { readAllDetailsExpenses } from '../data-access/detailsExpenseDataAccess'
import { readAllDetailsIncomes } from '../data-access/detailsIncomeDataAccess'
import $ from 'jquery'
import { datatableOptions } from '../utils/datatables'
const { CanvasJSChart } = CanvaJSReact

const Reports = () => {
	const { data: detailsExpenses = [], isLoadingExpenses } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'reporteEgresos',
		queryFn: readAllDetailsExpenses
	})
	const { data: detailsIncomes = [], isLoadingIncomes } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'reporteIngresos',
		queryFn: readAllDetailsIncomes
	})

	const tableRef = useRef()

	function getDetailsIncome(id){
		let foundDetailsIncome = detailsIncomes.find(details => details.product_id === id)
		if(foundDetailsIncome === undefined) foundDetailsIncome = {
			income_id: '',
			product_id: '',
			quantity: '',
			price: ''
		}
		return foundDetailsIncome
	}

	useEffect(() => {
		document.title = 'ComedorUV - Reportes'
		$('#tableReport tfoot th').each( function (i) {
            var title = $('#tableReport thead th').eq( $(this).index() ).text()
            $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' )
        } )
		const table = $(tableRef.current).DataTable(datatableOptions)
		table.draw()
		$( table.table().container() ).on( 'keyup', 'tfoot input', function () {
            table
                .column( $(this).data('index') )
                .search( this.value )
                .draw()
        } )
	}, [detailsExpenses, detailsIncomes])

	return (
		<>
			<div className='contenedor-tabla'>
				<NavigationTitle
					menu='Inicio'
					submenu='Reportes'
				/>

				<IncomesExpensesChart />
			</div>

			{isLoadingExpenses ? 'Cargando...' :
				<div className='contenedor-tabla'>
					<h3>Egresos</h3>

					<table 
						id='tableReport' 
						width='100%' 
						ref={tableRef} 
						className='table table-hover table-borderless'
					>
						<thead>
							<tr>
								<th className='leading-row'>Egreso</th>

								<th>Producto</th>

								<th>Cantidad</th>

								<th>Precio unitario</th>

								<th>Ingreso</th>

								<th>Producto</th>

								<th>Cantidad</th>

								<th>Precio unitario</th>
							</tr>
						</thead>

						<tbody className='table-group-divider'>
							{detailsExpenses.map(detailsExpense => {
								const detailsIncome = getDetailsIncome(detailsExpense.product_id)

								return (
									<tr key={detailsExpense.id}>
										<td className='leading-row'>
											{detailsExpense.expense_id}
										</td>

										<td>{detailsExpense.product_id}</td>

										<td>{detailsExpense.quantity}</td>

										<td>{detailsExpense.unit_price}</td>

										<td>{detailsIncome.income_id}</td>

										<td>{detailsIncome.product_id}</td>

										<td>{detailsIncome.quantity}</td>

										<td>{detailsIncome.price}</td>
									</tr>
								)
							})}
						</tbody>

						<tfoot>
							<tr>
								<th>Egreso</th>

								<th>Producto</th>

								<th>Cantidad</th>

								<th>Precio unitario</th>

								<th>Ingreso</th>

								<th>Producto</th>

								<th>Cantidad</th>
								
								<th>Precio unitario</th>
							</tr>
						</tfoot>
					</table>
				</div>
			}
		</>
	)
}

export default Reports