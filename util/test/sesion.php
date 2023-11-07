<?php

session_start();

echo 'test<br>';
echo $_SESSION['user_id'] . '<br>';
echo $_SESSION['key'] . '<br>';
echo $_SESSION['user_name'] . '<br>';