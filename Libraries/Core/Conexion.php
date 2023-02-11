<?php
class Conexion{
	// private $conect;

	// public function __construct(){
	// 	$connectionString = "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=".DB_CHARSET;
	// 	try{
	// 		$this->conect = new PDO($connectionString, DB_USER, DB_PASSWORD);
	// 		$this->conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// 	    //echo "conexión exitosa";
	// 	}catch(PDOException $e){
	// 		$this->conect = 'Error de conexión';
	// 	    echo "ERROR: " . $e->getMessage();
	// 	}
	// }

	// public function conect(){
	// 	return $this->conect;
	// }

	protected $connection;

    private function configConexion(){
		$connectionString = "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=".DB_CHARSET;
        try {
            $this->connection = new PDO($connectionString, DB_USER, DB_PASSWORD);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_PERSISTENT, true);
        } catch (PDOException $e) {
            echo "ERROR: " . $e->getMessage(); 
        }
    }

    protected function connectionDB(){
        $this->configConexion();
        return $this->connection;
    }
}

?>