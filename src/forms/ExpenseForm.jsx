import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { createExpenseMutation, CREATE_MUTATION_OPTIONS, updateExpenseMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'
import AutocompleteField from '../components/AutocompleteField'
import Alert from '../components/Alert'
import ExpenseFormValidator from '../validations/ExpenseFormValidator'
import $ from 'jquery'
import { QUERY_OPTIONS } from '../utils/useQuery'
import ProductsMenu from '../components/ProductsMenu'
import { readAllExpenseProducts } from '../data-access/productsDataAccess'
import TextAreaField from '../components/TextAreaField'
import SearchField from '../components/SearchField'
import DateField from '../components/DateField'

const ExpenseForm = ({ cancelAction, expenseUpdate, providers }) => {
	document.body.style.overflow = 'hidden'
	$('.modal-content').css('width', '80%')
	
	const billTypes = [
		{ label: 'Con factura', id: 'Con factura' },
		{ label: 'Sin factura', id: 'Sin factura' }
	]

	const [selectedName, setSelectedName] = useState('')
	const [searchedWord, setSearchedWord] = useState('')
	const [order, setOrder] = useState(expenseUpdate ? expenseUpdate.details : [])
	const [expense, setExpense] = useState(expenseUpdate ? {
		...expenseUpdate,
		date: new Date(expenseUpdate.date).formatted()
	} : {
		provider_id: null,
		type: 'Con factura',
		date: new Date().formatted(),
		description: '',
		total: 0,
		bill: '',
		departure: '',
		details: []
	})
	const [validations, setValidations] = useState({
		provider: null,
		description: null,
		type: null,
		bill: null,
		date: null,
		departure: null,
		orders: null
	})

	const { data: products, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'products',
		queryFn: readAllExpenseProducts
	})

	const queryClient = useQueryClient()
	
	const createMutation = useMutation(createExpenseMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('expenses')
		}
	})
	const updateMutation = useMutation(updateExpenseMutation, {
		...UPDATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('expenses')
		}
	})

	const total = useRef()

	const filteredProducts = useMemo(() => {
		if(selectedName === '' || selectedName === null) {
			return products ? products : []
		}else{
			return products ? products.filter(product => 
				product.name.toLowerCase().search(selectedName.toLowerCase()) > -1
			) : []
		}
	}, [products, selectedName])

	const validateAll = () => {
		const { provider_id, bill, type, date, description, departure } = expense
		let validations = { provider: null, description: null, date: null,
			bill: null, type: null, departure: null, orders: null
		}

		validations.provider = ExpenseFormValidator(provider_id).providerIdValidator(providers)
		validations.type = ExpenseFormValidator(type).typeValidator()
		validations.description = ExpenseFormValidator(description).descriptionValidator()
		validations.bill = ExpenseFormValidator(bill).billValidator(type)
		validations.date = ExpenseFormValidator(date).dateValidator()
		validations.departure = ExpenseFormValidator(departure).departureValidator()
		validations.orders = ExpenseFormValidator(order).orderValidator()

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
		)
		let isValid = !validationMessages.length

		if(!isValid) setValidations(validations)

		return isValid
	}

	const validateOne = (event) => {
		const {name} = event.target
		const value = expense[name]
		let message = null

		if(name === 'bill') message = ExpenseFormValidator(value).billValidator(expense['type'])
		if(name === 'date') message = ExpenseFormValidator(value).dateValidator()
		if(name === 'description') message = ExpenseFormValidator(value).descriptionValidator()
		if(name === 'departure') message = ExpenseFormValidator(value).departureValidator()

		setValidations({ ...validations, [name]: message })
	}

	function handleInputChange(event) {
		setExpense(prevExpense => {
			return {
				...prevExpense,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitExpense() {
		const isValid = validateAll();

		if(!isValid) return false
		
		if (expense.id) {
			await updateMutation.mutateAsync(expense)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(expense)
			createMutation.reset()
		}

		await queryClient.resetQueries()
		cancelAction()
		document.body.style.overflow = null
		$('.modal-content').css('width', '50%')
	}

	useEffect(() => {
		const currentTotal = order.reduce((total, current) => 
			total + (current.amount * current.product.purchase_price), 0
		)
		total.current = currentTotal
		setExpense(prevExpense => {
			return {
				...prevExpense,
				details: order,
				total: currentTotal
			}
		})
	}, [order])

	$('input[name="bill"]').prop('disabled', expense.type === 'Sin factura' ? true : false)

	return (
		<>
			<SearchField
				placeholder='Buscar por Nombre del producto'
				value={searchedWord}
				onChange={(event) => setSearchedWord(event.target.value)}
				onBlur={() => setSearchedWord(searchedWord)}
				onSearch={() => setSelectedName(searchedWord)}
				onReset={() => {
					setSelectedName('')
					setSearchedWord('')
				}}
			/>

			<ProductsMenu
				title='Detalles del Egreso'
				total={total.current}
				filteredProducts={filteredProducts}
				order={order}
				setOrder={setOrder}
				isLoading={isLoading}
				isIncome={false}
			>
				<AutocompleteField
					name='provider_id'
					iconClasses='fa-solid fa-person'
					options={providers}
					selectedOption={() => {
						return providers.find(
							provider => provider.id === expense.provider_id
						)
					}}
					placeholder='Nombre del proveedor'
					searchable={true}
					onChange={(selectedProvider) => {
						setExpense(prevExpense => {
							return {
								...prevExpense,
								provider_id: selectedProvider.id
							}
						})
					}}
					clearable={false}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.provider}
                />

				<AutocompleteField
					name='type'
					iconClasses='fa-solid fa-file-invoice'
					options={billTypes}
					selectedOption={() => {
						return billTypes.find(
							type => type.id === expense.type
						)
					}}
					placeholder='Tipo de egreso'
					searchable={true}
					onChange={(selectedType) => {
						if(selectedType.id === 'Sin factura') {
							$('input[name="bill"]').prop('disabled', true)
							setExpense(prevExpense => {
								return {
									...prevExpense,
									type: selectedType.id,
									bill: ''
								}
							})
						}else{
							$('input[name="bill"]').prop('disabled', false)
							setExpense(prevExpense => {
								return {
									...prevExpense,
									type: selectedType.id
								}
							})
						}
						setValidations(prevValidations => {
							return {
								...prevValidations,
								bill: null
							}
						})
					}}
					clearable={false}
				/>
				<Alert
					typeAlert='alert alert-warning'
					validation={validations.type}
				/>

				<FormField
					name='bill'
					inputType='text'
					iconClasses='fa-solid fa-receipt'
					placeholder='Factura'
					value={expense.bill}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.bill}
                />

				<DateField
					name='date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de registro'
					value={expense.date}
					label='Fecha de registro'
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert
					typeAlert='alert alert-warning'
					validation={validations.date}
				/>

				<TextAreaField
					name='description'
					placeholder='Descripción'
					value={expense.description}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.description}
                />

				<FormField
					name='departure'
					inputType='text'
					iconClasses='fa-solid fa-cart-shopping'
					placeholder='Partida'
					value={expense.departure}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
                    typeAlert='alert alert-warning'
                    validation={validations.departure}
                />

				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={()=>{
							cancelAction()
							document.body.style.position = null
						}}
					>
						Cancelar
					</button>

					<button
						type='button'
						className='btn btn-primary'
						onClick={() => {
							submitExpense()
						}}
					>
						{`${expense.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</ProductsMenu>
		</>
	)
}

export default ExpenseForm