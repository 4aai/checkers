<?php
// переменные для подключения к бд
$host = 'localhost'; // имя сервера БД
$db_name = 'checkers'; // название базы данных
$login = 'root'; // имя пользователя БД
$password = ''; // пароль пользователя бд


return new PDO("mysql:host=$host; dbname=$db_name", $login, $password);

