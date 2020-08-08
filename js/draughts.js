const boardSize = 8;

let generalRowModificator = -1;
let beatingPossible = false;
const allModPairs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
let selected = [-1, -1];
let notEmpty = false;
let blockChoose = false;
let black_pawns = 12;
let white_pawns = 12;

/* Right */
// const board = [[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, -1, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];
/* Testing */
let board = [[0, 0, 0, 0, 0, -1, 0, -1], [-1, 0, 0, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, -1, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];

$('body').click((e) => {
    // Get row and column from square ID
    let row = parseInt(e.target.id[1]);
    let column = parseInt(e.target.id[3]);

    console.log(`row: ${row}    column: ${column}`);

    if (selected[0] >= 0 && $(`#s${row}-${column}`).hasClass("squareA") && (selected[0] !== row || selected[1] !== column)) { //Check if the toSquare has "squareA" class AND its not fromSquare
        // prevent skipping beating
        if (Math.abs(selected[0] - row) === 1 || Math.abs(selected[0] - row) === 2 && board[(selected[0] + row) / 2][(selected[1] + column) / 2] === generalRowModificator) {
            doAMove(selected[0], selected[1], row, column);
        }
    }
    else if (!blockChoose) {
        selected[0] = row;
        selected[1] = column;
        $('.squareA').removeClass('squareA');
        showPossibilities(row, column);
    }

});

function showPossibilities(row, column, isContinued = false, modificators = [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const selectedSquare = $('#s' + row + "-" + column);

    // Math.sign(n) returns -1 for negative n and 1 for positive n
    // It can be used to determine whose pawn is on the square
    if (Math.sign(board[row][column]) === -generalRowModificator) {
        selectedSquare.addClass('squareA');
        notEmpty = true;
    }

    if (isContinued || notEmpty) {
        try {
            if (board[row + generalRowModificator][column + 1] === 0 && !isContinued && !beatingPossible) {
                $(`#s${row + generalRowModificator}-${column + 1}`).addClass('squareA');
            }
        } catch (error) {
            console.log("err");
            console.log(error);
        }

        try {
            if (board[row + generalRowModificator][column - 1] === 0 && !isContinued && !beatingPossible) {
                $(`#s${row + generalRowModificator}-${column - 1}`).addClass('squareA');
            }
        } catch (error) {
            console.log("err!");
            console.log(error);
        }

        // check if it is possible to beat enemy's pawn in some way 
        for (let index = 0; index < modificators.length; index++) {
            const modificatorsPair = modificators[index];
            const rowMod = modificatorsPair[0];
            const columnMod = modificatorsPair[1];

            // check if it is possible to beat enemy's pawn in currently considered way
            if (isBeatingThisWayPossible(row, column, rowMod, columnMod)) {
                // activate target square
                $('#s' + (row + rowMod * 2) + "-" + (column + columnMod * 2)).addClass('squareA');
                // remove not-beating possibility because the player must beat the pawn
                $(`#s${row + generalRowModificator}-${column + 1}`).removeClass('squareA');
                $(`#s${row + generalRowModificator}-${column - 1}`).removeClass('squareA');
                // continue search for possible kills ignoring the returning move
                showPossibilities(row + rowMod * 2, column + columnMod * 2, true, allModPairs.filter(elem => elem[0] != -rowMod || elem[1] != -columnMod));
            }

        }


        notEmpty = false;

        if (Math.abs(board[row][column]) === 2) {
            // custom behavior for the queen
        }

    }
}

function doAMove(fromRow, fromColumn, toRow, toColumn, toKill = 1) {
    const fromSquare = $('#s' + fromRow + "-" + fromColumn);
    const toSquare = $('#s' + toRow + '-' + toColumn);

    // behavior for regular pawn
    if (Math.abs(board[fromRow][fromColumn]) === 1) {
        // move pawn in logical board
        board[toRow][toColumn] = board[fromRow][fromColumn];
        board[fromRow][fromColumn] = 0;

        if (Math.abs(fromColumn - toColumn) === 2 && Math.abs(fromRow - toRow) === 2) {
            board[(toRow + fromRow) / 2][(toColumn + fromColumn) / 2] = 0;

            if (fromSquare.hasClass("black_pawn")) {
                white_pawns--;
            }
            else if (fromSquare.hasClass("white_pawn")) {
                black_pawns--;
            }
        }

        // update board
        update()

        // remove active square class to avoid problem in next loop
        fromSquare.removeClass("squareA");

        // determine if round should be ended or not
        let doNotEndTurn = false;
        // check all [row modificator, column modificator] combinations in search for active squares
        [[-2, 2], [2, 2], [-2, -2], [2, -2]].forEach(element => {
            if ($(`#s${toRow + element[0]}-${toColumn + element[1]}`).hasClass('squareA')) {
                doNotEndTurn = true;
            }
        });
        if (doNotEndTurn) {
            // console.log("abudabda");
            selected = [toRow, toColumn];
            blockChoose = true;
        }
        else {
            changeTurn();
        }
    }

}

function changeTurn() {
    $('.squareA').removeClass('squareA');

    if (white_pawns === 0 || black_pawns === 0) {
        alert("END OF GAME");
    }
    // const board = $("#board");

    generalRowModificator = -generalRowModificator;
    selected[0] = -1;
    blockChoose = false;
    beatingPossible = false;

    for (let row = 0; row < boardSize; row++) {
        for (let column = 0; column < boardSize; column++) {
            if (board[row][column] === -generalRowModificator) {
                beatingPossible = isAnyBeatingPossible(row, column);
            }
            if (beatingPossible) {
                return 0;
            }
        }
    }

    // board.css("transform", " rotate3d(20, 5, -3, 55deg)");
}

function update() {
    $(".square").removeClass("white_pawn black_pawn black_king whie_king");
    for (let row = 0; row < boardSize; row++) {
        for (let column = 0; column < boardSize; column++) {
            if (board[row][column] === -1) $(`#s${row}-${column}`).addClass("black_pawn");
            else if (board[row][column] === -2) $(`#s${row}-${column}`).addClass("black_king");
            else if (board[row][column] === 1) $(`#s${row}-${column}`).addClass("white_pawn");
            else if (board[row][column] === 2) $(`#s${row}-${column}`).addClass("white_king");
        }
    }
}

function isAnyBeatingPossible(row, column) {

    for (let index = 0; index < allModPairs.length; index++) {
        const modificatorsPair = allModPairs[index];
        const rowMod = modificatorsPair[0];
        const columnMod = modificatorsPair[1];

        console.log(`row: ${row}    column: ${column}`);
        console.log(`rowMod: ${rowMod}    columnMod: ${columnMod}`);
        if (isBeatingThisWayPossible(row, column, rowMod, columnMod)) {
            return true;

        }
    }


    return false;
}


function isBeatingThisWayPossible(row, column, rowMod, columnMod) {
    // put it in the trycatch structure to prevent outOfBoundException
    try {
        // Math.sign(n) returns -1 for negative n and 1 for positive n
        // It can be used to determine whose pawn is on the square
        if (Math.sign(board[row + rowMod][column + columnMod]) === generalRowModificator && board[row + (rowMod * 2)][column + columnMod * 2] === 0) {
            return true;
        }
    } catch (error) {
        console.log(error)
    }
    return false;
}