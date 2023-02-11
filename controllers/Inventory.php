<?php
	class Inventory extends Controllers{
		
		public function __construct()
		{
			parent::__construct();
		}

		public function inventory(){
			$data['title'] = nombreEmpresa;

			$this->views->getView($this,"inventory", "", $data); 
		}

		/******************************************* Proceso de Productos *******************************************/

		/**
		 * Lista todos los productos
		 */
		public function getProductos() {
			$start 	= $_GET["start"];
			$length	= $_GET["length"];
			$order	= $_GET["order"][0]["dir"] ?? "desc";
			$column	= $_GET["order"][0]["column"] ?? '';
			$search	= $_GET["search"]["value"] ?? '';

			$resultList = $this->model->getProducts(array(
				"start" 	=> $start,
				"length"	=> $length,
				"order"		=> $order,
				"column"	=> $column,
				"search"	=> $search
			));

			$total =  $this->model->getTotalProducts();

			$recordsFiltered = "";
			if($search != "") {
				$recordsFiltered = (int) $this->model->getTotalProducts($search);
			}

			echo json_encode(array(
				"data"				=> $resultList,
				"recordsTotal"		=> $total,
				"recordsFiltered"	=> $recordsFiltered
			));
		}

		/**
		 * Valida si ya existe un producto
		 */
		public function existProduct() {
			$name 	= $_GET["txtName"];
			$id 	= $_GET["id"];
			$exist = $this->model->existProduct(
				[
                    ["id", '!=', $id],
					["name", '=', $name],
                    ['remove', '=', '1']
                ], 
				"products"
			);

			//var_dump($exist);
			//exit;

			$noExisteProduct = true;
			if ($exist == true) {
				$noExisteProduct = false;
			}

			echo json_encode($noExisteProduct);
		}

		/**
		 * Lista un producto por ID
		 */
		public function getProductId($id) {
			$result = $this->model->getProductId($id);

			$msg 		= "";
			$status 	= 200;
			if($result == 2) {
				$status = 400;
				$msg = "El producto no existe en el sistema";
			}else {
				if(!$result) {
					$status = 500;
					$msg = "Se presentó un error, no se pudo listar el producto.";
				}
			}

			echo json_encode(array(
				"msg" => $msg,
				"data" => ($status != 200) ? [] : $result
			), http_response_code($status));
		}

		/**
		 * Guarda o edita un producto
		 */
		public function saveEditProduct() {
			$msg 		= "";
			$status 	= 200;

			try {
				if ($_POST) {
					$name 		= $_POST["txtName"] ?? '';
					$reference	= $_POST["txtReference"] ?? '';
					$price		= $_POST["txtPrice"] ?? '';
					$weight		= $_POST["txtWeight"] ?? '';
					$category	= $_POST["txtCategory"] ?? '';
					$stock		= $_POST["txtStock"] ?? '';
	
					$continuar 	= true;
	
					if($name == "") {
						$name 		= "El nombre es obligatorio";
						$continuar 	= false;
						$status		= 400;
					}
	
					if($continuar) {
						$name = Mysql::InjectionSql($name);
						if(empty($name)) {
							$msg 		= "El nombre del producto no es permitido";
							$continuar 	= false;
							$status		= 400;
						}
	
						if($continuar) {
							$reference = Mysql::InjectionSql($reference);
	
							if(empty($reference)) {
								$msg 		= "La referencia del producto no es permitido";
								$continuar 	= false;
								$status		= 400;
							}
						}
	
						if($continuar) {
							$valPrice = is_numeric($price);
	
							if(!$valPrice) {
								$msg 		= "El precio del producto debe ser solo números";
								$continuar 	= false;
								$status		= 400;
							}
						}
	
						if($continuar) {
							$valWeight = is_numeric($weight);
	
							if(!$valWeight) {
								$msg 		= "El peso del producto debe ser solo números";
								$continuar 	= false;
								$status		= 400;
							}
						}
	
						if($continuar) {
							$valStock = is_numeric($stock);
	
							if(!$valStock) {
								$msg 		= "El peso del producto debe ser solo números";
								$continuar 	= false;
								$status		= 400;
							}
						}
					}
	
					# validar si existe la categoria
					if($continuar) {
						$exist = $this->model->existCategory(
							[
								["id", '=', $category],
								['remove', '=', '1']
							], 
							"categories"
						);
	
						if(!$exist) {
							$msg 		= "La categoria que seleccionaste no es valida.";
							$continuar 	= false;
							$status		= 400;
						}
					}
	
					if($continuar) {
						if(empty($_POST["idProduct"])) {
	
							$result = $this->model->saveProduct(array(
								$name,
								$reference,
								$price,
								$weight,
								$category,
								$stock,
								Helpers::worldDate()
							));
							
							if($result == 2) {
								$status = 400;
								$msg = "Ya existe un producto con ese nombre";
							}else {
								if($result == 1) {
									$status = 200;
									$msg = "El producto se guardo correctamente";
								}else {
									$status = 500;
									$msg = "Se presentó un error, no se pudo guardar el producto.";
								}
							}
						}else {
							$result = $this->model->editProduct(array(
								$name,
								$reference,
								$price,
								$weight,
								$category,
								$stock,
								Helpers::worldDate(),
								$_POST["idProduct"],
							));
							
							if($result == 2) {
								$status = 400;
								$msg = "Ya existe un producto con ese nombre";
							}else {
								if($result == 1) {
									$status = 200;
									$msg = "El producto se actualizo correctamente";
								}else {
									$status = 500;
									$msg = "Se presentó un error, no se pudo actualizar el producto.";
								}
							}
						}
					}
				}
			} catch (\Throwable $th) {
				$msg 	= "Se presentó un error, no se pudo guardar la categoría.";
				$status = 500;
			}

			echo json_encode(array(
				"msg" => $msg
			), http_response_code($status));
		}

		/**
		 * Elimina un producto por ID
		 */
		public function deleteProductId($id) {
			$result 	= $this->model->deleteProductId($id);

			$msg 	= "";
			$status = 0;
			if($result == 2){
				$status = 400;
				$msg = "El prodcuto no existe en el sistema";
			}else {
				if($result == 1) {
					$status = 200;
					$msg = "El prodcuto se eliminó correctamente";
				}else {
					$status = 500;
					$msg = "Se presentó un error, no se pudo eliminar el prodcuto.";
				}
			}

			echo json_encode(array(
				"msg"	=> $msg
			), http_response_code($status));
		}

		/******************************************* Proceso de Categorias *******************************************/
		/**
		 * Listara todas las categorias
		 */
		public function getCategories() {
			$start 	= $_GET["start"];
			$length	= $_GET["length"];
			$order	= $_GET["order"][0]["dir"] ?? "desc";
			$column	= $_GET["order"][0]["column"] ?? '';
			$search	= $_GET["search"]["value"] ?? '';

			$resultList = $this->model->getCategories(array(
				"start" 	=> $start,
				"length"	=> $length,
				"order"		=> $order,
				"column"	=> $column,
				"search"	=> $search
			));

			$total =  $this->model->getTotalCategories();

			$recordsFiltered = "";
			if($search != "") {
				$recordsFiltered = (int) $this->model->getTotalCategories($search);
			}

			echo json_encode(array(
				"data"				=> $resultList,
				"recordsTotal"		=> $total,
				"recordsFiltered"	=> $recordsFiltered
			));
		}

		/**
		 * Listara la categoria por ID
		 */
		public function getCategoryId($id) {
			$result = $this->model->getCategoryId($id);

			$msg 		= "";
			$status 	= 200;
			if($result == 2) {
				$status = 400;
				$msg = "La categoría no existe en el sistema";
			}else {
				if(!$result) {
					$status = 500;
					$msg = "Se presentó un error, no se pudo listar la categoría.";
				}
			}

			echo json_encode(array(
				"msg" => $msg,
				"data" => ($status != 200) ? [] : $result
			), http_response_code($status));
		}

		/**
		 * validara si existe ya una categoria
		 */
		public function existCategory() {
			$name 	= $_GET["txtName"];
			$id 	= $_GET["id"];
			$exist = $this->model->existCategory(
				[
                    ["id", '!=', $id],
					["name", '=', $name],
                    ['remove', '=', '1']
                ], 
				"categories"
			);

			$noExisteCatgory = true;
			if ($exist == true) {
				$noExisteCatgory = false;
			}

			echo json_encode($noExisteCatgory);
		}

		/**
		 * Guarda o Edita una categoria
		 */
		public function saveEditCategory() {
			if ($_POST) {
				$name = $_POST["txtName"]?? '';

				$msg 		= "";
				$status 	= 0;
				$continuar 	= true;

				if($name == "") {
					$name 		= "El nombre es obligatorio";
					$continuar 	= false;
					$status		= 400;
				}

				if($continuar) {
					$name = Mysql::InjectionSql($name);
					if(empty($name)) {
						$msg 		= "El nombre de la categoría no es permitido";
						$continuar 	= false;
						$status		= 400;
					}
				}

				if(empty($_POST["idCategory"])) {

					$result = $this->model->saveCategory(array(
						"name" 	=> $name,
						"date"	=> Helpers::worldDate()
					));
					
					if($result == 2) {
						$status = 400;
						$msg = "Ya existe una categoria con ese nombre";
					}else {
						if($result == 1) {
							$status = 200;
							$msg = "La categoría se guardo correctamente";
						}else {
							$status = 500;
							$msg = "Se presentó un error, no se pudo guardar la categoría.";
						}
					}
				}else {
					$result = $this->model->editCategory(array(
						"id"	=> $_POST["idCategory"],
						"name" 	=> $name,
						"date"	=> Helpers::worldDate()
					));
					
					if($result == 2) {
						$status = 400;
						$msg = "Ya existe una categoria con ese nombre";
					}else {
						if($result == 1) {
							$status = 200;
							$msg = "La categoría se actualizo correctamente";
						}else {
							$status = 500;
							$msg = "Se presentó un error, no se pudo guardar la categoría.";
						}
					}
				}
				
				echo json_encode(array(
					"msg" => $msg
				), http_response_code($status));
			}
		}

		/**
		 * eliminara un acategoria por ID
		 */
		public function deleteCategoryId($id) {
			$result 	= $this->model->deleteCategoryId($id);

			$msg 	= "";
			$status = 0;
			if($result == 2){
				$status = 400;
				$msg = "La categoría no existe en el sistema.";
			} else if ($result == 3){
				$status = 400;
				$msg = "La categoría esta relacionada a un producto, no es posible eliminarla.";
			}else {
				if($result == 1) {
					$status = 200;
					$msg = "La categoría se eliminó correctamente.";
				}else {
					$status = 500;
					$msg = "Se presentó un error, no se pudo eliminar la categoría.";
				}
			}

			echo json_encode(array(
				"msg"	=> $msg
			), http_response_code($status));
		}

		/**
		 * Lisatra todas la categorias para el select
		 */
		public function selectCategories() {
			$data = $this->model->getCategoriesSelect();

			$msg = "";
			$status = 200;
			if($data == false) {
				$msg 	= "Se presentó un error, no se pudo cargar las categoría";
				$status = 500;
			}

			echo json_encode(array(
				"msg"	=> $msg,
				"data"	=> ($status != 200) ? [] : $data
			), http_response_code($status));
		}
	}
?>