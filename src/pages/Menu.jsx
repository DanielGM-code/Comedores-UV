import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import NavigationTitle from '../components/NavigationTitle'
import Alert from '../components/Alert'
import { readAllProducts } from '../data-access/productsDataAccess'
import { QUERY_OPTIONS } from '../utils/useQuery'
import '../css/menu.css'
import '../utils/formatting'
import FormField from '../components/FormField'
import PrintButton from '../components/PrintButton'
import { readAllScholarships } from '../data-access/scholarshipsDataAccess'
import { useMutation, useQueryClient } from 'react-query'
import { createIncomeMutation, CREATE_MUTATION_OPTIONS } from '../utils/mutations'
import AutocompleteField from '../components/AutocompleteField'
import MenuFormValidator from '../validations/MenuFormValidator'
import ConfirmModal from '../components/ConfirmModal'
import ProductsMenu from '../components/ProductsMenu'
import TextAreaField from '../components/TextAreaField'
import TabMenu from '../components/TabMenu'
import ToggleButton from '../components/ToggleButton'

const Menu = () => {
	const [isShowing, setIsShowing] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState('Alimentos')
	const [order, setOrder] = useState([])
	const [orderDetails, setOrderDetails] = useState({
		name: '',
		scholarshipName: '',
		printTicket: false,
		isScholarship: false,
		payment: '',
		change: 0
	})
	const [income, setIncome] = useState({
		user_id: null,
		scholarship_id: null,
		note: '',
		date: new Date().formatted(),
		details: [],
		total: 0
	})
	const [validations, setValidations] = useState({
		name: null,
		scholarship: null,
		note: null,
		orders: null,
		payment: null
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

	const total = useRef()

	const scholarshipsNames = useMemo(() => {
		return scholarships ? scholarships.map((scholarship) => {
			return {
				id: scholarship.id, 
				label: `${scholarship.first_name} ${scholarship.last_name}`
			}
		}) : []
	}, [scholarships])
	const filteredProducts = useMemo(() => {
		return products ? products.filter(product => product.product_type === selectedCategory) : []
	}, [products, selectedCategory])

	const validateAll = () => {
		const { scholarship_id, note } = income
		const { name, isScholarship, payment } = orderDetails
		const validations = { name: null, scholarship: null,
			note: null, orders: null, payment: null
		}

		validations.scholarship = MenuFormValidator(scholarship_id).scholarshipIdValidator(isScholarship, scholarships)
		validations.note = MenuFormValidator(note).noteValidator(note)
		validations.name = MenuFormValidator(name).nameValidator(isScholarship)
		validations.orders = MenuFormValidator(order).orderValidator()
		validations.payment = MenuFormValidator(payment).paymentValidator(total.current)

		const validationMessages = Object.values(validations).filter(
			(validationMessage) => validationMessage != null
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

		if(name === 'name') message = MenuFormValidator(orderDetails[name]).nameValidator(orderDetails.isScholarship)
		if(name === 'note') message = MenuFormValidator(income[name]).noteValidator()
		if(name === 'payment') message = MenuFormValidator(orderDetails[name]).paymentValidator(total.current)

		setValidations({ ...validations, [name]: message})
	}

	function restartOrder(){
		setOrder([])
		setOrderDetails({
			name: '',
			scholarshipName: '',
			printTicket: false,
			isScholarship: false,
			payment: '',
			change: 0
		})
		setIncome({
			user_id: null,
			scholarship_id: null,
			date: new Date().formatted(),
			note: '',
			total: 0
		})
	}

	function handleInputChange(event) {
		setIncome(prevIncome => {
			return {
				...prevIncome,
				[event.target.name]: event.target.value
			}
		})
	}

	async function submitIncome(){
		const isValid = validateAll();

		if(!isValid) return false

		await createMutation.mutateAsync(income)
		createMutation.reset()

		setOrderDetails(prevOrderDetails => {
			return {
				...prevOrderDetails,
				change: prevOrderDetails.payment - total.current
			}
		})

		setIsShowing(true)
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
			<div className='contenedor-tabla'>
				<NavigationTitle
					menu='Inicio'
					submenu='Menú'
				/>

				<TabMenu
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
				/>
				
				<ProductsMenu
					title='Deatlles de la Orden'
					total={total.current}
					filteredProducts={filteredProducts}
					order={order}
					setOrder={setOrder}
					isLoading={isLoading}
					isIncome={true}
					isScholarship={orderDetails.isScholarship}
				>
					<ToggleButton
						title='Imprimir ticket'
						isChecked={orderDetails.printTicket}
						onChange={() => {
							setOrderDetails(prevOrderDetails => {
								return {
									...prevOrderDetails,
									printTicket: !prevOrderDetails.printTicket
								}
							})
						}}
					/>

					<ToggleButton
						title='Es Becario'
						isChecked={orderDetails.isScholarship}
						onChange={() => {
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
							setValidations(prevValidations => {
								return {
									...prevValidations,
									name: null,
									scholarship: null
								}
							})
						}}
					/>

					{orderDetails.isScholarship ?
                        <>
                            <AutocompleteField
                                name='scholarship_id'
                                iconClasses='fa-solid fa-user'
                                className='becario-input'
                                placeholder='Nombre del becario'
                                options={scholarshipsNames}
								selectedOption={undefined}
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
                            <Alert 
                                typeAlert='alert alert-warning'
                                validation={validations.scholarship}
                            />
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
                            <Alert 
                                typeAlert='alert alert-warning'
                                validation={validations.name}
                            />
                        </>
                    }

					<FormField
                        name='payment'
                        inputType='number'
                        iconClasses='fa-solid fa-dollar-sign'
                        placeholder='Se paga con ...'
                        value={orderDetails.payment}
                        onChange={(event) => {
                            setOrderDetails(prevOrderDetails => {
                                return {
                                    ...prevOrderDetails,
                                    payment: event.target.value
                                }
                            })
                        }}
                        onBlur={validateOne}
                    />
                    <Alert
                        typeAlert='alert alert-warning'
                        validation={validations.payment}
                    />

					<TextAreaField
						name='note'
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
                                restartOrder()
                            }}
                        >
                            Cancelar
                        </button>

                        <PrintButton
                            order={order} 
                            orderDetails={orderDetails} 
                            onClick={submitIncome}
                        />
                    </div>
				</ProductsMenu>
			</div>

			<ConfirmModal
				cancelAction={() => {
					restartOrder()
				}}
				isShowingModal={isShowing}
				setIsShowingModal={setIsShowing}
				object={orderDetails}
			/>
		</>
	)
}

export default Menu