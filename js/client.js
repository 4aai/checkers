const api = '../api/api.php';

// const board = [
//     ['w','b','w','b','w','b','w','b',],
//     ['b','w','b','w','b','w','b','w',],
//     ['w','b','w','b','w','b','w','b',],
//     ['b','w','b','w','b','w','b','w',],
//     ['w','b','w','b','w','b','w','b',],
//     ['b','w','b','w','b','w','b','w',],
//     ['w','b','w','b','w','b','w','b',],
//     ['b','w','b','w','b','w','b','w',],
// ];

// let boardState = [
//     [' ','O',' ','O',' ','O',' ','O',],
//     ['O',' ','O',' ','O',' ','O',' ',],
//     [' ','O',' ','O',' ','O',' ','O',],
//     [' ',' ',' ',' ',' ',' ',' ',' ',],//
//     [' ',' ',' ',' ',' ',' ',' ',' ',],//
//     ['X',' ','X',' ','X',' ','X',' ',],
//     [' ','X',' ','X',' ','X',' ','X',],
//     ['X',' ','X',' ','X',' ','X',' ',],
// ];



// const boardState = [
//     [' ',' ',' ',' ',' ',' ',' ',' ',],
//     [' ',' ',' ',' ','O',' ','OK',' ',],
//     [' ',' ',' ',' ',' ',' ',' ',' ',],
//     [' ',' ','O',' ','O',' ','OK',' ',],//
//     [' ',' ',' ',' ',' ',' ',' ',' ',],//
//     [' ',' ','XK',' ','O',' ',' ',' ',],
//     [' ',' ',' ',' ',' ',' ',' ',' ',],
//     [' ',' ',' ',' ','X',' ',' ',' ',],
// ];



let gameState = {
    
};
function gameStateDefault(){
    gameState = {
        userName: '',
        userID: '',
    
        opponentName: '',
        opponentID: '',
    
        userTurn: 'unlocked', 
        myCheckerColor : 'red',
        checkerTurn: 'red',
        key: '',
        boardState: [
            [' ','O',' ','O',' ','O',' ','O',],
            ['O',' ','O',' ','O',' ','O',' ',],
            [' ','O',' ','O',' ','O',' ','O',],
            [' ',' ',' ',' ',' ',' ',' ',' ',],
            [' ',' ',' ',' ',' ',' ',' ',' ',],
            ['X',' ','X',' ','X',' ','X',' ',],
            [' ','X',' ','X',' ','X',' ','X',],
            ['X',' ','X',' ','X',' ','X',' ',],
        ],
    
        dateCreation: '',
        stateUI: 'default',
        gameOwner: '',
    };
    
}
gameStateDefault();



const qrCode = document.createElement('div');
    qrCode.classList.add('title');
    qrCode.classList.add('hide');
    qrCode.id = 'qrcode';
    document.querySelector('.container').appendChild(qrCode);

