import React from 'react'
import IncomesExpensesChart from '../components/IncomesExpensesChart'
import NavigationTitle from '../components/NavigationTitle'
import CanvaJSReact from '../utils/canvasjs.react'
const { CanvasJSChart } = CanvaJSReact

const Reports = () => {


	return (
		<div className='contenedor-tabla'>
			<NavigationTitle
				menu='Inicio'
				submenu='Reportes'
			/>
			<IncomesExpensesChart />
		</div>
	)
}

export default Reports