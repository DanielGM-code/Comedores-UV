import React from 'react'
import NavigationTitle from '../components/NavigationTitle'
import Accordion from '../components/Accordion'

const Help = () => {
	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Ayuda'
			/>

			<Accordion
				title={'¿Cómo se compone un RFC?'} 
				content={
					'El RFC se compone de 12 caracteres:' +
					'\n	>	Primero de 3 letras mayúsculas.' +
					'\n		*	Solo puede contener de A-Z, la letra Ñ y el símbolo &.' +
					'\n	>	Seguido de la fecha en formato AAMMDD.' +
					'\n		*	DD representa 2 dígitos del día.' +
					'\n		*	MM representa 2 dígitos del mes.' +
					'\n		*	AA representa 2 dígitos del año.' +
					'\n	>	Seguido del primer cáracter diferenciador de homonimia.' +
					'\n		*	Solo puede contener una letra de A-V o un dígito de 1-9.' +
					'\n		*	No incluye la letra Ñ, la letra Z y el cero.' +
					'\n	>	Seguido del segundo cáracter diferenciador de homonimia.' +
					'\n		*	Solo puede contener una letra de A-Z o un dígito de 1-9.' +
					'\n		*	No incluye la letra Ñ y el cero.' +
					'\n	>	Seguido del dígito verificador.' +
					'\n		*	Sólo puede contener un dígito del 0-9 o la letra A.'
				}
				id={'collapseOne'}
			/>

			<Accordion
				title={'¿Qué hago en caso de no conocer el RFC?'}
				content={'Debe de escribir únicamente al menos un signo de interrogación.'}
				id={'collapseTwo'}
			/>

			<Accordion
				title={'¿Hasta qué fechas se puede registrar un estudiante como becario?'}
				content={
					'Es posible hasta un año máximo y mínimo con respecto al año actual.' + 
					'Por ejemplo, si estamos a 2 de octubre de 2019, el año máximo es hasta el 2 ' + 
					'de octubre de 2020 y el año mínimo es hasta el 2 de octubre de 2018.'
				}
				id={'collapseThree'}
			/>

			<Accordion
				title={'¿Por qué no me permite ingresar el precio exacto?'}
				content={
					'El sistema está configurado para que el precio no exceda más de 2 ' + 
					'decimales, por lo que redondeará hacia arriba o abajo a partir de la mitad. ' +
					'Por ejemplo, si ingresa 12.245 se redondea a 12.24, pero si ingresa ' +
					'12.2451 se redondea a 12.25.'
				}
				id={'collapseFour'}
			/>

			<Accordion
				title={'¿Es obligatorio registrar un becario cuando se realiza el pago de un platillo?'}
				content={'Solo es obligatorio si habilita la opción \'Es becario\'.'}
				id={'collapseFive'}
			/>

			<Accordion
				title={'¿Puedo registrar nuevos platillos al menú'}
				content={
					'Por el momento no. Solo se puede registrar productos para los egresos por ' +
					'parte del administrador.'
				}
				id={'collapseSix'}
			/>

			<Accordion
				title={'¿Existe algún manual de usuario?'}
				content={'Por supuesto. Accediendo a este enlace.'}
				id={'collapseSeven'}
			/>
		</>
	)
}

export default Help