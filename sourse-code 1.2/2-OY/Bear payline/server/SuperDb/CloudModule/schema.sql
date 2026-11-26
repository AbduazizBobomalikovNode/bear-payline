-- Bear payline: faqat sxema (ma'lumotlarsiz). Asl dump'dan INSERT qatorlari olib tashlangan.
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: card
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `card` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(20) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `date` varchar(40) NOT NULL,
  `cvv` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`)
) ENGINE = InnoDB AUTO_INCREMENT = 1514963 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: card_has_user
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `card_has_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idcard` int NOT NULL,
  `iduser` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515173 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: device
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `device` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(40) NOT NULL,
  `model` varchar(50) NOT NULL,
  `ip` varchar(30) NOT NULL,
  `iduser` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515187 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: document
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `document` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `img_url` varchar(50) NOT NULL,
  `iduser` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515173 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: message
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `to_user` int NOT NULL,
  `from_user` int NOT NULL,
  `text` varchar(2000) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `date` varchar(40) NOT NULL,
  `is_reply` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: news
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `content` varchar(250) NOT NULL,
  `img_url` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515185 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: partner
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `partner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `iduser` int NOT NULL,
  `card_number` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515167 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: payments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `iduser` int NOT NULL,
  `date` varchar(40) NOT NULL,
  `sender_card_number` varchar(20) NOT NULL,
  `amout` decimal(12, 0) NOT NULL,
  `currency` varchar(5) NOT NULL,
  `receiver_card_number` varchar(20) NOT NULL,
  `receiver_full_name` varchar(50) NOT NULL,
  `commission` decimal(15, 0) NOT NULL,
  `method` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515128 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: role
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(15) NOT NULL,
  `licence` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role` (`role`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515163 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(30) NOT NULL,
  `address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `email_status` int DEFAULT '-1',
  `idcountry` int NOT NULL,
  `idrole` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 1515180 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: сountry
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `сountry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` int NOT NULL,
  `phone_code` varchar(5) NOT NULL,
  `lang_arr` varchar(150) NOT NULL,
  `currency` varchar(5) NOT NULL,
  `commission` decimal(10, 0) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE = InnoDB AUTO_INCREMENT = 1514936 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: card
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: card_has_user
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: device
# ------------------------------------------------------------

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: document
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: news
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: partner
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: payments
# ------------------------------------------------------------

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: role
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user
# ------------------------------------------------------------

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: сountry
# ------------------------------------------------------------


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
