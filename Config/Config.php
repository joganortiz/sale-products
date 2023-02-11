<?php

    const BASE_URL = "http://localhost/pruebaConekta";

	//Zona horaria
	date_default_timezone_set('America/Bogota');

	//Datos de conexión a Base de Datos
	const DB_HOST = "localhost";
	const DB_NAME = "pruebaconeckta";
	const DB_USER = "root";
	const DB_PASSWORD = "";
	const DB_CHARSET = "utf8";

	//DATOS PARA INCREPTION DE VARIABLES
	const nombreEmpresa = "Tienda";
	const intentosFallidos = 5;
	const mensaje_aviso_bloqueo = 4;

	//Deliminadores decimal y millar Ej. 24,1989.00
	const SPD = ",";
	const SPM = ".";

	const SMONEY = 'COP';