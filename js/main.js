/*$('body').click((e) => {
    if(e.target.id == "chess" || e.target.id == "draugths") {
        //alert(e.target +"- next -"+ e.target.id);
        prepareBoard(e.target.id);
    }

});

var board = ['<div id="board">'];

function prepareBoard(type) {
    if(type == "chess") {
        
    }
    else {
        for(var i = 0; i < 64; i++) {
           if(i < 16) board.push('<div class="square" id="s', i, '><div class="black_pawn" id="p', i, '></div></div>');
           else if(i > 48) board.push('<div class="square" id="s', i, '><div class="white_pawn" id="p', i, '></div></div>');
           else board.push('<div class="square" id="s', i, '></div>');
        }
        board.push('</div>');
        $('body').html(board.join(''));
    }
}*/