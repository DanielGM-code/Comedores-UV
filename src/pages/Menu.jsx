import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import { readAllProducts } from '../data-access/productsDataAccess'
import { QUERY_OPTIONS } from '../utils/useQuery'
import '../css/menu.css'
import '../utils/formatting'
import FormField from '../components/FormField'
import PrintButton from '../components/PrintButton'
import { readAllScholarships } from '../data-access/scholarshipsDataAccess'
import { useMutation, useQueryClient } from 'react-query'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS, createDetailsIncomeMutation } from '../utils/mutations'
import AutocompleteField from '../components/AutocompleteField'
import ValidatorNote from '../validations/ValidatorNote'
import ErrorMessage from '../components/ErrorMessage'
import ValidatorMenuName from '../validations/ValidatorMenuName'
import ValidatorMenuScholarship from '../validations/ValidatorMenuScholarship'

const Menu = () => {
	const [selectedCategory, setSelectedCategory] = useState('Alimentos')
	const [order, setOrder] = useState([])
	const [orderDetails, setOrderDetails] = useState({
		name: '',
		scholarshipName: '',
		printTicket: false,
		isScholarship: false
	})
	const [income, setIncome] = useState({
		user_id: null,
		scholarship_id: null,
		date: new Date().formatted(),
		note: '',
		total: 0
	})
	const [validations, setValidations] = useState({
		name: '',
		scholarship: '',
		note: '',
		product: '',
		income: ''
	})

	const { data: products, isLoading } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'products',
		queryFn: readAllProducts
	})
	const { data: scholarships } = useQuery({
		...QUERY_OPTIONS,
		queryKey: 'scholarships',
		queryFn: readAllScholarships
	})
	const queryClient = useQueryClient()
	const createMutation = useMutation(createIncomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('incomes')
		}
	})
	const createDetailsMutation = useMutation(createDetailsIncomeMutation, {
		...CREATE_MUTATION_OPTIONS,
		onSettled: async () => {
			queryClient.resetQueries('details_income')
		}
	})

	const scholarshipsNames = useMemo(() => {
		return scholarships ? scholarships.map((scholarship) => {
			return {
				id: scholarship.id, 
				label: `${scholarship.first_name} ${scholarship.last_name}`
			}
		}) : []
	})
	const total = useMemo(() => {
		return order.reduce((total, current) => total + (current.amount * current.product.sale_price), 0
		)
	}, [order])
	const filteredProducts = useMemo(() => {
		return products ? products.filter(product => product.product_type === selectedCategory) : []
	}, [products, selectedCategory])

	function onTabElementClicked(event) {
		setSelectedCategory(event.target.innerHTML)
	}

	function addToOrder(product) {
		if(product.stock < 1) return
		let found = order.find(orderItem => orderItem.product.id === product.id)
		if (!found) {
			setOrder(prevOrder => {
				return [
					...prevOrder,
					{
						product: product,
						amount: 1
					}
				]
			})
			return
		}
		let rest = product.stock - found.amount
		if(rest < 1) return
		setOrder(prevOrder => {
			let newOrder = prevOrder.filter(orderItem => orderItem !== found)
			newOrder.push({
				...found,
				amount: found.amount + 1
			})
			return newOrder
		})
	}

	function removeFromOrder(product) {
		let found = order.find(orderItem => orderItem.product.id === product.id)
		if (!found) return
		setOrder(prevOrder => {
			let newOrder = prevOrder.filter(orderItem => orderItem !== found)
			if (found.amount > 1) {
				newOrder.push({
					...found,
					amount: found.amount - 1
				})
			}
			return newOrder
		})
	}

	function countProduct(product) {
		let found = order.find(orderItem => orderItem.product.id === product.id)
		if (!found) return 0
		return found.amount
	}

	const validateAll = () => {
		const { scholarship_id, note } = income
		const { name, isScholarship } = orderDetails
		const validations = { name: '', scholarship: '',
			note: '', product: '', income: '' 
		}

		validations.scholarship = ValidatorMenuScholarship(isScholarship, scholarship_id, scholarships)
		validations.note = ValidatorNote(note)
		validations.name = ValidatorMenuName(isScholarship, name)

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage.length > 0
		)
		let isValid = !validationMessages.length

		if(!isValid){
			setValidations(validations)
		}
		if(order.length < 1) return false

		return isValid
	}

	const validateOne = (e) => {
		const { name } = e.target
		let message = ''

		if(name === 'name') message = ValidatorMenuName(orderDetails.isScholarship, orderDetails[name])
		if(name === 'note') message = ValidatorNote(income[name])

		setValidations({ ...validations, [name]: [message]})
	}

	function handleInputChange(event) {
		setIncome(prevIncome => {
			return {
				...prevIncome,
				[event.target.name]: event.target.value
			}
		})
	}

	async function sellProduct(){
		setIncome(prevIncome => {
			return {
				...prevIncome,
				total: total
			}
		})
		let newIncome = {
			user_id: income.user_id,
			scholarship_id: income.scholarship_id,
			date: income.date,
			note: income.note,
			total: total
		}

		const isValid = validateAll()
		if(!isValid) return false

		await createMutation.mutateAsync(newIncome)
		createMutation.reset()

		let income_details = order.map(orderItem => {
			return {
				income_id: null,
				quantity: orderItem.amount,
				price: orderItem.product.sale_price,
				product_id: orderItem.product.id
			}
		})

		income_details.forEach(async details => await createDetailsMutation.mutateAsync(details))
		createDetailsMutation.reset()
	}

	return (
		<div className='contenedor-tabla'>
			<NavigationTitle
				menu='Inicio'
				submenu='Menú'
			/>
			<div className='tab-bar'>
				<h3 className={`tab-element ${selectedCategory === 'Alimentos' && 'active'}`} onClick={onTabElementClicked} >Alimentos</h3>
				<h3>|</h3>
				<h3 className={`tab-element ${selectedCategory === 'Dulcería' && 'active'}`} onClick={onTabElementClicked} >Dulcería</h3>
				<h3>|</h3>
				<h3 className={`tab-element ${selectedCategory === 'Bebidas' && 'active'}`} onClick={onTabElementClicked} >Bebidas</h3>
			</div>
			<div className='main-container'>
				<div className='products-container'>
					{isLoading ? 'Loading' :
						filteredProducts.map(product => {
							return (
								<div key={product.id} className='menu-item'>
									<img className='menu-item-image' src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Empanadas_de_Queso.jpg" alt="empanadas" />
									<div className='menu-item-content'>
										<p className='menu-item-nombre'>{product.name}</p>
										<p className='menu-item-precio'>${product.sale_price}</p>
										<p className='menu-item-stock'>Existencia: {product.stock}</p>
									</div>
									<div className='stepper-container'>
										<i
											className='fa-solid fa-minus stepper-button'
											onClick={() => {
												removeFromOrder(product)
											}}
										></i>
										<div className='stepper-count'>{countProduct(product)}</div>
										<i
											className='fa-solid fa-plus stepper-button'
											onClick={() => {
												addToOrder(product)
											}}
										></i>
									</div>
								</div>
							)
						})
					}
				</div>
				<div className='order-card'>
					<h4>Detalles de la Orden</h4>
					<div className='table-productos'>
						{order.length > 0 ?
							<table>
								<thead>
									<tr>
										<td>Cantidad</td>
										<td>Descripción</td>
										<td>Subtotal</td>
									</tr>
								</thead>
								<tbody>
									{order.map(orderItem => {
										return (
											<tr key={orderItem.product.id}>
												<td>{orderItem.amount}</td>
												<td>{orderItem.product.name}</td>
												<td>${(orderItem.product.sale_price * orderItem.amount).priceFormat()}</td>
											</tr>
										)
									})}
									<tr>
										<td className='blank-td'></td>
										<td className='blank-td'>Total</td>
										<td className='blank-td'>${total.priceFormat()}</td>
									</tr>
								</tbody>
							</table>
							:
							'Aún no ha agregado ningún producto a la orden'
						}
					</div>

					<div className='ticket-toggle'>
						<label className="form-check-label" >Imprimir ticket</label>
						<label className="switch">
							<input type="checkbox" checked={orderDetails.printTicket} onChange={() => {
								setOrderDetails(prevOrderDetails => {
									return {
										...prevOrderDetails,
										printTicket: !prevOrderDetails.printTicket
									}
								})
							}} />
							<span className="slider round"></span>
						</label>
					</div>
					<div className='ticket-toggle'>
						<label className="form-check-label" >Es Becario</label>
						<label className="switch">
							<input type="checkbox" checked={orderDetails.isScholarship} onChange={() => {
								setOrderDetails(prevOrderDetails => {
									return {
										...prevOrderDetails,
										isScholarship: !prevOrderDetails.isScholarship,
										name: ''
									}
								})
								setIncome(prevIncome => {
									return {
										...prevIncome,
										scholarship_id: null
									}
								})
							}} />
							<span className="slider round"></span>
						</label>
					</div>

					{orderDetails.isScholarship ?
						<>
							<AutocompleteField
								name='scholarship_id'
								iconClasses='fa-solid fa-user'
								className='becario-input'
								placeholder='Nombre del becario'
								options={scholarshipsNames}
								onChange={(selectedScholarship) => {
									setOrderDetails(prevOrderDetails => {
										return {
											...prevOrderDetails,
											scholarshipName: selectedScholarship.label
										}
									})
									setIncome(prevIncome => {
										return {
											...prevIncome,
											scholarship_id: selectedScholarship.id
										}
									})
								}}
							/>
							<ErrorMessage validation={validations.scholarship}/>
						</>
						:
						<>
							<FormField
								name='name'
								inputType='text'
								iconClasses='fa-solid fa-user'
								placeholder='Nombre'
								value={orderDetails.name}
								onChange={(event) => {
									setOrderDetails(prevOrderDetails => {
										return {
											...prevOrderDetails,
											name: event.target.value
										}
									})
								}}
								onBlur={validateOne}
							/>
							<ErrorMessage validation={validations.name}/>
						</>
					}




					<textarea
						name="note"
						cols="30"
						rows="5"
						placeholder='Notas'
						value={income.note}
						onChange={handleInputChange}
						onBlur={validateOne}
					></textarea>
					<ErrorMessage validation={validations.note}/>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-danger'
							onClick={() => {
								setOrder([])
								setOrderDetails({
									name: '',
									scholarshipName: '',
									printTicket: false,
									isScholarship: false})
								setIncome((prevIncome) => {
									return {
										...prevIncome,
										scholarship_id: null,
										total: 0,
										note: ''
									}
								})
							}}
						>
							Cancelar
						</button>
						<PrintButton
							order={order} 
							orderDetails={orderDetails} 
							onClick={sellProduct}
						/>
					</div>
				</div>

			</div>
		</div>
	)
}

export default Menu