<?php

	class Mysql extends Conexion {

		protected string $query;
		protected array $data;
		protected string $typeQuery;
		protected bool $selecFetchAll;
		protected $stmt;
		protected $conexiondb;

	
		protected function query(string $query, array $data = [], bool $selecFetchAll = true): array|int|bool {
			$this->conexiondb       = $this->connectionDB(); # we call the database connection

			$this->query            = preg_replace(['/\s+/','/^\s|\s$/'],[' ',''], $query);   # query for database
			$this->data             = $data;    # information necessary for the query
			$this->selecFetchAll    = $selecFetchAll;

			// know what type of query it is
			$this->typeQuery = strtoupper(strstr(trim($this->query), ' ', true));

			if($this->typeQuery == 'CALL'){ # if the query is a stored procedure
				throw  new Exception("Cannot query stored procedures");
			}
			
			// start querying
			$this->stmt = $this->conexiondb->prepare($this->query);
			if(count($this->data) > 0){ # bring data for query
				$result = $this->queryWithData($this->stmt);
			}else{
				$result = $this->queryWithoutData($this->stmt);
			}

			$this->closeConexion();
			return $result;
		}


		private function queryWithData($result) {
			if($this->typeQuery == "SELECT"){
				$result->execute($this->data);
				if($this->selecFetchAll){
					$data   = $result->fetchall(PDO::FETCH_ASSOC);
				}else{
					$data   = $result->fetch(PDO::FETCH_ASSOC);
				}
			}else {
				$result->execute($this->data);
				if ($result) {
					$lastId = $this->conexiondb->lastInsertId();
					$data   = ($lastId != 0)? (int) $lastId:true;
				} else {
					$data = false;
				}
			} 
			return $data;
		}

		
		private function queryWithoutData($result){
			if($this->typeQuery == "SELECT"){
				$result->execute();
				if($this->selecFetchAll){
					$data   = $result->fetchall(PDO::FETCH_ASSOC);
				}else{
					$data   = $result->fetch(PDO::FETCH_ASSOC);
				}
			}else {
				$result->execute();
				if ($result) {
					$lastId = $this->conexiondb->lastInsertId();
					$data   = ($lastId != 0) ? $lastId : true;
				} else {
					$data   = false;
				}
			}
			return $data;
		}

		protected function queryDataExist(string $table, array $arrQuery): bool {

			if (empty($table)) {
				throw new Exception("Table name is required", 1);
				
			}

			if(count($arrQuery) < 0){
				throw new Exception("Query name is required", 1);
			}
			
			$values = [];
			$where = ' WHERE';
			if(is_array($arrQuery[0])){
				for ($i=0; $i < count($arrQuery); $i++) {
					$where .= ' '.$arrQuery[$i][0].' '. $arrQuery[$i][1].' ? AND';
					$values[$i] =  $arrQuery[$i][2];
				}
			}else{
				$where .= ' '.$arrQuery[0].' '. $arrQuery[1].' ? AND';
				$values[0] =  $arrQuery[2];
			}
			

			$where = substr($where, 0, -4);
			$query = 'SELECT '.((is_array($arrQuery[0]))?$arrQuery[0][0]:$arrQuery[0]) . ' FROM '.$table.  $where;

			$result = $this->query($query, $values);
			return (count($result)>0)? true: false;
		}

		private function closeConexion(){
			// we close the conexiondb
			$this->stmt->closeCursor();
			$this->stmt         = null;
			$this->conexiondb   = null;
		}

		public static function InjectionSql(string $strString = ''): string{
			if(empty($strString)){ #check if the string exists
				return $strString;
			}

			$string = implode("",explode("\\",$strString)); # Remove the inverted \
			$string = str_ireplace(self::arrReplace(),"",$string); # Replace words with empty
			$string = preg_replace(['/\s+/','/^\s|\s$/'],[' ',''], $string); # Remove spaces from beginning to end and between words
			return $string;
		}

		private static function arrReplace(): array {
			return [
				"<script>",
				"</script>",
				"alert",
				"script",
				"<script type=>",
				"<script src>",
				"SELECT",
				"SELECT * FROM",
				"SELECT COUNT(*) FROM",
				"DELETE",
				"DELETE FROM",
				"INSERT",
				"INSERT INTO",
				"DROP",
				"DROP TABLE",
				"UNION",
				"OR '1'='1",
				'OR "1"="1"',
				'OR ´1´=´1´',
				"is NULL; --",
				"LIKE '",
				'LIKE "',
				"LIKE ´",
				"OR 'a'='a",
				'OR "a"="a',
				"OR ´a´=´a",
				"OR ´a´=´a",
				"--",
				"^",
				"[",
				"]",
				"=="
			];  
		}
	}
?>