async function getMyState(){
    try {
        let response = await fetch(`${api}?type=get_info`);
        if (response.ok) {
            let data = await response.json();
            console.log('response getMyState() ',  data);
            if(data.error === "game-ended"){
                if(gameState.key !== ""){
                    // игра закончилась ключ сесси истек
                    alert('Игра закончилась');
                    viewUI('default');
                }
            }else{
                if(data.error !== 'no-key'){
                    // мы не зарегали и не подключились ни к какой игре
                    // должны предложить создать игру
                    gameState.userName = data.game_user_name;
                    gameState.userID = data.game_user_id;
                    gameState.opponentName = data.game_opponent_name;
                    gameState.opponentID = data.game_opponent_id;
                    gameState.checkerTurn = data.game_userturn;
                    gameState.key = data.game_key;
                    gameState.boardState =  data.game_state;
                    gameState.dateCreation = data.game_date_creation;
                    gameState.gameOwner = data.game_owner;

                    gameState.myCheckerColor = data.checker_color;
                    
                    if(gameState.checkerTurn === gameState.myCheckerColor){
                        document.querySelector('#chess-opponent-').classList.remove("turn");
                
                        document.querySelector('#chess-you-').classList.add("turn");
                        //alert('YOU');
                    }else{
                        document.querySelector('#chess-opponent-').classList.add("turn");
                        
                        document.querySelector('#chess-you-').classList.remove("turn");
                        //alert('HIM');
                    }

                    console.log(gameState);
                    if(gameState.key.length > 1 && gameState.userName !== '' && gameState.opponentName === ''){
                        gameState.stateUI = 'create-game';
                        getQr();
                        getGameOpponent();
                    }
                    if(gameState.key.length > 1 && gameState.userName === ''){
                        
                        writeToChat(`SERVER: ${gameState.opponentName} ждет тебя в игре!`);
                        gameState.stateUI = 'on-connect';
                    }
                    if(gameState.key.length > 1 && gameState.userName !== '' && gameState.opponentName !== ''){
                        gameState.stateUI = 'in-game';
                        drawCheckersBoard();
                        core();
                    }
                    viewUI(gameState.stateUI);
                    
                
                    console.log('============Тест ходят', gameState.checkerTurn);
                    
                }
                
            }
            
        }
    }
    catch (error) {
        console.log(error);
    }
}
viewUI(gameState.stateUI);
getMyState();

document.getElementById("play").addEventListener('click', function(event) {
    // вводим ник или начинаем новую игру
    console.log('click')
    if(gameState.key === ''){
        createGame(document.querySelector("#playlogin").value);
    }else{
        joinGame(document.querySelector("#playlogin").value);
    }

});

document.getElementById("btn-chat-leave").addEventListener('click', function(event) {
    // удаляем сессии
    //leaveGame();
    writeMessage('aezakmi');
    getMyState();
});

document.getElementById("btn-chat").addEventListener('click', function(event) {
    const message = document.querySelector("#inpt-chat").value;
    writeMessage(message);
    
});
document.getElementById("inpt-chat").addEventListener('keyup', function(event){
    if(event.key === 'Enter'){
        const message = document.querySelector("#inpt-chat").value;
        writeMessage(message);
    }
});

function viewUI(state) {
    
    switch (state) {
        case 'default':
            // только логин
            document.querySelector('#play').textContent = 'Создать игру';
            document.querySelector("#window-nickname").classList.remove("hide");

            document.querySelector("#qrcode").classList.add("hide");
            document.querySelector("#window-game").classList.add("hide");
            document.querySelector("#window-chat").classList.add("hide");
            break;
    
        case 'create-game':
            // ждем вторго игрока показываем только чат + qr?
            document.querySelector("#window-chat").classList.remove("hide");

            document.querySelector("#window-game").classList.add("hide");
            document.querySelector("#window-nickname").classList.add("hide");
            document.querySelector("#qrcode").classList.remove("hide");
            
            break;
    
        case 'on-connect':
            // только ввод ника
            document.querySelector('#play').textContent = 'присоедениться';
            document.querySelector("#window-nickname").classList.remove("hide");

            document.querySelector("#qrcode").classList.add("hide");
            document.querySelector("#window-game").classList.add("hide");
            document.querySelector("#window-chat").classList.add("hide");
            break;
    
        case 'in-game':
            // доска + чат
            document.querySelector("#window-game").classList.remove("hide");
            document.querySelector("#window-chat").classList.remove("hide");

            document.querySelector("#qrcode").classList.add("hide");
            document.querySelector("#window-nickname").classList.add("hide");

            document.querySelector('#chess-opponent').textContent = gameState.opponentName;
            document.querySelector('#chess-you').textContent = gameState.userName;
            
            
            getMessage();
            break;
    
        default:
            // только логин
            viewUI('default');
            break;
    }
    
}

/**
 * 
 * @param {*text string текст} text 
 * @param {*clearInput boolean очистить поле ввода} clearInput 
 */
function writeToChat(text, clearInput = false) {
    if(clearInput === true) document.querySelector("#inpt-chat").value = '';
    document.querySelector("#h-chat").value = `[${getTimeNow()}] ${text}\n${document.querySelector("#h-chat").value}`;
}

