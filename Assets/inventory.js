
document.write(`<script src="${base_url}/Assets/datatable.js"></script>`);
document.write(`<script src="${base_url}/Assets/alerts.js"></script>`);
var idProducto = '';
$(document).ready(function () {
    $("nav a:nth-of-type(2)").hide();
    $("nav .offcanvas-end, nav button").remove();

    listProducts();

    $("button[data-control=category]").click(function (e) { 
        cleanForm("formCategory");
        $("#category .modal-header h5").html("Crear Categoría");
        validateFieldsCategory()
    });

    $("button[data-control=product]").click(function (e) { 
        cleanForm("formProduct");
        $("#category .modal-header h5").html("Crear Producto");

        validateFieldsProduct();
        listarCategoriesSelect();
    });
});

/************************************* Procesos de Productos *************************************/

/**
 * @description Listar todos los productos
 */
const listProducts = async () => {
    // quitar el onclick del modulo en el que estamos y agregamos el click al otro modulo
    $("#productos-tab").removeAttr("onclick");
    $("#categorias-tab").attr("onclick", "listCategories();");

    const configTable = {
        id: "listadoProductos",
        ajax: true,
        url: base_url + '/Inventory/getProductos',
        serverSide: true,
        columns:  [
            { "data": "nombre" },
            { "data": "referencia" },
            { "data": "precio" },
            { "data": "peso" },
            { "data": "categoria"},
            { "data": "stock" },
            { "data": "fecha" },
            { "data": function(data) {
                    return `
                        <button type="button" class="btn btn-warning btn-sm edit-product" data-control="${data.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm remove-product" data-control="${data.id}" data-name="${data.nombre}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                        </button>
                    `;
                } 
            },
        ],
        columnDefs: [
            {
                className: "text-center",
                targets: "_all",
            },
            {
                orderable: !1,
                targets: [7],
            }
        ],
        scroll: true,
        scrollY: "290px"
    }

    // creamos el listado de los productos
    const table = await crearDataTable(configTable);

    table.on('draw', function() {
        //editar un producto por ID
        $(".edit-product").on("click", async function() {
            const id        = $(this).attr('data-control');

            await listProductId(id);
        });

        // eliminar un producto por ID
        $(".remove-product").on("click", async function() {
            const id        = $(this).attr('data-control');
            const nombre    = $(this).attr('data-name');

            await removeProductId(table, id, nombre);
        });
    });
}

/**
 * @description Listar los datos del producto por ID
 * @param {string} id 
 * @returns 
 */
const listProductId = async (id = "") => {
    if( id == "") return false;

    alertSweetTimer();

    $.ajax({
        type: "GET",
        url: base_url + '/Inventory/getProductId/'+id,
        dataType: "json",
        success: function (response) {
            setTimeout( async() => {
                await Swal.close();
                await cleanForm("formProduct");
                $("#idProduct").val(response.data.id);

                $("#product .modal-header h5").html("Editar Producto");
                $("#txtName").val(response.data.nombre);
                $("#txtReference").val(response.data.referencia);
                $("#txtPrice").val(response.data.precio);
                $("#txtWeight").val(response.data.peso);
                $("#txtStock").val(response.data.stock);

                await listarCategoriesSelect(response.data.categoria);
                $("#product").modal('show');


                validateFieldsProduct(response.data.id);
            }, 500);
        },
        error: function (error) {
            setTimeout(() => {
                if(error.status == 400) {
                    toastSwal("warning", error.responseJSON.msg);
                }else {
                    toastSwal("error", error.responseJSON.msg)
                }
            }, 500);
        }
    });
}

/**
 * @description Valida los campos del formulario del producto
 * @param {string} id 
 */
const validateFieldsProduct = async (id = "") => {

    const btnForm   = $("#btnFormProduct");
    $.validator.setDefaults({
        submitHandler: function () {
            btnForm.html('<span class="indicator-progress">Espere por favor...</span>');
            btnForm.prop('disabled', !0);
            saveEditProduct(btnForm)
        }
    });
    $('#formProduct').validate({
        debug: false,
        rules: {
            txtName: {
                required: !0,
                minlength: 4,
                maxlength: 25,
                remote: {
                    url: base_url + '/Inventory/existProduct',
                    type: 'GET',
                    async: false,
                    data: {
                        'id':function(){ 
                            return $('#idProduct').val()
                        } 
                    }
                }
            },
            txtReference: {
                required: !0,
                maxlength: 25
            },
            txtPrice : {
                required: !0,
                maxlength: 10,
                number: true
            },
            txtWeight: {
                required: !0,
                maxlength: 10,
                number: true
            },
            txtCategory: {
                required: !0,
            },
            txtStock: {
                required: !0,
                maxlength: 10,
                number: true
            }
        },
        messages: {
            txtName: {
                required: 'El campo es obligatorio',
                remote: 'Ya existe un producto con ese nombre',
                minlength: 'Debe tener al menos 4 caracteres',
                maxlength: 'Debe tener máximo 25 caracteres'
            },
            txtReference: {
                required: 'El campo es obligatorio',
                maxlength: 'Debe tener máximo 25 caracteres',
            },
            txtPrice: {
                required: 'El campo es obligatorio',
                maxlength: 'Debe tener máximo 10 caracteres',
                number: "Sólo se permiten números"
            },
            txtWeight: {
                required: 'El campo es obligatorio',
                maxlength: 'Debe tener máximo 10 caracteres',
                number: "Sólo se permiten números"
            },
            txtCategory: {
                required: 'El campo es obligatorio'
            },
            txtStock: {
                required: 'El campo es obligatorio',
                maxlength: 'Debe tener máximo 10 caracteres',
                number: "Sólo se permiten números"
            }
        },
        onkeyup: function(element) {
            $(element).valid()
        },
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid').addClass("is-valid");
        },
    });
}

