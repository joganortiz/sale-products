document.write(`<script src="${base_url}/Assets/alerts.js"></script>`);

$(document).ready( async function () {
    await listProductStore();

    await updateTotalCard();

    $(".list-card").click(function (e) { 
        listProductCard();
    });

    $("#venderProductos").click(function (e) { 
        e.preventDefault();
        let validProductCar = JSON.parse(localStorage.getItem("cart"));

        if(Array.isArray(validProductCar) && validProductCar.length > 0) {
            sellProductCard();
        }
    });
});

const listProductStore = async () => {
    $.ajax({
        type: "GET",
        url: base_url + "/Home/listaProductStore",
        data: "data",
        dataType: "json",
        success: async function (response) {
            
            let listProduct = '';
            response.data.forEach(element => {
                listProduct += `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-2">
                        <div class="card ${(element.stock <= 0) ? "product-disabled": ""} ">
                            <div class="pd">
                                <img src="${base_url}/Assets/img/default-store.jpg" class="card-img-top" alt="...">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${element.nombre}</h5>
                                <p class="card-text">
                                    ${
                                        (element.stock <= 20) ? 
                                            ((element.stock <= 5) ? 
                                                ((element.stock <= 0) ?
                                                `<label class="text-danger">Sin Stock</label>`:
                                                `<label class="text-danger"><b>${element.stock}</b> ${(element.stock == 1) ? "Unidad": "Unidades"}</label>` 
                                                )
                                                : `<label class="text-warning"><b>${element.stock}</b> Unidades</label>` 
                                            )
                                        : 
                                        `<label class="text-success"><b>Stock</b></label>`
                                    }
                                </p>
                                <div class="text-end d-grid gap-2 footer-card_${element.id}">
                                    <button class="btn btn-primary agregar-carrito" data-control="${element.id}">
                                        Agregar
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });



            $(".listProducts").html(listProduct);

            $(".agregar-carrito").click(function (e) { 
                const id = $(this).attr("data-control");
                $(this).attr("disabled", true).html("Agregando...!");
                addCart(id, this);
            });

            await validateProductCard();
        },
        error: function (error) {
            setTimeout(() => {
                toastSwal("error", error.responseJSON.msg);
            }, 500);
        }
    });
}

const addCart = async (id = "", btn) => {
    if(id == "") return false;

    $.ajax({
        type: "GET",
        url: base_url + "/Home/validateStock/"+id,
        data: {
            id : id
        },
        dataType: "json",
        success: function (response) {
            setTimeout(async () => {
               await toastSwal("success", response.msg, "bottom-start");

               let validProductCar = JSON.parse(localStorage.getItem("cart"));

               let existProduct = false;
               let total = 1;
                if(Array.isArray(validProductCar) &&  validProductCar.length > 0) {
                    validProductCar.forEach(element => {
                        if (element.id == id) {
                            existProduct = true;
                            element.amount = element.amount + 1;

                            total = element.amount;
                        }
                    });
                }else {
                    validProductCar = [];
                }

                if(!existProduct) {
                    validProductCar.push(
                        {
                            id,
                            nombre: response.data.nombre,
                            amount: 1
                        }
                    );
                }
                
                localStorage.setItem("cart", JSON.stringify(validProductCar));

                $(btn).parent().html(`
                    <div class="input-group">
                        <span class="input-group-text" onclick="addDecreaseAmount('${id}', -1)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                            </svg>
                        </span>
                        <input type="text" class="form-control amount id_${id}" placeholder="amount" aria-describedby="basic-addon1" onblur="updateAmount('${id}')" oninput="soloNumeros('${id}')" value="${total}" >
                        <span class="input-group-text" onclick="addDecreaseAmount('${id}', 1)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </span>
                    </div>
                `);

                updateTotalCard();
            }, 500);
        },
        error: function(error) {
            setTimeout(() => {
                if(error.status == 400) {
                    toastSwal("warning", error.responseJSON.msg, "bottom-start");
                }else {
                    toastSwal("error", error.responseJSON.msg, "bottom-start");
                }
            }, 500);
        }
    });
}

/**
 * @description Solo deja escribir numeros
 */
const soloNumeros = async (id = "") => {
    $(`.id_${id}`).val($(`.id_${id}`).val().replace(/[^0-9]/g, ""));
}

const addDecreaseAmount = async(id, amount = 1) => {
    let validProductCar = JSON.parse(localStorage.getItem("cart"));
    
    if(amount == -1) {
        let total = 0;
        let eliminado = false;
        validProductCar.forEach((element, index) => {
            if (element.id == id) {
                element.amount = element.amount - 1;

                if(element.amount <= 0 ) {
                    eliminado = true;
                    delete(validProductCar[index])
                }else {
                    total = element.amount;
                }
            }
        });

        const resultado = validProductCar.filter(element => element != undefined);
        validProductCar = resultado;

        $(`.id_${id}`).val(total);
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(validProductCar));

        if(eliminado) {
            await updateTotalCard();
            await listProductCard();

            $(`.footer-card_${id}`).html(`
                <button class="btn btn-primary agregar-carrito" data-control="${id}">
                    Agregar
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                    </svg>
                </button>
            `);

            $(".agregar-carrito").click(function (e) { 
                const id = $(this).attr("data-control");
                $(this).attr("disabled", true).html("Agregando...!");
                addCart(id, this);
            });
        }
    }else {
        let total = 0;
        let indexProduct = 0;
        validProductCar.forEach((element, index) => {
            if (element.id == id) {
                indexProduct = index;
                element.amount = element.amount + 1;

                total = element.amount;
            }
        });

        updateAmountProduct(validProductCar, id, total, indexProduct);
    }
}

const updateAmount = async (id)  => {
    let total = $(`.id_${id}`).val();
    let validProductCar = JSON.parse(localStorage.getItem("cart"));

    if(total.length <= 0) {
        addDecreaseAmount(id, -1)
    }else {
        total = Number(total);
        
        if(total <= 0) {
            addDecreaseAmount(id, -1);
        }else {
            let indexProduct = 0;
            let totalCurrent = 0;
            let totalAntes   = 0;
            validProductCar.forEach((element, index) => {
                if (element.id == id) {
                    indexProduct    = index;
                    totalCurrent    = total;
                    totalAntes      = element.amount;
                    element.amount  = total;
                    total           = element.amount;
                }
            });
        
            updateAmountProduct(validProductCar, id, total, indexProduct, totalAntes);
        }
    }

}

const updateAmountProduct = async (validProductCar, id, total, indexProduct, totalAntes = 0) => {
    $.ajax({
        type: "GET",
        url: base_url + "/Home/validateStock/",
        data: {
            id : id,
            total : total
        },
        dataType: "json",
        success: function (response) {
            setTimeout(async () => {
                localStorage.removeItem("cart");
                localStorage.setItem("cart", JSON.stringify(validProductCar));

                $(`.id_${id}`).val(total);

                updateTotalCard();
            }, 500);
        },
        error: function (error) {
            setTimeout(() => {
                if(error.status == 400) {
                    toastSwal("warning", error.responseJSON.msg, "bottom-start");
                }else {
                    toastSwal("error", error.responseJSON.msg, "bottom-start");
                }

                validProductCar[indexProduct].amount =  (totalAntes != 0) ? totalAntes : validProductCar[indexProduct].amount - 1 ;
                $(`.id_${id}`).val(validProductCar[indexProduct].amount);
                localStorage.removeItem("cart");
                localStorage.setItem("cart", JSON.stringify(validProductCar));
            }, 500);
        }
    });
}

const updateTotalCard = async () => {
    let total = 0;
    let validProductCar = JSON.parse(localStorage.getItem("cart"));
    if(Array.isArray(validProductCar)) {
        total = validProductCar.length;
    }

    if(total > 0) {
        $("#totalCard span").html(`${total}`);
        $("#totalCard").css("display", "block");
    }else {
        $("#totalCard").css("display", "none");
    }
}

const validateProductCard = async () => {
    let validProductCar = JSON.parse(localStorage.getItem("cart"));
    if(Array.isArray(validProductCar)) {
        validProductCar.forEach(element => {
            $(`.footer-card_${element.id}`).html(`
                <div class="input-group">
                    <span class="input-group-text" onclick="addDecreaseAmount('${element.id}', -1)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </span>
                    <input type="text" class="form-control amount id_${element.id}" placeholder="amount" aria-describedby="basic-addon1" onblur="updateAmount('${element.id}')" oninput="soloNumeros('${element.id}')" value="${element.amount}" >
                    <span class="input-group-text" onclick="addDecreaseAmount('${element.id}', 1)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </span>
                </div>
            `);
        });
    }
}

const listProductCard = async () => {
    let validProductCar = JSON.parse(localStorage.getItem("cart"));

    if(Array.isArray(validProductCar) && validProductCar.length > 0) {
        let html = "";
        validProductCar.forEach(element => {
            html +=`
                <div class="col-12 div-card-${element.id}">
                    <div class="row">
                        <div class="col-4">
                            <div class="pd">
                                <img src="${base_url}/Assets/img/default-store.jpg" class="card-img-top" alt="..." style="border-radius: 25px;max-width: 90px;">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="pd" style="margin-top: 6px;">
                                <h6>${element.nombre}</h6>
                                <div class="input-group">
                                    <span class="input-group-text" onclick="addDecreaseAmount('${element.id}', -1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                    </span>
                                    <input type="text" class="form-control amount id_${element.id}" placeholder="amount" aria-label="Nombre de usuario" aria-describedby="basic-addon1" onblur="updateAmount('${element.id}')" oninput="soloNumeros('${element.id}')" value="${element.amount}" >
                                    <span class="input-group-text" onclick="addDecreaseAmount('${element.id}', 1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-2 text-center">
                            <div style="margin-top: 40px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart-x text-danger" viewBox="0 0 16 16" onclick="deleteProductCard('${element.id}')">
                                    <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });


        $(".list-product-card").html(html);
    }else {
        $(".list-product-card").html(`
            <div class="col-12 text-center" style="margin-top: 21vh;">
                <h4>Carrito sin productos</h4>
            </div>
        `);
    }
}

const deleteProductCard = async (id ) => {
    let validProductCar = JSON.parse(localStorage.getItem("cart"));

    if(Array.isArray(validProductCar)) {
        validProductCar.forEach((element, index) => {
            if(element.id == id) {
                delete(validProductCar[index]);
            }
        });

        const resultado = validProductCar.filter(element => element != undefined);
        validProductCar = resultado;

        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(validProductCar));
        $(`.div-card-${id}`).remove(`.div-card-${id}`)

        updateTotalCard();

        $(`.footer-card_${id}`).html(`
            <button class="btn btn-primary agregar-carrito" data-control="${id}">
                Agregar
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                </svg>
            </button>
        `);

        $(".agregar-carrito").click(function (e) { 
            const id = $(this).attr("data-control");
            $(this).attr("disabled", true).html("Agregando...!");
            addCart(id, this);
        });

        if(validProductCar.length <= 0) {
            $(".list-product-card").html(`
                <div class="col-12 text-center" style="margin-top: 21vh;">
                    <h4>Carrito sin productos</h4>
                </div>
            `);
        }
    }
}

const sellProductCard = async () => {
    let validProductCar = JSON.parse(localStorage.getItem("cart"));

    const formData = new FormData();
    validProductCar.forEach((element, index) => {
        formData.append(`sale[${index}]`, [element.id, element.nombre, element.amount]);
    });



    if(Array.isArray(validProductCar) && validProductCar.length > 0) {
        $.ajax({
            processData: false,
            contentType: false,
            type: "POST",
            url: base_url + "/Home/saveSale/",
            data: formData,
            dataType: "json",
            success: function (response) {
                setTimeout(async() => {
                    toastSwal("success", response.msg);
                    localStorage.removeItem("cart");

                    await listProductStore();

                    await updateTotalCard();

                    listProductCard();

                    // cerramos el carrito
                    let closeCanvas = document.querySelector('[data-bs-dismiss="offcanvas"]');
                    closeCanvas.click();
                    
                }, 500);
            }
        });
    }

}