function getTimeNow(){
    let time = new Date();
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds() < 10? `0${time.getSeconds()}` : `${time.getSeconds()}`}`;
}


async function sendCheckerStep() {
    try {
        // btoa(text)
        //let response = await fetch(`${api}?type=checker_move&mess=${gameState.boardState}`);
        let response = await fetch(`${api}?type=checker_move`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameState.boardState)
        });
        
        if (response.ok) {
            let data = await response.json();

            console.log('response sendCheckerStep() ',  data);
            if(data.success){
                // ход сделан]
                document.querySelector('#chess-opponent-').classList.add("turn");
                    
                document.querySelector('#chess-you-').classList.remove("turn");
                //alert('HIM');
                
                writeMessage('aezakmi_make_step');
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function writeMessage(text) {

    try {
        // btoa(text)
        let response = await fetch(`${api}?type=write_message&mess=${text}`);
        if (response.ok) {
            let data = await response.json();

            console.log('response writeMessage() ',  data);
            if(data.error === 'no-key'){
                writeToChat(`SERVER: ${data.error}`);
                
            }
            if(data.success){
                
                if(text === 'aezakmi') leaveGame();
                if(text !== 'aezakmi_make_step'){
                    writeToChat(`${gameState.userName} ${document.querySelector("#inpt-chat").value}` , true);
                }
            }
            //writeToChat(`SERVER: ${getTimeNow()}`);
            
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function getMessage() {
    try {
        let response = await fetch(`${api}?type=get_message`);
        if (response.ok) {
            let data = await response.json();

            console.log('response getMessage() ',  data);
            
            if(data.error === 'no-key'){
                writeToChat(`SERVER: ${data.error}`)
            }
            else{
                if(data[0]){
                    data.forEach( function(el){
                        // try {
                        //     writeToChat(`${el.user}: ${atob(el.message)}`);
                        // } catch (error) {
                        //     writeToChat(`${el.user}: ${el.message}`);
                        // }
                        if(el.message === 'aezakmi'){
                            writeToChat(`SERVER: пользователь ${el.user} вышел из игры`);
                        }else if(el.message === 'aezakmi_make_step'){
                            getMyState();
                            
                                document.querySelector('#chess-opponent-').classList.remove("turn");
                        
                                document.querySelector('#chess-you-').classList.add("turn");
                                //alert('YOU');
                            
                            //core();
                        }else{
                            writeToChat(`${el.user}: ${el.message}`);
                        }
                        
                    });
                }
                
                setTimeout(function () {
                    getMessage();
                }, 1000);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function createGame(user) {
    try {
        let response = await fetch(`${api}?type=create_link&user=${user}`);
        if (response.ok) {
            let data = await response.json();
        
            console.log(`response createGame(${user})`,  data);
            qrCode.innerHTML = `<div><img src="${data.qr}"> <br><p style="width: 100px;"><a href="${data.link}">${data.link}</a></p></div>`;
            

            gameState.key = data.key;
            gameState.userName = data.uname;
            gameState.userID = data.uid;
            gameState.boardState = data.game
            gameState.stateUI = 'create-game';
            viewUI(gameState.stateUI);

            
            console.log(gameState);
            
            writeToChat(`SERVER: ${gameState.userName}, вы успешно создали игру [${gameState.key}]`);
            writeToChat(`SERVER: поделитесь ссылкой со вторым игроком`);
            getGameOpponent();
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function getQr() {
    try {
        let response = await fetch(`${api}?type=get_qr`);
        if (response.ok) {
            let data = await response.json();
        
            console.log(`response getQr()`,  data);

            if(data.error){
                console.log(`response getQr()`,  data.error);
            }else{
                qrCode.innerHTML = `<div><img src="${data.qr}"> <br><p style="width: 100px;"><a href="${data.link}">${data.link}</a></p></div>`;
                //getGameOpponent();
            }
            
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function getGameOpponent() {
    try {
        let response = await fetch(`${api}?type=get_opponent`);
        if (response.ok) {
            let data = await response.json();

            console.log('response getGameOpponent() ',  data);
            // if(data.error = 'empty'){
            //     alert('что пошло не так, попробуйде заново');
            //     return;
            // }
            if(data.error !== 'no-key'){
                if(data.error === 'no-user'){
                    setTimeout(function () {
                        getGameOpponent();
                    }, 1000);
                }else{
                    //document.querySelector("#qrcode").remove();
                    writeToChat(`SERVER:  ${data.name} подключился!!!`)
                    gameState.stateUI = 'in-game';
                    viewUI(gameState.stateUI);
                    getMyState();
                }
            }
            
            
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function joinGame(userName) {
    try {
        let response = await fetch(`${api}?type=accept_game&user=${userName}`);
        if (response.ok) {
            let data = await response.json();

            console.log('response joinGame(userName) ',  data);
            if(data.error === 'no-key'){
                
            }else{
                getMyState();
                writeToChat(`SERVER: ${gameState.userName}, вы успешно зашли в игру [${gameState.key}]`);
                
            }
            
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function leaveGame() {
    try {
        let response = await fetch(`${api}?type=leave`);
        if (response.ok) {
            let data = await response.json();
            if(data.leave){
                console.log('response leaveGame() ',  data);
                writeToChat(`SERVER: ${gameState.userName}, вы вышли из игры [${gameState.key}]`);
                gameStateDefault();
                
                viewUI(gameState.stateUI);
                
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

//!==============================================================================================================
//!==============================================================================================================
//!==============================================================================================================


/**
 * 
 * @param {*int текущая координата по оси X} x 
 * @param {*int текущая координата по оси Y} y 
 * @param {*string является ли шашка дамкой, у дамки type='king'} type 
 * @param {*int для рекурсивного выбора ходов дамки} branch 
 * @returns [[x,y],...] координаты возможных ходов 
 */

 let traceRoutsMoves = [];
 function movePossible(x, y, type = '', branch = 0, enemy = '', node = false, traceRouts = [], enemys = []){
    let revers = {
        'O': 'X',
        'X': 'O',
        'OK': 'X',
        'XK': 'O',
    }
    

    if(branch === 0 && enemy === '') enemy = revers[gameState.boardState[y][x]];
    const moves = [];
    let X, Y;
    let position = [];
//*------------------------------------------------------------------------------   
    if(branch === 0 || branch === 1){
        X = x + 1; Y = y + 1;
        if((0 <= X && X <= 7) && (0 <= Y && Y <= 7)){
            console.log(x,y,' - ', X,Y, ' | ', gameState.boardState[y][x], gameState.boardState[Y][X], type === ''? 'not king': type, branch);
            
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] !== ' ') {
                //traceRoutsMoves.push( ...traceRouts);
                return moves;
            }
            
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] === ' '){
                moves.push([-x, -y]);
                moves.push([X, Y]);
                
                position = [X,Y]; enemys.push([x, y]);
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, 1, enemy, false, traceRouts, enemys));
                }else{
                    moves.push(...movePossible(X, Y, type, 1, enemy, true, traceRouts, enemys));
                }
                moves.push(...movePossible(X, Y, type, -2, enemy, true, traceRouts, enemys));
                moves.push(...movePossible(X, Y, type, 2, enemy, true, traceRouts, enemys));
                
            }

            if(gameState.boardState[Y][X] === ' ' && gameState.boardState[y][x][0] !== enemy && node === false){
                moves.push([X, Y]);

                position = [X,Y];
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, 1, enemy, false, traceRouts, enemys));
                }

            }
            if(gameState.boardState[y][x][0] !== enemy && gameState.boardState[Y][X][0] === enemy){
                moves.push(...movePossible(X, Y, type, 1, enemy, false, traceRouts, enemys));
            }
            
            
        }
    }
//*------------------------------------------------------------------------------
    if(branch === 0 || branch === -2){
        X = x + 1; Y = y - 1;
        if((0 <= X && X <= 7) && (0 <= Y && Y <= 7)){
            console.log(x,y,' - ', X,Y, ' | ', gameState.boardState[y][x], gameState.boardState[Y][X], type === ''? 'not king': type, branch);
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] !== ' ')  {
                //traceRoutsMoves.push( ...traceRouts);
                return moves;
            }
            
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] === ' '){
                moves.push([-x, -y]);
                moves.push([X, Y]);
                
                position = [X,Y]; enemys.push([x, y]);
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, -2, enemy, false, traceRouts, enemys));
                }else{
                    moves.push(...movePossible(X, Y, type, -2, enemy, true, traceRouts, enemys));
                }
                moves.push(...movePossible(X, Y, type, 1, enemy, true, traceRouts, enemys));
                moves.push(...movePossible(X, Y, type, -1, enemy, true, traceRouts, enemys));
            }
            
            if(gameState.boardState[Y][X] === ' ' && gameState.boardState[y][x][0] !== enemy && node === false){
                moves.push([X, Y]);
                
                position = [X,Y];
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, -2, enemy, false, traceRouts, enemys));
                }
            }
            
            if(gameState.boardState[y][x][0] !== enemy && gameState.boardState[Y][X][0] === enemy){
                moves.push(...movePossible(X, Y, type, -2, enemy, false, traceRouts, enemys));
            }
            
        
        }
    }
//*------------------------------------------------------------------------------
    if(branch === 0 || branch === 2){
        X = x - 1; Y = y + 1;
        if((0 <= X && X <= 7) && (0 <= Y && Y <= 7)){
            console.log(x,y,' - ', X,Y, ' | ', gameState.boardState[y][x], gameState.boardState[Y][X], type === ''? 'not king': type, branch);
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] !== ' ')  {
                //traceRoutsMoves.push( ...traceRouts);
                return moves;
            }
            
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] === ' '){
                moves.push([-x, -y]);
                moves.push([X, Y]);

                position = [X,Y]; enemys.push([x, y]);
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, 2, enemy, false, traceRouts, enemys));
                }
                else{
                    moves.push(...movePossible(X, Y, type, 2, enemy, true, traceRouts, enemys));
                }
                moves.push(...movePossible(X, Y, type, 1, enemy, true, traceRouts, enemys));
                moves.push(...movePossible(X, Y, type, -1, enemy, true, traceRouts, enemys));
            }
            
            if(gameState.boardState[Y][X] === ' ' && gameState.boardState[y][x][0] !== enemy && node === false){
                moves.push([X, Y]);
                
                position = [X,Y];
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, 2, enemy, false, traceRouts, enemys));
                }
            }
            if(gameState.boardState[y][x][0] !== enemy && gameState.boardState[Y][X][0] === enemy){
                moves.push(...movePossible(X, Y, type, 2, enemy, false, traceRouts, enemys));
            }
            
        }
    }
//*------------------------------------------------------------------------------
    if(branch === 0 || branch === -1){
        X = x - 1; Y = y - 1;
        if((0 <= X && X <= 7) && (0 <= Y && Y <= 7)){
            console.log(x,y,' - ', X,Y, ' | ', gameState.boardState[y][x], gameState.boardState[Y][X], type === ''? 'not king': type, branch);
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] !== ' ') {
                //traceRoutsMoves.push( ...traceRouts);
                return moves;
            }
            if(gameState.boardState[y][x][0] === enemy && gameState.boardState[Y][X][0] === ' '){
                moves.push([-x, -y]);
                moves.push([X, Y]);

                position = [X,Y]; enemys.push([x, y]);
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, -1, enemy, false, traceRouts, enemys));
                }
                else{
                    moves.push(...movePossible(X, Y, type, -1, enemy, true, traceRouts, enemys));
                }
                moves.push(...movePossible(X, Y, type, -2, enemy, true, traceRouts, enemys));
                moves.push(...movePossible(X, Y, type, 2, enemy, true, traceRouts, enemys));
            }
            
            if(gameState.boardState[Y][X] === ' ' && gameState.boardState[y][x][0] !== enemy && node === false){
                moves.push([X, Y]);

                position = [X,Y];
                traceRouts.push( [position, ...enemys] );

                if(type === 'king'){
                    moves.push(...movePossible(X, Y, type, -1, enemy, false, traceRouts, enemys));
                }
            }
            if(gameState.boardState[y][x][0] !== enemy && gameState.boardState[Y][X][0] === enemy){
                moves.push(...movePossible(X, Y, type, -1, enemy, false, traceRouts, enemys));
            }
            
            
        }
    }
//*------------------------------------------------------------------------------ 
    // if(branch !== 0){
        
    //     console.log(traceRouts);
    // }    
    traceRoutsMoves = traceRouts;
    return moves;
}




/**
 * 
 * @param {*int} старая координата по оси X oldX 
 * @param {*int} старая координата по оси Y oldY 
 * @param {*int} новая координата по оси X newX 
 * @param {*int} новая координата по оси Y newY 
 * @returns ничего
 */
function moveChecker(oldX, oldY, newX, newY){
    
    if(oldX < 0 && 7 < oldX){
        return false;
    }
    if(oldY < 0 && 7 < oldY){
        return false;
    }
    if(newX < 0 && 7 < newX){
        return false;
    }
    if(newY < 0 && 7 < newY){
        return false;
    }

    gameState.boardState[newY][newX] = gameState.boardState[oldY][oldX];
    gameState.boardState[oldY][oldX] = ' ';
    if(newY === 0 && gameState.boardState[newY][newX].length < 2) gameState.boardState[newY][newX] += 'K';
    //console.log(oldX, oldY, newX, newY);
}

function removeEnemys(enemys) {
    enemys.forEach(el => {
        gameState.boardState[el[1]][el[0]] = ' ';
    });
}

const checkerTypes = {
    'O':  ['checker', 'blue'],
    'X':  ['checker', 'red'],
    'OK': ['checker', 'blue', 'king',],
    'XK': ['checker', 'red',  'king',],
};
function drawCheckersBoard() {
    const container = document.querySelector('.chess-board');
    container.textContent = '';
    let cellClass = 'white';
    // let checkerClass = [];
    for (let y = 0; y < gameState.boardState.length; y++) {
        for (let x = 0; x < gameState.boardState[0].length; x++) {
            if(y % 2 === 0){
                if(x % 2 === 0) cellClass = 'white';
                else cellClass = 'black';
            }
            else{
                if(x % 2 === 0) cellClass = 'black';
                else cellClass = 'white';
            }

            const div =  document.createElement('div');
            div.id = `x${x}y${y}`;
            div.classList.add('cell');
            div.classList.add(cellClass);

            if(gameState.boardState[y][x] !== ' '){
                // checkerClass = ;
                const innerDiv =  document.createElement('div');
                innerDiv.classList.add(...checkerTypes[gameState.boardState[y][x]]);
                innerDiv.setAttribute('x', x) ;
                innerDiv.setAttribute('y', y) ;
                div.appendChild(innerDiv);
            }

            container.appendChild(div);
        }  
    }
}



let moves = [];
let enemys = [];
let checkerX;
let checkerY;
// let checkerType;
let checkerState = 'idle';
let checkerNeedToMove;

function uniq(a) {
    return Array.from(new Set(a));
}
/**
 *  основной движок 
 */
function core(){
    
    if(gameState.checkerTurn !== gameState.myCheckerColor){return;}
    document.querySelectorAll(`.checker.${gameState.myCheckerColor}`).forEach(function(item) {
//*=========================================================================================================
//? MOUSE OVER
//*=========================================================================================================
            item.addEventListener('mouseover', function() {
                
                if(checkerState === 'idle'){
                    
                    //получаем координаты
                    checkerX = Number.parseInt( this.getAttribute('x') );
                    checkerY = Number.parseInt( this.getAttribute('y') );

                    console.log(`%c MOUSEOVER %c %c ${checkerX};${checkerY} `, 'color: white; background: red;', '', 'color: white; background: purple;');
                    traceRoutsMoves = [];
                    moves.push(...movePossible(checkerX, checkerY, this.classList.contains('king')? 'king': '' ));
                    console.log(traceRoutsMoves);
                    moves = moves.filter(function(el){
                        if(el[0] < 0){
                            enemys.push([-1 * el[0], -1 * el[1]]);
                        }
                        else{
                            return true;
                        }
                    });
                    
                    
                    if(moves.length > 0){
                        moves.forEach(function(i){
                            
                            const checkerPossibleMove = document.createElement('div');
                            checkerPossibleMove.classList.add('checker-move');
                            // checkerPossibleMove.innerHTML
                            
                            document.querySelector(`#x${i[0]}y${i[1]}`).appendChild(checkerPossibleMove);
                            
                            
                        });
                    }
                    if(enemys.length > 0){
                        enemys.forEach(function(i){
                             document.querySelector(`#x${i[0]}y${i[1]}`).children[0].classList.toggle('checker-enemy');
                        });
                    }
                    if(moves.length > 0) this.classList.toggle('checkers-hover');
                    checkerState = 'move';

                    // console.log(`%c MOUSEOVER %c %c ${checkerX};${checkerY} `, 'color: white; background: red;', '', 'color: white; background: purple;');
                    console.log('%c moves: ', 'color: black; background: yellow;');
                    console.log(moves.length, moves);

                    console.log('%c enemys: ', 'color: black; background: yellow;');
                    console.log(enemys.length, enemys);
                    

                }
            });
