<?php 

	class InventoryModel extends Mysql {
		
        /******************************************* Proceso de Productos *******************************************/
        /**
         * Listara los productos por bloques
         */
        public function getProducts($data) {
            $columns = array(
                ""  => "date_format(p.date_created, '%d-%m-%Y %H:%i:%s')",
                "0" => "nombre",
                "1" => "referencia",
                "2" => "precio",
                "3" => "peso",
                "4" => "categoria",
                "5" => "stock",
                "6" => "fecha"
            );

            $start      = intval($data["start"]);
            $length     = intval($data["length"]);
            $columns    = $columns[$data["column"]];
            $order      = $data["order"];
            $search     = $data["search"];

            $like = "";
            if( $search != "") {
                $like = " AND (
                    p.name LIKE '%$search%' OR 
                    date_format(p.date_created, '%d-%m-%Y %H:%i') LIKE '%$search%' OR
                    p.reference LIKE '%$search%' OR
                    p.weight LIKE '%$search%' OR
                    p.price LIKE '%$search%' OR
                    p.stock LIKE '%$search%' OR
                    c.name LIKE '%$search%'
                )";
            }        
            
            $sql = "SELECT 
                p.id AS id, 
                p.name AS nombre, 
                p.reference AS referencia, 
                p.price AS precio, 
                p.weight AS peso, 
                c.name AS categoria,
                p.stock AS stock,
                date_format(p.date_created, '%d-%m-%Y %H:%i') AS fecha
                FROM products AS p
                INNER JOIN categories AS c ON p.category = c.id
                WHERE p.remove = ? $like
                ORDER BY $columns $order 
                LIMIT $start, $length;
            ";

            return $this->query(
                $sql, ['1']
            );
        }

        /**
         * Tomara el total de productos que exista
         */
        public function getTotalProducts($search = "") {

            $like = "";
            if( $search != "") {
                $like = " AND (
                    p.name LIKE '%$search%' OR 
                    date_format(p.date_created, '%d-%m-%Y %H:%i') LIKE '%$search%' OR
                    p.reference LIKE '%$search%' OR
                    p.weight  LIKE '%$search%' OR
                    p.price LIKE '%$search%' OR
                    p.stock LIKE '%$search%' OR
                    p.stock LIKE '%$search%' OR
                    c.name LIKE '%$search%'
                )";
            } 

            $sql = "SELECT 
                COUNT(p.id) AS total
                FROM products AS p
                INNER JOIN categories AS c ON p.category = c.id
                WHERE p.remove = ?  $like
            ";

            return $this->query(
                $sql, ['1'], false
            )["total"];
        }

        /**
         * Lista un producto por ID
         */
        public function getProductId($id) {
            $exist = $this->existCategory(
                [
                    ["id", '=', $id],
                    ['remove', '=', '1']
                ],
                "products"
            );

            if(!$exist) {
                return 2; // no existe el producto
            }

            $sql = " SELECT 
                id,
                name AS nombre,
                reference AS referencia,
                price AS precio,
                weight AS peso,
                category AS categoria,
                stock
                FROM products 
                WHERE id = ?
            ";

            return $this->query(
                $sql, [$id], false
            );
        }

        /***
         * Guarda un producto
         */
        public function saveProduct($data = array()) {
            $exist = $this->existProduct(
                [
                    ["name", '=', $data[0]],
                    ['remove', '=', '1']
                ], 
                "products"
            );

            if($exist) {
                return 2; // si existe la categoria
            }
            
            $sql = "INSERT INTO products(
                name, 
                reference, 
                price,
                weight, 
                category, 
                stock, 
                date_created
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
            ";

            $result = $this->query(
                $sql, $data
            );

            return ($result == true) ? 1 : 0;
        }

        /**
         * Edita un producto
         */
        public function editProduct($data) {
            $exist = $this->existProduct(
                [
                    ["id", '!=', $data[7]],
                    ["name", '=', $data[0]],
                    ['remove', '=', '1']
                ], 
                "products"
            );

            if($exist) {
                return 2; // si existe la categoria
            }

            $sql = "UPDATE products SET 
                name= ?,
                reference=?,
                price=?,
                weight= ?,
                category= ?,
                stock= ?,
                date_update= ? 
                WHERE id = ?
            ";

            $result = $this->query(
                $sql, $data
            );

            return ($result == true) ? 1 : 0;
        }

        /**
         * Eliminara una categoria por ID
         */
        public function deleteProductId($id) {
            $exist = $this->existProduct(
                [
                    ["id", '=', $id],
                    ['remove', '=', '1']
                ], 
                "products"
            );

            if(!$exist) {
                return 2; // no existe la categoria
            }
            
            $sql = "UPDATE products SET 
                remove = ?
                WHERE id = ?
            ";

            $result = $this->query(
                $sql, ['0', $id], false
            );

            return ($result == true) ? 1 : 0;
        }

        /**
         * Validara si existe una categoria
         */
        public function existProduct($data, $table) {
            return $this->queryDataExist(
                $table,
                $data
            );
        }

		/******************************************* Proceso de Categorias *******************************************/
        /**
         * Listara las categorias por bloques
         */
        public function getCategories ($data) {
            $columns = array(
                ""  => "fecha",
                "0" => "nombre",
                "1" => "fecha"
            );

            $start      = intval($data["start"]);
            $length     = intval($data["length"]);
            $columns    = $columns[$data["column"]];
            $order      = $data["order"];
            $search     = $data["search"];

            $like = "";
            if( $search != "") {
                $like = " AND ( 
                    name LIKE '%$search%' OR 
                    date_format(date_created, '%d-%m-%Y %H:%i') LIKE '%$search%'
                )";
            }        
            
            $sql = "SELECT 
                id AS id, 
                name AS nombre,
                date_format(date_created, '%d-%m-%Y %H:%i') AS fecha
                FROM categories 
                WHERE remove = ? $like
                ORDER BY $columns $order 
                LIMIT $start, $length;
            ";

            return $this->query(
                $sql, ['1']
            );

        } 
        
        /**
         * Tomara el total de categorias que exista
         */
        public function getTotalCategories($search = "") {

            $like = "";
            if( $search != "") {
                $like = " AND ( 
                    name LIKE '%$search%' OR 
                    date_format(date_created, '%d-%m-%Y %H:%i') LIKE '%$search%'
                )";
            } 

            $sql = "SELECT 
                COUNT(id) AS total
                FROM categories 
                WHERE remove = ? $like
            ";

            return $this->query(
                $sql, ['1'], false
            )["total"];
        }

        /**
         * Listara una categoria por ID
         */
        public function getCategoryId($id) {
            $exist = $this->existCategory(
                [
                    ["id", '=', $id],
                    ['remove', '=', '1']
                ],
                "categories"
            );

            if(!$exist) {
                return 2; // no existe la categoria
            }

            $sql = " SELECT 
                id, 
                name AS nombre
                FROM categories 
                WHERE id = ?
            ";

            return $this->query(
                $sql, [$id], false
            );
        }

        /**
         * Guardara una categoria
         */
        public function saveCategory($data = array()) {
            $exist = $this->existCategory(
                [
                    ["name", '=', $data["name"]],
                    ['remove', '=', '1']
                ], 
                "categories"
            );

            if($exist) {
                return 2; // si existe la categoria
            }
            
            $sql = "INSERT INTO categories (
                    name,
                    date_created
                ) VALUES (
                    ?,
                    ?
                );
            ";

            $result = $this->query(
                $sql, [$data["name"], $data["date"]]
            );

            return ($result == true) ? 1 : 0;
        }

        /**
         * Ediatara una categoria por ID
         */
        public function editCategory($data = array()) {
            $exist = $this->existCategory(
                [
                    ["id", '!=', $data["id"]],
                    ["name", '=', $data["name"]],
                    ['remove', '=', '1']
                ], 
                "categories"
            );

            if($exist) {
                return 2; // si existe la categoria
            }

            $sql = "UPDATE categories SET 
                name=?,
                date_update=? 
                WHERE id = ?
            ";

            $result = $this->query(
                $sql, [$data["name"], $data["date"], $data["id"]]
            );

            return ($result == true) ? 1 : 0;
        }

        /**
         * Eliminara una categoria por ID
         */
        public function deleteCategoryId($id) {
            $exist = $this->existCategory(
                [
                    ["id", '=', $id],
                    ['remove', '=', '1']
                ], 
                "categories"
            );

            if(!$exist) {
                return 2; // no existe la categoria
            }

            $existProduct = $this->existProduct(
                [
                    ["category", '=', $id],
                    ['remove', '=', '1']
                ], 
                "products"
            );

            if($existProduct) {
                return 3; // esta relacionado a un producto
            }

            
            $sql = "UPDATE categories SET 
                remove = ?
                WHERE id = ?
            ";

            $result = $this->query(
                $sql, ['0', $id], false
            );

            return ($result == true) ? 1 : 0;
        }

        /**
         * Validara si existe una categoria
         */
        public function existCategory($data, $table) {
            return $this->queryDataExist(
                $table,
                $data
            );
        }

        /**
         * Lisata todas las categorias para el select
         */
        public function getCategoriesSelect() {
            $sql ="SELECT 
                id, 
                name AS nombre
                FROM categories
                WHERE remove = ?;
            ";

            return $this->query(
                $sql, ['1']
            );
        }
    }
?>