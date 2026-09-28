-- MySQL dump 10.13  Distrib 9.4.0, for macos14.7 (arm64)
--
-- Host: localhost    Database: cinema
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoriums`
--

DROP TABLE IF EXISTS `auditoriums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoriums` (
  `auditorium_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `total_seats` int NOT NULL,
  `rows_count` int DEFAULT NULL,
  `seats_per_row` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`auditorium_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoriums`
--

LOCK TABLES `auditoriums` WRITE;
/*!40000 ALTER TABLE `auditoriums` DISABLE KEYS */;
INSERT INTO `auditoriums` VALUES (1,'Auditorium 1',100,10,10,1);
/*!40000 ALTER TABLE `auditoriums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_items`
--

DROP TABLE IF EXISTS `booking_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_items` (
  `booking_item_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `ticket_id` int NOT NULL,
  `seat_number` varchar(10) DEFAULT NULL,
  `age_category` varchar(20) DEFAULT NULL,
  `unit_price` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`booking_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_items`
--

LOCK TABLES `booking_items` WRITE;
/*!40000 ALTER TABLE `booking_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `booking_number` varchar(50) DEFAULT NULL,
  `user_id` int NOT NULL,
  `showtime_id` int NOT NULL,
  `booking_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_tickets` int NOT NULL,
  `subtotal` decimal(8,2) DEFAULT NULL,
  `tax_amount` decimal(8,2) DEFAULT NULL,
  `online_fee` decimal(8,2) DEFAULT NULL,
  `discount_amount` decimal(8,2) DEFAULT NULL,
  `total_amount` decimal(8,2) DEFAULT NULL,
  `promo_code` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `card_last_four` varchar(4) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','EXPIRED') DEFAULT 'PENDING',
  `confirmation_email_sent` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking_number` (`booking_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_payment`
--

DROP TABLE IF EXISTS `card_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_payment` (
  `card_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `card_num` varchar(100) DEFAULT NULL,
  `bill_address` varchar(100) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`card_id`),
  KEY `card_customer` (`user_id`),
  CONSTRAINT `card_customer` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_payment`
--

LOCK TABLES `card_payment` WRITE;
/*!40000 ALTER TABLE `card_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `card_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_payments`
--

DROP TABLE IF EXISTS `card_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_payments` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `card_holder_name` varchar(255) DEFAULT NULL,
  `card_brand` varchar(32) DEFAULT NULL,
  `card_last4` char(4) DEFAULT NULL,
  `enc_card_number` text,
  `enc_expiry` text,
  `enc_cvv` text,
  `billing_address` varchar(255) DEFAULT NULL,
  `billing_city` varchar(100) DEFAULT NULL,
  `billing_state` varchar(100) DEFAULT NULL,
  `billing_zip` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`card_id`),
  KEY `fk_card_user` (`user_id`),
  CONSTRAINT `fk_card_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_payments`
--

LOCK TABLES `card_payments` WRITE;
/*!40000 ALTER TABLE `card_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `card_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movie_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `rating` varchar(100) DEFAULT NULL,
  `duration` int unsigned DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `synopsis` text,
  `release_year` year DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `duration_mins` int DEFAULT NULL,
  `poster_url` varchar(1024) DEFAULT NULL,
  `trailer_url` varchar(1024) DEFAULT NULL,
  `is_now_showing` tinyint(1) DEFAULT '0',
  `mpaa_rating` varchar(10) DEFAULT NULL,
  `cast` text,
  `director` varchar(255) DEFAULT NULL,
  `producer` varchar(255) DEFAULT NULL,
  `reviews` text,
  `trailer_video_url` varchar(1024) DEFAULT NULL,
  `category` enum('Currently Running','Coming Soon') NOT NULL DEFAULT 'Currently Running',
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (9,'Interstellar','PG-13',NULL,NULL,'A team travels through a wormhole in space.',NULL,'2014-11-07',169,NULL,'https://www.youtube.com/embed/zSWdZVtXT7E',1,NULL,NULL,'Christopher Nolan',NULL,NULL,NULL,'Currently Running'),(10,'Dune: Part Two','PG-13',NULL,NULL,'Paul Atreides unites with Chani and the Fremen.',NULL,'2024-03-01',166,NULL,'https://www.youtube.com/embed/Way9Dexny3w',0,NULL,NULL,'Denis Villeneuve',NULL,NULL,NULL,'Coming Soon');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `promo_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `percent` decimal(5,2) DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `starts_on` date DEFAULT NULL,
  `ends_on` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`promo_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'FALL20','20% off autumn promo',20.00,NULL,NULL,NULL,1),(6,'SUMMER20','20% OFF PROMOTION',20.00,5.00,'2025-10-27','2025-10-31',1),(7,'WINTER20','20% OFF WINTER PROMO',20.00,5.00,'2025-10-30','2025-11-07',1);
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `seat_id` int NOT NULL AUTO_INCREMENT,
  `auditorium_id` int NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `seat_row` varchar(10) DEFAULT NULL,
  `seat_type` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`seat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'A01','A','regular',1),(2,1,'A02','A','regular',1),(3,1,'A03','A','regular',1),(4,1,'B01','B','regular',1),(5,1,'B02','B','regular',1);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `showtimes`
--

DROP TABLE IF EXISTS `showtimes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `showtimes` (
  `showtime_id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `auditorium` varchar(64) NOT NULL,
  `start_time` datetime NOT NULL,
  `base_price` decimal(8,2) NOT NULL DEFAULT '10.00',
  PRIMARY KEY (`showtime_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `showtimes`
--

LOCK TABLES `showtimes` WRITE;
/*!40000 ALTER TABLE `showtimes` DISABLE KEYS */;
INSERT INTO `showtimes` VALUES (11,9,'Aud 1','2025-10-27 18:12:57',12.00),(12,10,'Aud 1','2025-10-27 18:12:57',12.00),(13,9,'Main Theater','2025-10-30 16:00:00',12.00);
/*!40000 ALTER TABLE `showtimes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theatre`
--

DROP TABLE IF EXISTS `theatre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theatre` (
  `theatre_id` int unsigned NOT NULL,
  `t_name` varchar(100) DEFAULT NULL,
  `t_address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`theatre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theatre`
--

LOCK TABLES `theatre` WRITE;
/*!40000 ALTER TABLE `theatre` DISABLE KEYS */;
/*!40000 ALTER TABLE `theatre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `showtime_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `age_category` varchar(20) DEFAULT NULL,
  `base_price` decimal(8,2) DEFAULT NULL,
  `final_price` decimal(8,2) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwords` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(50) DEFAULT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `promo_subscription` enum('Inactive','Active') NOT NULL DEFAULT 'Inactive',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `subscribe_promotions` tinyint(1) DEFAULT '1',
  `card_type` varchar(50) DEFAULT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `card_expiration` varchar(10) DEFAULT NULL,
  `billing_address` text,
  `home_address` text,
  `account_suspended` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','User','admin@example.com',NULL,'admin123','555-1234','admin','Active','2025-10-25 23:47:05',1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,0),(2,'Test','User','test@example.com',NULL,'password123',NULL,'customer','Active',NULL,0,'eb232319-2cd9-4a78-a2be-a6560265e297',NULL,1,NULL,NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29 19:51:21
