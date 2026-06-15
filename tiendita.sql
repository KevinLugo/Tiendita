-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 15-06-2026 a las 02:38:27
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tiendita`
--
CREATE DATABASE IF NOT EXISTS `tiendita` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tiendita`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `idCat` int NOT NULL AUTO_INCREMENT,
  `nomCat` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idCat`),
  UNIQUE KEY `nomCat` (`nomCat`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`idCat`, `nomCat`) VALUES
(1, 'Lácteos y Huevos'),
(2, 'Bebidas y Jugos'),
(3, 'Botanas y Snacks'),
(4, 'Enlatados y Conservas'),
(5, 'Cuidado del Hogar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

DROP TABLE IF EXISTS `detalle_ventas`;
CREATE TABLE IF NOT EXISTS `detalle_ventas` (
  `idDet` int NOT NULL AUTO_INCREMENT,
  `idVenta` int NOT NULL,
  `idProd` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idDet`),
  KEY `idVenta` (`idVenta`),
  KEY `idProd` (`idProd`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`idDet`, `idVenta`, `idProd`, `cantidad`, `precio`) VALUES
(1, 1, 1, 2, 25.00),
(2, 1, 3, 1, 35.00),
(3, 1, 5, 1, 11.50),
(4, 2, 2, 1, 58.00),
(5, 2, 6, 2, 19.00),
(6, 2, 10, 1, 41.00),
(7, 3, 4, 2, 20.00),
(8, 3, 7, 1, 15.00),
(9, 4, 1, 4, 25.00),
(10, 5, 1, 1, 25.00),
(11, 5, 2, 1, 58.00),
(12, 6, 5, 1, 11.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `idProd` int NOT NULL AUTO_INCREMENT,
  `codBar` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomProd` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idCat` int NOT NULL,
  `idProv` int NOT NULL,
  `pCompra` decimal(10,2) NOT NULL,
  `pVenta` decimal(10,2) NOT NULL,
  `sActual` int NOT NULL DEFAULT '0',
  `sMin` int NOT NULL DEFAULT '5',
  `creado_por` int NOT NULL,
  `fechaCad` date NOT NULL,
  `estatus` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`idProd`),
  UNIQUE KEY `codBar` (`codBar`),
  KEY `idCat` (`idCat`),
  KEY `idProv` (`idProv`),
  KEY `creado_por` (`creado_por`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idProd`, `codBar`, `nomProd`, `idCat`, `idProv`, `pCompra`, `pVenta`, `sActual`, `sMin`, `creado_por`, `fechaCad`, `estatus`) VALUES
(1, '7501001', 'Leche Entera 1L', 1, 1, 19.50, 25.00, 19, 10, 1, '2027-07-05', 1),
(2, '7501002', 'Queso Panela 400g', 1, 1, 42.00, 58.00, 2, 6, 1, '2027-07-05', 1),
(3, '7502001', 'Refresco de Cola 2.5L', 2, 2, 26.00, 35.00, 40, 15, 1, '2027-07-05', 1),
(4, '7502002', 'Jugo de Naranja 1L', 2, 2, 14.00, 20.00, 4, 8, 1, '2027-07-05', 1),
(5, '7502003', 'Agua Purificada 600ml', 2, 2, 6.00, 11.50, 5, 12, 1, '2027-07-05', 1),
(6, '7503001', 'Papas Fritas Con Sal', 3, 3, 13.50, 19.00, 18, 8, 1, '2027-07-05', 1),
(7, '7503002', 'Churritos de Maíz 200g', 3, 3, 9.00, 15.00, 5, 5, 1, '2027-07-05', 1),
(8, '7504001', 'Atún en Agua 140g', 4, 4, 15.00, 22.00, 30, 10, 1, '2027-07-05', 1),
(9, '7504002', 'Frijoles Bayos Refritos', 4, 4, 11.00, 16.50, 2, 8, 1, '2027-07-05', 1),
(10, '7505001', 'Detergente Líquido 1L', 5, 2, 28.00, 41.00, 12, 4, 1, '2027-07-05', 1),
(11, '1234567', 'Sabritas', 3, 3, 10.00, 15.00, 32, 5, 1, '2026-07-08', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE IF NOT EXISTS `proveedores` (
  `idProv` int NOT NULL AUTO_INCREMENT,
  `nomEmp` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomProv` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telProv` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailProv` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idProv`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`idProv`, `nomEmp`, `nomProv`, `telProv`, `emailProv`) VALUES
(1, 'Lácteos del Valle S.A.', 'Carlos Mendoza', '5551110192', 'carlos@valle.com'),
(2, 'Embotelladora Central', 'Patricia Sosa', '555-0483', 'ventas@embo-central.com'),
(3, 'Snacks del Sur', 'Ramiro Guerra', '555-0921', 'ramiro.g@snackssur.com'),
(4, 'La Costeña Distribuidora', 'Laura Ruiz', '555-0744', 'lruiz@lacostena.com'),
(5, 'NA', 'Pablito', '5531231231', 'kiensabe@algo.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `idRol` int NOT NULL AUTO_INCREMENT,
  `nomRol` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idRol`),
  UNIQUE KEY `nomRol` (`nomRol`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idRol`, `nomRol`) VALUES
(1, 'Administrador'),
(2, 'Vendedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `psw` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apPat` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apMat` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(55) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rfc` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salario` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `turno` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idRol` int NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `user` (`user`),
  KEY `idRol` (`idRol`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUser`, `user`, `psw`, `nom`, `apPat`, `apMat`, `tel`, `email`, `rfc`, `salario`, `activo`, `turno`, `idRol`) VALUES
(1, 'che', '321', 'Chenchoo', 'Fulgencio', 'Gonzales', '5532330829', 'chencho123@gmail.com', 'ABCD123456HGF', 15, 1, 'Matutino', 1),
(2, 'ana', 'abc', 'Ana', 'López', 'Lopez', '5521234254', 'anazi@hotmail.com', 'BCDA098765ABC', 3, 1, 'Vespertino', 2),
(3, 'federico', '123', 'Pablo', 'P', 'Luche', '1123123123', 'si@adsas', 'AJPA900510XYZ', 3, 1, 'Matutino', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
  `idVenta` int NOT NULL AUTO_INCREMENT,
  `fechaVenta` datetime DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `idVendedor` int NOT NULL,
  PRIMARY KEY (`idVenta`),
  KEY `idVendedor` (`idVendedor`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `fechaVenta`, `total`, `idVendedor`) VALUES
(1, '2026-06-12 09:15:00', 94.50, 2),
(2, '2026-06-12 11:30:00', 135.00, 1),
(3, '2026-06-12 14:20:00', 55.00, 2),
(4, '2026-06-13 22:12:15', 100.00, 1),
(5, '2026-06-13 22:12:36', 83.00, 1),
(6, '2026-06-14 00:24:48', 11.50, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
