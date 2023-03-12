import { Player } from '@lottiefiles/react-lottie-player'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../css/login.css'
import { login } from '../data-access/authentication'

const Login = () => {
	const [user, setUser] = useState({
		username: "",
		password: ""
	})
	const navigate = useNavigate()

	function handleInputChange(event) {
		setUser(prevUser => {
			return {
				...prevUser,
				[event.target.name]: event.target.value
			}
		})
	}

	return (
		<div className='login-container'>
			<div className='title'>
				<img className='logo' src="http://colaboracion.uv.mx/afbg-combas/imagenespublicas/FlorconUV1024x768SinFondo.png" alt="" srcset="" />
				<h1>Comedores Universidad Veracruzana</h1>
				<h5 className='mb-3'>¡Bienvenido! Debes iniciar sesión para usar este servicio.</h5>
			</div>
			<div className='login-card'>


				<div className='login-card-content'>

					<div className='formulario'>
				<h2 >Inicio de Sesión</h2>
						<h4 className='mt-2'>Usuario</h4>
						<input
							type="text"
							name='username'
							value={user.username}
							onChange={handleInputChange}
						/>
						<h4 className='mt-3'>Contraseña</h4>
						<input
							type="password"
							name='password'
							value={user.password}
							onChange={handleInputChange}
						/>
						<button
							onClick={async () => {
								if (user.username == "") {
									toast("Campo de usuario vacío!", {
										type: "warning"
									})
									return
								}

								if (user.password == "") {
									toast("Campo de contraseña vacío!", {
										type: "warning"
									})
									return
								}

								try {
									let token = await login(user)
									sessionStorage.setItem('loggedUser', token)
									navigate("/")
								} catch (error) {
									console.log('Credenciales incorrectas');
									toast(error, {
										type: "error"
									})
								}
							}}
						>Iniciar Sesión</button>
					</div>
					<Player 
						className='lottie'
						autoplay
						loop
						background='transparent'
						src='https://assets8.lottiefiles.com/temp/lf20_nXwOJj.json'
						renderer='svg'
					>
					</Player>
				</div>
			</div>

		</div>

	)
}

export default Login