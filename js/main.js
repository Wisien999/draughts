for (let i = 0; i < 8; i++) { // Colorize board
    if (i % 2 == 0) {
        for (let j = 0; j < 8; j += 2) {
            $(`#s${i}-${j}`).css("background-color", "white");
        }
    }
    else {
        for (let j = 1; j < 8; j += 2) {
            $(`#s${i}-${j}`).css("background-color", "white");
        }
    }
}