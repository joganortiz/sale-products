<?php 
	//session_start();
	class Controller_Error extends Controllers{
		public function __construct()
		{
			parent::__construct();
		}

		public function notFound()
		{
			$data['title'] = nombreEmpresa;
			$this->views->getView($this,"error", "", $data);
		}
	}

	$notFound = new Controller_Error();
	$notFound->notFound();
 ?>