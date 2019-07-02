let firstClickInATurn = true;
let rowModificator = -1;
const selected = [-1, -1];
let notEmpty = false;
let black_pawns = 12;
let white_pawns = 12;

/* Old */
// var board = [0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0];
/* Right */
// const board = [[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, -1, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];
/* Testing */
const board = [[0, 0, 0, 0, 0, -1, 0, -1], [-1, 0, 0, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, -1, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];

$('body').click((e) => {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (e.target.id === "s" + row + "-" + column) {
                // alert($('#s' + row + "-" + column).hasClass("squareA"));
                if (selected[0] >= 0 && $(`#s${row}-${column}`).hasClass("squareA") && (selected[0] !== row || selected[1] !== column)) { //Check if the toSquare has "squareA" class AND its not fromSquare
                    // alert(e.target +"- next -"+ e.target.id);
                    doAMove(selected[0], selected[1], row, column);
                    $('.squareA').removeClass('squareA');
                    selected[0] = -1;
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

function showPossibilities(row, column, isContinued = false) {
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
            else if ((board[row + rowModificator][column + 1] === rowModificator || board[row + rowModificator][column + 1] === rowModificator * 2) && board[row + (rowModificator * 2)][column + 2] === 0) {
                console.log('#s' + (row + (rowModificator * 2)) + "-" + (column + 2));
                $('#s' + (row + (rowModificator * 2)) + "-" + (column + 2)).addClass('squareA');
                showPossibilities(row + (rowModificator * 2), column + 2, true);
            }
            console.log("Im here too");
        } catch (error) {
            console.log("err");
            console.log(error);
        }

        try {
            console.log("Im here!")
            if (board[row + rowModificator][column - 1] === 0 && !isContinued) {
                $('#s' + (row + rowModificator) + "-" + (column - 1)).addClass('squareA');
            }
            else if ((board[row + rowModificator][column - 1] === rowModificator || board[row + rowModificator][column - 1] === rowModificator * 2) && board[row + (rowModificator * 2)][column - 2] === 0) {
                $('#s' + (row + (rowModificator * 2)) + "-" + (column - 2)).addClass('squareA');
                showPossibilities(row + (rowModificator * 2), column - 2, true);
            }
            console.log("Im here too!");
        } catch (error) {
            console.log("err!");
            console.log(error);
        }

        notEmpty = false;

        if (board[row][column] === -2 || board[row][column] === 2) {

        }

    }
}

function doAMove(fromRow, fromColumn, toRow, toColumn) {
    const fromSquare = $('#s' + fromRow + "-" + fromColumn);
    const toSquare = $('#s' + toRow + '-' + toColumn);

    if (Math.abs(board[fromRow][fromColumn]) === 1) {
        if (Math.abs(fromColumn - toColumn) === 1 && Math.abs(fromRow - toRow) === 1) {
            board[toRow][toColumn] = board[fromRow][fromColumn];
            board[fromRow][fromColumn] = 0;

            if (fromSquare.hasClass("black_pawn")) { // Alternatywny sposób: Tomboy
                toSquare.addClass("black_pawn");
                fromSquare.removeClass("black_pawn");
            }
            else if (fromSquare.hasClass("white_pawn")) {
                toSquare.addClass("white_pawn");
                fromSquare.removeClass("white_pawn");
            }

        }


        
        // W przypadku wielokrotnego zbijania zachowywać się tak jak podczas jednokrotnego, ale na koniec ni przechodzić do kolejnej tury.
    }

}

function changeTurn() {
    if (white_pawns === 0 || black_pawns === 0) {
        alert("END OF GAME");
    }
    const board = $("#board");

    board.css("transform", " rotate3d(20, 5, -3, 55deg)");
}