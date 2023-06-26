import React from 'react'
import NavigationTitle from '../components/NavigationTitle'
import AccordionHelp from '../components/AccordionHelp'

const Help = () => {
	return (
		<>
			<NavigationTitle
				menu='Inicio'
				submenu='Ayuda'
			/>

			<AccordionHelp 
				question={'¿Cómo se compone un RFC?'} 
				answer={
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
			/>

			<AccordionHelp
				question={'¿Hasta qué fechas se puede registrar un estudiante como becario?'}
				answer={
					'Es posible hasta un año máximo y mínimo con respecto al año actual.' + 
					'Por ejemplo, si estamos a 2 de octubre de 2019, el año máximo es hasta el 2 ' + 
					'de octubre de 2020 y el año mínimo es hasta el 2 de octubre de 2018.'
				}
			/>

			<AccordionHelp
				question={'¿Por qué no me permite ingresar el precio exacto?'}
				answer={
					'El sistema está configurado para que el precio no exceda más de 2 ' + 
					'decimales, por lo que redondeará hacia arriba o abajo a partir de la mitad. ' +
					'Por ejemplo, si ingresa 12.245 se redondea a 12.24, pero si ingresa ' +
					'12.2451 se redondea a 12.25.'
				}
			/>

			<AccordionHelp
				question={'¿Es obligatorio registrar un becario cuando se realiza el pago de un platillo?'}
				answer={
					'Solo es obligatorio si habilita la opción \'Es bcario\'.'
				}
			/>

			<AccordionHelp
				question={'¿Puedo registrar nuevos platillos al menú'}
				answer={
					'Por el momento no. Solo se puede registrar productos para los egresos por ' +
					'parte del administrador.'
				}
			/>
		</>
	)
}

export default Help