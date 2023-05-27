/*
SQLyog Ultimate v12.08 (64 bit)
MySQL - 8.0.25 : Database - dao_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`dao_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `dao_db`;

/*Table structure for table `a_account` */

DROP TABLE IF EXISTS `a_account`;

CREATE TABLE `a_account` (
  `id` int unsigned NOT NULL COMMENT 'dao_id',
  `account` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '帐号',
  `account_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '帐号url表示',
  `pubkey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `privkey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `actor_home_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '主页',
  `icon` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '头像字符表示',
  `actor_desc` text COMMENT '介绍',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`account`) USING BTREE,
  UNIQUE KEY `did` (`actor_home_url`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_account` */

/*Table structure for table `a_actor` */

DROP TABLE IF EXISTS `a_actor`;

CREATE TABLE `a_actor` (
  `member_address` char(42) NOT NULL,
  `member_icon` text,
  `member_nick` varchar(100) DEFAULT NULL,
  `member_desc` text,
  PRIMARY KEY (`member_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_actor` */

/*Table structure for table `a_discussion` */

DROP TABLE IF EXISTS `a_discussion`;

CREATE TABLE `a_discussion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dao_id` bigint DEFAULT NULL,
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '钱包地址',
  `title` varchar(256) DEFAULT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `is_send` tinyint DEFAULT '1' COMMENT '允许发送1:主题，2所有',
  `is_discussion` tinyint DEFAULT '1' COMMENT '允许评论',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_discussion` */

/*Table structure for table `a_discussion_commont` */

DROP TABLE IF EXISTS `a_discussion_commont`;

CREATE TABLE `a_discussion_commont` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pid` int DEFAULT NULL,
  `member_address` char(42) DEFAULT NULL,
  `content` text,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_discussion_commont` */

/*Table structure for table `a_events` */

DROP TABLE IF EXISTS `a_events`;

CREATE TABLE `a_events` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dao_id` bigint DEFAULT NULL,
  `member_address` char(42) DEFAULT NULL,
  `title` varchar(256) DEFAULT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `is_send` tinyint DEFAULT '1' COMMENT '允许发送1:主题，2所有',
  `is_discussion` tinyint DEFAULT '1' COMMENT '允许评论',
  `top_img` text COMMENT '头部图片',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `on_line` tinyint DEFAULT NULL COMMENT '完全线上活动',
  `event_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '网站主页',
  `original` char(42) DEFAULT NULL COMMENT '组织者地址',
  `numbers` int DEFAULT NULL COMMENT '上限人数,0无上限',
  `participate` tinyint DEFAULT NULL COMMENT '0匿名，1审核',
  `address` varchar(256) DEFAULT NULL COMMENT '活动地址',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `img_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_events` */

/*Table structure for table `a_events_commont` */

DROP TABLE IF EXISTS `a_events_commont`;

CREATE TABLE `a_events_commont` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pid` int DEFAULT NULL,
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `content` text,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_discussion` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_events_commont` */

/*Table structure for table `a_events_join` */

DROP TABLE IF EXISTS `a_events_join`;

CREATE TABLE `a_events_join` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pid` int DEFAULT NULL,
  `member_address` char(42) DEFAULT NULL,
  `content` text,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flag` tinyint DEFAULT NULL COMMENT '3拒绝2匿名0待审批1审批通过',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_events_join` */

/*Table structure for table `a_events_reply` */

DROP TABLE IF EXISTS `a_events_reply`;

CREATE TABLE `a_events_reply` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pid` int DEFAULT NULL,
  `member_address` char(42) DEFAULT NULL,
  `member_nick` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `member_icon` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `content` text,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_events_reply` */

/*Table structure for table `a_follow` */

DROP TABLE IF EXISTS `a_follow`;

CREATE TABLE `a_follow` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `actor_account` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '参与者@',
  `actor_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '参与者url',
  `actor_inbox` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '参与者信箱',
  `actor_icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '参与者ICON',
  `actor_pubkey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '参与者公钥',
  `user_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '本地昵称',
  `user_domain` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '本地域名',
  `user_account` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '本地帐号@',
  `user_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '本地帐号url',
  `follow_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '关注ID 唯一',
  `follow_type` tinyint DEFAULT NULL COMMENT '0 关注， 1被关注',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dao_id` bigint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `follow_id` (`follow_id`),
  UNIQUE KEY `idd` (`follow_type`,`actor_account`,`user_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_follow` */

/*Table structure for table `a_invite` */

DROP TABLE IF EXISTS `a_invite`;

CREATE TABLE `a_invite` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dao_id` bigint DEFAULT NULL,
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `info` text,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flag` tinyint DEFAULT '0' COMMENT '0未处理，1接收，2驳回',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dao_id` (`dao_id`,`member_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_invite` */

/*Table structure for table `a_message` */

DROP TABLE IF EXISTS `a_message`;

CREATE TABLE `a_message` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_account` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '参与者帐号@',
  `actor_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '参与者帐号url',
  `message_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '信息ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '内容',
  `follower_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '推送地址',
  `actor_icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `message_type` varchar(128) DEFAULT NULL,
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) DEFAULT NULL,
  `pid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `noteid` (`message_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_message` */

/*Table structure for table `a_news` */

DROP TABLE IF EXISTS `a_news`;

CREATE TABLE `a_news` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `top_img` text,
  `dao_id` bigint DEFAULT NULL,
  `member_address` char(42) DEFAULT NULL,
  `title` varchar(256) DEFAULT NULL,
  `content` text,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `img_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `a_news` */

/*Table structure for table `aux_bt` */

DROP TABLE IF EXISTS `aux_bt`;

CREATE TABLE `aux_bt` (
  `d` varchar(50) NOT NULL,
  `t` varchar(2000) DEFAULT NULL,
  `f` varchar(500) DEFAULT NULL,
  `s` varchar(2000) DEFAULT NULL,
  `w` varchar(500) DEFAULT NULL,
  `rt` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`d`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aux_bt` */

insert  into `aux_bt`(`d`,`t`,`f`,`s`,`w`,`rt`) values ('dao','v_dao','*','','1=1',''),('daotoken','v_daotoken','*',NULL,'1=1',NULL),('discussions','v_discussion','*',NULL,'1=1',NULL),('events','v_events','*',NULL,'1=1',NULL),('news','v_news','*',NULL,'1=1',NULL),('swap','v_swap','*',NULL,'1=1',NULL);

/*Table structure for table `aux_tree` */

DROP TABLE IF EXISTS `aux_tree`;

CREATE TABLE `aux_tree` (
  `id` varchar(20) NOT NULL,
  `sqls` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aux_tree` */

insert  into `aux_tree`(`id`,`sqls`) values ('business_type_com','select id,type_name `text` from g5_businesstype'),('get_tl','SELECT * FROM g_location WHERE im_id=? AND  DATE_FORMAT(locate_time, \'%Y-%m-%d\')=  DATE_FORMAT(NOW(), \'%Y-%m-%d\') LIMIT 100');

/*Table structure for table `t_app` */

DROP TABLE IF EXISTS `t_app`;

CREATE TABLE `t_app` (
  `block_num` bigint NOT NULL,
  `app_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'app名称',
  `app_id` int DEFAULT NULL COMMENT 'app id',
  `app_desc` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述',
  `app_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '插件地址',
  `app_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '管理员',
  `app_version` int DEFAULT NULL COMMENT '版本号',
  `app_time` int DEFAULT NULL COMMENT '时间戳',
  `version_desc` varchar(2000) DEFAULT NULL COMMENT '版本描述',
  `app_type` int DEFAULT NULL COMMENT 'app类型',
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `app_index` (`app_id`,`app_type`) USING BTREE,
  UNIQUE KEY `app_name` (`app_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_app` */

/*Table structure for table `t_appinstall` */

DROP TABLE IF EXISTS `t_appinstall`;

CREATE TABLE `t_appinstall` (
  `block_num` bigint unsigned NOT NULL,
  `dao_id` int DEFAULT NULL,
  `delegate_id` int DEFAULT NULL COMMENT '代理id',
  `app_id` int DEFAULT NULL COMMENT 'app id',
  `app_version` int DEFAULT NULL,
  `app_type` int DEFAULT NULL,
  `install_address` char(42) DEFAULT NULL COMMENT '代理ID',
  `install_time` bigint DEFAULT NULL COMMENT '安装版本号',
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `dao_id` (`dao_id`,`delegate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_appinstall` */

/*Table structure for table `t_appversion` */

DROP TABLE IF EXISTS `t_appversion`;

CREATE TABLE `t_appversion` (
  `block_num` bigint NOT NULL,
  `app_type` int DEFAULT NULL COMMENT 'app类型',
  `app_index` int DEFAULT NULL COMMENT 'app id',
  `app_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '插件地址',
  `app_version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '版本号',
  `version_desc` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '版本描述',
  `app_time` int DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`block_num`) USING BTREE,
  UNIQUE KEY `app_index` (`app_index`,`app_type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

/*Data for the table `t_appversion` */

/*Table structure for table `t_changelogo` */

DROP TABLE IF EXISTS `t_changelogo`;

CREATE TABLE `t_changelogo` (
  `dao_id` int NOT NULL COMMENT 'dao id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `dao_logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'svg logo',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_changelogo` */

/*Table structure for table `t_dao` */

DROP TABLE IF EXISTS `t_dao`;

CREATE TABLE `t_dao` (
  `dao_id` int NOT NULL COMMENT 'dao ID',
  `block_num` bigint DEFAULT NULL COMMENT '区块号',
  `dao_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '名称',
  `dao_symbol` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'DAO 符号',
  `dao_desc` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述',
  `dao_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '管理员地址',
  `dao_logo` text COMMENT 'svg logo',
  `utoken_cost` decimal(18,4) DEFAULT '0.0000' COMMENT '币值',
  `dao_ranking` int DEFAULT '0' COMMENT '排名',
  `creator` char(42) DEFAULT NULL COMMENT 'mint dao的合约地址',
  `delegator` char(42) DEFAULT NULL COMMENT 'DAO代理地址',
  `dao_exec` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '调用者',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dao_id`),
  UNIQUE KEY `block_num` (`block_num`),
  UNIQUE KEY `dao_name` (`dao_name`),
  UNIQUE KEY `dao_symbol` (`dao_symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_dao` */

/*Table structure for table `t_daodetail` */

DROP TABLE IF EXISTS `t_daodetail`;

CREATE TABLE `t_daodetail` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dao_id` int DEFAULT '0',
  `member_votes` int DEFAULT '0' COMMENT '成员票数',
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '成员地址',
  `member_index` int DEFAULT '0' COMMENT '成员序号',
  `member_type` tinyint DEFAULT '1' COMMENT '类型:1原始，0邀请',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`dao_id`,`member_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_daodetail` */

/*Table structure for table `t_e2t` */

DROP TABLE IF EXISTS `t_e2t`;

CREATE TABLE `t_e2t` (
  `block_num` bigint NOT NULL,
  `from_address` varchar(50) DEFAULT NULL,
  `to_address` varchar(50) DEFAULT NULL,
  `in_amount` decimal(18,4) DEFAULT '0.0000',
  `out_amount` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tran_hash` char(66) NOT NULL DEFAULT '',
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `tran_hash` (`tran_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_e2t` */

insert  into `t_e2t`(`block_num`,`from_address`,`to_address`,`in_amount`,`out_amount`,`swap_time`,`_time`,`tran_hash`) values (3484589,'0x5aD91dCCD7b5F15A454213B36aaDa82a8FbD4ea2','0x5aD91dCCD7b5F15A454213B36aaDa82a8FbD4ea2','0.0010','48679.1043',1684071732,'2023-05-15 10:56:26','0x1134f4fbb79376bcae8b4c9176dabac5979ce980b33fd9df439804b635b9de54'),(3484749,'0x854f2999442cd1Dfc5b52924A5692505c3759da6','0x854f2999442cd1Dfc5b52924A5692505c3759da6','0.0010','48674.3567',1684073844,'2023-05-15 10:56:26','0xa4cf1ea1962def2d61f52b59d9b099458fbab8a8611655fbac3a88fddf5cd4f6'),(3484815,'0x854f2999442cd1Dfc5b52924A5692505c3759da6','0x854f2999442cd1Dfc5b52924A5692505c3759da6','0.0010','48679.1022',1684074660,'2023-05-15 10:56:26','0xc5b8cbb9c1452b44a2ba041e6c47ab53343b5d1ca3bfc405df2628e25d39c97b'),(3484827,'0x854f2999442cd1Dfc5b52924A5692505c3759da6','0x854f2999442cd1Dfc5b52924A5692505c3759da6','0.0010','48679.1015',1684074828,'2023-05-15 10:56:26','0x8ccda802bf33f7773727149008d6dd87ee4e6c3286ee1a71ef778e3484bd80b8'),(3485350,'0x7915813EcD1CF3B6c2B1638362E152176505b2E5','0x7915813EcD1CF3B6c2B1638362E152176505b2E5','0.0010','48669.6028',1684081824,'2023-05-15 10:56:27','0x00276086c230bb5c7bf9aed990bcfff557c30f32b1fc185a919ab7c6445f0564'),(3487704,'0x7915813EcD1CF3B6c2B1638362E152176505b2E5','0x7915813EcD1CF3B6c2B1638362E152176505b2E5','0.0011','53546.7421',1684112940,'2023-05-15 10:56:27','0xc6f9f4ba1cd96b5924751fded25d9d81600afbf5cf6e0a4f1ab42be7ad4bad7d'),(3487916,'0x7915813EcD1CF3B6c2B1638362E152176505b2E5','0x7915813EcD1CF3B6c2B1638362E152176505b2E5','0.0010','48664.8565',1684115784,'2023-05-15 10:56:27','0x19008f04d2bae8dd5710025072c412412e341fd3dd49592a63bf4eeadd336f5e');

/*Table structure for table `t_eth_utoken` */

DROP TABLE IF EXISTS `t_eth_utoken`;

CREATE TABLE `t_eth_utoken` (
  `block_num` bigint NOT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `swap_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `swap_time` int DEFAULT NULL,
  `swap_eth` decimal(18,4) DEFAULT '0.0000',
  `swap_utoken` decimal(18,4) DEFAULT '0.0000',
  `tran_hash` char(66) NOT NULL DEFAULT '',
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_eth_utoken` */

/*Table structure for table `t_gastoken_utoken` */

DROP TABLE IF EXISTS `t_gastoken_utoken`;

CREATE TABLE `t_gastoken_utoken` (
  `block_num` bigint NOT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `swap_time` int DEFAULT NULL,
  `swap_eth` decimal(18,4) DEFAULT '0.0000',
  `swap_utoken` decimal(18,4) DEFAULT '0.0000',
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tran_hash` char(66) NOT NULL DEFAULT '',
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_gastoken_utoken` */

/*Table structure for table `t_pro` */

DROP TABLE IF EXISTS `t_pro`;

CREATE TABLE `t_pro` (
  `pro_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '提案序号',
  `pro_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'hash号',
  `dao_id` int DEFAULT NULL,
  `app_type` int DEFAULT NULL,
  `app_id` int DEFAULT '0' COMMENT 'app序号',
  `pro_type` smallint DEFAULT '0' COMMENT '1安装，0：非安装',
  `pro_manager` char(42) DEFAULT NULL,
  `pro_name` varchar(128) DEFAULT NULL,
  `block_num` int DEFAULT NULL,
  `logo_img` text COMMENT 'logo 图片',
  `function_name` varchar(128) DEFAULT NULL COMMENT '函数名称',
  `function_para` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '函数参数',
  `app_address` char(42) DEFAULT NULL COMMENT '执行的app(安装)',
  `cause_address` char(42) DEFAULT NULL COMMENT '实际执行的app地址',
  `pro_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pro_id`) USING BTREE,
  UNIQUE KEY `dao_id` (`dao_id`,`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_pro` */

/*Table structure for table `t_probak` */

DROP TABLE IF EXISTS `t_probak`;

CREATE TABLE `t_probak` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pro_hash` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'hash号',
  `dao_id` int DEFAULT NULL,
  `app_id` int DEFAULT '0' COMMENT 'app序号',
  `app_type` int DEFAULT NULL,
  `pro_type` smallint DEFAULT '0' COMMENT '1安装，0：非安装',
  `pro_manager` char(42) DEFAULT NULL,
  `pro_name` varchar(128) DEFAULT NULL,
  `block_num` int DEFAULT NULL,
  `pro_id` int NOT NULL COMMENT '提案序号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_probak` */

/*Table structure for table `t_proexcu` */

DROP TABLE IF EXISTS `t_proexcu`;

CREATE TABLE `t_proexcu` (
  `block_num` bigint NOT NULL,
  `pro_id` int DEFAULT NULL COMMENT '提案序号',
  `pro_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '代理地址',
  `excu_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '执行人',
  `excu_time` int DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`block_num`),
  KEY `pro_index` (`pro_id`,`pro_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_proexcu` */

/*Table structure for table `t_provote` */

DROP TABLE IF EXISTS `t_provote`;

CREATE TABLE `t_provote` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pro_id` int DEFAULT NULL COMMENT '提案序号',
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '投票人地址',
  `member_votes` int DEFAULT '0' COMMENT '票数',
  `vote_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `vote_singer` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '签名',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `vote_address` (`pro_id`,`member_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_provote` */

/*Table structure for table `t_provotebak` */

DROP TABLE IF EXISTS `t_provotebak`;

CREATE TABLE `t_provotebak` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pro_id` int DEFAULT NULL COMMENT '提案序号',
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '投票人地址',
  `member_votes` int DEFAULT '1' COMMENT '票数',
  `vote_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `vote_singer` varchar(256) DEFAULT NULL COMMENT '签名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_provotebak` */

/*Table structure for table `t_setlogo` */

DROP TABLE IF EXISTS `t_setlogo`;

CREATE TABLE `t_setlogo` (
  `dao_id` int NOT NULL COMMENT 'dao id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `dao_logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'svg图片',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `dao_id` (`dao_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_setlogo` */

/*Table structure for table `t_software` */

DROP TABLE IF EXISTS `t_software`;

CREATE TABLE `t_software` (
  `block_num` bigint NOT NULL,
  `software_id` int DEFAULT NULL,
  `software_version_id` int DEFAULT NULL,
  `dao_delegator_full_id` varchar(255) DEFAULT NULL,
  `install_address` char(42) DEFAULT NULL,
  `install_time` bigint DEFAULT NULL,
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_software` */

/*Table structure for table `t_t2t` */

DROP TABLE IF EXISTS `t_t2t`;

CREATE TABLE `t_t2t` (
  `block_num` bigint NOT NULL,
  `from_dao_id` int DEFAULT NULL,
  `to_dao_id` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `from_utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `to_utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `from_token` decimal(18,4) DEFAULT '0.0000',
  `to_token` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  `tran_hash` char(66) NOT NULL DEFAULT '',
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_t2t` */

/*Table structure for table `t_t2u` */

DROP TABLE IF EXISTS `t_t2u`;

CREATE TABLE `t_t2u` (
  `block_num` bigint NOT NULL,
  `from_token_id` int DEFAULT NULL,
  `utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `from_address` varchar(50) DEFAULT NULL,
  `to_address` varchar(50) DEFAULT NULL,
  `utoken_amount` decimal(18,4) DEFAULT '0.0000',
  `token_amount` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tran_hash` char(66) NOT NULL DEFAULT '',
  PRIMARY KEY (`block_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_t2u` */

/*Table structure for table `t_token` */

DROP TABLE IF EXISTS `t_token`;

CREATE TABLE `t_token` (
  `dao_id` int NOT NULL COMMENT 'dao Id',
  `token_id` int DEFAULT NULL COMMENT 'token Id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int DEFAULT NULL COMMENT '时间戳',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dao_id`),
  UNIQUE KEY `block_num` (`block_num`),
  UNIQUE KEY `token_id` (`token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_token` */

/*Table structure for table `t_tokenuser` */

DROP TABLE IF EXISTS `t_tokenuser`;

CREATE TABLE `t_tokenuser` (
  `dao_id` int DEFAULT NULL,
  `token_id` int NOT NULL,
  `dao_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token_cost` decimal(18,4) DEFAULT '0.0000',
  PRIMARY KEY (`token_id`,`dao_manager`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_tokenuser` */

/*Table structure for table `t_u2t` */

DROP TABLE IF EXISTS `t_u2t`;

CREATE TABLE `t_u2t` (
  `block_num` bigint NOT NULL,
  `token_id` int DEFAULT NULL,
  `utoken_cost` decimal(18,4) DEFAULT '0.0000',
  `from_address` varchar(50) DEFAULT NULL,
  `to_address` varchar(50) DEFAULT NULL,
  `utoken_amount` decimal(18,4) DEFAULT '0.0000',
  `token_amount` decimal(18,4) DEFAULT '0.0000',
  `swap_time` int DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tran_hash` char(66) NOT NULL DEFAULT '',
  PRIMARY KEY (`block_num`),
  UNIQUE KEY `tran_hash` (`tran_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_u2t` */

/* Trigger structure for table `a_account` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `account_trigger` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `account_trigger` AFTER UPDATE ON `a_account` FOR EACH ROW BEGIN
	update a_follow set user_name=SUBSTRING_INDEX(new.account,'@',1), user_account=new.account,user_url=new.account_url where dao_id=new.id;
    END */$$


DELIMITER ;

/* Trigger structure for table `a_discussion` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `discussion_del` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `discussion_del` AFTER DELETE ON `a_discussion` FOR EACH ROW BEGIN
	delete from a_discussion_commont where pid=old.id;
    END */$$


DELIMITER ;

/* Trigger structure for table `a_invite` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `invite_delmember` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `invite_delmember` AFTER DELETE ON `a_invite` FOR EACH ROW BEGIN
	if(old.flag=1) then 
		delete from t_taodetail where member_address=old.member_address and member_type=0;
	end if;
    END */$$


DELIMITER ;

/* Trigger structure for table `t_changelogo` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `changeLogotrigger` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `changeLogotrigger` AFTER INSERT ON `t_changelogo` FOR EACH ROW BEGIN
	update t_dao set dao_logo=new.dao_logo where dao_id=new.dao_id;
    END */$$


DELIMITER ;

/* Trigger structure for table `t_pro` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `del_pro` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `del_pro` AFTER DELETE ON `t_pro` FOR EACH ROW BEGIN
    delete from t_provote WHERE pro_id=old.pro_id;
	    
    END */$$


DELIMITER ;

/* Trigger structure for table `t_setlogo` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `setLogotrigger` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `setLogotrigger` AFTER INSERT ON `t_setlogo` FOR EACH ROW BEGIN
	update t_dao set dao_logo=new.dao_logo where dao_id=new.dao_id;
    END */$$


DELIMITER ;

/* Trigger structure for table `t_t2t` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `t2t_regisster` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `t2t_regisster` AFTER INSERT ON `t_t2t` FOR EACH ROW BEGIN
    
--	UPDATE t_dao SET utoken_cost=new.from_utoken_cost WHERE dao_id in(select dao_id from t_token where token_id=new.from_dao_id);
--	UPDATE t_dao SET utoken_cost=new.to_utoken_cost WHERE dao_id in(select dao_id from t_token where token_id=new.to_dao_id);
--	CALL excuteRank();
    END */$$


DELIMITER ;

/* Trigger structure for table `t_t2u` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `t2u_regisster` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `t2u_regisster` AFTER INSERT ON `t_t2u` FOR EACH ROW BEGIN
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id in (select dao_id from t_token where token_id=new.from_token_id);
	CALL excuteRank();
    END */$$


DELIMITER ;

/* Trigger structure for table `t_u2t` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `u2t_regisster` */$$

/*!50003 CREATE */ /*!50003 TRIGGER `u2t_regisster` AFTER INSERT ON `t_u2t` FOR EACH ROW BEGIN
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id  in(select dao_id from t_token where token_id =new.token_id);
	CALL excuteRank();
    END */$$


DELIMITER ;

/* Procedure structure for procedure `aa` */

/*!50003 DROP PROCEDURE IF EXISTS  `aa` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `aa`()
BEGIN
	-- update t_tokenuser set dao_id=2 where token_id=38888888;
	-- select ROW_COUNT();
	declare str varchar(100);
	set str='aaa1a78787823bbb@qwe';
	select substring_index(str,'@',1) as aa;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `excuteRank` */

/*!50003 DROP PROCEDURE IF EXISTS  `excuteRank` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `excuteRank`()
BEGIN
UPDATE t_dao t1 JOIN (
SELECT dao_id,  utoken_cost, yy FROM
(SELECT dao_id,  utoken_cost,
@curRank := IF(@prevRank = utoken_cost, @curRank, @incRank) AS yy, 
@incRank := @incRank + 1, 
@prevRank := utoken_cost
FROM t_dao p, (
SELECT @curRank :=0, @prevRank := NULL, @incRank := 1
) r 
ORDER BY utoken_cost DESC) s
) t2 
ON t1.dao_id = t2.dao_id
SET t1.dao_ranking = t2.yy;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `excuteToken` */

/*!50003 DROP PROCEDURE IF EXISTS  `excuteToken` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `excuteToken`($tokenid int,$address VARCHAR(50),$cost decimal(18,4))
BEGIN
declare _daoid int;
-- set session transaction isolation level serializable;
-- START TRANSACTION;  
IF EXISTS(SELECT * FROM t_tokenuser WHERE token_id=$tokenid and dao_manager=$address) THEN 
		UPDATE t_tokenuser SET token_cost=$cost WHERE token_id=$tokenid AND dao_manager=$address;
	ELSE
		select dao_id into _daoid from t_token where token_id=$tokenid;
		INSERT INTO t_tokenuser(dao_id,token_id,dao_manager,token_cost) VALUES(_daoid,$tokenid,$address,$cost) ;
	END IF;
--	  COMMIT;  
-- set session transaction isolation level repeatable read;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `excu_pro` */

/*!50003 DROP PROCEDURE IF EXISTS  `excu_pro` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `excu_pro`(blockNum bigint,proHash varchar(255),address char(42),ti bigint)
BEGIN
        DECLARE _proId INT;
	DECLARE _daoId INT;
	DECLARE _appId INT;
	DECLARE _proType INT;
	declare _type int;
	    
    if exists(select * from t_pro where pro_hash=proHash) then 
	  
	    select pro_id,pro_type,dao_id,app_id,app_type into _proId,_proType,_daoId,_appId,_type from t_pro where pro_hash=proHash;
	    CALL i_proexec(blockNum,_proId,proHash,address,ti);
	   -- if _proType=1 then 
	   --	call i_appinstall(_daoId,_appId,_type,proHash);
	   -- end if ;
	    INSERT INTO t_probak(pro_id,pro_hash,dao_id,app_id,app_type,pro_type,pro_manager,pro_name,block_num) 
	    select pro_id,pro_hash,dao_id,app_id,app_type,pro_type,pro_manager,pro_name,block_num from t_pro where pro_id=_proId;
	    delete from t_pro where pro_id=_proId;
	    INSERT INTO t_provotebak(pro_id,member_address,member_votes,vote_time,vote_singer)
	    select pro_id,member_address,member_votes,vote_time,vote_singer from t_provote where pro_id=_proId;
	    delete from t_provote WHERE pro_id=_proId;
	    
	
     else
	call i_proexec(blockNum,0,proHash,address,ti);
	    
    end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `exec_daomember` */

/*!50003 DROP PROCEDURE IF EXISTS  `exec_daomember` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `exec_daomember`(_id int,_flag int)
BEGIN
	update a_invite set flag=_flag where id=_id;
	if(_flag=1) then 
		INSERT INTO t_daodetail (dao_id,member_address,member_type) select dao_id,member_address,0 from a_invite where id=_id;
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `getAccount` */

/*!50003 DROP PROCEDURE IF EXISTS  `getAccount` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `getAccount`(did char(42))
BEGIN
	SELECT a.dao_id,a.dao_manager,IFNULL(b.account,'') account FROM t_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.dao_id IN(SELECT dao_id FROM t_daodetail
	 WHERE member_address=did);
    END */$$
DELIMITER ;

/* Procedure structure for procedure `get_page` */

/*!50003 DROP PROCEDURE IF EXISTS  `get_page` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `get_page`($daima VARCHAR(6000),$ps INT,$i INT,$s VARCHAR(6000),$a VARCHAR(4),$w NVARCHAR(6000))
BEGIN
declare $t varchar(20);
	SELECT t INTO $t FROM aux_bt WHERE d=$daima;
	
	IF $w='' THEN 
	SELECT w INTO $w FROM aux_bt WHERE d=$daima;
	END IF;
	
	SET $w=IF($w='','',CONCAT(' where ',$w));
	
	SET @cqw=CONCAT('SELECT * FROM ',$t,$w,' order by ',$s,' ',$a,' LIMIT ',$ps,' OFFSET ',($i-1)*$ps);
	PREPARE stmt1 FROM @cqw;
	EXECUTE stmt1 ;
		
	 SET @cqw=CONCAT('SELECT count(*) as mcount FROM ',$t,$w);
	 PREPARE stmt1 FROM @cqw;
         EXECUTE stmt1 ;
	END */$$
DELIMITER ;

/* Procedure structure for procedure `get_pro` */

/*!50003 DROP PROCEDURE IF EXISTS  `get_pro` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `get_pro`(_daoId int,_appId int,_address char(42),_appType int)
BEGIN
 
		 SELECT 
			a.app_address,a.cause_address, a.function_name,a.function_para, a.logo_img, a.pro_id,a.pro_hash,a.dao_id,a.app_id,a.app_type,a.pro_type,
			a.pro_name,IFNULL(b.`member_votes`,0) pro_member_votes,IFNULL(c.voted,0) voted,
			IFNULL(d.total_vote,0) total_vote,e.member_index,e.member_votes 	 
		FROM t_pro a
		 LEFT JOIN (select pro_id,member_votes from t_provote where member_address=_address) b ON a.`pro_id`=b.`pro_id`
		 LEFT JOIN(SELECT pro_id,sum(member_votes) voted FROM t_provote GROUP BY pro_id) c ON a.pro_id=c.pro_id	
		 left JOIN (SELECT dao_id,sum(member_votes) total_vote FROM t_daodetail GROUP BY dao_id) d ON a.dao_id=d.dao_id
		 left join (select member_index,member_votes,dao_id from t_daodetail where dao_id=_daoId and member_address=_address) e on a.dao_id=e.dao_id
		WHERE a.dao_id=_daoId AND a.app_id=_appId and a.app_type=_appType 
		 AND a.pro_manager IN(SELECT member_address FROM t_daodetail WHERE dao_id=a.dao_id);
 END */$$
DELIMITER ;

/* Procedure structure for procedure `get_proList` */

/*!50003 DROP PROCEDURE IF EXISTS  `get_proList` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `get_proList`($address char(42))
BEGIN
	SELECT a.app_address,a.cause_address,a.function_name,a.function_para,a.pro_id,a.dao_id,a.pro_name,a.app_id,a.pro_manager,DATE_FORMAT(pro_time,'%Y-%m-%d') pro_time,IFNULL(b.s,0) total_vote,IFNULL(c.s,0) votes  
	,IFNULL(d.member_index,-1) member_index,d.member_votes,a.pro_hash,IFNULL(e.yvote,0) yvote 
	FROM t_pro a LEFT JOIN 
	(SELECT dao_id,COUNT(*) s FROM t_daodetail where member_type=1 GROUP BY dao_id) b ON a.dao_id=b.dao_id 
	LEFT JOIN 
        (SELECT pro_id,COUNT(*) s FROM t_provote GROUP BY pro_id) c ON a.pro_id=c.pro_id 
        LEFT JOIN 
        (SELECT dao_id,member_index,member_votes FROM t_daodetail WHERE member_address=$address) d ON a.dao_id=d.dao_id
        LEFT JOIN 
        (SELECT pro_id,1 yvote FROM t_provote WHERE member_address=$address) e ON a.pro_id=e.pro_id
         WHERE a.dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address=$address);
         
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_actor` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_actor` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_actor`(_member_address char(42),_icon text,_desc text,_nick varchar(100))
BEGIN
     if exists(select * from a_actor where member_address=_member_address) then 
	if(_icon='') then 
		update a_actor set member_nick=_nick,member_desc=_desc where member_address=_member_address;
	else 
		UPDATE a_actor SET member_icon=_icon,member_nick=_nick,member_desc=_desc WHERE member_address=_member_address;
	end if;
     else
     insert into a_actor(member_address,member_icon,member_desc,member_nick) values(_member_address,_icon,_desc,_nick); 
     end if;
     
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_app` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_app` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_app`(blocknum bigint,appname varchar(200),appindex int,version varchar(50),appdesc varchar(2000)
    ,appaddress char(42),appmanager char(42),apptime int,versiondesc varchar(2000),plugintype int)
BEGIN
    IF NOT EXISTS(SELECT * FROM t_app WHERE block_num=blocknum) THEN
	INSERT INTO t_app(block_num,app_name,app_id,app_version,app_desc,app_address,app_manager,app_time,version_desc,app_type) 
	VALUES(blocknum,appname,appindex,version,appdesc,appaddress,appmanager,apptime,versiondesc,plugintype);
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_appinstall` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_appinstall` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_appinstall`(daoId int, appId int,appType int,proHah varchar(255))
BEGIN
	if not exists(select * from t_appinstall where dao_id=daoId and app_id=appId and app_type=appType) then
		INSERT INTO t_appinstall(dao_id,app_id,app_type,pro_hash) VALUES(daoId,appId,appType,proHah);
	end if;
END */$$
DELIMITER ;

/* Procedure structure for procedure `i_changelogo` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_changelogo` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_changelogo`(daoid int,blocknum bigint,daotime int,daologo text)
BEGIN
	if not exists(select * from t_changelogo where block_num=blocknum) then
	INSERT INTO t_changelogo (dao_id,block_num,dao_time,dao_logo) VALUES(daoid,blocknum,daotime,daologo);
	
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_dao` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_dao` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_dao`(daoid int,blocknum bigint,daoname varchar(200),daosymbol varchar(200),daodsc varchar(4000)
    ,daomanager char(42),daotime int,daoaddress char(42),_creator CHAR(42),_delegator CHAR(42))
BEGIN
	if not exists(select * from t_dao where block_num=blocknum) then
		INSERT INTO t_dao(dao_id,block_num,dao_name,dao_symbol,dao_desc,dao_manager,dao_time,dao_exec,creator,delegator) 
		valueS(daoid,blocknum,daoname,daosymbol,daodsc,daomanager,daotime,daoaddress,_creator,_delegator);
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_daodetail` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_daodetail` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_daodetail`(daoid int,daoaddress char(42),daovotes int,daoindex int)
BEGIN
	if not exists(select * from t_daodetail where dao_id=daoid and member_address=daoaddress) then
		INSERT INTO t_daodetail(dao_id,member_address,member_votes,member_index) VALUES(daoid,daoaddress,daovotes,daoindex);
	end if;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_proexec` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_proexec` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_proexec`(blocknum bigint,proId int,proHash varchar(255),excuaddress char(42),excutime int)
BEGIN
   if not exists(select * from t_proexcu where block_num=blocknum) then
	   INSERT INTO t_proexcu(block_num,pro_id,pro_hash,excu_address,excu_time) 
	   VALUES(blocknum,proId,proHash,excuaddress,excutime);
	end if;
END */$$
DELIMITER ;

/* Procedure structure for procedure `i_setlogo` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_setlogo` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_setlogo`(daoid int,blocknum bigint,daotime int,daologo text)
BEGIN
	IF NOT EXISTS(SELECT * FROM t_setlogo WHERE block_num=blocknum) THEN
	INSERT INTO t_setlogo(dao_id,block_num,dao_time,dao_logo) VALUES(daoid,blocknum,daotime,daologo);
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_swap` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_swap` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_swap`(blocknum bigint,swapaddress char(42),swaptime int,swapeth decimal(18,4),swaputoken decimal(18,4),tranHash char(66))
BEGIN
    IF NOT EXISTS(SELECT * FROM t_eth_utoken WHERE block_num=blocknum) THEN
			INSERT INTO t_eth_utoken(block_num,swap_address,swap_time,swap_eth,swap_utoken,tran_hash) 
			VALUES(blocknum,swapaddress,swaptime,swapeth,swaputoken,tranHash);
		end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_swapdeth` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_swapdeth` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_swapdeth`(blocknum bigint,fromaddress char(42),swaptime int,swapeth decimal(18,9)
    ,swaputoken decimal(18,4),toaddress char(42),tranHsh char(66))
BEGIN
		 IF NOT EXISTS(SELECT * FROM t_gastoken_utoken WHERE block_num=blocknum) THEN
	INSERT INTO t_gastoken_utoken(block_num,from_address,swap_time,swap_eth,swap_utoken,to_address,tran_hash) 
	VALUES(blocknum,fromaddress,swaptime,swapeth,swaputoken,toaddress,tranHsh);
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_t2t` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_t2t` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_t2t`(blocknum bigint,fromdaoid int,todaoid int,fromutokencost decimal(18,4),toutokencost DECIMAL(18,4),
    fromaddress char(42),toaddress char(42),fromtoken DECIMAL(18,4),totoken DECIMAL(18,4),swaptime int,tranHsh char(66))
BEGIN
     IF NOT EXISTS(SELECT * FROM t_t2t WHERE block_num=blocknum) THEN
	INSERT INTO t_t2t(block_num,from_dao_id,to_dao_id,from_utoken_cost,to_utoken_cost,from_address,to_address,from_token,to_token,swap_time,tran_hash)
	 VALUES(blocknum,fromdaoid,todaoid,fromutokencost,toutokencost,fromaddress,toaddress,fromtoken,totoken,swaptime,tranHsh);
	 end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_t2u` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_t2u` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_t2u`(blocknum bigint,fromTokenId int,utokencost decimal(18,4),fromaddress char(42)
    ,toaddress char(42),utokenamount DECIMAL(18,4),tokenamount DECIMAL(18,4),swaptime int,tranHash char(66))
BEGIN
    IF NOT EXISTS(SELECT * FROM t_t2u WHERE block_num=blocknum) THEN
	INSERT INTO t_t2u(block_num,from_token_id,utoken_cost,from_address,to_address,utoken_amount,token_amount,swap_time,tran_hash)  
	VALUES(blocknum,fromTokenId,utokencost,fromaddress,toaddress,utokenamount,tokenamount,swaptime,tranHash);
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_token` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_token` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_token`(daoid int,tokenid int,blocknum bigint,daotime int)
BEGIN
	if not exists(select * from t_token where block_num=blocknum) then
	INSERT INTO t_token(dao_id,token_id,block_num,dao_time) VALUES(daoid,tokenid,blocknum,daotime);
	end if;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `i_u2t` */

/*!50003 DROP PROCEDURE IF EXISTS  `i_u2t` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `i_u2t`(blocknum bigint,tokenId int,utokencost decimal(18,4),fromaddress char(42)
    ,toaddress char(42),utokenamount DECIMAL(18,4),tokenamount DECIMAL(18,4),swaptime int,tranHash char(66))
BEGIN
    IF NOT EXISTS(SELECT * FROM t_u2t WHERE block_num=blocknum) THEN
	INSERT INTO t_u2t(block_num,token_id,utoken_cost,from_address,to_address,utoken_amount,token_amount,swap_time,tran_hash) 
	VALUES(blocknum,tokenId,utokencost,fromaddress,toaddress,utokenamount,tokenamount,swaptime,tranHash);
	end if;
    END */$$
DELIMITER ;

/*Table structure for table `v_account` */

DROP TABLE IF EXISTS `v_account`;

/*!50001 DROP VIEW IF EXISTS `v_account` */;
/*!50001 DROP TABLE IF EXISTS `v_account` */;

/*!50001 CREATE TABLE  `v_account`(
 `dao_id` int ,
 `dao_name` varchar(200) ,
 `dao_symbol` varchar(200) ,
 `dao_logo` text ,
 `dao_desc` varchar(4000) ,
 `dao_manager` char(42) ,
 `account` varchar(100) ,
 `account_url` varchar(128) ,
 `actor_desc` text ,
 `actor_home_url` varchar(100) ,
 `icon` text ,
 `inviteAddress` mediumtext 
)*/;

/*Table structure for table `v_app` */

DROP TABLE IF EXISTS `v_app`;

/*!50001 DROP VIEW IF EXISTS `v_app` */;
/*!50001 DROP TABLE IF EXISTS `v_app` */;

/*!50001 CREATE TABLE  `v_app`(
 `block_num` bigint ,
 `app_name` varchar(128) ,
 `app_id` int ,
 `app_desc` varchar(2000) ,
 `app_address` char(42) ,
 `app_manager` char(42) ,
 `app_time` varchar(10) ,
 `app_version` int ,
 `version_desc` varchar(2000) ,
 `app_type_text` varchar(6) ,
 `app_type` int 
)*/;

/*Table structure for table `v_dao` */

DROP TABLE IF EXISTS `v_dao`;

/*!50001 DROP VIEW IF EXISTS `v_dao` */;
/*!50001 DROP TABLE IF EXISTS `v_dao` */;

/*!50001 CREATE TABLE  `v_dao`(
 `dao_id` int ,
 `block_num` bigint ,
 `dao_name` varchar(200) ,
 `dao_symbol` varchar(200) ,
 `dao_desc` varchar(4000) ,
 `dao_time` varchar(10) ,
 `dao_manager` char(42) ,
 `dao_logo` text ,
 `creator` char(42) ,
 `delegator` char(42) ,
 `utoken_cost` decimal(18,4) ,
 `dao_ranking` int ,
 `dao_exec` char(42) ,
 `_time` timestamp ,
 `token_id` bigint 
)*/;

/*Table structure for table `v_daoinvitelist` */

DROP TABLE IF EXISTS `v_daoinvitelist`;

/*!50001 DROP VIEW IF EXISTS `v_daoinvitelist` */;
/*!50001 DROP TABLE IF EXISTS `v_daoinvitelist` */;

/*!50001 CREATE TABLE  `v_daoinvitelist`(
 `dao_id` int unsigned ,
 `account` varchar(100) ,
 `icon` text ,
 `actor_desc` text ,
 `dao_manager` char(42) ,
 `originalAddress` mediumtext ,
 `inviteAddress` mediumtext ,
 `flag` bigint ,
 `id` int unsigned 
)*/;

/*Table structure for table `v_daotoken` */

DROP TABLE IF EXISTS `v_daotoken`;

/*!50001 DROP VIEW IF EXISTS `v_daotoken` */;
/*!50001 DROP TABLE IF EXISTS `v_daotoken` */;

/*!50001 CREATE TABLE  `v_daotoken`(
 `token_id` bigint ,
 `dao_id` bigint ,
 `dao_symbol` varchar(200) ,
 `dao_logo` mediumtext 
)*/;

/*Table structure for table `v_discussion` */

DROP TABLE IF EXISTS `v_discussion`;

/*!50001 DROP VIEW IF EXISTS `v_discussion` */;
/*!50001 DROP TABLE IF EXISTS `v_discussion` */;

/*!50001 CREATE TABLE  `v_discussion`(
 `id` bigint unsigned ,
 `member_address` char(42) ,
 `dao_id` bigint ,
 `title` varchar(256) ,
 `content` text ,
 `is_send` tinyint ,
 `is_discussion` tinyint ,
 `member_icon` mediumtext ,
 `member_nick` varchar(100) ,
 `createtime` varchar(24) ,
 `times` varchar(28) ,
 `dao_name` varchar(200) 
)*/;

/*Table structure for table `v_discussion_commont` */

DROP TABLE IF EXISTS `v_discussion_commont`;

/*!50001 DROP VIEW IF EXISTS `v_discussion_commont` */;
/*!50001 DROP TABLE IF EXISTS `v_discussion_commont` */;

/*!50001 CREATE TABLE  `v_discussion_commont`(
 `id` int unsigned ,
 `pid` int ,
 `member_address` char(42) ,
 `content` text ,
 `createtime` varchar(24) ,
 `times` varchar(28) ,
 `member_icon` mediumtext ,
 `member_nick` varchar(100) 
)*/;

/*Table structure for table `v_events` */

DROP TABLE IF EXISTS `v_events`;

/*!50001 DROP VIEW IF EXISTS `v_events` */;
/*!50001 DROP TABLE IF EXISTS `v_events` */;

/*!50001 CREATE TABLE  `v_events`(
 `id` int unsigned ,
 `dao_id` bigint ,
 `dao_name` varchar(200) ,
 `member_address` char(42) ,
 `title` varchar(256) ,
 `content` text ,
 `is_send` tinyint ,
 `is_discussion` tinyint ,
 `top_img` text ,
 `state` int ,
 `start_time` varchar(24) ,
 `end_time` varchar(24) ,
 `on_line` varchar(1) ,
 `event_url` varchar(100) ,
 `original` char(42) ,
 `numbers` int ,
 `participate` tinyint ,
 `address` varchar(256) ,
 `createtime` varchar(24) ,
 `member_icon` mediumtext ,
 `member_nick` varchar(100) ,
 `original_icon` mediumtext ,
 `original_nick` varchar(100) 
)*/;

/*Table structure for table `v_events_commont` */

DROP TABLE IF EXISTS `v_events_commont`;

/*!50001 DROP VIEW IF EXISTS `v_events_commont` */;
/*!50001 DROP TABLE IF EXISTS `v_events_commont` */;

/*!50001 CREATE TABLE  `v_events_commont`(
 `id` int unsigned ,
 `pid` int ,
 `is_discussion` tinyint ,
 `member_address` char(42) ,
 `content` text ,
 `createtime` timestamp ,
 `member_icon` mediumtext ,
 `times` varchar(28) ,
 `member_nick` varchar(100) 
)*/;

/*Table structure for table `v_events_join` */

DROP TABLE IF EXISTS `v_events_join`;

/*!50001 DROP VIEW IF EXISTS `v_events_join` */;
/*!50001 DROP TABLE IF EXISTS `v_events_join` */;

/*!50001 CREATE TABLE  `v_events_join`(
 `id` int unsigned ,
 `pid` int ,
 `member_address` char(42) ,
 `manager` char(42) ,
 `content` text ,
 `createtime` timestamp ,
 `flag` tinyint ,
 `member_icon` mediumtext ,
 `member_nick` varchar(100) 
)*/;

/*Table structure for table `v_events_reply` */

DROP TABLE IF EXISTS `v_events_reply`;

/*!50001 DROP VIEW IF EXISTS `v_events_reply` */;
/*!50001 DROP TABLE IF EXISTS `v_events_reply` */;

/*!50001 CREATE TABLE  `v_events_reply`(
 `id` int unsigned ,
 `pid` int ,
 `member_address` char(42) ,
 `member_nick` varchar(100) ,
 `member_icon` text ,
 `content` text ,
 `createtime` timestamp ,
 `times` varchar(28) 
)*/;

/*Table structure for table `v_invite` */

DROP TABLE IF EXISTS `v_invite`;

/*!50001 DROP VIEW IF EXISTS `v_invite` */;
/*!50001 DROP TABLE IF EXISTS `v_invite` */;

/*!50001 CREATE TABLE  `v_invite`(
 `dao_name` varchar(200) ,
 `id` int unsigned ,
 `dao_id` bigint ,
 `member_address` char(42) ,
 `info` text ,
 `createtime` varchar(24) ,
 `flag` tinyint ,
 `icon` mediumtext ,
 `account` varchar(100) ,
 `member_nick` varchar(100) ,
 `member_icon` mediumtext 
)*/;

/*Table structure for table `v_members` */

DROP TABLE IF EXISTS `v_members`;

/*!50001 DROP VIEW IF EXISTS `v_members` */;
/*!50001 DROP TABLE IF EXISTS `v_members` */;

/*!50001 CREATE TABLE  `v_members`(
 `dao_id` int ,
 `member_votes` int ,
 `member_address` char(42) ,
 `member_type` tinyint ,
 `member_desc` text ,
 `member_icon` text ,
 `member_nick` varchar(100) 
)*/;

/*Table structure for table `v_news` */

DROP TABLE IF EXISTS `v_news`;

/*!50001 DROP VIEW IF EXISTS `v_news` */;
/*!50001 DROP TABLE IF EXISTS `v_news` */;

/*!50001 CREATE TABLE  `v_news`(
 `id` int unsigned ,
 `top_img` text ,
 `dao_id` bigint ,
 `member_address` char(42) ,
 `title` varchar(256) ,
 `content` text ,
 `createtime` varchar(24) ,
 `dao_name` varchar(200) ,
 `times` varchar(28) ,
 `member_icon` mediumtext ,
 `member_nick` varchar(100) 
)*/;

/*Table structure for table `v_swap` */

DROP TABLE IF EXISTS `v_swap`;

/*!50001 DROP VIEW IF EXISTS `v_swap` */;
/*!50001 DROP TABLE IF EXISTS `v_swap` */;

/*!50001 CREATE TABLE  `v_swap`(
 `tran_hash` char(66) ,
 `title` varchar(14) ,
 `in_amount` decimal(18,4) ,
 `out_amount` decimal(18,4) ,
 `block_num` bigint ,
 `swap_address` varchar(50) ,
 `swap_time` varchar(24) 
)*/;

/*Table structure for table `v_tokenuser` */

DROP TABLE IF EXISTS `v_tokenuser`;

/*!50001 DROP VIEW IF EXISTS `v_tokenuser` */;
/*!50001 DROP TABLE IF EXISTS `v_tokenuser` */;

/*!50001 CREATE TABLE  `v_tokenuser`(
 `dao_id` int ,
 `token_id` int ,
 `dao_manager` char(42) ,
 `token_cost` decimal(18,4) ,
 `dao_logo` text ,
 `dao_symbol` varchar(200) 
)*/;

/*View structure for view v_account */

/*!50001 DROP TABLE IF EXISTS `v_account` */;
/*!50001 DROP VIEW IF EXISTS `v_account` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_account` AS select `a`.`dao_id` AS `dao_id`,`a`.`dao_name` AS `dao_name`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_logo` AS `dao_logo`,`a`.`dao_desc` AS `dao_desc`,`a`.`dao_manager` AS `dao_manager`,ifnull(`b`.`account`,'') AS `account`,`b`.`account_url` AS `account_url`,`b`.`actor_desc` AS `actor_desc`,`b`.`actor_home_url` AS `actor_home_url`,`b`.`icon` AS `icon`,ifnull(`c`.`inviteAddress`,'') AS `inviteAddress` from ((`t_dao` `a` left join `a_account` `b` on((`a`.`dao_id` = `b`.`id`))) left join (select `t_daodetail`.`dao_id` AS `dao_id`,group_concat(`t_daodetail`.`member_address` separator ',') AS `inviteAddress` from `t_daodetail` where (`t_daodetail`.`member_type` = 0) group by `t_daodetail`.`dao_id`) `c` on((`a`.`dao_id` = `c`.`dao_id`))) */;

/*View structure for view v_app */

/*!50001 DROP TABLE IF EXISTS `v_app` */;
/*!50001 DROP VIEW IF EXISTS `v_app` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_app` AS select `t_app`.`block_num` AS `block_num`,`t_app`.`app_name` AS `app_name`,`t_app`.`app_id` AS `app_id`,`t_app`.`app_desc` AS `app_desc`,`t_app`.`app_address` AS `app_address`,`t_app`.`app_manager` AS `app_manager`,date_format(from_unixtime(`t_app`.`app_time`),'%Y-%m-%d') AS `app_time`,`t_app`.`app_version` AS `app_version`,`t_app`.`version_desc` AS `version_desc`,(case `t_app`.`app_type` when 1 then 'plugin' else 'system' end) AS `app_type_text`,`t_app`.`app_type` AS `app_type` from `t_app` */;

/*View structure for view v_dao */

/*!50001 DROP TABLE IF EXISTS `v_dao` */;
/*!50001 DROP VIEW IF EXISTS `v_dao` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_dao` AS select `a`.`dao_id` AS `dao_id`,`a`.`block_num` AS `block_num`,`a`.`dao_name` AS `dao_name`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_desc` AS `dao_desc`,date_format(from_unixtime(`a`.`dao_time`),'%Y-%m-%d') AS `dao_time`,`a`.`dao_manager` AS `dao_manager`,`a`.`dao_logo` AS `dao_logo`,`a`.`creator` AS `creator`,`a`.`delegator` AS `delegator`,`a`.`utoken_cost` AS `utoken_cost`,`a`.`dao_ranking` AS `dao_ranking`,`a`.`dao_exec` AS `dao_exec`,`a`.`_time` AS `_time`,ifnull(`b`.`token_id`,0) AS `token_id` from (`t_dao` `a` left join `t_token` `b` on((`a`.`dao_id` = `b`.`dao_id`))) */;

/*View structure for view v_daoinvitelist */

/*!50001 DROP TABLE IF EXISTS `v_daoinvitelist` */;
/*!50001 DROP VIEW IF EXISTS `v_daoinvitelist` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_daoinvitelist` AS select `a`.`id` AS `dao_id`,`a`.`account` AS `account`,`a`.`icon` AS `icon`,`a`.`actor_desc` AS `actor_desc`,`b`.`dao_manager` AS `dao_manager`,ifnull(`c`.`originalAddress`,'') AS `originalAddress`,ifnull(`d`.`inviteAddress`,'') AS `inviteAddress`,ifnull(`e`.`flag`,-(1)) AS `flag`,`e`.`id` AS `id` from ((((`a_account` `a` join `t_dao` `b` on((`a`.`id` = `b`.`dao_id`))) left join (select `t_daodetail`.`dao_id` AS `dao_id`,group_concat(`t_daodetail`.`member_address` separator ',') AS `originalAddress` from `t_daodetail` where (`t_daodetail`.`member_type` = 1) group by `t_daodetail`.`dao_id`) `c` on((`a`.`id` = `c`.`dao_id`))) left join (select `t_daodetail`.`dao_id` AS `dao_id`,group_concat(`t_daodetail`.`member_address` separator ',') AS `inviteAddress` from `t_daodetail` where (`t_daodetail`.`member_type` = 0) group by `t_daodetail`.`dao_id`) `d` on((`a`.`id` = `d`.`dao_id`))) left join (select `a_invite`.`id` AS `id`,`a_invite`.`dao_id` AS `dao_id`,`a_invite`.`flag` AS `flag` from `a_invite` where (`a_invite`.`flag` = 0)) `e` on((`a`.`id` = `e`.`dao_id`))) */;

/*View structure for view v_daotoken */

/*!50001 DROP TABLE IF EXISTS `v_daotoken` */;
/*!50001 DROP VIEW IF EXISTS `v_daotoken` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_daotoken` AS select -(2) AS `token_id`,-(2) AS `dao_id`,'eth' AS `dao_symbol`,NULL AS `dao_logo` union all select -(1) AS `token_id`,-(1) AS `dao_id`,'utoken' AS `dao_symbol`,NULL AS `dao_logo` union all select `a`.`token_id` AS `token_id`,`a`.`dao_id` AS `dao_id`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_logo` AS `dao_logo` from `v_dao` `a` where (`a`.`token_id` > 0) */;

/*View structure for view v_discussion */

/*!50001 DROP TABLE IF EXISTS `v_discussion` */;
/*!50001 DROP VIEW IF EXISTS `v_discussion` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_discussion` AS select `a`.`id` AS `id`,`a`.`member_address` AS `member_address`,`a`.`dao_id` AS `dao_id`,`a`.`title` AS `title`,`a`.`content` AS `content`,`a`.`is_send` AS `is_send`,`a`.`is_discussion` AS `is_discussion`,ifnull(`b`.`member_icon`,'') AS `member_icon`,ifnull(`b`.`member_nick`,'') AS `member_nick`,date_format(`a`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,(case when (timestampdiff(YEAR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a`.`createtime`,now()),'_minute') end) AS `times`,`c`.`dao_name` AS `dao_name` from ((`a_discussion` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) left join `t_dao` `c` on((`a`.`dao_id` = `c`.`dao_id`))) */;

/*View structure for view v_discussion_commont */

/*!50001 DROP TABLE IF EXISTS `v_discussion_commont` */;
/*!50001 DROP VIEW IF EXISTS `v_discussion_commont` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_discussion_commont` AS select `a`.`id` AS `id`,`a`.`pid` AS `pid`,`a`.`member_address` AS `member_address`,`a`.`content` AS `content`,date_format(`a`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,(case when (timestampdiff(YEAR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a`.`createtime`,now()),'_minute') end) AS `times`,ifnull(`b`.`member_icon`,'') AS `member_icon`,ifnull(`b`.`member_nick`,'') AS `member_nick` from (`a_discussion_commont` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) */;

/*View structure for view v_events */

/*!50001 DROP TABLE IF EXISTS `v_events` */;
/*!50001 DROP VIEW IF EXISTS `v_events` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_events` AS select `a`.`id` AS `id`,`a`.`dao_id` AS `dao_id`,`d`.`dao_name` AS `dao_name`,`a`.`member_address` AS `member_address`,`a`.`title` AS `title`,`a`.`content` AS `content`,`a`.`is_send` AS `is_send`,`a`.`is_discussion` AS `is_discussion`,`a`.`top_img` AS `top_img`,(case when (now() > `a`.`end_time`) then 2 when (now() > `a`.`start_time`) then 1 else 0 end) AS `state`,date_format(`a`.`start_time`,'%Y-%m-%d %H:%i:%s') AS `start_time`,date_format(`a`.`end_time`,'%Y-%m-%d %H:%i:%s') AS `end_time`,(case when (`a`.`address` = '') then '0' else '1' end) AS `on_line`,`a`.`event_url` AS `event_url`,`a`.`original` AS `original`,`a`.`numbers` AS `numbers`,`a`.`participate` AS `participate`,`a`.`address` AS `address`,date_format(`a`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,ifnull(`b`.`member_icon`,'') AS `member_icon`,ifnull(`b`.`member_nick`,'') AS `member_nick`,ifnull(`c`.`member_icon`,'') AS `original_icon`,ifnull(`c`.`member_nick`,'') AS `original_nick` from (((`a_events` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) left join `a_actor` `c` on((`a`.`original` = `c`.`member_address`))) left join `t_dao` `d` on((`a`.`dao_id` = `d`.`dao_id`))) */;

/*View structure for view v_events_commont */

/*!50001 DROP TABLE IF EXISTS `v_events_commont` */;
/*!50001 DROP VIEW IF EXISTS `v_events_commont` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_events_commont` AS select `a`.`id` AS `id`,`a`.`pid` AS `pid`,`a`.`is_discussion` AS `is_discussion`,`a`.`member_address` AS `member_address`,`a`.`content` AS `content`,`a`.`createtime` AS `createtime`,ifnull(`b`.`member_icon`,'') AS `member_icon`,(case when (timestampdiff(YEAR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a`.`createtime`,now()),'_minute') end) AS `times`,ifnull(`b`.`member_nick`,'') AS `member_nick` from (`a_events_commont` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) */;

/*View structure for view v_events_join */

/*!50001 DROP TABLE IF EXISTS `v_events_join` */;
/*!50001 DROP VIEW IF EXISTS `v_events_join` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_events_join` AS select `a`.`id` AS `id`,`a`.`pid` AS `pid`,`a`.`member_address` AS `member_address`,`c`.`member_address` AS `manager`,`a`.`content` AS `content`,`a`.`createtime` AS `createtime`,`a`.`flag` AS `flag`,ifnull(`b`.`member_icon`,'') AS `member_icon`,ifnull(`b`.`member_nick`,'') AS `member_nick` from ((`a_events_join` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) join `a_events` `c` on((`a`.`pid` = `c`.`id`))) */;

/*View structure for view v_events_reply */

/*!50001 DROP TABLE IF EXISTS `v_events_reply` */;
/*!50001 DROP VIEW IF EXISTS `v_events_reply` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_events_reply` AS select `a_events_reply`.`id` AS `id`,`a_events_reply`.`pid` AS `pid`,`a_events_reply`.`member_address` AS `member_address`,`a_events_reply`.`member_nick` AS `member_nick`,`a_events_reply`.`member_icon` AS `member_icon`,`a_events_reply`.`content` AS `content`,`a_events_reply`.`createtime` AS `createtime`,(case when (timestampdiff(YEAR,`a_events_reply`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a_events_reply`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a_events_reply`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a_events_reply`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a_events_reply`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a_events_reply`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a_events_reply`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a_events_reply`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a_events_reply`.`createtime`,now()),'_minute') end) AS `times` from `a_events_reply` */;

/*View structure for view v_invite */

/*!50001 DROP TABLE IF EXISTS `v_invite` */;
/*!50001 DROP VIEW IF EXISTS `v_invite` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_invite` AS select `d`.`dao_name` AS `dao_name`,`a`.`id` AS `id`,`a`.`dao_id` AS `dao_id`,`a`.`member_address` AS `member_address`,`a`.`info` AS `info`,date_format(`a`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,`a`.`flag` AS `flag`,ifnull(`b`.`icon`,'') AS `icon`,`b`.`account` AS `account`,`c`.`member_nick` AS `member_nick`,ifnull(`c`.`member_icon`,'') AS `member_icon` from (((`a_invite` `a` left join `a_account` `b` on((`a`.`dao_id` = `b`.`id`))) left join `a_actor` `c` on((`a`.`member_address` = `c`.`member_address`))) left join `t_dao` `d` on((`b`.`id` = `d`.`dao_id`))) */;

/*View structure for view v_members */

/*!50001 DROP TABLE IF EXISTS `v_members` */;
/*!50001 DROP VIEW IF EXISTS `v_members` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_members` AS select `a`.`dao_id` AS `dao_id`,`a`.`member_votes` AS `member_votes`,`a`.`member_address` AS `member_address`,`a`.`member_type` AS `member_type`,`b`.`member_desc` AS `member_desc`,`b`.`member_icon` AS `member_icon`,`b`.`member_nick` AS `member_nick` from (`t_daodetail` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) */;

/*View structure for view v_news */

/*!50001 DROP TABLE IF EXISTS `v_news` */;
/*!50001 DROP VIEW IF EXISTS `v_news` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_news` AS select `a`.`id` AS `id`,`a`.`top_img` AS `top_img`,`a`.`dao_id` AS `dao_id`,`a`.`member_address` AS `member_address`,`a`.`title` AS `title`,`a`.`content` AS `content`,date_format(`a`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,`c`.`dao_name` AS `dao_name`,(case when (timestampdiff(YEAR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a`.`createtime`,now()),'_minute') end) AS `times`,ifnull(`b`.`member_icon`,'') AS `member_icon`,ifnull(`b`.`member_nick`,'') AS `member_nick` from ((`a_news` `a` left join `a_actor` `b` on((`a`.`member_address` = `b`.`member_address`))) left join `t_dao` `c` on((`a`.`dao_id` = `c`.`dao_id`))) */;

/*View structure for view v_swap */

/*!50001 DROP TABLE IF EXISTS `v_swap` */;
/*!50001 DROP VIEW IF EXISTS `v_swap` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_swap` AS select `t_eth_utoken`.`tran_hash` AS `tran_hash`,'eth->utoken' AS `title`,`t_eth_utoken`.`swap_eth` AS `in_amount`,`t_eth_utoken`.`swap_utoken` AS `out_amount`,`t_eth_utoken`.`block_num` AS `block_num`,`t_eth_utoken`.`swap_address` AS `swap_address`,date_format(from_unixtime(`t_eth_utoken`.`swap_time`),'%Y-%m-%d %H:%i:%s') AS `swap_time` from `t_eth_utoken` union all select `t_u2t`.`tran_hash` AS `tran_hash`,'utoken->token' AS `utoken->token`,`t_u2t`.`utoken_amount` AS `utoken_amount`,`t_u2t`.`token_amount` AS `token_amount`,`t_u2t`.`block_num` AS `block_num`,`t_u2t`.`to_address` AS `to_address`,date_format(from_unixtime(`t_u2t`.`swap_time`),'%Y-%m-%d %H:%i:%s') AS `DATE_FORMAT(FROM_UNIXTIME(swap_time),'%Y-%m-%d %H:%i:%s')` from `t_u2t` union all select `t_t2u`.`tran_hash` AS `tran_hash`,'token->utoken' AS `token->utoken`,`t_t2u`.`token_amount` AS `token_amount`,`t_t2u`.`utoken_amount` AS `utoken_amount`,`t_t2u`.`block_num` AS `block_num`,`t_t2u`.`from_address` AS `from_address`,date_format(from_unixtime(`t_t2u`.`swap_time`),'%Y-%m-%d %H:%i:%s') AS `my_time` from `t_t2u` union all select `t_e2t`.`tran_hash` AS `tran_hash`,'eth->token' AS `eth->token`,`t_e2t`.`in_amount` AS `in_amount`,`t_e2t`.`out_amount` AS `out_amount`,`t_e2t`.`block_num` AS `block_num`,`t_e2t`.`to_address` AS `to_address`,date_format(from_unixtime(`t_e2t`.`swap_time`),'%Y-%m-%d %H:%i:%s') AS `DATE_FORMAT(FROM_UNIXTIME(swap_time),'%Y-%m-%d %H:%i:%s')` from `t_e2t` union all select `t_gastoken_utoken`.`tran_hash` AS `tran_hash`,'GToken->utoken' AS `GToken->utoken`,`t_gastoken_utoken`.`swap_eth` AS `swap_eth`,`t_gastoken_utoken`.`swap_utoken` AS `swap_utoken`,`t_gastoken_utoken`.`block_num` AS `block_num`,`t_gastoken_utoken`.`to_address` AS `to_address`,date_format(from_unixtime(`t_gastoken_utoken`.`swap_time`),'%Y-%m-%d %H:%i:%s') AS `DATE_FORMAT(FROM_UNIXTIME(swap_time),'%Y-%m-%d %H:%i:%s')` from `t_gastoken_utoken` */;

/*View structure for view v_tokenuser */

/*!50001 DROP TABLE IF EXISTS `v_tokenuser` */;
/*!50001 DROP VIEW IF EXISTS `v_tokenuser` */;

/*!50001 CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_tokenuser` AS select `a`.`dao_id` AS `dao_id`,`a`.`token_id` AS `token_id`,`a`.`dao_manager` AS `dao_manager`,`a`.`token_cost` AS `token_cost`,`b`.`dao_logo` AS `dao_logo`,`b`.`dao_symbol` AS `dao_symbol` from (`t_tokenuser` `a` join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`))) */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
