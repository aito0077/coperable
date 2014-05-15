ng.Language.set_language('en', {
	direction: 'ltr',
	
	numbers: ['0','1','2','3','4','5','6','7','8','9'],
	numbers_ordinal: ['st', 'nd', 'rd', 'th'],
	
	date: {
		date_format: 'm/d/Y',
		time_format: 'h:i A',
		
		days:{
			'char':['D','L','M','M','J','V','S'],
			short:['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
			mid:['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],
			'long':['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
		},
		months:{
			short:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
			'long':['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
		},
		am_pm:{
			lowercase:['am','pm'],
			uppercase:['AM','PM']
		}
	},
	
	yes: 'Si',
	no: 'No',
	
	'open': 'Abrir',
	'close': 'Cerrar',
	clear: 'Limpiar'
});

