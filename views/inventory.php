<?= Helpers::header($data); ?>
<link rel="stylesheet" href="//cdn.datatables.net/1.13.2/css/jquery.dataTables.min.css">


<ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
        <button class="nav-link active" id="productos-tab" data-bs-toggle="tab" data-bs-target="#productos" type="button" role="tab" aria-controls="home" aria-selected="true">Productos</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="categorias-tab" onclick="listCategories()" data-bs-toggle="tab" data-bs-target="#categorias" type="button" role="tab" aria-controls="profile" aria-selected="false">Categorias</button>
    </li>
</ul>
<div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="productos" role="tabpanel" aria-labelledby="productos-tab">
        <div class="pd mt-3">
            <div class="header row">
                <div class="col-6">
                    <h4>Modulo de productos</h4>
                </div>
                <div class="col-6 text-end">
                    <button type="button" class="btn btn-primary btn-sm" title="Agregar nuevo producto" data-bs-toggle="modal" data-bs-target="#product" data-control="product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <table id="listadoProductos" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style="min-width: 150px;">Nombre</th>
                            <th>Referencia</th>
                            <th>Precio</th>
                            <th>Peso</th>
                            <th style="min-width: 100px;">Categoría</th>
                            <th style="min-width: 50px;">stock</th>
                            <th style="min-width: 100px;">Fecha C.</th>
                            <th style="min-width: 100px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="categorias" role="tabpanel" aria-labelledby="categorias-tab">
        <div class="pd mt-3">
            <div class="header row">
                <div class="col-12 col-sm-6 col-lg-6 col-xl-6">
                    <h4>Modulo de Categorías</h4>
                </div>
                <div class="col-12 col-sm-6 col-lg-6 col-xl-6 text-end">
                    <button type="button" class="btn btn-primary btn-sm" title="Agregar nueva categoria" data-bs-toggle="modal" data-bs-target="#category" data-control="category">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <table  id="listadoCategorias" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style="min-width: 150px;">Nombre</th>
                            <th style="min-width: 100px;">Fecha C.</th>
                            <th style="min-width: 100px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</div>


<?= Helpers::footer() ?>

<script src="//cdn.datatables.net/1.13.2/js/jquery.dataTables.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="<?= Helpers::media(); ?>/inventory.js"></script>

<!-- Modal Productos-->
<div class="modal fade" id="product" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Crear Producto</h5>
                <button type="button" id="btnCloseModalProdcut" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formProduct">
                    <input type="hidden" name="idProduct" id="idProduct" value="">
                    <div class="row mb-3">
                        <div class="col-12 col-md-6">
                            <label class="col-12 control-label">Nombre <span class="text-danger">*</span>:</label>
                            <div class="form-group col-12">
                                <input type="text" class="form-control"  name="txtName" id="txtName" placeholder="Nombre del producto" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="col-12 control-label">Referencia <span class="text-danger">*</span>:</label>
                            <div class="form-group col-12">
                                <input type="text" class="form-control"  name="txtReference" id="txtReference" placeholder="Referencia del producto" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="col-12 control-label">Precio <span class="text-danger">*</span>:</label>
                            <div class="form-group col-12">
                                <input type="text" class="form-control"  name="txtPrice" id="txtPrice" placeholder="Referencia del producto" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="col-12 control-label">Peso <span class="text-danger">*</span>:</label>
                            <div class="form-group col-12">
                                <input type="text" class="form-control"  name="txtWeight" id="txtWeight" placeholder="Referencia del producto" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="col-12 control-label">Categoria <span class="text-danger">*</span>:</label>
                            <div class="form-group col-12">
                                <select class="form-control form-selec" name="txtCategory" id="txtCategory">
                                </select>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="col-12 control-label">stock <span class="text-danger">*</span>:</label>
                            <div class="form-group col-12">
                                <input type="text" class="form-control"  name="txtStock" id="txtStock" placeholder="Referencia del producto" autocomplete="off">
                            </div>
                        </div>
                    </div>
                    <div class="text-end">
                        <button id="btnFormProduct" type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal Categorias-->
<div class="modal fade" id="category" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Crear Categoría</h5>
                <button type="button" id="btnCloseModalCategory" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formCategory">
                    <input type="hidden" name="idCategory" id="idCategory" value="">
                    <div class="row row-input mb-3">
                        <label class="col-12 control-label">Nombre <span class="text-danger">*</span>:</label>
                        <div class="form-group col-12">
                            <input type="text" class="form-control"  name="txtName" id="txtNameC" placeholder="Nombre de la Categoría" autocomplete="off">
                        </div>
                    </div>
                    <div class="text-end">
                        <button id="btnFormCategory" type="submit" class="btn btn-primary" disabled>Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>