import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import FormField from '../components/FormField'
import { createSupplierMutation, CREATE_MUTATION_OPTIONS, updateSupplierMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'

const SupplierForm = ({ cancelAction, supplierUpdate}) => {
    const [supplier, setSupplier] = useState(supplierUpdate ?? {
        nombre: '',
        direccion: '',
        telefono: '',
        rfc: ''
    })
    const queryClient = useQueryClient()
    const createMutation = useMutation(createSupplierMutation, {
        ...CREATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('suppliers')
        }
    })

    const updateMutation = useMutation(updateSupplierMutation, {
        ...UPDATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('suppliers')
        }
    })

    function handleInputChange(event) {
        setSupplier(prevSupplier => {
            return {
                ...prevSupplier,
                [event.target.name]: event.target.value
            }
        })
    }

    async function submitSupplier() {
        if(supplier.id) {
            await updateMutation.mutateAsync(supplier)
            updateMutation.reset()
        }else{
            await createMutation.mutateAsync(supplier)
            createMutation.reset()
        }
        await queryClient.resetQueries()
        cancelAction()
    }

    return (
        <form>
            <FormField
				name='name'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Nombre'
				value={supplier.name}
				onChange={handleInputChange}
			/>
            <FormField
				name='address'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Dirección'
				value={supplier.address}
				onChange={handleInputChange}
			/>
            <FormField
				name='phone'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='Teléfono'
				value={supplier.phone}
				onChange={handleInputChange}
			/>
            <FormField
				name='rfc'
				inputType='text'
				iconClasses='fa-solid fa-i-cursor'
				placeholder='RFC'
				value={supplier.rfc}
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
					onClick={submitSupplier}
				>
					{`${supplier.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
        </form>
    )
}

export default SupplierForm