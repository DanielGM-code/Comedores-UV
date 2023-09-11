import React, { useState, useMemo, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { QUERY_OPTIONS } from '../utils/useQuery'
import { readAllProducts } from '../data-access/productsDataAccess'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS, updateIncomeMutation } from '../utils/mutations'
import '../utils/formatting'
import $ from 'jquery'
import AutocompleteInput from '../components/AutocompleteField'
import DateField from '../components/DateField'
import Alert from '../components/Alert'
import IncomeFormValidator from '../validations/IncomeFormValidator'
import ProductsMenu from '../components/ProductsMenu'
import TextAreaField from '../components/TextAreaField'
import TabMenu from '../components/TabMenu'
import { useRef } from 'react'
import ToggleButton from '../components/ToggleButton'
import SearchField from '../components/SearchField'

const IncomeForm = ({ cancelAction, incomeUpdate, scholarships }) => {
	document.body.style.overflow = 'hidden'
	$('.modal-content').css('width', '80%')
	
	const [selectedCategory, setSelectedCategory] = useState('Alimentos')
	const [searhedWord, setSearchedWord] = useState('')
	const [selectedName, setSelectedName] = useState('')
	const [isScholarship, setIsScholarship] = useState(incomeUpdate ? (incomeUpdate.scholarship_id ? true : false) : false)
	const [order, setOrder] = useState(incomeUpdate ? incomeUpdate.details : [])
	const [income, setIncome] = useState(incomeUpdate ? {
		...incomeUpdate,
		date: new Date(incomeUpdate.date).formatted()
	} : {
		user_id: null,
		scholarship_id: null,
		note: '',
		date: new Date().formatted(),
		details: [],
		total: 0
	})
	const [validations, setValidations] = useState({
		scholarship: null,
		date: null,
		note: null,
		orders: null
	})

	const { data: products, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'products',
		queryFn: readAllProducts
	})

	const queryClient = useQueryClient()

	const createMutation = useMutation(createIncomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('incomes')
		}
	})
	const updateMutation = useMutation(updateIncomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('incomes')
		}
	})

	const total = useRef()

	const filteredProducts = useMemo(() => {
		if(selectedName === '' || selectedName === null){
			return products ? products.filter(
				product => product.product_type === selectedCategory
			) : []
		}else{
			return products ? products.filter(product => 
				product.product_type === selectedCategory &&
				product.name.toLowerCase().search(selectedName) > -1
			) : []
		}
	}, [products, selectedCategory, selectedName])

	const validateAll = () => {
		const { scholarship_id, date, note } = income
		const validations = { scholarship: null, date: null, note: null, orders: null }

		validations.scholarship = IncomeFormValidator(scholarship_id).scholarshipIdValidator(isScholarship, scholarships)
		validations.date = IncomeFormValidator(date).dateValidator()
		validations.note = IncomeFormValidator(note).noteValidator()
		validations.orders = IncomeFormValidator(order).orderValidator()

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage !== null
		)
		let isValid = !validationMessages.length

		if(!isValid) setValidations(validations)

		return isValid
	}

	const validateOne = (e) => {
		const { name } = e.target
		const value = income[name]
		let message = null

		if(name === 'date') message = IncomeFormValidator(value).dateValidator()
		if(name === 'note') message = IncomeFormValidator(value).noteValidator()

		setValidations({ ...validations, [name]: message })
	}

	function handleInputChange(event) {
		setIncome(prevIncome => {
			return {
				...prevIncome,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitIncome() {
		const isValid = validateAll();

		if(!isValid) return false

		if (income.id) {
			await updateMutation.mutateAsync(income)
			updateMutation.reset()
		} else {
			await createMutation.mutateAsync(income)
			createMutation.reset()
		}

		await queryClient.resetQueries()
		cancelAction()
		document.body.style.overflow = null
		$('.modal-content').css('width', '50%')
	}

	useEffect(() => {
		const currentTotal = order.reduce((total, current) => 
			total + (current.amount * current.product.sale_price), 0
		)
		total.current = currentTotal
		setIncome(prevIncome => {
			return {
				...prevIncome,
				details: order,
				total: currentTotal
			}
		})
	}, [order])

	return (
		<>
			<TabMenu
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>

			<SearchField
				placeholder='Buscar por Nombre del menú'
				value={searhedWord}
				onChange={(event) => setSearchedWord(event.target.value)}
				onBlur={() => setSearchedWord(searhedWord)}
				onSearch={() => setSelectedName(searhedWord)}
				onReset={() => {
					setSearchedWord('')
					setSelectedName('')
				}}
			/>

			<ProductsMenu
				title='Detalles del Ingreso'
				total={total.current}
				filteredProducts={filteredProducts}
				order={order}
				setOrder={setOrder}
				isLoading={isLoading}
				isIncome={true}
				isScholarship={isScholarship}
			>
				<ToggleButton
					title='Con becario'
					isChecked={isScholarship}
					onChange={() => {
						setIsScholarship(!isScholarship)
						setIncome(prevIncome => {
							return {
								...prevIncome,
								scholarship_id: null
							}
						})
						setValidations(prevValidations => {
							return {
								...prevValidations,
								scholarship: null
							}
						})
					}}
				/>

				{isScholarship ? 
					<>
						<AutocompleteInput
							name='scholarship_id'
							iconClasses='fa-solid fa-user'
							options={scholarships}
							selectedOption={() => {
								return scholarships.find(scholarship => 
									scholarship.id === income.scholarship_id
								)
							}}
							placeholder='Nombre del becario'
							searchable={true}
							onChange={(selectedScholarship) => {
								setIncome(prevIncome => {
									return {
										...prevIncome,
										scholarship_id: selectedScholarship.id
									}
								})
							}}
							clearable={false}
						/>
						<Alert 
							typeAlert='alert alert-warning'
							validation={validations.scholarship}
						/>
					</>
					:
					<></>
				}

				<DateField
					name='date'
					inputType='date'
					iconClasses='fa-solid fa-calendar-days'
					placeholder='Fecha de registro'
					value={income.date}
					label='Fecha de registro:'
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert
					typeAlert='alert alert-warning'
					validation={validations.date}
				/>

				<TextAreaField
					name='note'
					widthCols="30"
					placeholder='Notas'
					value={income.note}
					onChange={handleInputChange}
					onBlur={validateOne}
				/>
				<Alert 
					typeAlert='alert alert-warning'
					validation={validations.note}
				/>

				<div className='modal-footer'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => {
							cancelAction()
							document.body.style.position = null
							$('.modal-content').css('width', '50%')
						}}
					>
						Cancelar
					</button>

					<button
						type='button'
						className='btn btn-primary'
						onClick={() => {
							submitIncome()
						}}
					>
						{`${income.id ? 'Actualizar' : 'Guardar'}`}
					</button>
				</div>
			</ProductsMenu>
		</>
	)
}

export default IncomeForm