<?php
//?  server.php?type='        '&key='               '&user='         '&mess='       ' 
//!                    create        jsdkgfsdjkf2343        Player324
//!                    end
//!                    chat
//!                    join
//!                    leave
//!                    game_state
session_start();  // вызываем везде, где исп сесии
$pdo = require '../util/connect_db.php'; 

    if( isset($_REQUEST["type"]) ){ // если сессии установлены
        
        $_REQUEST["type"] = htmlspecialchars( trim( $_REQUEST["type"] ) );
        if( isset($_REQUEST["key"]) ){ $_REQUEST["key"] = htmlspecialchars( trim( $_REQUEST["key"] ) ); }
        if( isset($_REQUEST["user"]) ){ $_REQUEST["user"] = htmlspecialchars( trim( $_REQUEST["user"] ) ); }
        if( isset($_REQUEST["mess"]) ){ $_REQUEST["mess"] = htmlspecialchars( trim($_REQUEST["mess"])  ); }

        $error['error'] = 'empty';
        $response = json_encode($error);

        switch ($_REQUEST["type"]) {
                                    
            case 'join':

                unset($_SESSION['user_name']); // уничтожаем переменную в сессии
                unset($_SESSION['user_id']); // уничтожаем переменную в сессии
                unset($_SESSION['key']); // уничтожаем переменную в сессии

                $query = "SELECT `game_slave`, `game_slave_name` FROM `game_states` WHERE `game_key` = ?;";
                $result = $GLOBALS['pdo']->prepare($query);
                $result->execute([ $_REQUEST['key']] );

                $rowCount = $result->rowCount();

                if( $rowCount < 0 ){
                    $response = 'error key ключа нет';break;
                }

                $file = $result->fetch();
                if(!empty($file['game_slave_name'])) {
                    $response = "<div>к этой игре больше нельзя подключиться</div><div>key: $_REQUEST[key] <a href='http://localhost/test_checkers_demo/' >на главную</a></div>'</div>";
                    break;
                }

                # создаем сессию для пользователя
                # отвечаем что создали сессию
                $_SESSION['user_id'] = "user_" . sha1(uniqid(time(), true));
                $_SESSION['key'] = $_REQUEST['key'];
                //$_SESSION['user_name'] = $_REQUEST["user"];
                
                # создание записи в таблице
                $query = "UPDATE `game_states`  SET `game_slave` = ? WHERE `game_key` = ?;";
                $result = $GLOBALS['pdo']->prepare($query);
                $result->execute([  $_SESSION['user_id'] , $_SESSION['key']]);
                
                $response = "<div>вы подключились к игре</div><div>key: $_SESSION[key] <a href='../test_checkers_demo/' >на главную</a></div>'</div>";
                header("Location: ../");
                break;
                        
            case 'accept_game':

                
                if( isset( $_SESSION['key'] ) ){
                    // просто получаем имя пользователя
                    $_SESSION['user_name'] = $_REQUEST['user'];
                    $query = "UPDATE `game_states`  SET `game_slave_name` = ? WHERE `game_key` = ?;";
                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([  $_SESSION['user_name'] , $_SESSION['key']]);
                    $out['joined'] = true;
                }
                else{
                    $out['error'] = 'no-key';
                }
                $response = json_encode($out);

            break;
                        
            case 'leave':
                # удаляем сессию пользователя
                # отвечаем что удалили
                unset($_SESSION['user_name']); // уничтожаем переменную в сессии
                unset($_SESSION['user_id']); // уничтожаем переменную в сессии
                unset($_SESSION['key']); // уничтожаем переменную в сессии
                $out['leave'] = true;
                $response = json_encode($out);
            break;

            case 'checker_move':
                # передача массива состояния доски

                if( isset( $_SESSION['key'] ) ){
                    $query = "SELECT `game_owner`, `game_slave`, `game_state`, `user_turn`
                    FROM `game_states` WHERE `game_key` = ?;";
                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([ $_SESSION['key']] );
                    $file = $result->fetch();

                    $rowCount = $result->rowCount();
                    if( $rowCount <= 0 ){
                        $out['error'] = 'no-key';
                        $response = json_encode($out);
                        break;
                    }

                    $postData = file_get_contents('php://input');
                    $board = json_decode($postData, true);
                    // echo '<pre>';
                    // print_r($board);
                    // echo '</pre>';

                    if($file['game_owner'] === $_SESSION['user_id']){
                        // если мы овнер игры то переворачиваем доску
                        $board = array_reverse($board);
                        foreach ($board as &$element) {
                            $element = array_reverse($element);
                        }
                    }

                    if($file['user_turn'] === 'red') {
                        $file['user_turn'] = 'blue';
                    }else{
                        $file['user_turn'] = 'red';
                    }
                    $query = "UPDATE `game_states`  
                    SET `game_state` = ?, `user_turn` = ?
                    WHERE `game_key` = ?;";

                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([ json_encode($board),  $file['user_turn'], $_SESSION['key'] ] );

                    $out['success'] = true;
                }
                else{
                    $out['error'] = 'no-key';
                }
                $response = json_encode($out);
                break;

            case 'create_link':

                #  
                #  мы должны создать ключ игры если он еще не создан
                #  создаем сессию для пользователя
                # возвращаем сессию и ключ игры
                unset($_SESSION['user_name']); // уничтожаем переменную в сессии
                unset($_SESSION['user_id']); // уничтожаем переменную в сессии
                unset($_SESSION['key']); // уничтожаем переменную в сессии

                $_SESSION['user_id'] = "user_" . sha1(uniqid(time(), true));
                $_SESSION['user_name'] = $_REQUEST["user"];
                $key = sha1(uniqid(time(), true));
                $_SESSION['key'] = $key;
                $boardState = require('../util/rnd-game-state.php');

                $slave_color = '';
                $owner_color = '';
                $user_turn = 'red';
                if($boardState[7][0][0] === 'X'){
                    $slave_color = 'red';
                    $owner_color = 'blue';
                }
                if($boardState[7][0][0] === 'O'){
                    $slave_color = 'blue';
                    $owner_color = 'red';
                }
                
                // создание записи в таблице
                // проверяем на уникальность логина в бд
                // $query = "SELECT `game_id` FROM `game_states` WHERE `game_id` = 'df';"; // текст запроса
                
               

                $query = "INSERT INTO `game_states` (`game_owner_color`, `game_slave_color`, `game_key`, `game_state`, `game_owner`, `game_owner_name`, `user_turn`)
                 VALUES(?, ?, ?, ?, ?, ?, ?);";
                $result = $GLOBALS['pdo']->prepare($query);
                $result->execute([ $owner_color, $slave_color, $_SESSION['key'], json_encode($boardState), $_SESSION['user_id'], $_SESSION['user_name'], $user_turn  ]);


                # создаем key и отдаем ссылку и QR_Code
                # server.php?type='join'&key=''

                require_once  '../config/config.php';
                require_once  '../phpqrcode/qrlib.php';

                $QR_PATH = '../img/qr/';

                if (!file_exists( $QR_PATH)) {
                    mkdir( $QR_PATH, 0755, true);
                }
                $namePng = substr($_SESSION['key'], 0, 5) .'link.png'; //substr( sha1(uniqid(time(), true)), 0, 8 ) . '.png';
                
                $link = "$SERVER_API?type=join&key=" . $_SESSION['key'];
                QRcode::png($link,   $QR_PATH . $namePng, 'H', 6, 2);
                // $response = '<div><img src="' . $QR_PATH . $namePng . '">' . '<br><p style="width: 100px;"><a href="' . $link . '">'. $link .'</a></p></div>';
                $out['link'] = $link;
                $out['qr'] = $QR_CODE_SRC . $namePng;

                $out['uname'] = $_SESSION['user_name'];
                $out['uid'] = $_SESSION['user_id'];
                
                $out['key'] = $_SESSION['key'];
                $out['game'] = $boardState;
                $response = json_encode($out);

            break;

            case 'get_qr':
                if( isset( $_SESSION['key'] ) ){
                    require_once  '../config/config.php';
                    require_once  '../phpqrcode/qrlib.php';

                    $QR_PATH = '../img/qr/';

                    if (!file_exists( $QR_PATH)) {
                        mkdir( $QR_PATH, 0755, true);
                    }
                    $namePng = substr($_SESSION['key'], 0, 5) .'link.png';
                    
                    $link = "$SERVER_API?type=join&key=" . $_SESSION['key'];
                    QRcode::png($link, $QR_PATH . $namePng, 'H', 6, 2);
                    $out['link'] = $link;
                    $out['qr'] = $QR_CODE_SRC . $namePng;
                    
                
                }
                else{
                    $out['error'] = 'no-qr';
                }
                
                $response = json_encode($out);
            break;
            case 'get_message':
                if( isset( $_SESSION['key'] ) ){
                    // если у нас есть сешшн кей значит мы можем писать сообщения в чат
                    // и нам нужно проверить наличие сообщения и если оно есть отправить клиенту
                    
                    $query = "SELECT `game_owner`, `game_slave`
                    FROM `game_states` WHERE `game_key` = ?;";
                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([ $_SESSION['key']] );
                    $file1 = $result->fetch();

                    $rowCount = $result->rowCount();
                    if( $rowCount <= 0 ){
                        $out['error'] = 'no-key';
                        $response = json_encode($out);
                        break;
                    }

                    
                    if($file1['game_owner'] === $_SESSION['user_id']){ 
                        // если мы геймовнер
                       $query = "SELECT `game_chat_owner_n`, `game_chat_owner`
                                FROM `game_states` WHERE `game_chat_owner_n` > 0 AND `game_key` = ?;";
                        $result = $GLOBALS['pdo']->prepare($query);
                        $result->execute([ $_SESSION['key']] );
    
                        $rowCount = $result->rowCount();
    
                        if( $rowCount <= 0 ){
                            $out['error'] = 'no-message';
                            $response = json_encode($out);
                            break;
                        }
    
                        $file = $result->fetch();
                        $response = $file['game_chat_owner'];

                        $query = "UPDATE `game_states`  
                        SET `game_chat_owner` = ?, `game_chat_owner_n` = ?
                        WHERE `game_key` = ?;";

                        $result = $GLOBALS['pdo']->prepare($query);
                        $result->execute([ '', 0, $_SESSION['key']] );
                    }
                    
                    if($file1['game_slave'] === $_SESSION['user_id']){ 
                        // если мы гейм слэйв
                        $query = "SELECT `game_chat_slave_n`, `game_chat_slave`
                                FROM `game_states` WHERE `game_chat_slave_n` > 0 AND `game_key` = ?;";
                        $result = $GLOBALS['pdo']->prepare($query);
                        $result->execute([ $_SESSION['key']] );
    
                        $rowCount = $result->rowCount();
    
                        if( $rowCount <= 0 ){
                            $out['error'] = 'no-message';
                            $response = json_encode($out);
                            break;
                        }
    
                        $file = $result->fetch();
                        $response = $file['game_chat_slave'];

                        $query = "UPDATE `game_states`  
                        SET `game_chat_slave` = ?, `game_chat_slave_n` = ?
                        WHERE `game_key` = ?;";

                        $result = $GLOBALS['pdo']->prepare($query);
                        $result->execute([ '', 0, $_SESSION['key']] );
                    }

                    


                }
                else{
                    $out['error'] = 'no-key';
                    $response = json_encode($out);
                }
                //$response = json_encode($out);
            break;

            case 'write_message':
                if( isset( $_SESSION['key'] ) ){
                    // если у нас есть сешшн кей значит мы можем писать сообщения в чат
                    $query = "SELECT `game_owner`, `game_slave`,
                     `game_chat_owner_n`, `game_chat_slave_n`,
                     `game_chat_owner`, `game_chat_slave`
                    FROM `game_states` WHERE `game_key` = ?;";
                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([ $_SESSION['key']] );

                    $rowCount = $result->rowCount();

                    if( $rowCount <= 0 ){
                        $out['error'] = 'game-ended';
                        $response = json_encode($out);
                        break;
                    }

                    $file = $result->fetch();

                    if($file['game_owner'] === $_SESSION['user_id']){ 
                        // если мы геймовнер
                        $query = "UPDATE `game_states`  
                        SET `game_chat_slave` = ?, `game_chat_slave_n` = ?
                        WHERE `game_key` = ?;";

                        $result = $GLOBALS['pdo']->prepare($query);

                        $new_message = json_decode($file['game_chat_slave']);
                        
                        $message['user'] = $_SESSION["user_name"];
                        $message['message'] = $_REQUEST["mess"];
                        $new_message[] = $message;

                        $new_message = json_encode($new_message);
                        //echo $new_message;
                        $result->execute([ $new_message, $file['game_chat_slave_n'] + 1, $_SESSION['key']] );
                    }
                    
                    if($file['game_slave'] === $_SESSION['user_id']){ 
                        // если мы гейм слэйв
                        $query = "UPDATE `game_states`  
                        SET `game_chat_owner` = ?, `game_chat_owner_n` = ?
                        WHERE `game_key` = ?;";

                        $result = $GLOBALS['pdo']->prepare($query);
                        
                        $new_message = json_decode($file['game_chat_owner']);

                        $message['user'] = $_SESSION["user_name"];
                        $message['message'] = $_REQUEST["mess"];
                        $new_message[] = $message;

                        $new_message = json_encode($new_message);
                        //echo $new_message;
                        $result->execute([ $new_message, $file['game_chat_owner_n'] + 1, $_SESSION['key']] );
                    }
                    
                    $out['success'] = true;
                }
                else{
                    $out['error'] = 'no-key';
                }
                $response = json_encode($out);
            break;

            case 'get_opponent':
                // проверка по базе есть ли ключ игры ищем по сессии
                if( isset( $_SESSION['key'] ) ){
                    $query = "SELECT `game_slave_name`, `game_slave` FROM `game_states` WHERE `game_key` = ?;";
                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([ $_SESSION['key']] );

                    $rowCount = $result->rowCount();

                    if( $rowCount <= 0 ){
                        break;
                    }

                    $file = $result->fetch();

                    if(!empty($file['game_slave_name'])){
                        $out['id'] = $file['game_slave'];
                        $out['name'] =  $file['game_slave_name'];
                    }else{
                        $out['error'] = 'no-user';
                    }
                    
                }else{

                    $out['error'] = 'no-key';
                }

                
                // print_r($out);
                $response = json_encode($out);

            break;

            case 'get_info':
            
                // $out['game_key'] = 'no-value';
                // $out['game_user_id'] = 'no-value';
                // $out['game_user_name'] = 'no-value';
                // $out['game_opponent'] = 'no-value';
                // $out['game_opponent_name'] = 'no-value';
                // $out['game_userturn'] = 'no-value';
                // $out['game_state'] = 'no-value';
                // $out['game_date_creation'] = 'no-value';

                if( isset( $_SESSION['key'] ) ){

                    $query = "SELECT *
                    FROM `game_states` WHERE `game_key` = ?;";
                    $result = $GLOBALS['pdo']->prepare($query);
                    $result->execute([ $_SESSION['key']] );

                    $rowCount = $result->rowCount();

                    if( $rowCount <= 0 ){
                        $out['error'] = 'game-ended';
                        $response = json_encode($out);
                        break;
                    }

                    $file = $result->fetch();
                    $out['game_user_id'] = $_SESSION['user_id'];
                    if( isset( $_SESSION['user_name'] ) ){
                        $out['game_user_name'] = $_SESSION['user_name'];
                    }
                    else{
                        $out['game_user_name'] = '';
                    }

                    if($file['game_owner'] === $_SESSION['user_id']){ 
                        // если мы геймовнер
                        $out['game_opponent_id'] = $file['game_slave'];
                        $out['game_opponent_name'] = $file['game_slave_name'];
                        $out['checker_color'] = $file['game_owner_color'];
                    }
                    
                    if($file['game_slave'] === $_SESSION['user_id']){ 
                        // если мы гейм слэйв
                        $out['game_opponent_id'] = $file['game_owner'];
                        $out['game_opponent_name'] = $file['game_owner_name'];
                        $out['checker_color'] = $file['game_slave_color'];
                    }
                    $out['game_key'] = $_SESSION['key'];
                   
                    $out['game_owner'] = $file['game_owner'];
                    $out['game_userturn'] = $file['user_turn'];
                    $out['game_state'] = json_decode($file['game_state']);

                    if($file['game_owner'] === $_SESSION['user_id']){
                        $out['game_state'] = array_reverse($out['game_state']);
                        foreach ($out['game_state'] as &$element) {
                            $element = array_reverse($element);
                        }
                    }
                    

                    $out['game_date_creation'] = $file['game_date_creation'];

                }
                else{
                    $out['error'] = 'no-key';
                }
                $response = json_encode($out);


            break;
                        
        }
        
        // var_dump($_REQUEST);
        // echo '<pre>';
        // print_r($_REQUEST);echo '</pre>';

        echo $response; // какой то ответ сервера
        
    }
?>