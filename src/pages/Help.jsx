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
					'El RFC puede ser para una persona física o moral.' + 
					'Para el caso de una persona moral se compone de 12 caracteres:' +
					'\n	>	Primero de 3 caracteres mayúsculas.' +
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
					'\n		*	Sólo puede contener un dígito del 0-9 o la letra A.' +
					'\n\nPor otro lado, para una persona física se compone de 13 dígitos:' +
					'\n	>	Primero de 4 caracteres mayúsculas' +
					'\n		*	Solo puede contener de A-Z, la letra Ñ y el símbolo &.' +
					'\n	>	El resto de los caractes es igual al de la persona moral.' +
					'\nAdemás, para una persona física se excluyen las siguientes palabras:' +
					'\nBUEI, BUEY, CACA, CACO, CAGA, CAGO, CAKA, CAKO, COGE, COJA, COJE, ' +
					'COJI, COJO, CULO, FETO, GUEY, JOTO, KACA, KACO, KAGA, KAGO, KOGE, KOJO, ' +
					'KAKA, KULO, MAME, MAMO, MEAR, MEAS, MEON, MION, MOCO, MULA, PEDA, PEDO, ' +
					'PENE, PUTA, PUTO, QULO, RATA, RUIN'
				}
				id={'collapse1'}
			/>

			<Accordion
				title={'¿Cuál es el formato del correo electrónico del usuario?'}
				content={
					'El correo se compone de la siguiente manera:' +
					'\n	>	La primera sección puede tener letras, números y caracteres especiales.' +
					'\n		*	Los caracteres especiales son: .!#$%&*+/=?^_~-' +
					'\n	>	Seguido del arroba (@)' +
					'\n	>	Seguido de la segunda sección que contiene dominios como gmail.com, ' +
					'hotmail.com, uv.mx, ...'
				}
				id={'collapse2'}
			/>

			<Accordion
				title={'¿Cuál es el formato del teléfono del proveedor?'}
				content={
					'Se aceptan 10 dígitos separados por espacios blancos, puntos o ' +
					'guiones, en las siguientes maneras:' +
					'\n	>	xx xxxx xxxx' +
					'\n		*	Primera sección de 2 dígitos (seguido de un espacio).' +
					'\n		*	Segunda sección de 4 dígitos (seguido de un espacio).' +
					'\n		*	Tercera sección de 4 dígitos.' +
					'\n	>	xxx xxx xxxx' +
					'\n		*	Primera sección de 3 dígitos (seguido de un espacio).' +
					'\n		*	Segunda sección de 3 dígitos (seguido de un espacio).' +
					'\n		*	Tercera sección de 4 dígitos.' +
					'\ndonde x representa un número del 0 al 9.'
				}
				id={'collapse3'}
			/>

			<Accordion
				title={'¿Hasta qué fechas se puede registrar un estudiante como becario?'}
				content={
					'Es posible hasta un año máximo y mínimo con respecto al año actual.' + 
					'Por ejemplo, si estamos a 2 de octubre de 2019, el año máximo es hasta el 2 ' + 
					'de octubre de 2020 y el año mínimo es hasta el 2 de octubre de 2018.'
				}
				id={'collapse4'}
			/>

			<Accordion
				title={'¿Es obligatorio escribir todos los precios del producto?'}
				content={
					'Sí. Sin embargo, en caso de no requerirlo debe escribir un cero.' +
					'\n\nNOTA: También aplica al stock.'
				}
				id={'collapse5'}
			/>

			<Accordion
				title={'¿Cómo registro el precio exacto?'}
				content={
					'El sistema está configurado para que el precio no exceda más de 2 ' + 
					'decimales, por lo que redondeará hacia arriba o abajo a partir de la mitad. ' +
					'Por ejemplo, si ingresa 12.245 se redondea a 12.24, pero si ingresa ' +
					'12.2451 se redondea a 12.25.' +
					'\n\nNOTA: El sistema no toma en cuenta los ceros al principio y fin de un número ' +
					'o ambos, por ejemplo, 0009 se guardará como 9 ó 9.1000 se guardará como 9.1'
				}
				id={'collapse6'}
			/>

			<Accordion
				title={'¿Cómo puedo registrar más menús?'}
				content={
					'Se puede desde la página \'Productos\' y acceda al formulario. Desde ' +
					' el campo \'Tipo de producto\', donde se aceptan \'Dulcería\', ' +
					'\'Bebidas\' y \'Alimentos\'. Sólo son registrados por el administrador.' +
					'\n\nNOTA: Cuidar acentos y mayúsculas.'
				}
				id={'collapse7'}
			/>

			<Accordion
				title={'¿Cómo puedo agregar más productos relacionados a los egresos?'}
				content={
					'Se puede desde la página \'Productos\' y acceda al formulario. Desde ' +
					'el campo \'Tipo de producto\', debe ser diferente de \'Dulcería\',' +
					'\'Bebidas\' y \'Alimentos\'. Sólo son registrados por el administrador.' + 
					'\n\nNOTA: Cuidar acentos y mayúsculas.'
				}
				id={'collapse8'}
			/>

			<Accordion
				title={'¿Por qué no se muestra el stock de los productos del egreso?'}
				content={
					'Para mostrar la cantidad de cada producto se aumenta o disminuye ' +
					'el contador del producto, ya que con eso se calcula el total del egreso.'
				}
				id={'collapse9'}
			/>

			<Accordion
				title={'¿El formulario de ingreso y el formulario de venta de menús es lo mismo?'}
				content={
					'No. En el formulario de ingreso se registra únicamente el ingreso, ' + 
					'mientras que en el formulario de venta toma en cuenta el registro del ingreso ' +
					'junto con el proceso de pago e impresión de ticket.'
				}
				id={'collapse10'}
			/>

			<Accordion
				title={'¿Es obligatorio registrar un becario cuando se realiza el pago de un menú?'}
				content={'Solo es obligatorio si habilita la opción \'Es becario\'.'}
				id={'collapse11'}
			/>

			<Accordion
				title={'¿Es obligatorio registrar un becario cuando se registra un ingreso?'}
				content={'No, a menos que habilite la opción \'Con becario\'.'}
				id={'collapse12'}
			/>

			<Accordion
				title={'¿Por qué no se registra el nombre de un estudiante al registrar un ingreso?'}
				content={'Eso solo aplica cuando se imprima el ticket.'}
				id={'collapse13'}
			/>

			<Accordion
				title={'¿Existe algún manual de usuario?'}
				content={'Por supuesto. Accediendo a este enlace.'}
				id={'collapse14'}
			/>
		</>
	)
}

export default Help