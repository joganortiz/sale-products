<?php 
	
	class Views{
		function getView($controller,$view, $carpeta="", $data = ""){
			
			$controller = get_class($controller);

			if($controller == "Home"){
				$view = "Views/".$view.".php";
			}else if($controller == "Controller_Error"){
				$view = $view.".php";
			}else{
				$view = "Views/".$view.".php";
			}

			require_once ($view);
		}
	}

?>