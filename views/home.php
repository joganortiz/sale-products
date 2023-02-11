<?= Helpers::header($data); ?>

<div class="row">
    <div class="col-12 col-sm-6 col-md-4 col-xl-4">
        <div class="card">
            <div class="pd">
                <img src="https://s1.eestatic.com/2022/09/23/reportajes/705440357_227439387_1024x576.jpg" class="card-img-top" alt="...">
            </div>
            <div class="card-body">
                <h5 class="card-title">Nombre producto</h5>
                <p class="card-text">Stock</p>
                <div class="text-end d-grid gap-2">
                    <a href="#" class="btn btn-primary">
                        Agregar
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
 
<?= Helpers::footer() ?>