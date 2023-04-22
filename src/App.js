import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import Home from './pages/Home';
import Incomes from './pages/Incomes';
import Expenses from './pages/Expenses';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Menu from './pages/Menu';
import Users from './pages/Users';
import Scholarships from './pages/Scholarships';
import Providers from './pages/Providers';
import Help from './pages/Help';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />} >
					<Route index element={<Home />} />
					<Route path='incomes' element={<Incomes />} />
					<Route path='expenses' element={<Expenses />} />
					<Route path='products' element={<Products />} />
					<Route path='reports' element={<Reports />} />
					<Route path='menu' element={<Menu />} />
					<Route path='users' element={<Users />} />
					<Route path='scholarships' element={<Scholarships />} />
					<Route path='providers' element={<Providers/>}/>
					<Route path='help' element={<Help />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;