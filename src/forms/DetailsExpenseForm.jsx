import { useState } from "react"
import Validator from "../validations/Validator"
import FormField from "../components/FormField"
import ErrorMessage from "../components/ErrorMessage"
import ConfirmModal from "../components/ConfirmModal"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { CREATE_MUTATION_OPTIONS, createDetailsExpenseMutation, updateDetailsExpenseMutation } from "../utils/mutations"
import { useMemo } from "react"
import { QUERY_OPTIONS } from "../utils/useQuery"
import { readAllProducts } from "../data-access/productsDataAccess"
import AutocompleteField from "../components/AutocompleteField"

const DetailsExpenseForm = ({ cancelAction, expenseDetails }) => {

	const { data: dataProducts } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'products',
		queryFn: readAllProducts
	})

    const [expense_details, setDetailsExpense] = useState(expenseDetails ?? [])

    const [typeModal, setTypeModal] = useState(0)
	const [isShowingModal, setIsShowingModal] = useState(false)

    const [validations, setValidations] = useState({
        expense_id: [],
        product_id: [],
        quantity: [],
        unit_price: []
    })

    const validateAll = () => {
        const { expense_id, product_id, quantity, unit_price } = expense_details
        const validations = { expense_id: '', product_id: '', quantity: '', unit_price: '' }

        validations.expense_id = validateId(expense_id, 'egreso')
        validations.product_id = validateId(product_id, 'producto')
        validations.quantity = validateQuantity(quantity)
        validations.unit_price = validatePrice(unit_price)

        const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage.length > 0
		)
		let isValid = !validationMessages.length

		if(!isValid){
			setValidations(validations)
		}

		return isValid
    }

    const validateOne = (e) => {
        const { name } = e.target
		const value = expense_details[name]
		let message = ''

        if(name === 'expense_id') message = validateId(value, 'egreso')
        if(name === 'product_id') message = validateId(value, 'producto')
        if(name === 'quantity') message = validateQuantity(value)
        if(name === 'unit_price') message = validatePrice(value)

        setValidations({ ...validations, [name]: [message] })
    }

    const validateId = (id, name) => {
        const validatorId = Validator(id)

        if(validatorId.isEmpty()) return `Debe seleccionar un ${name}`
        return ''
    }

    const validateQuantity = (quantity) => {
        const validatorQuantity = Validator(quantity)

        if(validatorQuantity.isEmpty()) return 'Cantidad requerida'
        if(validatorQuantity.isOutOfMinQuantityRange(1)) return 'La cantidad no debe ser menor a cero'
        if(validatorQuantity.isOutOfMaxQuantityRange(999)) return 'La cantidad debe ser menor a 1000'
        return ''
    }

    const validatePrice = (price) => {
		const validatorPrice = Validator(price)

		if(validatorPrice.isEmpty()) return 'Precio requerido'
		if(validatorPrice.isOutOfMinQuantityRange(0)) return 'El precio no debe ser menor a cero'
		if(validatorPrice.isOutOfDecimalRange()) return 'El precio debe tener máximo 2 decimales'
		if(validatorPrice.isOutOfMaxQuantityRange(9999999999)) return 'El precio debe ser menor a 100,000,000.00'
		return ''
	}

    const queryClient = useQueryClient()
    const createMutation = useMutation(createDetailsExpenseMutation, {
        ...CREATE_MUTATION_OPTIONS,
        onSettled: async () => {
			queryClient.resetQueries('details_expenses')
		}
    })

    const updateMutation = useMutation(updateDetailsExpenseMutation, {
        ...CREATE_MUTATION_OPTIONS,
        onSettled: async () => {
			queryClient.resetQueries('details_expenses')
		}
    })

    const products = useMemo(() => {
        return dataProducts ? dataProducts.map((product) => {
            return {
                id: product.id,
				label: product.name
            }
        }) : []
    })

	function getSelectedProvider() {
		return products.find(product => product.id === expenseDetails.product_id)
	}

    function handleInputChange(event) {
		setDetailsExpense(prevDetailsExpense => {
			return {
				...prevDetailsExpense,
				[event.target.name]: event.target.value
			}
		})
	}

    async function submitDetailsExpense() {
		const isValid = validateAll();

		if(!isValid){
			return false
		}

		if (expense_details.id) {
			await updateMutation.mutateAsync(expense_details)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(expense_details)
			createMutation.reset()
		}
		await queryClient.resetQueries()
		setTypeModal(expense_details.id ? 3 : 2)
		setIsShowingModal(true)
	}

	function handleAutocompleteChange(selectedProvider){
		setDetailsExpense(prevDetails => {
			return {
				...prevDetails,
				'product_id': selectedProvider.id
			}
		})
	}

    const {
        expense_id: expenseIdValidation,
        product_id: productIdValidation,
        quantity: quantityValidation,
        unit_price: unitPriceValidation
    } = validations

    return (
		<>
			<form>
				<AutocompleteField
					name='provider_id'
					iconClasses='fa-solid fa-industry'
					options={products}
					selectedOption={getSelectedProvider}
					placeholder='Proveedor'
					searchable={true}
					onChange={handleAutocompleteChange}
				/>
				<FormField
					name='quantity'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
					placeholder='Cantidad'
					value={expense_details.quantity}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<ErrorMessage validation={quantityValidation}/>
				<FormField
					name='unit_price'
					inputType='number'
					iconClasses='fa-solid fa-dollar'
                    placeholder='Precio unitario'
					value={expense_details.unit_price}
					onChange={handleInputChange}
                    onBlur={validateOne}
				/>
                <ErrorMessage validation={unitPriceValidation}/>
				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => {
							setTypeModal(1)
							setIsShowingModal(true)
						}}
					>
						Cancelar
					</button>
					<button
						type='button'
						className='btn btn-primary'
						onClick={() => {
							submitDetailsExpense()
						}}
					>
						{`${expense_details.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</form>

			<ConfirmModal
				cancelAction={cancelAction} 
				typeModal={typeModal} 
				isShowingModal={isShowingModal} 
				setIsShowingModal={setIsShowingModal}
				typeClass={'detalles del egreso'}
			/>
		</>
	)
}

export default DetailsExpenseForm