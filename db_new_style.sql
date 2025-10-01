-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-10-2025 a las 04:06:07
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
(1, 'sdadad', 'sadadsad', 'dsaad', 'dasda');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `address_profile`
--

CREATE TABLE `address_profile` (
  `Address_profile_id` int(11) NOT NULL,
  `Address_id_fk` int(11) DEFAULT NULL,
  `Profile_id_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(3, 'Master'),
(5, 'SENA');

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
(1, 'Azul'),
(2, 'Rojo'),
(4, 'Verde'),
(5, 'Beige'),
(6, 'Marron'),
(7, 'Vino'),
(8, 'Negro'),
(9, 'Gris'),
(10, 'Blanco'),
(11, 'Morado'),
(12, 'Rosa');

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
(4, 'Master', 'Calle12, Medellin, Colombia', '3135855789', 'master@gmail.com'),
(5, 'hipster', 'cll12 no 65-25', '3215698787', 'jose12@gmail.com'),
(6, '123', '123', '132', '132@gmail.com');

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
(5, 'Gabán Marron', '/public/assets/imgs/file-1752345238390-890141172.png'),
(9, 'Gabán Azul Casual', '/public/assets/imgs/file-1752345253348-194217967.jpg'),
(10, 'Gabán Beige Elegante', '/public/assets/imgs/file-1752345278324-253536173.png'),
(12, 'Gaban negro Clasico', '/public/assets/imgs/file-1752345291953-343695301.png'),
(13, 'Gabán Gris', '/public/assets/imgs/file-1752345302756-487276008.png'),
(14, 'Gabán Vino', '/public/assets/imgs/file-1752345366066-291584180.png'),
(15, 'Blazer Marron', '/public/assets/imgs/file-1752345390459-56107428.png'),
(16, 'Blazer Negro', '/public/assets/imgs/file-1752345409664-92542091.png'),
(17, 'Blazer azul', '/public/assets/imgs/file-1752345509608-292140403.png'),
(18, 'Blazer vino', '/public/assets/imgs/file-1752345536446-802643366.png'),
(19, 'Blazer Beige', '/public/assets/imgs/file-1752345550971-222038477.png'),
(20, 'Abrigo formal azul', '/public/assets/imgs/file-1752345722597-59766409.jpg'),
(21, 'Abrigo formal beige', '/public/assets/imgs/file-1752345737193-584703283.jpg'),
(22, 'Abrigo formal negro', '/public/assets/imgs/file-1752345751031-648256689.jpg'),
(23, 'Abrigo formal Marron', '/public/assets/imgs/file-1752345761809-814939246.jpg'),
(24, 'Camisa Alfilerada Rosa', '/public/assets/imgs/file-1752345777563-156721397.jpg'),
(25, 'Camisa Alfilerada Azul', '/public/assets/imgs/file-1752345786989-682293455.jpg'),
(26, 'Camisa Alfilerada Blanca', '/public/assets/imgs/file-1752345803422-341400602.jpg'),
(27, 'Camisa Alfilerada Morada', '/public/assets/imgs/file-1752345813964-371874768.jpg'),
(28, 'Americana negra', '/public/assets/imgs/file-1752345828245-811142538.png'),
(29, 'Americana Roja', '/public/assets/imgs/file-1752345840601-857446229.jpg'),
(30, 'Americana azul', '/public/assets/imgs/file-1752345859507-217704074.jpg'),
(31, 'Americana Marron', '/public/assets/imgs/file-1752345874899-334882584.jpg'),
(34, 'Pantalo Beige', '/public/assets/imgs/file-1752346065130-946150012.jpg'),
(35, 'Pantalon negro', '/public/assets/imgs/file-1752346443557-134287300.png'),
(36, 'pantalon azul', '/public/assets/imgs/file-1752346530837-445847229.png');

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

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`Orders_id`, `Product_fk`, `User_fk`, `State_order_fk`) VALUES
(1, 17, 25, 2),
(2, 18, 27, 2);

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
(16, 'Blazer beige', 213, 'TORSO', 'Fresco y distinguido', NULL, 230, 1, 5, 10, 19, 10),
(17, 'Blazer Azul', 131, 'TORSO', 'Clásico y profesional', NULL, 351, 3, 1, 5, 17, 10),
(18, 'Blazer negro', 132, 'torso', 'Impecable para oficina', NULL, 90, 3, 8, 6, 16, 10),
(19, 'Gabán Vino Burdeos Formal', 513, 'Torso', 'Color profundo y elegante', NULL, 300, 2, 1, 6, 14, 3),
(20, 'Gabán Marrón Chocolate', 32, 'torso', 'Calidez con distinción', NULL, 201, 1, 6, 4, 5, 3),
(21, 'Gabán Gris Oxford', 13, 'TORSO', 'Formal y versátil', NULL, 199, 2, 8, 8, 13, 3),
(22, 'Gabán Negro Clásico', 321, 'TORSO', 'Ideal para diario', NULL, 179, 3, 8, 9, 12, 3),
(23, 'Gabán Beige Elegante', 300, 'TORSO', 'Estilo sobrio y moderno', NULL, 205, 1, 5, 5, 10, 3),
(24, 'Gaban azul', 213, 'TORSO', 'Elegancia en todo clima', NULL, 190, 1, 1, 4, 9, 3),
(25, 'Blazer vino', 40, 'TORSO', 'Audaz y refinado', NULL, 65, 3, 2, 9, 18, 10),
(26, 'Abrigo formal Negro', 40, 'TORSO', 'Distinción en cada paso', NULL, 105, 3, 8, 6, 22, 9),
(27, 'Abrigo formal Azul', 40, 'TORSO', 'Clásico y sobrio', NULL, 205, 3, 1, 5, 20, 9),
(28, 'Abrigo formal Beige', 40, 'TORSO', 'Estilo cálido atemporal', NULL, 160, 3, 5, 4, 21, 9),
(29, 'Abrigo formal Marron', 40, 'TORSO', 'Toque moderno sofisticado', NULL, 160, 2, 6, 4, 23, 9),
(30, 'Camisa Alfilerada Rosa', 60, 'camisas', 'Elegancia fresca diaria', NULL, 85, 1, 12, 6, 24, 6),
(31, 'Camisa Alfilerada Morada', 40, 'camisas', 'Sutileza con estilo', NULL, 90, 2, 11, 9, 27, 6),
(32, 'Camisa Alfilerada Blanca', 80, 'camisas', 'Formal y moderna', NULL, 105, 3, 10, 4, 26, 6),
(33, 'Camisa Alfilerada Azul', 30, 'camisas', 'Toque elegante suave', NULL, 150, 2, 1, 9, 25, 6),
(34, 'Camisa Americana Negra', 200, 'camisas', 'Toque elegante suave', NULL, 130, 2, 8, 9, 28, 7),
(35, 'Camisa Americana Roja', 80, 'camisas', 'Estilo fresco sutil', NULL, 130, 1, 2, 6, 29, 7),
(36, 'Camisa Americana Azul', 40, 'camisas', 'Versátil y sobria', NULL, 180, 2, 1, 9, 30, 7),
(37, 'Camisa Americana Marron', 65, 'camisas', 'Ligera y profesional', NULL, 180, 2, 6, 4, 31, 7),
(38, 'Pantalon de Drill', 500, 'pantalon', 'Pantalon casual para el dia a dia', NULL, 60, 3, 8, 5, 35, 2),
(39, 'Pantalon Gabardina', 500, 'pantalon', 'Pantalon ideal para salir con amigos', NULL, 60, 1, 5, 4, 34, 4),
(40, 'Pantalon Gabardina', 30, 'pantalon', 'Elegante y casual', NULL, 60, 2, 1, 4, 36, 5);

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
  `Type_document_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profile`
--

INSERT INTO `profile` (`Profile_id`, `Profile_name`, `Profile_lastname`, `Profile_phone`, `Profile_number_document`, `User_fk`, `image_fk`, `Type_document_fk`) VALUES
(2, 'pruebaNombre', 'pruebaApellido', 1234567891, '1234567898', 25, 5, 2);

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
(22, 'Bodega'),
(23, 'Empresa'),
(24, '123');

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

--
-- Volcado de datos para la tabla `role_module`
--

INSERT INTO `role_module` (`Role_module_id`, `Role_fk`, `Module_fk`, `Per_show`, `Per_create`, `Per_update`, `Per_delete`) VALUES
(1, 21, 1, 1, 1, 1, 1),
(2, 21, 2, 1, 1, 1, 1),
(3, 21, 3, 1, 1, 1, 1),
(4, 21, 4, 1, 1, 1, 1),
(5, 21, 5, 1, 1, 1, 1),
(7, 19, 5, 1, 0, 0, 0),
(8, 22, 11, 1, 1, 1, 1),
(9, 22, 15, 1, 1, 1, 1),
(10, 22, 14, 1, 1, 1, 1),
(11, 22, 13, 1, 1, 1, 1),
(12, 21, 9, 1, 1, 1, 1),
(13, 21, 10, 1, 1, 1, 1),
(14, 21, 11, 1, 1, 1, 1),
(15, 21, 12, 1, 1, 1, 1),
(16, 21, 13, 1, 1, 1, 1),
(17, 21, 14, 1, 1, 1, 1),
(18, 21, 15, 1, 1, 1, 1),
(19, 23, 1, 1, 1, 1, 1),
(20, 23, 11, 1, 1, 1, 1),
(21, 23, 14, 1, 1, 1, 1),
(22, 23, 15, 1, 1, 1, 1);

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
(4, 'M'),
(5, 'L'),
(6, 'S'),
(7, 'XS'),
(8, 'X'),
(9, 'XL'),
(10, 'XXL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `state_order`
--

CREATE TABLE `state_order` (
  `State_order_id` int(11) NOT NULL,
  `State_order_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `state_order`
--

INSERT INTO `state_order` (`State_order_id`, `State_order_name`) VALUES
(2, 'prueba ESTADO'),
(3, 'prueba ESTADOs');

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
(2, 'Drill', 'Pantalon'),
(3, 'GABAN', 'TORSO'),
(4, 'Gabardina', 'Pantalon'),
(5, 'Lino', 'Pantalon'),
(6, 'Alfilerada', 'camisas'),
(7, 'Americana', 'camisas'),
(8, 'Pasador', 'camisas'),
(9, 'ABRIGO FORMAL', 'TORSO'),
(10, 'blazer', 'torso');

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
(25, 'Daniel', 'diomedesmunozcardenas@gmail.com', '$2b$10$TdixlsN7oz3uTdSCfwRrG.GEvT9Sz2M8ty1ffIK1HzNJ6qWVnEcEu', 21, 1, NULL),
(27, 'Diego Casallas', 'diego@email.com', '$2b$10$Hv7dxmR2h4MAS7V/K4vfpOQTgFLuLyWHMKPRC/vlme2xEo.3gp2hy', 21, 1, 4),
(28, 'sebastian', 'sebastian@gmail.com', '$2b$10$di8di7o.lHDkksPiSE0/tORhl.1BlgwJ12uBx.Fl8Yysm4HpZc4Gu', 19, 2, NULL),
(31, '11111', 'Prueba1@gmail.com', '$2b$10$0nUvBrm3WGIf9aI1Iebw7uwXhv3Ie2WHLQhml1kjjWV/Coj75/OM2', 21, 2, NULL),
(32, 'Ferney', 'ferney12@email.com', '$2b$10$SpkewbvGlHMoknToZSiaJ.x7D/U4ahbForwXq2zwHrF2MxSaXV76u', 19, 2, NULL),
(33, 'prueba', 'prueba2@email.com', '$2b$10$kfnhwU031stJ4PyXktjd4.uKkUKa32pX8ppiTRwe7hMX.Bn1gmEty', 19, 2, NULL),
(35, 'nuevo', 'nuevo@gmail.com', '$2b$10$YPWItZEkNTttV8JYMYhC2.EQfJwVcUynmsrFvQD2tBpawddE5Vqy6', 19, 2, NULL),
(36, 'Daniel', 'daniel@gmail.com', '$2b$10$YdDoi1voSVRHblKdtjLrh.xU/HLEatiptNvQLWv9lQaj2GdNUMjGu', 19, 2, NULL),
(37, 'Daniel', 'daniel@gmail.com', '$2b$10$i/F/d78yBf2LNfHPyopjmeDer.qbJCZAkOohM96yXTYMnbQfVRnHK', 19, 2, NULL),
(38, 'Daniel', 'daniel@gmail.com', '$2b$10$DUBI0RoAuEYaFvEx7iVO5.r0cyIC7GFrEY8zheLhzG0xXkREyUemS', 19, 2, NULL),
(39, 'danielPrueba', 'danielPrueba@gmail.com', '$2b$10$wucdPqX7FsucslL1owvfu.Eb6COhqk/4zuLLQiEUxyhVL5rGQ9tpq', 19, 2, NULL),
(41, 'Alejandro12', 'alejandro1221@gmail,com', '$2b$10$OyLyyBedCD8828hhLZxUWu.EoTRs8sbnwq56o/2Rb8L/oTSM05502', 19, 2, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`Address_id`);

--
-- Indices de la tabla `address_profile`
--
ALTER TABLE `address_profile`
  ADD PRIMARY KEY (`Address_profile_id`),
  ADD KEY `Address_id_fk` (`Address_id_fk`),
  ADD KEY `Profile_id_fk` (`Profile_id_fk`);

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
  ADD KEY `Type_document_fk` (`Type_document_fk`);

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
  MODIFY `Address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `address_profile`
--
ALTER TABLE `address_profile`
  MODIFY `Address_profile_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `api_users`
--
ALTER TABLE `api_users`
  MODIFY `Api_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `brand`
--
ALTER TABLE `brand`
  MODIFY `Brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `client`
--
ALTER TABLE `client`
  MODIFY `Client_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `codige`
--
ALTER TABLE `codige`
  MODIFY `Codige_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `color`
--
ALTER TABLE `color`
  MODIFY `Color_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `company`
--
ALTER TABLE `company`
  MODIFY `Company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `images`
--
ALTER TABLE `images`
  MODIFY `Image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `module`
--
ALTER TABLE `module`
  MODIFY `Module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `Orders_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `Product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `profile`
--
ALTER TABLE `profile`
  MODIFY `Profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `Size_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `Type_product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `address_profile`
--
ALTER TABLE `address_profile`
  ADD CONSTRAINT `address_profile_ibfk_1` FOREIGN KEY (`Address_id_fk`) REFERENCES `address` (`Address_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `address_profile_ibfk_2` FOREIGN KEY (`Profile_id_fk`) REFERENCES `profile` (`Profile_id`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`Type_document_fk`) REFERENCES `type_document` (`Type_document_id`);

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
