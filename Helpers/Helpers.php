<?php

class Helpers{

    /**
     * Url del proyecto
     */
	public static function base_url()
	{
		return BASE_URL;
	}

    /**
     * Url de los archivos Assets
     */
    public static function media()
    {
        return BASE_URL."/Assets";
    }

    /**
     * Llama al archivo del footer
     */
    public static function footer($data=""){
        $view_footer = "Views/Template/footer.php";
        require_once ($view_footer);        
    }

    /**
     * Llama al archivo del header
     */
    public static function header($data=""){
        $view_header = "Views/Template/header.php";
        require_once ($view_header);
    }

    /**
     * fecha de la zona horaria
     */
    public static function worldDate(){
        date_default_timezone_set("America/Bogota");
        return date("Y-m-d H:i:s");
    }
}