/**
 * @description Guarda o edita un producto
 * @param {string} btnForm 
 */
const saveEditProduct = async (btnForm) => {
    const formData = new FormData(document.getElementById("formProduct"));

    $.ajax({
        processData: false,
        contentType: false,
        type: "POST",
        url: base_url + '/Inventory/saveEditProduct',
        data: formData,
        dataType: "json",
        success: function (response) {
            setTimeout(() => {
                toastSwal("success", response.msg);
                $("#listadoProductos").DataTable().ajax.reload(null, false);
                $("#product").modal('hide');
                cleanForm("formProduct")
                btnForm.html('<span class="indicator-label">Guardar</span>');
                btnForm.prop('disabled', !1);
            }, 500);
        },
        error: function (error) {
            setTimeout(() => {
                console.log(error)
                if(error.status == 400) {
                    toastSwal("warning", error.responseJSON.msg)
                    btnForm.html('<span class="indicator-label">Guardar</span>');
                    btnForm.prop('disabled', !1);
                }else {
                    toastSwal("error", error.responseJSON.msg)
                }
            }, 500);
        }
    });
}

/**
 * @description Eliminara un producto por ID
 * @param {Object} table 
 * @param {string} id 
 * @param {string} nombre 
 * @returns 
 */
const removeProductId = async(table, id = "", nombre = "") => {
    if(id == "") return false;

    Swal.fire({
        html: `Estás seguro de que quieres eliminar el producto <br><b>${nombre}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false,
        stopKeydownPropagation: true
    }).then((result) => {
        if (result.isConfirmed) {
            alertSweetTimer();
            $.ajax({
                type: "POST",
                url: base_url + '/Inventory/deleteProductId/'+id,
                dataType: "json",
                success: function (response) {
                    setTimeout(() => {
                        Swal.close();

                        toastSwal("success", response.msg);
                        table.ajax.reload(null, false);
                    }, 500);
                },
                error: function (error) {
                    setTimeout(() => {
                        Swal.close();
                        if(error.status == 400) {
                            toastSwal("warning", error.responseJSON.msg)
                        }else {
                            toastSwal("error", error.responseJSON.msg)
                        }
                    }, 500);
                }
            });
        }
    });
}

/************************************* Procesos de Categorias *************************************/

/**
 * @description Listar todos las categorias 
 */
const listCategories = async () => {
    // quitar el onclick del modulo en el que estamos y agregamos el click al otro modulo
    $("#categorias-tab").removeAttr("onclick");
    $("#productos-tab").attr("onclick", "listProducts();");

    const configTable = {
        id: "listadoCategorias",
        ajax: true,
        url: base_url + '/Inventory/getCategories',
        serverSide: true,
        columns:  [
            { "data": "nombre" },
            { "data": "fecha" },
            { "data": function(data) {
                    return `
                        <button type="button" class="btn btn-warning btn-sm edit-category" data-control="${data.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm remove-category" data-control="${data.id}" data-name="${data.nombre}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                        </button>
                    `;
                } 
            },
        ],
        columnDefs: [
            {
                className: "text-center",
                targets: "_all",
            },
            {
                orderable: !1,
                targets: [2],
            }
        ],
        scroll: true,
        scrollY: "290px"
    }

    // creamos el listado de los productos
    const table = await crearDataTable(configTable);

    table.on('draw', function() {
        // editar una categoria por ID
        $(".edit-category").on("click", async function() {
            const id        = $(this).attr('data-control');

            await listCategoryId(id);
        });

        // eliminar una categoria
        $(".remove-category").on("click", async function() {
            const id        = $(this).attr('data-control');
            const nombre    = $(this).attr('data-name');

            await removeCategoryId(table, id, nombre);
        });
    });
}

/**
 * @description Listar los datos de la categoria por ID
 * @param {string} id 
 * @returns 
 */
const listCategoryId = async (id = "") => {
    if(id == "") return false;
    alertSweetTimer();

    $.ajax({
        type: "GET",
        url: base_url + '/Inventory/getCategoryId/'+id,
        dataType: "json",
        success: function (response) {
            setTimeout(() => {
                Swal.close();
                cleanForm("formCategory");

                $("#category .modal-header h5").html("Editar Categoría");
                $("#idCategory").val(response.data.id);
                $("#txtNameC").val(response.data.nombre);
                $("#category").modal('show');
                validateFieldsCategory(response.data.id)
            }, 500);
        },
        error: function (error) {
            setTimeout(() => {
                if(error.status == 400) {
                    toastSwal("warning", error.responseJSON.msg);
                }else {
                    toastSwal("error", error.responseJSON.msg)
                }
            }, 500);
        }
    });
}

/**
 * @description Valida los campos obligatorio para crear la categoria
 */
const validateFieldsCategory = async (id = '') => {
    const btn       = $("#btnCloseModalCategory");
    const btnForm   = $("#btnFormCategory");
    $.validator.setDefaults({
        submitHandler: function () {
            btnForm.html('<span class="indicator-progress">Espere por favor...</span>');
            btnForm.prop('disabled', !0);
            saveEditCategory(btnForm)
        }
    });

    $('#formCategory').validate({
        debug: false,
        rules: {
            txtName: {
                required: !0,
                minlength: 4,
                maxlength: 25,
                remote: {
                    url: base_url + '/Inventory/existCategory',
                    type: 'GET',
                    async: false,
                    data: {
                        'id':function(){ 
                            return $('#idCategory').val()
                        } 
                    }
                }
            },
        },
        messages: {
            txtName: {
                required: 'El campo es obligatorio',
                remote: 'Ya existe una categoria con ese nombre',
                minlength: 'Debe tener al menos 4 caracteres',
                maxlength: 'Debe tener máximo 25 caracteres'
            }
        },
        onkeyup: function(element) {
            $(element).valid()
        },
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);

            btnForm.attr("disabled", true);
            btn.removeAttr("disabled");
        },
        highlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-valid').addClass('is-invalid');
            btnForm.attr("disabled", true);
            btn.removeAttr("disabled");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid').addClass("is-valid");
            btnForm.removeAttr("disabled");
            btn.attr("disabled", true);
        }
    });
}

/**
 * @description guardara o editara una categoria
 * @param {Object} btnForm 
 */
const saveEditCategory = async(btnForm) => {
    const formData = new FormData(document.getElementById("formCategory"));

    $.ajax({
        processData: false,
        contentType: false,
        type: "POST",
        url: base_url + '/Inventory/saveEditCategory',
        data: formData,
        dataType: "json",
        success: function (response) {
            setTimeout(() => {
                toastSwal("success", response.msg);
                $("#listadoCategorias").DataTable().ajax.reload(null, false);
                $("#category").modal('hide');
                cleanForm("formCategory")
                btnForm.html('<span class="indicator-label">Guardar</span>');
                $("#btnCloseModalCategory").removeAttr("disabled", true)
            }, 500);
        },
        error: function (error) {
            setTimeout(() => {
                if(error.status == 400) {
                    toastSwal("warning", error.responseJSON.msg)
                    btnForm.html('<span class="indicator-label">Guardar</span>');
                    btnForm.prop('disabled', !1);
                }else {
                    toastSwal("error", error.responseJSON.msg)
                }
            }, 500);
        }
    });
}

/**
 * @description Eliminara una categoría por ID
 * @param {Object} table 
 * @param {string} id 
 * @param {string} nombre 
 * @returns 
 */
const removeCategoryId = async (table, id = "", nombre = "") => {
    if(id == "") return false;

    Swal.fire({
        html: `Estás seguro de que quieres eliminar la categoría <br><b>${nombre}</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false,
        stopKeydownPropagation: true
    }).then((result) => {
        if (result.isConfirmed) {
            alertSweetTimer();
            $.ajax({
                type: "POST",
                url: base_url + '/Inventory/deleteCategoryId/'+id,
                dataType: "json",
                success: function (response) {
                    setTimeout(() => {
                        Swal.close();

                        toastSwal("success", response.msg);
                        table.ajax.reload(null, false);
                    }, 500);
                },
                error: function (error) {
                    setTimeout(() => {
                        Swal.close();
                        if(error.status == 400) {
                            toastSwal("warning", error.responseJSON.msg)
                        }else {
                            toastSwal("error", error.responseJSON.msg)
                        }
                    }, 500);
                }
            });
        }
    })
}

/**
 * @description Listara todas la categorias para el select
 */
const listarCategoriesSelect = async (id = "") => {
    $.ajax({
        type: "GET",
        url: base_url + '/Inventory/selectCategories/',
        dataType: "json",
        success: function (response) {
            let html = '<option value="">*** seleccione ***</option>';

            response.data.forEach(element => {
                html += ` <option value="${element.id}" ${(id == element.id) ? "selected" : ""} >${element.nombre}</option> `;
            });

            $("#txtCategory").html(html);
        },
        error: function (error) {
            setTimeout(() => {
                toastSwal("error", error.responseJSON.msg)
            }, 500);
        }
    });
}

/****************** procesos del sistema *******************/

/**
 * @description Limpiara el formula
 * @param {string} idForm 
 * @returns 
 */
const cleanForm = (idForm = "") => {
    if( idForm == "") return false;

    $(`#${idForm} .form-control`).removeClass("is-invalid").removeClass("is-valid");
    document.getElementById(idForm).reset()
}