import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarButton from '../components/SidebarButton'
import '../css/layout.css'
import '../css/botones.css'
import '../css/datatable.css'

export const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	function toggleSidebar() {
		setIsSidebarOpen(oldIsSidebarOpen => !oldIsSidebarOpen)
	}

	return (
		<>
			<div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
				<div className='logo-detalles' onClick={toggleSidebar}>
					<div className='logo_nombre'>COMEDORES</div>

					<i 
						className={`bx ${isSidebarOpen ? 'bx-menu-alt-right' : 'bx-menu'}`} 
						id='btn'
					></i>
				</div>
				<ul className='nav-lista'>
					{/* Home */}
					<SidebarButton
						to='/'
						iconClasses='fa-solid fa-house'
						label='Inicio'
					/>

					{/* Users */}
					<SidebarButton
						to='/users'
						iconClasses='bi bi-people-fill'
						label='Usuarios'
					/>

					{/* Scholarships */}
					<SidebarButton
						to='/scholarships'
						iconClasses='bi bi-person-plus-fill'
						label='Becarios'
					/>

					{/* Incomes */}
					<SidebarButton
						to='/incomes'
						iconClasses='fa-solid fa-money-bill-trend-up'
						label='Ingresos'
					/>

					{/* Expenses */}
					<SidebarButton
						to='/expenses'
						iconClasses='fa-solid fa-money-bill-transfer'
						label='Egresos'
					/>

					{/* Reports */}
					<SidebarButton
						to='/reports'
						iconClasses='fa-solid fa-square-poll-vertical'
						label='Reportes'
					/>

					{/* Menu */}
					<SidebarButton
						to='/menu'
						iconClasses='fa-solid fa-store'
						label='Menú'
					/>

					{/* Products */}
					<SidebarButton
						to='/products'
						iconClasses='fa-solid fa-boxes-stacked'
						label='Productos'
					/>

					{/* Providers */}
					<SidebarButton
						to='/providers'
						iconClasses='fa fa-archive'
						label='Proveedores'
					/>
					
					{/* Help */}
					<SidebarButton
						to='/help'
						iconClasses='fa-solid fa-circle-question'
						label='Ayuda'
					/>

					{/* User Info */}
					<li className='perfil'>
						<div className='perfil-detalles'>
							<div>
								<div className='perfil_nombre'>Daniel García</div>
								
								<div className='perfil_correo'><br /> GarDB_45@gmail.com</div>
							</div>
						</div>

						<i className='bx bx-log-out' id='log_out'></i>
					</li>
				</ul>

			</div>

			<section className='main-seccion'>
				<Outlet />
			</section>
		</>
	)
}
