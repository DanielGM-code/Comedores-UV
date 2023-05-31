import { useEffect, useRef, useState } from "react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { CREATE_MUTATION_OPTIONS, createDetailsExpenseMutation, updateDetailsExpenseMutation } from "../utils/mutations"
import AutocompleteField from "../components/AutocompleteField"
import ValidatorPrice from '../validations/ValidatorPrice'
import Validator from "../validations/Validator"
import { useMemo } from "react"
import { QUERY_OPTIONS } from "../utils/useQuery"
import { readAllProducts } from "../data-access/productsDataAccess"

const DetailsExpenseDialog = ({ cancelAction, expenseDetails }) => {

    const { data: products } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'expenses',
		queryFn: readAllProducts
	})

	const productsNames = useMemo(() => {
		return products ? products.map((product) => {
			return {
				id: product.id,
				label: `${product.name} ${product.sale_price} ${product.product_type}`
			}
		}) : []
	})

    const [expense_details, setDetailsExpense] = useState(expenseDetails ?? [])
    const [typeModal, setTypeModal] = useState(0)
	const [open, setOpen] = useState(false)
	const [isShowingModal, setIsShowingModal] = useState(false)
	const [listedProduct, setListedProduct] = useState(null)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [selectedProducts, setSelectedProducts] = useState([])

    const [validations, setValidations] = useState({
        expense_id: '',
        product_id: '',
        quantity: '',
        unit_price: ''
    })

    const validateAll = () => {
        const { expense_id, product_id, quantity, unit_price } = expense_details
        const validations = { expense_id: '', product_id: '', quantity: '', unit_price: '' }

        validations.expense_id = validateId(expense_id, 'egreso')
        validations.product_id = validateId(product_id, 'producto')
        validations.quantity = validateQuantity(quantity)
        validations.unit_price = ValidatorPrice(unit_price)

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
        if(name === 'unit_price') message = ValidatorPrice(value)

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

	function handleAutocompleteChange(selectedProduct){
		const foundProduct = products.find(product => product.id === selectedProduct.id)
		if(foundProduct){
			setSelectedProduct(foundProduct)
		}else{
			setSelectedProduct(null)
		}
	}

	function handleClose(){
		cancelAction()
		setOpen(false)
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
    
    return (
        <Dialog
				open={open}
				onClose={handleClose()}
				scroll="paper"
				aria-labelledby="scroll-dialog-title"
			>
				<DialogTitle id='scroll-dialog-title'>Detalles del egreso</DialogTitle>
				<DialogContent dividers={true}>
					<AutocompleteField
						name='product_id'
						iconClasses='fa-solid fa-burger-soda'
						options={productsNames}
						selectedOption={null}
						placeholder='Producto'
						onChange={handleAutocompleteChange}
					/>
				</DialogContent>
				<DialogActions>
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
				</DialogActions>
			</Dialog>
    )
}