<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    
    <link rel="stylesheet" href="css/style.css">
    <script src="js/client.js" defer></script>
    
    <title>Сheckers online</title>

    

</head>
<body>
    
    <div class="container">

        <div class="title" id="window-game">
                
            <div class="chess-board"></div>
            <div class="chess-nicknames" >
                <div class="chess-nickname" id="chess-opponent-">Соперник: <span id="chess-opponent"></span></div>
                <div class="chess-nickname" id="chess-you-">Вы: <span id="chess-you"></span></div>
                
            </div>    
              
        </div>   

    
        <div class="title" id="window-nickname">
            <div class="title-head">
                <H1 class="text-shadow">Сheckers online</H1>
                <div class="title-caption"><span>Приветствую тебя</span></div>
            </div>
            <div class="form">

                <label class="input-caption" for="Login">Введите имя</label>
                <input type="text" name="Login" id="playlogin" placeholder="Login" value="Player">
                
                <div class="controls">
                    <button type="button" id="play">Создать игру</button>
                </div>
            </div>
        </div>

        <div class="title" id="window-chat">
            <div class="title-head">
                <H1 class="text-shadow">Сheckers online</H1>
                <div class="title-caption"><span>Чат</span></div>
            </div>
            <div class="form">
                <textarea rows="10" cols="45" name="text" id="h-chat" value="helloworld"></textarea>
                <input type="text" name="Text" id="inpt-chat" placeholder="сообщение">
                
                <div class="controls">
                    <button type="button" id="btn-chat-leave">Выйти из игры</button>
                    <button type="button" id="btn-chat">Отправить</button>
                </div>
            </div>
        </div>


        

        

    </div>
    
</body>
</html>
