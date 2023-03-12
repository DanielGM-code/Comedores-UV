import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Content = () => {
	const navigate = useNavigate()
	const [token, setToken] = useState(undefined)

	useEffect(() => {
		setToken(sessionStorage.getItem('loggedUser'))
	}, [])

	return !token ? (navigate("/login")) : (<Outlet /> )
}

export default Content