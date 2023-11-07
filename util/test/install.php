
<?php
/**
 * это скрипт позволяет пересоздавать базу на локальном хостинге
 * если меняются поля в таблице
 * 
 */
    $host = "localhost";

    $root = "root";
    $root_password = "";

    $db = "checkers";

    try {
        $dbh = new PDO("mysql:host=$host", $root, $root_password);

        $dbh->exec("DROP DATABASE IF EXISTS `$db`;
            CREATE DATABASE IF NOT EXISTS `$db`;
            CREATE TABLE IF NOT EXISTS `$db`.`game_states` (
            `game_id` INT NOT NULL AUTO_INCREMENT ,
            `game_key` VARCHAR(255) NOT NULL ,
            `game_owner` VARCHAR(255) NOT NULL ,
            `game_owner_name` VARCHAR(255) NOT NULL ,
            `game_slave` VARCHAR(255) NOT NULL ,
            `game_slave_name` VARCHAR(255) NOT NULL ,
            `game_owner_color` VARCHAR(255) NOT NULL ,
            `game_slave_color` VARCHAR(255) NOT NULL ,
            `user_turn` VARCHAR(255) NOT NULL ,
            `game_state` TEXT NOT NULL ,
            `game_chat_owner` TEXT NOT NULL ,
            `game_chat_owner_n` INT NOT NULL DEFAULT 0,
            `game_chat_slave` TEXT NOT NULL ,
            `game_chat_slave_n` INT NOT NULL DEFAULT 0,
            `game_date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (`game_id`)
            ) ENGINE = InnoDB;") or die(print_r($dbh->errorInfo(), true));

    }
    catch (PDOException $e) {
        die("DB ERROR: " . $e->getMessage());
    }
?>
