let winner = sessionStorage.getItem("winner");
let winnerBox = $("#winner");

if (winner === "White") {
    winnerBox.css("color", "white");    
}
else {
    winnerBox.css("color", "black");    
}

winnerBox.append(winner);