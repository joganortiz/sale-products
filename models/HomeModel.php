<?php 

	class HomeModel extends Mysql {

        public function listaProductStore () {
            $sql = "SELECT 
                p.id AS id, 
                p.name AS nombre, 
                p.reference AS referencia, 
                p.price AS precio, 
                p.weight AS peso, 
                c.name AS categoria,
                p.stock AS stock
                FROM products AS p
                INNER JOIN categories AS c ON p.category = c.id
                WHERE p.remove = ?
                ORDER BY p.date_created DESC
            ";

            return $this->query(
                $sql, ['1']
            );
        }

        public function validateStock($id) {
            $sql = "SELECT
                p.name AS nombre,
                p.stock AS stock
                FROM products AS p
                WHERE p.id = ?
            ";

            return $this->query(
                $sql, [$id], false
            );
        }

        public function saveSale($data = array()){
            $sql = "INSERT INTO sales(
                    code_sale, 
                    product, 
                    amount, 
                    date_created
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                )
            ";

            return $this->query(
                $sql, $data
            );
        }

        public function updateStockProduct($idProduct, $amount) {
            $sql = "SELECT 
                stock 
                FROM products 
                WHERE id = ?
            ";

            $result =  $this->query(
                $sql, [$idProduct], false
            );

            if($amount <= $result["stock"]) {
                $newStock = $result["stock"] - $amount;

                $sql2 = "UPDATE products SET 
                    stock= ? 
                    WHERE id= ?
                ";

                $this->query(
                    $sql2, [$newStock, $idProduct], false
                );
            }
        }
    }
?>