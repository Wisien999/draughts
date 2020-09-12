const boardSize = 8;
const allModPairs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

let generalRowModificator = -1;
let beatingPossible = false;
let selected = [-1, -1];
let notEmpty = false;
let blockChoose = false;
let black_pawns = 12;
let white_pawns = 12;

/* Right */
const board = [[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, -1, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];
/* Testing */
// const board = [[0, 0, 0, 0, 0, -1, 0, -1], [-1, 0, 0, 0, -1, 0, 0, 0], [0, -1, 0, -1, 0, -1, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0], [0, -1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, -1, 0, 0, 0], [0, 1, 0, 2, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];

$('body').click((e) => {
    // Get row and column from square ID
    
    let row = parseInt(e.target.id[1]);
    let column = parseInt(e.target.id[3]);

    if (isNaN(row) || isNaN(column)) {
        return 0;
    }

    console.log(`row: ${row}    column: ${column}`);

    if (selected[0] >= 0 && $(`#s${row}-${column}`).hasClass("squareA") && (selected[0] !== row || selected[1] !== column)) { //Check if the toSquare has "squareA" class AND its not fromSquare
        doAMove(selected[0], selected[1], row, column);
    }
    else if (!blockChoose) {
        selected[0] = row;
        selected[1] = column;
        showPossibilities(row, column);
    }

});

function showPossibilities(row, column, isContinued = false, modificators = allModPairs) {
    const selectedSquare = $('#s' + row + "-" + column);

    $('.squareA').removeClass('squareA');

    // Math.sign(n) returns -1 for negative n and 1 for positive n
    // It can be used to determine whose pawn is on the square

    if (Math.sign(board[row][column]) === -generalRowModificator) {
        selectedSquare.addClass('squareA');
        notEmpty = true;
    }

    if (Math.abs(board[row][column]) === 1) {
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
                }

            }
        }
        notEmpty = false;
    }
    // custom behavior for the queen
    else if (Math.abs(board[row][column]) === 2 && notEmpty) {
        if (!beatingPossible) {
            for (let index = 0; index < allModPairs.length; index++) {
                const modPair = allModPairs[index];
                const rowMod = modPair[0];
                const columnMod = modPair[1];

                try {
                    // check every square in the current line
                    for (let currRow = row + rowMod, currColumn = column + columnMod; 0 <= currRow && currRow < boardSize && 0 <= currColumn && currColumn < boardSize; currRow += rowMod, currColumn += columnMod) {

                        console.log(`Damka      row: ${currRow}    column: ${currColumn}`);

                        // stop checking if anything met and enemy met before
                        if (board[currRow][currColumn] !== 0) {
                            break;
                        }
                        // check square as able to do move on if it is empty
                        else if (board[currRow][currColumn] === 0) {
                            $(`#s${currRow}-${currColumn}`).addClass('squareA');
                        }
                    }
                } catch (error) {
                    console.log("asdasdasdasd");
                    console.log(error);
                }
                console.log("q");
            }
        }
        else {
            // check squares in different lines
            for (let index = 0; index < allModPairs.length; index++) {
                const modPair = allModPairs[index];
                const rowMod = modPair[0];
                const columnMod = modPair[1];

                if (beatingPossible && isBeatingThisWayPossible(row, column, rowMod, columnMod)) {
                    let endSearchAtTheFirstPawn = false;
                    let enemyMet = false;
                    try {
                        // check every square in the current line
                        for (let currRow = row + rowMod, currColumn = column + columnMod; 0 <= currRow && currRow < boardSize && 0 <= currColumn && currColumn < boardSize; currRow += rowMod, currColumn += columnMod) {

                            console.log(`Damka      row: ${currRow}    column: ${currColumn}`);

                            // stop checking if ally met
                            if (Math.sign(board[currRow][currColumn]) === -generalRowModificator) {
                                break;
                            }
                            // stop checking if anything met and enemy met before
                            else if (board[currRow][currColumn] !== 0 && endSearchAtTheFirstPawn) {
                                break;
                            }
                            // enemy met
                            else if (Math.sign(board[currRow][currColumn]) === generalRowModificator) {
                                // stop checking if next square is not empty
                                if (board[currRow + rowMod][currColumn + columnMod] !== 0) {
                                    break;
                                }
                                // stop at the next pawn
                                endSearchAtTheFirstPawn = true;
                                enemyMet = true;
                            }
                            // check square as able to do move on if it is empty
                            else if (board[currRow][currColumn] === 0 && enemyMet) {
                                $(`#s${currRow}-${currColumn}`).addClass('squareA');
                            }
                        }
                    } catch (error) {
                        console.log("asdasdasdasd");
                        console.log(error);
                    }
                    console.log("q");
                }

            }
        }
    }

}


