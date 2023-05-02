import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { readAllIncomes } from '../data-access/incomesDataAccess'
import { readAllExpenses } from '../data-access/expensesDataAccess'
import CanvaJSReact from '../utils/canvasjs.react'
import { QUERY_OPTIONS } from '../utils/useQuery'
const { CanvasJSChart } = CanvaJSReact

const IncomesExpensesChart = () => {
	const { data: incomes = [] } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'incomes',
		queryFn: readAllIncomes
	})
	const { data: expenses = [] } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'expenses',
		queryFn: readAllExpenses
	})

	const options = useMemo(() => {
		let totalIncomes = incomes.lenght !== 0 ? incomes.reduce((sum, actual) => sum + actual.total, 0) : 0
		let totalExpenses = expenses.lenght !== 0 ? expenses.reduce((sum, actual) => sum + actual.total, 0) : 0

		return {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2",
			title: {
				text: "Ingresos - Egresos"
			},
			axisY: {
				minimum: 0,
				maximum: Math.max(totalIncomes, totalExpenses)
			},
			data: [{
				type: "bar", //change type to bar, line, area, pie, etc
				indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#70768c",
				indexLabelPlacement: "auto",
				dataPoints: [
					{
						label: 'Ingresos',
						y: totalIncomes
					},
					{
						label: 'Egresos',
						y: totalExpenses
					},
				]
			}]
		}
	}, [incomes, expenses])

	return (
		<CanvasJSChart options={options} />
	)
}

export default IncomesExpensesChart