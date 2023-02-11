
const crearDataTable = async (configTable = {}) => {
    if(configTable.id == undefined) { // si el id de la tabla llega vacio devolvemos un vacio
		alert("El Id de la tabla es necesario")
		return '';
	}

    // la configuraciones necesarias para el dataTable
	let configuraciones = {
		"responsive": true,
		"bDestroy": true,
		"language": await language_ES(),
		"pageLength": 10,
	};

	// si quiere que el dataTable tenga peticiones ajax
	if(configTable.ajax == true && $(`#${configTable.id} thead tr:last th`).length == configTable.columns?.length) {
        configuraciones.columns = configTable.columns;
       
		configuraciones.ajax = {
			"url": configTable.url,
		}

		// si requiere activar el serverSide a la tabla que quiere convertir en dataTable
		if(configTable.serverSide == true) {
			configuraciones.serverSide = true;

			configuraciones.ajax.dataFilter = function(data){
				let arrData = JSON.parse( data ); // obtenemos la data del controlador
				
				let json = {};
				json.recordsTotal = arrData.recordsTotal;
				json.recordsFiltered = arrData.recordsTotal;
				
				if(typeof arrData.recordsFiltered == 'number'){
					json.recordsFiltered = arrData.recordsFiltered;
				}
				
				json.data = arrData.data;
				
				return JSON.stringify( json );
			}
		}else {
			configuraciones.ajax.dataSrc = "";
		}
	}

	if(configTable.columnDefs != undefined && typeof configTable.initComplete == "function") {
		configuraciones.initComplete	= function() {
			configTable.initComplete(table);
		};
	}
	
	// validamos las columnDefs si existe o no tra nada
	if(configTable.columnDefs != undefined && configTable.columnDefs.length > 0) {
		configuraciones.columnDefs	= configTable.columnDefs;
	}

	// validamos si requiere el scroll en el listado
	if(configTable.scroll == true) {
		configuraciones.autoWidth		= true;
		configuraciones.scrollX 		= "auto";
		configuraciones.scrollY 		= configTable.scrollY;
		configuraciones.scrollCollapse 	= true;

		// a la tabla le colocamos que siempre sea el 100%
		$(`#${configTable.id}`).css("width", "100%");
	}

	// si queremos quitar o colocar el paginado de la tabla
	configuraciones.paging = (configTable.paging == true || configTable.paging == false) ? configTable.paging : true;

	// si queremos quitar o colocar la busqueda de la tabla
	configuraciones.searching = (configTable.searching == true || configTable.searching == false) ? configTable.searching : true;

	// si queremos quitar o colocar la informacion de la tabla
	configuraciones.info = (configTable.info == true || configTable.info == false) ? configTable.info : true;
	
	// si queremos quitar o el ordenado de la tabla
	configuraciones.ordering = (configTable.ordering == true || configTable.ordering == false) ? configTable.ordering : true;
	
	// si queremos ordenar de la tabla
	configuraciones.order = (configTable.orderColumns != undefined) ? configTable.orderColumns : [];

	setTimeout(() => { // si aparece el scrollX le damos un espacion al final del encabezado
		$(`#${configTable.id}`).DataTable().columns.adjust();
        $(`#${configTable.id}_filter`).css("margin-bottom", "8px")
	}, 100);

	// devolvemos el dataTable con todas las configuraciones necesarias solicitadas
	const table =  $(`#${configTable.id}`).DataTable(configuraciones);

	return table;
}

const language_ES = async ()  => {
    return {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
        }
    }
}