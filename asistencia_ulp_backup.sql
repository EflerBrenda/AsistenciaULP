-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: asistencia_ulp
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_materia` int(11) DEFAULT NULL,
  `fecha_asistencia` date DEFAULT NULL,
  `hora_asistencia` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
INSERT INTO `asistencia` VALUES (1,8,1,'2022-09-05','10:00'),(2,9,1,'2022-09-05','10:00'),(7,12,1,'2022-09-05','10:00'),(8,8,1,'2022-11-01','10:00'),(9,8,1,'2022-11-09','10:00'),(10,9,1,'2022-11-09','10:00'),(11,8,2,'2022-08-04','10:00'),(12,9,2,'2022-08-04','10:00'),(13,8,2,'2022-07-21','10:00'),(14,9,2,'2022-07-22','10:00'),(16,11,2,'2022-08-04','10:00'),(17,12,2,'2022-08-04','10:00'),(18,11,2,'2022-08-05','10:00'),(19,12,2,'2022-08-05','10:00'),(20,8,2,'2022-08-05','10:00'),(21,9,2,'2022-08-05','10:00'),(22,11,2,'2022-07-29','10:00'),(23,12,2,'2022-07-29','10:00'),(24,8,2,'2022-07-29','10:00'),(25,9,2,'2022-07-29','10:00'),(26,11,2,'2022-07-28','10:00'),(27,12,2,'2022-07-28','10:00'),(28,8,2,'2022-07-28','10:00'),(29,9,2,'2022-07-28','10:00'),(30,11,2,'2022-08-11','10:00'),(31,12,2,'2022-08-11','10:00'),(32,8,2,'2022-08-11','10:00'),(33,9,2,'2022-08-11','10:00'),(34,8,3,'2022-08-03','10:00'),(35,9,3,'2022-08-03','10:00'),(36,8,3,'2022-08-10','10:00'),(37,9,3,'2022-08-10','10:00'),(38,8,3,'2022-08-17','10:00'),(39,9,3,'2022-08-17','10:00'),(40,8,3,'2022-08-24','10:00'),(41,9,3,'2022-08-24','10:00');
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursadomateria`
--