function doAMove(fromRow, fromColumn, toRow, toColumn) {
    const fromSquare = $('#s' + fromRow + "-" + fromColumn);

    const type = Math.abs(board[fromRow][fromColumn]);

    // move pawn or queen in the logical board
    board[toRow][toColumn] = board[fromRow][fromColumn];
    board[fromRow][fromColumn] = 0;

    // behavior for regular pawn
    if (type === 1) {

        // killing behavior
        if (Math.abs(fromColumn - toColumn) === 2 && Math.abs(fromRow - toRow) === 2) {
            // remove enemy's pawn from logical board
            board[(toRow + fromRow) / 2][(toColumn + fromColumn) / 2] = 0;

            // update amount of pawns of each player
            if (fromSquare.hasClass("black_pawn")) {
                white_pawns--;
            }
            else if (fromSquare.hasClass("white_pawn")) {
                black_pawns--;
            }

            // update board
            update()

            // remove active square class to avoid problem in next loop
            fromSquare.removeClass("squareA");

            // determine if round should be ended or not
            if (isBeatingInAnyWayPossible(toRow, toColumn)) {
                // console.log("abudabda");
                selected = [toRow, toColumn];
                blockChoose = true;
                // show possible kills
                showPossibilities(toRow, toColumn, true);
            }
            else {
                changeTurn();
            }
        }
        // if nothong killed then you can't continue move so change turn
        else {
            changeTurn();
        }

    }
    // behavior for a queen
    else if (type === 2) {
        const rowMod = Math.sign(toRow - fromRow);
        const columnMod = Math.sign(toColumn - fromColumn);

        let killed = false;
        // wipe path from fromSquare tot toSquare
        for (let currRow = fromRow, currColumn = fromColumn; currRow !== toRow && currColumn !== toColumn; currRow += rowMod, currColumn += columnMod) {
            // check if sth was killed
            if (Math.sign(board[currRow][currColumn]) === generalRowModificator) {
                // if yes then remember it
                killed = true;
                // and wipe it
                board[currRow][currColumn] = 0;
            }
        }
        if (killed) {
            if (board[toRow][toColumn] === -2) {
                white_pawns--;
            }
            else if (board[toRow][toColumn] === 2) {
                black_pawns--;
            }

            // update board
            update()

            // remove active square class to avoid problem in next loop
            fromSquare.removeClass("squareA");

            // determine if round should be ended or not
            if (isBeatingInAnyWayPossible(toRow, toColumn)) {
                // console.log("abudabda");
                selected = [toRow, toColumn];
                blockChoose = true;
                // show possible kills
                showPossibilities(toRow, toColumn, true);
            }
            else {
                changeTurn();
            }
        }
        // if nothong killed then you can't continue move so change turn
        else {
            changeTurn();
        }
    }

    // update board
    update()
}

async function changeTurn() {
    $('.squareA').removeClass('squareA');

    if (white_pawns === 0 || black_pawns === 0) {
        // set winner
        if (white_pawns === 0) {
            sessionStorage.setItem("winner", "Black");
        }
        else if (black_pawns === 0) {
            sessionStorage.setItem("winner", "White");
        }

        // wait for 2 seconds
        await new Promise(r => setTimeout(r, 2000));

        // go to the winner info
        document.location.href = "endOfGame.html";
    }

    generalRowModificator = -generalRowModificator;
    selected[0] = -1;
    blockChoose = false;
    beatingPossible = false;

    // transform pawns to queens if needed
    for (let column = 0; column < boardSize; column++) {
        // white pawns
        if (board[0][column] === 1) {
            board[0][column] = 2
        }
        // black pawns
        if (board[boardSize - 1][column] === -1) {
            board[boardSize - 1][column] = -2;
        }
    }

    // update board
    update();

    // detrmine if player should be forced to kill enemy's pawn
    for (let row = 0; row < boardSize; row++) {
        for (let column = 0; column < boardSize; column++) {
            if (Math.sign(board[row][column]) === -generalRowModificator) {
                beatingPossible = isBeatingInAnyWayPossible(row, column);
            }
            if (beatingPossible) {
                return 0;
            }
        }
    }

    // board.css("transform", " rotate3d(20, 5, -3, 55deg)");
}

function update() {
    $(".square").removeClass("white_pawn black_pawn black_queen white_queen");
    for (let row = 0; row < boardSize; row++) {
        for (let column = 0; column < boardSize; column++) {
            switch (board[row][column]) {
                case -1:
                    $(`#s${row}-${column}`).addClass("black_pawn");
                    break;
                case -2:
                    $(`#s${row}-${column}`).addClass("black_queen");
                    break;
                case 1:
                    $(`#s${row}-${column}`).addClass("white_pawn");
                    break;
                case 2:
                    $(`#s${row}-${column}`).addClass("white_queen");
                    break;
                case 0:
                    break;
            }
        }
    }
}

function isBeatingInAnyWayPossible(row, column) {

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
        console.log(Math.abs(board[row][column]));
        switch (Math.abs(board[row][column])) {
            case 1: // regular pawn
                // Math.sign(n) returns -1 for negative n and 1 for positive n
                // It can be used to determine whose pawn is on the square
                if (Math.sign(board[row + rowMod][column + columnMod]) === generalRowModificator && board[row + rowMod * 2][column + columnMod * 2] === 0) {
                    return true;
                }
                break;

            case 2: // queen
                for (let currRow = row + rowMod, currColumn = column + columnMod; 0 <= currRow && currRow < boardSize && 0 <= currColumn && currColumn < boardSize; currRow += rowMod, currColumn += columnMod) {

                    if (Math.sign(board[currRow][currColumn]) === -generalRowModificator) {
                        return false;
                    }
                    // enemy met
                    else if (Math.sign(board[currRow][currColumn]) === generalRowModificator) {
                        // next square is empty
                        if (board[currRow + rowMod][currColumn + columnMod] === 0) {
                            return true;
                        }
                        return false;
                    }
                }
                break;
        }
    } catch (error) {
        console.log(error)
    }
    return false;
}

// async function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
