# sale-products

## consultas
#### Consulta para saber cuál producto tiene más Stock
`SELECT id, name, reference, price, weight, category, stock, date_created FROM products ORDER BY stock DESC LIMIT 1;`

### Consulta para saber cuál es el producto más vendido
`SELECT SUM(s.amount) AS total_vendido, p.name AS producto FROM sales AS s INNER JOIN products AS p ON s.product = p.id GROUP BY product ORDER BY total_vendido DESC LIMIT 1;`


Tener en cuanta para correr el proyecto:
1. Nombre de la base de datos debe ser - `pruebaconeckta`.
2. El proyecto se debe correr con conexión a Internet, ya que hay librerías que esta por CDN.

La base de datos se encuentra en la raíz del proyecto se llama `pruebaconeckta.sql`

El proyecto fue realizado con PHP versión 8.0
