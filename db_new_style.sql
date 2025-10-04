-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-10-2025 a las 07:56:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_new_style`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `address`
--

CREATE TABLE `address` (
  `Address_id` int(11) NOT NULL,
  `Address_number_street` varchar(50) DEFAULT NULL,
  `Address_neighborhood` varchar(50) DEFAULT NULL,
  `Address_locality` varchar(50) DEFAULT NULL,
  `Address_city` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `address`
--

INSERT INTO `address` (`Address_id`, `Address_number_street`, `Address_neighborhood`, `Address_locality`, `Address_city`) VALUES
(3, 'Quinta', 'Patio Bonito', 'Kennedy', 'Bogota');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `api_users`
--

CREATE TABLE `api_users` (
  `Api_user_id` int(11) NOT NULL,
  `Api_user` varchar(50) DEFAULT NULL,
  `Api_password` varchar(255) DEFAULT NULL,
  `Api_status` varchar(50) DEFAULT NULL,
  `Api_role` varchar(50) DEFAULT NULL,
  `Created_at` datetime DEFAULT current_timestamp(),
  `Updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `api_users`
--

INSERT INTO `api_users` (`Api_user_id`, `Api_user`, `Api_password`, `Api_status`, `Api_role`, `Created_at`, `Updated_at`) VALUES
(1, 'adminapi@gmail.com', '$2b$10$yV99IDgP.lD5XFZ/H1id3ODc6LaLKGH7DaODNd.hJxM30.IbKeDA6', 'Active', 'Admin', '2025-04-12 11:25:41', '2025-04-12 11:25:41'),
(2, 'adminapi@gmail.com', '$2b$10$jFExWZd9eonD/zjMGgOzMexjxk7I87rF8lOgRh6Rut7figmbbj/O2', 'Active', 'Admin', '2025-04-12 11:38:52', '2025-04-12 11:38:52'),
(3, 'diomedes@gmail.com', '$2b$10$r49y3OmXudgBuX37xiBkuOm9Z/kxCmC/iApLZhK0djLI6DtfsvoEW', 'Active', 'Cliente', '2025-04-12 13:29:24', '2025-04-12 13:29:24'),
(4, 'diomedes@gmail.com', '$2b$10$V.XMIjTV/.h6M.4ufKOaqeHKmmp8zE5w4Yj11mDE3/mKtiRcwLkze', 'Active', 'Cliente', '2025-04-13 08:49:06', '2025-04-13 08:49:06'),
(5, 'adminapi2@gmail.com', '$2b$10$X3DK2LeBJFS64wz1mKb.iOVcQywiH9m4j40lY9Dn5utwwXbuvMOjW', 'Active', 'Admin', '2025-06-29 17:18:56', '2025-06-29 17:18:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `brand`
--

CREATE TABLE `brand` (
  `Brand_id` int(11) NOT NULL,
  `Brand_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `brand`
--

INSERT INTO `brand` (`Brand_id`, `Brand_name`) VALUES
(1, 'Shoptop'),
(2, 'Elegant'),
(6, 'Master');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `Client_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codige`
--

CREATE TABLE `codige` (
  `Codige_id` int(11) NOT NULL,
  `Codige_number` varchar(100) DEFAULT NULL,
  `Orders_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `color`
--

CREATE TABLE `color` (
  `Color_id` int(11) NOT NULL,
  `Color_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `color`
--

INSERT INTO `color` (`Color_id`, `Color_name`) VALUES
(13, 'Azul'),
(14, 'Rosa'),
(15, 'Morado'),
(16, 'Negro'),
(17, 'Blanco'),
(18, 'Beige'),
(19, 'Marron');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `company`
--

CREATE TABLE `company` (
  `Company_id` int(11) NOT NULL,
  `Company_name` varchar(50) DEFAULT NULL,
  `Company_Address` varchar(50) DEFAULT NULL,
  `Company_phone` varchar(50) DEFAULT NULL,
  `Company_mail` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `company`
--

INSERT INTO `company` (`Company_id`, `Company_name`, `Company_Address`, `Company_phone`, `Company_mail`) VALUES
(3, 'Elegant', 'Calle100, Bucaramanga, Colombia', '3135855847', 'elegant@gmail.com'),
(4, 'Master', 'Calle12, Medellin, Colombia', '3135855789', 'master@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `images`
--

CREATE TABLE `images` (
  `Image_id` int(11) NOT NULL,
  `Image_name` varchar(50) NOT NULL,
  `Image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `images`
--

INSERT INTO `images` (`Image_id`, `Image_name`, `Image_url`) VALUES
(51, 'Americana azul', '/assets/imgs/file-1759550732128-391742523.png'),
(52, 'Americana marron', '/assets/imgs/file-1759550789521-238895736.png'),
(53, 'abrigo azul', '/assets/imgs/file-1759550817859-12326640.png'),
(54, 'abrigo  negro', '/assets/imgs/file-1759550838137-583751162.png'),
(55, 'abrigo  marron', '/assets/imgs/file-1759550860450-14003704.png'),
(56, 'Abrigo beige', '/assets/imgs/file-1759550895242-231092057.png'),
(57, 'Alfilereada azul', '/assets/imgs/file-1759550924574-475992591.png'),
(58, 'Alfilereada morada', '/assets/imgs/file-1759550954197-810400194.png'),
(59, 'Alfilereada rosa', '/assets/imgs/file-1759550970861-938534531.png'),
(60, 'Alfilereada blanca', '/assets/imgs/file-1759550991550-25004056.png'),
(61, 'Pantalon gris', '/assets/imgs/file-1759555130786-822910818.png'),
(63, 'Pantalon Negro', '/assets/imgs/file-1759557275301-470674696.jpg'),
(64, 'Pantalon negro 2', '/assets/imgs/file-1759557295259-977503722.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `module`
--

CREATE TABLE `module` (
  `Module_id` int(11) NOT NULL,
  `Module_name` varchar(50) NOT NULL,
  `Module_description` varchar(100) DEFAULT NULL,
  `Module_route` varchar(50) DEFAULT NULL,
  `Module_icon` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `module`
--

INSERT INTO `module` (`Module_id`, `Module_name`, `Module_description`, `Module_route`, `Module_icon`) VALUES
(1, 'Inicio', 'Este es el modulo inicio', '../../home/home.html', 'fas fa-home'),
(2, 'Usuarios', 'Este es el modulo para usuarios', '../users/users.html', 'fas fa-user-shield'),
(3, 'Roles', 'Este es el modulo para roles', '../role/role.html', 'fas fa-user-cog'),
(4, 'Empresas', 'Este es el modulo de empresas', '../company/company.html', 'fas fa-building'),
(5, 'Clientes', 'Este es el modulo para clientes', '../client/client.html', 'icono_cliente'),
(9, 'Direcciones', 'Este es el modulo para direcciones', '../address/address.html', 'fas fa-map-marker-alt'),
(10, 'Estados de usuarios', 'Este es el modulo para los estados de usuario', '../userStatus/userStatus.html', 'fas fa-user-check'),
(11, 'Productos', 'Este es el modulo de productos', '../product/product.html', 'fas fa-box-open'),
(12, 'Gestion de permisos', 'Este es el modulo para gestionar permisos', '../Module/module.html', 'fas fa-key'),
(13, 'Marcas', 'Este es el modulo para Gestionar las marcas', '../brand/brand.html', 'fas fa-tag'),
(14, 'Tallas', 'Este es el modulo de tallas', '../size/size.html', 'fas fa-ruler-combined'),
(15, 'Colores', 'Este es el modulo de colores', '../color/color.html', 'fas fa-palette');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `Orders_id` int(11) NOT NULL,
  `Product_fk` int(11) NOT NULL,
  `User_fk` int(11) DEFAULT NULL,
  `State_order_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `Product_id` int(11) NOT NULL,
  `Product_name` varchar(50) DEFAULT NULL,
  `Product_amount` int(11) DEFAULT NULL,
  `Product_category` varchar(50) DEFAULT NULL,
  `Product_description` varchar(50) DEFAULT NULL,
  `Product_image` varchar(50) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `Brand_fk` int(11) DEFAULT NULL,
  `Color_fk` int(11) DEFAULT NULL,
  `Size_fk` int(11) DEFAULT NULL,
  `Image_fk` int(11) DEFAULT NULL,
  `Type_product_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`Product_id`, `Product_name`, `Product_amount`, `Product_category`, `Product_description`, `Product_image`, `price`, `Brand_fk`, `Color_fk`, `Size_fk`, `Image_fk`, `Type_product_fk`) VALUES
(42, 'ABRIGO FORMAL', 2, 'Torso', 'Abrigo de color negro', NULL, 12000, 1, 16, 11, 54, 14),
(43, 'BLAZER', 3, 'Torso', 'Blazer de color marron', NULL, 14555, 1, 19, 6, 55, 13),
(44, 'GABAN', 7, 'Torso', 'Gaban de color azul', NULL, 15555, 1, 13, 11, 53, 11),
(45, 'GABAN', 4, 'Torso', 'Gaban de color Beige', NULL, 20000, 1, 18, 13, 56, 11),
(46, 'CAMISA', 2, 'camisas', 'Camisa de color marron', NULL, 60000, 2, 19, 6, 52, 15),
(47, 'CAMISA', 5, 'camisas', 'Camisa de color azul', NULL, 60000, 2, 13, 5, 51, 15),
(48, 'CAMISA', 7, 'camisas', 'Camisa', NULL, 60000, 2, 13, 6, 57, 17),
(49, 'CAMISA', 10, 'camisas', 'Camisas de color morado', NULL, 60000, 2, 15, 6, 58, 17),
(50, 'CAMISA', 16, 'camisas', 'Camisa rosada', NULL, 60000, 6, 14, 6, 59, 16),
(51, 'CAMISA', 8, 'camisas', 'Camisa de color blanco', NULL, 60000, 6, 17, 6, 60, 16),
(52, 'PANTALON DRILL', 1, 'pantalon', 'Pantalon gris', NULL, 12312312, 1, 16, 6, 61, 20),
(53, 'PANTALON LINO', 12, 'pantalon', 'Pantalon de lino negro', NULL, 12312312, 2, 16, 11, 63, 19),
(54, 'PANTALON GABARDINA', 12, 'pantalon', 'Pantalon de gabardina', NULL, 12312312, 2, 16, 6, 64, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profile`
--

CREATE TABLE `profile` (
  `Profile_id` int(11) NOT NULL,
  `Profile_name` varchar(50) DEFAULT NULL,
  `Profile_lastname` varchar(50) DEFAULT NULL,
  `Profile_phone` int(10) DEFAULT NULL,
  `Profile_number_document` varchar(10) DEFAULT NULL,
  `User_fk` int(11) DEFAULT NULL,
  `image_fk` int(11) DEFAULT NULL,
  `Type_document_fk` int(11) DEFAULT NULL,
  `Address_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE `role` (
  `Role_id` int(11) NOT NULL,
  `Role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`Role_id`, `Role_name`) VALUES
(19, 'Cliente'),
(21, 'Admin'),
(22, 'Empresa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_module`
--

CREATE TABLE `role_module` (
  `Role_module_id` int(11) NOT NULL,
  `Role_fk` int(11) DEFAULT NULL,
  `Module_fk` int(11) DEFAULT NULL,
  `Per_show` int(11) NOT NULL DEFAULT 1,
  `Per_create` int(11) NOT NULL DEFAULT 0,
  `Per_update` int(11) NOT NULL DEFAULT 0,
  `Per_delete` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `size`
--

CREATE TABLE `size` (
  `Size_id` int(11) NOT NULL,
  `Size_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `size`
--

INSERT INTO `size` (`Size_id`, `Size_name`) VALUES
(5, 'L'),
(6, 'S'),
(11, 'M'),
(12, 'X'),
(13, 'XL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `state_order`
--

CREATE TABLE `state_order` (
  `State_order_id` int(11) NOT NULL,
  `State_order_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `state_user`
--

CREATE TABLE `state_user` (
  `State_user_id` int(11) NOT NULL,
  `State_user_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `state_user`
--

INSERT INTO `state_user` (`State_user_id`, `State_user_name`) VALUES
(1, 'activo'),
(2, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_document`
--

CREATE TABLE `type_document` (
  `Type_document_id` int(11) NOT NULL,
  `Type_document_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_document`
--

INSERT INTO `type_document` (`Type_document_id`, `Type_document_name`) VALUES
(2, 'prueba Tipo de Documento'),
(3, 'prueba Tipo de Documento2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_product`
--

CREATE TABLE `type_product` (
  `Type_product_id` int(11) NOT NULL,
  `Type_product_name` varchar(255) NOT NULL,
  `Type_product_category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_product`
--

INSERT INTO `type_product` (`Type_product_id`, `Type_product_name`, `Type_product_category`) VALUES
(11, 'Gaban', 'Torso'),
(13, 'BLAZER', 'Torso'),
(14, 'Abrigo Formal', 'Torso'),
(15, 'Americana', 'camisas'),
(16, 'PASADOR', 'Torso'),
(17, 'ALFILERADA', 'Torso'),
(18, 'Gabardina', 'pantalon'),
(19, 'LINO', 'pantalon'),
(20, 'Drill', 'pantalon');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `User_id` int(11) NOT NULL,
  `User_name` varchar(255) DEFAULT NULL,
  `User_mail` varchar(50) DEFAULT NULL,
  `User_password` varchar(255) DEFAULT NULL,
  `Role_fk` int(11) DEFAULT NULL,
  `State_user_fk` int(11) DEFAULT NULL,
  `Company_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`User_id`, `User_name`, `User_mail`, `User_password`, `Role_fk`, `State_user_fk`, `Company_fk`) VALUES
(25, 'Daniel', 'diomedesmunozcardenas@gmail.com', '$2b$10$TdixlsN7oz3uTdSCfwRrG.GEvT9Sz2M8ty1ffIK1HzNJ6qWVnEcEu', 21, 1, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`Address_id`);

--
-- Indices de la tabla `api_users`
--
ALTER TABLE `api_users`
  ADD PRIMARY KEY (`Api_user_id`);

--
-- Indices de la tabla `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`Brand_id`);

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`Client_id`);

--
-- Indices de la tabla `codige`
--
ALTER TABLE `codige`
  ADD PRIMARY KEY (`Codige_id`),
  ADD KEY `Orders_fk` (`Orders_fk`);

--
-- Indices de la tabla `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`Color_id`);

--
-- Indices de la tabla `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`Company_id`),
  ADD UNIQUE KEY `Company_mail` (`Company_mail`);

--
-- Indices de la tabla `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`Image_id`),
  ADD UNIQUE KEY `Image_url` (`Image_url`);

--
-- Indices de la tabla `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`Module_id`),
  ADD UNIQUE KEY `icon` (`Module_icon`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Orders_id`),
  ADD KEY `Product_id_fk` (`Product_fk`),
  ADD KEY `User_fk` (`User_fk`),
  ADD KEY `State_order_fk` (`State_order_fk`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`Product_id`),
  ADD KEY `Brand_id` (`Brand_fk`),
  ADD KEY `Color_id` (`Color_fk`),
  ADD KEY `Size_id` (`Size_fk`),
  ADD KEY `product_fk_images` (`Image_fk`),
  ADD KEY `product_fk_Type_product` (`Type_product_fk`);

--
-- Indices de la tabla `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`Profile_id`),
  ADD UNIQUE KEY `Profile_phone` (`Profile_phone`),
  ADD UNIQUE KEY `Profile_number_document` (`Profile_number_document`),
  ADD UNIQUE KEY `User_id` (`User_fk`),
  ADD KEY `profile_fk_image` (`image_fk`),
  ADD KEY `Type_document_fk` (`Type_document_fk`),
  ADD KEY `Address_fk` (`Address_fk`);

--
-- Indices de la tabla `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`Role_id`);

--
-- Indices de la tabla `role_module`
--
ALTER TABLE `role_module`
  ADD PRIMARY KEY (`Role_module_id`),
  ADD KEY `Role_fk` (`Role_fk`),
  ADD KEY `Module_fk` (`Module_fk`);

--
-- Indices de la tabla `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`Size_id`);

--
-- Indices de la tabla `state_order`
--
ALTER TABLE `state_order`
  ADD PRIMARY KEY (`State_order_id`);

--
-- Indices de la tabla `state_user`
--
ALTER TABLE `state_user`
  ADD PRIMARY KEY (`State_user_id`);

--
-- Indices de la tabla `type_document`
--
ALTER TABLE `type_document`
  ADD PRIMARY KEY (`Type_document_id`);

--
-- Indices de la tabla `type_product`
--
ALTER TABLE `type_product`
  ADD PRIMARY KEY (`Type_product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_id`),
  ADD KEY `Role_id` (`Role_fk`),
  ADD KEY `State_user_id` (`State_user_fk`),
  ADD KEY `Company_id` (`Company_fk`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `address`
--
ALTER TABLE `address`
  MODIFY `Address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `api_users`
--
ALTER TABLE `api_users`
  MODIFY `Api_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `brand`
--
ALTER TABLE `brand`
  MODIFY `Brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `Client_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `codige`
--
ALTER TABLE `codige`
  MODIFY `Codige_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `color`
--
ALTER TABLE `color`
  MODIFY `Color_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `company`
--
ALTER TABLE `company`
  MODIFY `Company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `images`
--
ALTER TABLE `images`
  MODIFY `Image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `module`
--
ALTER TABLE `module`
  MODIFY `Module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `Orders_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `Product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `profile`
--
ALTER TABLE `profile`
  MODIFY `Profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `role`
--
ALTER TABLE `role`
  MODIFY `Role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `role_module`
--
ALTER TABLE `role_module`
  MODIFY `Role_module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `size`
--
ALTER TABLE `size`
  MODIFY `Size_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `state_order`
--
ALTER TABLE `state_order`
  MODIFY `State_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `state_user`
--
ALTER TABLE `state_user`
  MODIFY `State_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `type_document`
--
ALTER TABLE `type_document`
  MODIFY `Type_document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `type_product`
--
ALTER TABLE `type_product`
  MODIFY `Type_product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `codige`
--
ALTER TABLE `codige`
  ADD CONSTRAINT `codige_ibfk_1` FOREIGN KEY (`Orders_fk`) REFERENCES `orders` (`Orders_id`);

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`Product_fk`) REFERENCES `product` (`Product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`User_fk`) REFERENCES `users` (`User_id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`State_order_fk`) REFERENCES `state_order` (`State_order_id`);

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_fk_Type_product` FOREIGN KEY (`Type_product_fk`) REFERENCES `type_product` (`Type_product_id`),
  ADD CONSTRAINT `product_fk_brand` FOREIGN KEY (`Brand_fk`) REFERENCES `brand` (`Brand_id`),
  ADD CONSTRAINT `product_fk_color` FOREIGN KEY (`Color_fk`) REFERENCES `color` (`Color_id`),
  ADD CONSTRAINT `product_fk_images` FOREIGN KEY (`Image_fk`) REFERENCES `images` (`Image_id`),
  ADD CONSTRAINT `product_fk_size` FOREIGN KEY (`Size_fk`) REFERENCES `size` (`Size_id`);

--
-- Filtros para la tabla `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_fk_user` FOREIGN KEY (`User_fk`) REFERENCES `users` (`User_id`),
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`Type_document_fk`) REFERENCES `type_document` (`Type_document_id`),
  ADD CONSTRAINT `profile_ibfk_2` FOREIGN KEY (`Address_fk`) REFERENCES `address` (`Address_id`);

--
-- Filtros para la tabla `role_module`
--
ALTER TABLE `role_module`
  ADD CONSTRAINT `role_module_fk_module` FOREIGN KEY (`Module_fk`) REFERENCES `module` (`Module_id`),
  ADD CONSTRAINT `role_module_fk_role` FOREIGN KEY (`Role_fk`) REFERENCES `role` (`Role_id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_fk_company` FOREIGN KEY (`Company_fk`) REFERENCES `company` (`Company_id`),
  ADD CONSTRAINT `users_fk_role` FOREIGN KEY (`Role_fk`) REFERENCES `role` (`Role_id`),
  ADD CONSTRAINT `users_fk_state_user` FOREIGN KEY (`State_user_fk`) REFERENCES `state_user` (`State_user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
