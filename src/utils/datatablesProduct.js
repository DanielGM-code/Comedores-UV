export const datatableOptions = {
	scrollX: true,
	ordering: true,
	destroy: true,
	searching: true,
	sorting: true,
	dom:'Bfritp',
	order: [],
	language: {
		'processing': 'Procesando...',
		'lengthMenu': 'Mostrar _MENU_ registros',
		'zeroRecords': 'No se encontraron resultados',
		'emptyTable': 'Ningún dato disponible en esta tabla',
		'infoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
		'infoFiltered': '(filtrado de un total de _MAX_ registros)',
		'search': '',
		searchPlaceholder: 'Buscar',
		'infoThousands': ',',
		'loadingRecords': 'Cargando...',
		'paginate': {
			'first': 'Primero',
			'last': 'Último',
			'next': 'Siguiente',
			'previous': 'Anterior'
		},
		'aria': {
			'sortAscending': ': Activar para ordenar la columna de manera ascendente',
			'sortDescending': ': Activar para ordenar la columna de manera descendente'
		},
		'buttons': {
			'copy': 'Copiar',
			'colvis': 'Visibilidad',
			'collection': 'Colección',
			'colvisRestore': 'Restaurar visibilidad',
			'copyKeys': 'Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br /> <br /> Para cancelar, haga clic en este mensaje o presione escape.',
			'copySuccess': {
				'1': 'Copiada 1 fila al portapapeles',
				'_': 'Copiadas %ds fila al portapapeles'
			},
			'copyTitle': 'Copiar al portapapeles',
			'csv': 'CSV',
			'excel': 'Excel',
			'pageLength': {
				'-1': 'Mostrar todas las filas',
				'_': 'Mostrar %d filas'
			},
			'pdf': 'PDF',
			'print': 'Imprimir',
		},
		'decimal': ',',
		'searchBuilder': {
			'add': 'Añadir condición',
			'button': {
				'0': 'Constructor de búsqueda',
				'_': 'Constructor de búsqueda (%d)'
			},
			'clearAll': 'Borrar todo',
			'condition': 'Condición',
			'conditions': {
				'date': {
					'after': 'Despues',
					'before': 'Antes',
					'between': 'Entre',
					'empty': 'Vacío',
					'equals': 'Igual a',
					'notBetween': 'No entre',
					'notEmpty': 'No Vacio',
					'not': 'Diferente de'
				},
				'number': {
					'between': 'Entre',
					'empty': 'Vacio',
					'equals': 'Igual a',
					'gt': 'Mayor a',
					'gte': 'Mayor o igual a',
					'lt': 'Menor que',
					'lte': 'Menor o igual que',
					'notBetween': 'No entre',
					'notEmpty': 'No vacío',
					'not': 'Diferente de'
				},
				'string': {
					'contains': 'Contiene',
					'empty': 'Vacío',
					'endsWith': 'Termina en',
					'equals': 'Igual a',
					'notEmpty': 'No Vacio',
					'startsWith': 'Empieza con',
					'not': 'Diferente de',
					'notContains': 'No Contiene',
					'notStartsWith': 'No empieza con',
					'notEndsWith': 'No termina con'
				},
				'array': {
					'not': 'Diferente de',
					'equals': 'Igual',
					'empty': 'Vacío',
					'contains': 'Contiene',
					'notEmpty': 'No Vacío',
					'without': 'Sin'
				}
			},
			'data': 'Data',
			'deleteTitle': 'Eliminar regla de filtrado',
			'leftTitle': 'Criterios anulados',
			'logicAnd': 'Y',
			'logicOr': 'O',
			'rightTitle': 'Criterios de sangría',
			'title': {
				'0': 'Constructor de búsqueda',
				'_': 'Constructor de búsqueda (%d)'
			},
			'value': 'Valor'
		},
		'searchPanes': {
			'clearMessage': 'Borrar todo',
			'collapse': {
				'0': 'Paneles de búsqueda',
				'_': 'Paneles de búsqueda (%d)'
			},
			'count': '{total}',
			'countFiltered': '{shown} ({total})',
			'emptyPanes': 'Sin paneles de búsqueda',
			'loadMessage': 'Cargando paneles de búsqueda',
			'title': 'Filtros Activos - %d',
			'showMessage': 'Mostrar Todo',
			'collapseMessage': 'Colapsar Todo'
		},
		'thousands': '.',
		'info': 'Mostrando _START_ a _END_ de _TOTAL_ registros',
	},
	buttons: [
		'csv','copy'
	]
}