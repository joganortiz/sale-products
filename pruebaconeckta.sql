-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2023 a las 17:42:53
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pruebaconeckta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` varchar(40) COLLATE utf8_spanish_ci NOT NULL DEFAULT uuid(),
  `name` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `remove` enum('0','1') COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT '0->Removed 1->not removed',
  `date_created` datetime NOT NULL,
  `date_update` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `remove`, `date_created`, `date_update`) VALUES
('7a18058e-aa67-11ed-9448-00e04c360ad5', 'categoria 1', '1', '2023-02-11 18:54:54', NULL),
('8028b0c5-aa67-11ed-9448-00e04c360ad5', 'categoria 2', '1', '2023-02-11 18:55:04', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` varchar(40) COLLATE utf8_spanish_ci NOT NULL DEFAULT uuid(),
  `name` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `reference` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  `price` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `category` varchar(255) COLLATE utf8_spanish_ci NOT NULL,
  `stock` int(11) NOT NULL,
  `remove` enum('0','1') COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT '0->Removed 1->not removed',
  `date_created` datetime NOT NULL,
  `date_update` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `reference`, `price`, `weight`, `category`, `stock`, `remove`, `date_created`, `date_update`) VALUES
('4d541a02-aa76-11ed-b2e8-d95b390d96ca', 'producto 6', 'referencia 6', 500, 200, '8028b0c5-aa67-11ed-9448-00e04c360ad5', 5, '1', '2023-02-11 20:40:59', '2023-02-11 21:09:53'),
('9003a777-aa74-11ed-b2e8-d95b390d96ca', 'producto 3', 'referencia 3', 123, 123, '7a18058e-aa67-11ed-9448-00e04c360ad5', 0, '1', '2023-02-11 20:28:32', '2023-02-11 20:32:18'),
('a62238c5-aa74-11ed-b2e8-d95b390d96ca', 'producto 4', 'referencia 4', 500, 50, '8028b0c5-aa67-11ed-9448-00e04c360ad5', 0, '1', '2023-02-11 20:29:09', '2023-02-11 20:37:00'),
('b3fd6cd7-aa74-11ed-b2e8-d95b390d96ca', 'producto 5', 'referencia 5', 6000, 40, '8028b0c5-aa67-11ed-9448-00e04c360ad5', 153, '1', '2023-02-11 20:29:33', NULL),
('bdfc87d5-aa67-11ed-9448-00e04c360ad5', 'producto 1', 'referencia 1', 123, 123, '7a18058e-aa67-11ed-9448-00e04c360ad5', 12, '1', '2023-02-11 18:56:48', NULL),
('cfa489a6-aa67-11ed-9448-00e04c360ad5', 'producto 2', 'referencia 2', 123456, 123456, '7a18058e-aa67-11ed-9448-00e04c360ad5', 25, '1', '2023-02-11 18:57:17', '2023-02-11 20:28:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sales`
--

CREATE TABLE `sales` (
  `id` varchar(40) COLLATE utf8_spanish_ci NOT NULL DEFAULT uuid(),
  `code_sale` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `product` varchar(40) COLLATE utf8_spanish_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `sales`
--

INSERT INTO `sales` (`id`, `code_sale`, `product`, `amount`, `date_created`) VALUES
('0edc6a4b-aaf4-11ed-a67f-00e04c360ad5', '3WwIZhTHJrscnGRML2jq', 'b3fd6cd7-aa74-11ed-b2e8-d95b390d96ca', 1, '2023-02-12 11:41:11'),
('246cc986-aaf4-11ed-a67f-00e04c360ad5', 'p9mP8ywIE61cZezOCaix', '9003a777-aa74-11ed-b2e8-d95b390d96ca', 2, '2023-02-12 11:41:47'),
('24723862-aaf4-11ed-a67f-00e04c360ad5', 'p9mP8ywIE61cZezOCaix', 'b3fd6cd7-aa74-11ed-b2e8-d95b390d96ca', 4, '2023-02-12 11:41:47'),
('2be645e1-aaf4-11ed-a67f-00e04c360ad5', 'dDkJLYPcZyxIUlKz78FW', 'b3fd6cd7-aa74-11ed-b2e8-d95b390d96ca', 1, '2023-02-12 11:42:00'),
('bf47f46c-aaf3-11ed-a67f-00e04c360ad5', 'bpFXAgHE5JYOPofGxZlh', 'b3fd6cd7-aa74-11ed-b2e8-d95b390d96ca', 1, '2023-02-12 11:38:58'),
('bf4eba01-aaf3-11ed-a67f-00e04c360ad5', 'bpFXAgHE5JYOPofGxZlh', 'a62238c5-aa74-11ed-b2e8-d95b390d96ca', 1, '2023-02-12 11:38:58'),
('bf51e6bb-aaf3-11ed-a67f-00e04c360ad5', 'bpFXAgHE5JYOPofGxZlh', '9003a777-aa74-11ed-b2e8-d95b390d96ca', 1, '2023-02-12 11:38:58'),
('d032d9e6-aaf3-11ed-a67f-00e04c360ad5', 'ukdGXzlTrL9Q214SJO63', '9003a777-aa74-11ed-b2e8-d95b390d96ca', 1, '2023-02-12 11:39:26');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- Indices de la tabla `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product` (`product`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product`) REFERENCES `products` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