//*=========================================================================================================
//? MOUSE OUT 
//*=========================================================================================================
            item.addEventListener('mouseout', function() {
                if(checkerState === 'move'){
                    if(moves.length > 0){
                        moves.forEach(function(i){
                            document.querySelector(`#x${i[0]}y${i[1]}`).textContent = ''; 
                        });
                    }
                    if(enemys.length > 0){
                        enemys.forEach(function(i){
                             document.querySelector(`#x${i[0]}y${i[1]}`).children[0].classList.toggle('checker-enemy');
                        });
                    }
                    moves = [];
                    enemys = [];
                    checkerState = 'idle';
                }
                if(this.classList.contains('checkers-hover')){
                    this.classList.toggle('checkers-hover');}
            });
        
//*=========================================================================================================
//? CLICK  
//*=========================================================================================================
            item.addEventListener('click', function() {
                if(checkerState === 'makemove'){
                    
                    moves = [];
                    enemys = [];
                    drawCheckersBoard();
                    core();
                    checkerState = 'idle';
                }
                if(checkerState === 'move'){
                    checkerNeedToMove = this;
                    if(this.classList.contains('checkers-hover')){
                        this.classList.toggle('checkers-hover');
                        this.classList.toggle('checkers-click');
                    }
                    if(moves.length > 0){            
                        moves.forEach(function(i){
                            document.querySelector(`#x${i[0]}y${i[1]}`).addEventListener('click', function(){                                 
                                if (checkerState === 'makemove'){ 
                                    moves = [];
                                    enemys = [];
                                    let x = Number.parseInt(this.id[1]);
                                    let y = Number.parseInt(this.id[3]);

                                    moveChecker(checkerX, checkerY, x, y)
                                    console.log(x,y, traceRoutsMoves);
                                    try {
                                        traceRoutsMoves.forEach(position => {
                                            if(position[0][0] === x && position[0][1] === y){
                                                position.shift();
                                                console.log('position' ,position);
                                                removeEnemys(position);
                                                throw new Error();
                                            }
                                        });
                                    } catch (error) {
                                        
                                    }
                                    sendCheckerStep();
                                    drawCheckersBoard();
                                    checkerState = 'idle';
                                }
                            }); 
                        });
                    }
                    checkerState = 'makemove';
                }               
            });
//*=========================================================================================================
        });
}

drawCheckersBoard();
core();