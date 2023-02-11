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

	}
 ?>