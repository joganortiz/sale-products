<?php 
	
	class Controllers
	{
		public function __construct(public $views = null, public $model = null)
		{
			$this->views = new Views();
			$this->loadModel();
		}

		public function loadModel()
		{
			$model = get_class($this)."Model";
			//HomeModel.php
			$routClass = "Models/".$model.".php";
			if(file_exists($routClass)){
				require_once($routClass);
				$this->model = new $model();
			}
		}
	}

 ?>