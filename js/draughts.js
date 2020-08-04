let firstClickInATurn = true;
let rowModificator = -1;
let selected = [-1, -1];
let notEmpty = false;
let black_pawns = 12;
let white_pawns = 12;

/* Right */
// const board = [[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, -1, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];
/* Testing */
const board = [[0, 0, 0, 0, 0, -1, 0, -1], [-1, 0, 0, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, -1, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];

$('body').click((e) => {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (e.target.id === "s" + row + "-" + column) {
                console.log(`row: ${row}    column: ${column}`);
                // alert($('#s' + row + "-" + column).hasClass("squareA"));
                if (selected[0] >= 0 && $(`#s${row}-${column}`).hasClass("squareA") && (selected[0] !== row || selected[1] !== column)) { //Check if the toSquare has "squareA" class AND its not fromSquare
                    // alert(e.target +"- next -"+ e.target.id);
                    doAMove(selected[0], selected[1], row, column);
                }
                else {
                    // alert(e.target +"- next -"+ e.target.id);
                    selected[0] = row;
                    selected[1] = column;
                    $('.squareA').removeClass('squareA');
                    showPossibilities(row, column);
                }
                break;
            }
        }
    }


});

function showPossibilities(row, column, isContinued = false, modificators = [[-1, 1], [-1, 1]]) {
    const selectedSquare = $('#s' + row + "-" + column);

    if (rowModificator === -1 && board[row][column] > 0) {
        selectedSquare.addClass('squareA');
        notEmpty = true;

    }
    if (rowModificator === 1 && board[row][column] < 0) {
        selectedSquare.addClass('squareA');
        notEmpty = true;
    }

    if (isContinued || notEmpty) {
        try {
            console.log("Im here");
            if (board[row + rowModificator][column + 1] === 0 && !isContinued) {
                $('#s' + (row + rowModificator) + "-" + (column + 1)).addClass('squareA');
            }
            else {
                modificators[0].forEach(rowMod => {
                    if ((board[row + rowMod][column + 1] === rowModificator || board[row + rowMod][column + 1] === rowModificator * 2) && board[row + (rowMod * 2)][column + 2] === 0) {
                        $('#s' + (row + (rowMod * 2)) + "-" + (column + 2)).addClass('squareA');
                        // remove not-beating possibility because the player must beat the pawn
                        $('#s' + (row + rowMod) + "-" + (column - 1)).removeClass('squareA');
                        modC = [rowMod];
                        showPossibilities(row + (rowMod * 2), column + 2, true, [[-1,1], modC]);
                    } 
                });
            }
        } catch (error) {
            console.log("err");
            console.log(error);
        }

        try {
            if (board[row + rowModificator][column - 1] === 0 && !isContinued) {
                $('#s' + (row + rowModificator) + "-" + (column - 1)).addClass('squareA');
            }
            else {
                modificators[1].forEach(rowMod => {
                    if ((board[row + rowMod][column - 1] === rowModificator || board[row + rowMod][column - 1] === rowModificator * 2) && board[row + (rowMod * 2)][column - 2] === 0) {
                        $('#s' + (row + (rowMod * 2)) + "-" + (column - 2)).addClass('squareA');
                        // remove not-beating possibility because the player must beat the pawn
                        $('#s' + (row + rowMod) + "-" + (column + 1)).removeClass('squareA');
                        modC = [rowMod];
                        // modC = modificators[1].filter(el => el != -rowMod);
                        showPossibilities(row + (rowMod * 2), column - 2, true, [modC, [-1,1]]);
                    } 
                });
            }
            // else if ((board[row + rowModificator][column - 1] === rowModificator || board[row + rowModificator][column - 1] === rowModificator * 2) && board[row + (rowModificator * 2)][column - 2] === 0) {
            //     $('#s' + (row + (rowModificator * 2)) + "-" + (column - 2)).addClass('squareA');
            //     // remove not-beating possibility because the player must beat the pawn
            //     $('#s' + (row + rowModificator) + "-" + (column + 1)).removeClass('squareA');
            //     showPossibilities(row + (rowModificator * 2), column - 2, true);
            // }
            // console.log("Im here too!");
        } catch (error) {
            console.log("err!");
            console.log(error);
        }

        notEmpty = false;

        if (Math.abs(board[row][column]) === 2) {
            // custom behavior for 
        }

    }
}

function doAMove(fromRow, fromColumn, toRow, toColumn, toKill = 1) {
    const fromSquare = $('#s' + fromRow + "-" + fromColumn);
    const toSquare = $('#s' + toRow + '-' + toColumn);

    if (Math.abs(board[fromRow][fromColumn]) === 1) {

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

        // detrmine if round should be ended or not
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
    const board = $("#board");

    rowModificator = -rowModificator;
    selected[0] = -1;

    // board.css("transform", " rotate3d(20, 5, -3, 55deg)");
}

function update() {
    $(".square").removeClass("white_pawn black_pawn black_king whie_king");
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (board[row][column] === -1) $(`#s${row}-${column}`).addClass("black_pawn");
            else if (board[row][column] === -2) $(`#s${row}-${column}`).addClass("black_king");
            else if (board[row][column] === 1) $(`#s${row}-${column}`).addClass("white_pawn");
            else if (board[row][column] === 2) $(`#s${row}-${column}`).addClass("white_king");
        }
    }
}