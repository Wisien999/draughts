var first = true;
var selected = 0;
let rowModificator = -1;
/* Old */ //var board = [0, -1, 0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0];
/* Right */ // const board = [[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, -1, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];
/* Testing */ const board = [[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, 0, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, -1, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]];

$('body').click((e) => {
    for (var row = 0; row < 8; row++) {
        for (var column = 0; column < 8; column++) {
            if (e.target.id == "s" + row + "-" + column && first) {
                //alert(e.target +"- next -"+ e.target.id);
                $('.squareA').removeClass('squareA');
                showPossibilities(row, column);
            }
        }
    }

    for (var i = 0; i < 64; i++) {
        if (e.target.id == "s" + i && first == false) {
            doAMove(selected, i);
        }
    }
});

function showPossibilities(row, column, isContinued = false) {


    var selectedSquare = $('#s' + row + "-" + column);

    if (rowModificator == -1 && board[row][column] > 0 || isContinued) {
        selectedSquare.addClass('squareA');
        isContinued = true;

    }
    if (rowModificator == 1 && board[row][column] < 0 || isContinued) {
        selectedSquare.addClass('squareA');
        isContinued = true;
    }

    if (isContinued) {
        try {
            console.log("Im here");
            if (board[row + rowModificator][column + 1] == 0) {
                $('#s' + (row + rowModificator) + "-" + (column + 1)).addClass('squareA');
            }
            else if ((board[row + rowModificator][column + 1] == rowModificator || board[row + rowModificator][column + 1] == rowModificator * 2) && board[row + (rowModificator * 2)][column + 2] == 0) {
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
            if (board[row + rowModificator][column - 1] == 0) {
                $('#s' + (row + rowModificator) + "-" + (column - 1)).addClass('squareA');
            }
            else if ((board[row + rowModificator][column - 1] == rowModificator || board[row + rowModificator][column - 1] == rowModificator * 2) && board[row + (rowModificator * 2)][column - 2] == 0) {
                $('#s' + (row + (rowModificator * 2)) + "-" + (column - 2)).addClass('squareA');
                showPossibilities(row + (rowModificator * 2), column - 2, true);
            }
            console.log("Im here too!");
        } catch (error) {
            console.log("err!");
            console.log(error);
        }


        if (board[row][column] == -2 || board[row][column] == 2) {

        }

    }
}
