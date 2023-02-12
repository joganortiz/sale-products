<?php
	class Home extends Controllers{
		
		public function __construct()
		{
			session_start();
			parent::__construct();
		}

		public function home(){
			$data['title'] = nombreEmpresa;

			$this->views->getView($this,"home", "", $data); 
		}

		public function listaProductStore() {
			$msg	= "";
			$status = 200;

			try {
				$result = $this->model->listaProductStore();
			} catch (\Throwable $th) {
				$status = 500;
				$msg	= "Se presentó un error, no se pudo listar los productos.";
			}
			
			echo json_encode(array(
				"msg" => $msg,
				"data" => ($status != 200) ? [] : $result
			), http_response_code($status));
		}

		public function validateStock() {
			$msg 	= "";
			$status = 200;
			

			try {
				$result = $this->model->validateStock($_GET["id"]);
				$cantidad = $_GET["total"] ?? 0;

				if($cantidad > 0) {
					if($cantidad > $result["stock"]) {
						$status = 400;
						$msg = "El producto <b>".$result["nombre"]."</b> no tiene Suficiente stock";
					}
				}else {
					if($result["stock"] > 0) {
						$msg	= "El producto <b>".$result["nombre"]."</b> se agrego al carrito";
					}else {
						$status = 400;
						$msg	= "El producto <b>".$result["nombre"]."</b> no tiene suficiente stock, no se puede agregar al cerrito";
					}
				}


			} catch (\Throwable $th) {
				$status = 500;
				$msg = "Se presentó un error, no se pudo agregar al carrito el producto.";
			}

			echo json_encode(array(
				"msg" => $msg,
				"data" => ($status != 200) ? [] : $result
			), http_response_code($status));
		}

		public function saveSale() {
			if($_POST) {
				$permitted_chars 	= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				$codeSale			= substr(str_shuffle($permitted_chars), 0, 20);
				$date				= Helpers::worldDate();

				if(count($_POST["sale"]) > 0) {
					foreach ($_POST["sale"] as $key => $value) {
						$arrData = explode(",", $value);
	
						$idProduct	= $arrData[0];
						$amount		= $arrData[2];

						$this->model->saveSale(array(
							$codeSale,
							$idProduct,
							$amount,
							$date
						));

						$this->model->updateStockProduct($idProduct, $amount);

					}

					echo json_encode(array(
						"msg" => "La venta se realizo exitosamente",
					), http_response_code(200));
				}
			}
		}

	}
 ?>