DROP TABLE IF EXISTS `cursadomateria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cursadomateria` (
  `id_cursadoMateria` int(11) NOT NULL AUTO_INCREMENT,
  `id_materia` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `condicion_alumno` int(1) DEFAULT 1 COMMENT '--1 REGULAR\r\n--2 PROMOCION\r\n--3 LIBRE',
  `habilitar_cursada` tinyint(4) DEFAULT 0 COMMENT '--0 AUN NO ACEPTADO --1 ACEPTADO --2 RECHAZADO',
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_cursadoMateria`),
  KEY `id_materia` (`id_materia`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `cursadomateria_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cursadomateria_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursadomateria`
--

LOCK TABLES `cursadomateria` WRITE;
/*!40000 ALTER TABLE `cursadomateria` DISABLE KEYS */;
INSERT INTO `cursadomateria` VALUES (1,1,8,1,1,'2022-08-15'),(2,1,9,1,1,'2022-08-15'),(17,1,11,1,1,'2022-12-06'),(18,1,12,1,1,'2022-12-06'),(19,2,8,1,1,'2022-12-07'),(20,2,9,1,1,'2022-12-09'),(21,2,12,1,1,'2022-12-09'),(22,2,11,1,1,'2022-12-09'),(23,3,8,1,1,'2022-12-09'),(24,3,9,1,1,'2022-12-09'),(25,9,8,1,1,'2022-12-14');
/*!40000 ALTER TABLE `cursadomateria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dictadomateria`
--

DROP TABLE IF EXISTS `dictadomateria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dictadomateria` (
  `id_dictadoMateria` int(11) NOT NULL AUTO_INCREMENT,
  `id_materia` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_dictadoMateria`),
  KEY `id_materia` (`id_materia`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `dictadomateria_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dictadomateria_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictadomateria`
--

LOCK TABLES `dictadomateria` WRITE;
/*!40000 ALTER TABLE `dictadomateria` DISABLE KEYS */;
INSERT INTO `dictadomateria` VALUES (1,1,2,'2022-07-05'),(14,3,2,'2022-07-19'),(23,2,2,'2022-08-04'),(34,9,7,'2022-12-14');
/*!40000 ALTER TABLE `dictadomateria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios`
--

DROP TABLE IF EXISTS `horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horarios` (
  `id_horario` int(11) NOT NULL AUTO_INCREMENT,
  `dia_cursado` int(11) DEFAULT NULL,
  `hora_desde` varchar(10) DEFAULT NULL,
  `hora_hasta` varchar(10) DEFAULT NULL,
  `clase_activa` tinyint(1) DEFAULT 1,
  `id_materia` int(11) DEFAULT NULL,
  `ver_horario` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_horario`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id_materia`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios`
--

LOCK TABLES `horarios` WRITE;
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;
INSERT INTO `horarios` VALUES (27,1,'10:00','13:00',1,1,1,'2022-11-21'),(30,2,'12:00','14:00',1,1,1,'2022-12-06'),(31,3,'15:00','18:30',1,1,1,'2022-12-06'),(32,4,'12:00','18:00',1,2,1,'2022-12-09'),(33,5,'15:00','18:30',1,2,1,'2022-12-09'),(34,3,'16:00','17:00',1,3,1,'2022-12-09'),(35,1,'10:00','12:00',1,2,1,'2022-12-12'),(36,1,'10:00','20:00',1,9,1,'2022-12-14'),(37,4,'12:00','17:00',1,1,1,'2022-12-14'),(38,5,'10:00','12:00',2,1,0,'2022-12-14');
/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materias` (
  `id_materia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_materia` varchar(255) DEFAULT NULL,
  `fecha_inicio_cursada` date DEFAULT NULL,
  `fecha_fin_cursada` date DEFAULT NULL,
  `ver_materia` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_materia`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
INSERT INTO `materias` VALUES (1,'Base de Datos','2022-09-01','2022-12-14',1,'2022-07-02'),(2,'Web II','2022-07-18','2022-08-31',1,'2022-07-02'),(3,'Ingles III','2022-08-01','2022-08-31',1,'2022-07-03'),(4,'Base de Datos III','2022-07-02','2022-07-02',0,'2022-07-03'),(8,'111','2022-12-14','2022-12-15',0,'2022-12-14'),(9,'TEST MATERIA','2022-12-14','2022-12-14',1,'2022-12-14');
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion_rol` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Coordinador'),(2,'Profesor'),(3,'Alumno');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20220624234502-create-usuario.js'),('20220624235309-create-asistencia.js'),('20220624235520-create-materia.js'),('20220624235737-create-horario.js'),('20220624235840-create-rol.js'),('20220625000031-create-dictado-materia.js'),('20220625000308-create-cursado-materia.js'),('20220625000636-create-roles.js'),('20220625004539-create-materias.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(255) DEFAULT NULL,
  `apellido_usuario` varchar(255) DEFAULT NULL,
  `email_usuario` varchar(255) DEFAULT NULL,
  `password_usuario` varchar(255) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `ver_usuario` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` date NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email_usuario` (`email_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'coordinador','coordinador','coordinador@ulp.edu.ar','$2b$10$jANvUHK2FaRdbDJjhmNI.euXk5k.3LbYgYR9cPxLIFeKOkW//pni2',1,1,'2022-06-27'),(2,'profesor','profesor','profesor@ulp.edu.ar','$2b$10$wJg0MjPOPIST81.9SaI94egKsu5eFSmScw/4dZupuf0koMYM1yRzq',2,1,'2022-06-27'),(3,'Brenda Roxana','Efler','befler@ulp.edu.ar','$2a$12$AXcb5qfpm07j7hHJBhz44uVxBG2Y0CsmL.YadcMtT8E3PxYiBylRG',2,1,'2022-06-27'),(7,'Jose','Velazquez','return@hh.com','$2b$10$B18T7jI8CsvzjRkZ35ZopumWnL5N4Igjuh/UcCJuyFaYWNi/4qU6.',2,1,'2022-07-01'),(8,'Evelyn','Benitez','alumno@ulp.edu.ar','$2b$10$jANvUHK2FaRdbDJjhmNI.euXk5k.3LbYgYR9cPxLIFeKOkW//pni2',3,1,'2022-08-11'),(9,'Julian','Quiroga','alumno2@ulp.edu.ar','$2b$10$jANvUHK2FaRdbDJjhmNI.euXk5k.3LbYgYR9cPxLIFeKOkW//pni2',3,1,'2022-08-11'),(10,'testa','testa','testa@ii.com','$2b$10$lMlvE2TSSA2jRohCPaYWFuajBaJ11dheYiW1maW.7UrKuDfnQtVGW',2,0,'2022-11-10'),(11,'Nancy','Gimenez','email@hotmail.com','$2b$10$jANvUHK2FaRdbDJjhmNI.euXk5k.3LbYgYR9cPxLIFeKOkW//pni2',3,1,'2022-12-06'),(12,'Federico','Guzman','email33@hotmail.com','$2b$10$jANvUHK2FaRdbDJjhmNI.euXk5k.3LbYgYR9cPxLIFeKOkW//pni2',3,0,'2022-12-06'),(13,'esteban','test','test@ii.com','$2b$10$OgCHDizEP3eD/amYGXuIveOa1bKXaMqLf9jTsOKByCtTErMbu20ai',1,0,'2022-12-14'),(14,'Fernando','Uchino','coordinador2@ulp.edu.ar','$2b$10$LIW7D0oppwBzCsU.KSMRZek1yO/cjltzO9VBPdpfQq8wG9ycqm4mu',1,1,'2022-12-14');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-14 20:57:26
