<?php

/**
 * 
 * тут происходит выбор кто какими фишками играет
 * 
 */
    $bState = [
        [' ','O',' ','O',' ','O',' ','O'],
        ['O',' ','O',' ','O',' ','O',' '],
        [' ','O',' ','O',' ','O',' ','O'],
        [' ',' ',' ',' ',' ',' ',' ',' '],
        [' ',' ',' ',' ',' ',' ',' ',' '],
        ['X',' ','X',' ','X',' ','X',' '],
        [' ','X',' ','X',' ','X',' ','X'],
        ['X',' ','X',' ','X',' ','X',' ']
    ];

    if(rand(0, 10) > 5){
        $bState = [
            [' ','X',' ','X',' ','X',' ','X'],
            ['X',' ','X',' ','X',' ','X',' '],
            [' ','X',' ','X',' ','X',' ','X'],
            [' ',' ',' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ',' ',' '],
            ['O',' ','O',' ','O',' ','O',' '],
            [' ','O',' ','O',' ','O',' ','O'],
            ['O',' ','O',' ','O',' ','O',' ']
        ];
    }
    return $bState;
?>