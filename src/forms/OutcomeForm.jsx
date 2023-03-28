import React from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQueryClient } from 'react-query'
import { createOutcomeMutation, CREATE_MUTATION_OPTIONS, updateOutcomeMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'



const OutcomeForm = ({ cancelAction, outcomeUpdate }) => {
	const [outcome, setOutcome] = useState(outcomeUpdate ?? {
		proveedor: '',
		fecha: '',
		factura: '',
		total: ''
	})
	const queryClient = useQueryClient()
	const createMutation = useMutation(createOutcomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('outcomes')
		}
	})

	const updateMutation = useMutation(updateOutcomeMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('outcomes')
		}
	})

	function handleInputChange(event) {
		setOutcome(prevOutcome => {
			return {
				...prevOutcome,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitOutcome() {
		if (outcome.id) {
			await updateMutation.mutateAsync(outcome)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(outcome)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		
		cancelAction()
	}

	return (
		<form>
			<FormField
				name='proveedor'
				inputType='text'
				iconClasses='fa-solid fa-user-tie'
				placeholder='Nombre del proveedor'
				value={outcome.proveedor}
				onChange={handleInputChange}
			/>
			<FormField
				name='fecha'
				inputType='date'
				iconClasses='fa-solid fa-calendar-days'
				placeholder='Fecha'
				value={outcome.fecha}
				onChange={handleInputChange}
			/>
			<FormField
				name='factura'
				inputType='text'
				iconClasses='fa-solid fa-receipt'
				placeholder='Factura'
				value={outcome.factura}
				onChange={handleInputChange}
			/>
			<FormField
				name='total'
				inputType='number'
				iconClasses='fa-solid fa-circle-dollar-to-slot'
				placeholder='Total'
				value={outcome.total}
				onChange={handleInputChange}
			/>
			<div className='modal-footer'>
				<button
					type='button'
					className='btn btn-danger'
					onClick={cancelAction}
				>
					Cancelar
				</button>
				<button
					type='button'
					className='btn btn-primary'
					onClick={submitOutcome}
				>
					{`${outcome.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
		</form>
	)
}

export default OutcomeForm