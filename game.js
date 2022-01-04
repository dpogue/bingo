const btnNew = document.getElementById("btn-new");
const board = document.getElementById("board");

btnNew.addEventListener("click", () => {
    board.resetBoard();
});

board.addEventListener("statechange", (e) => {
    localStorage.setItem("saveState", JSON.stringify({
        time: new Date(),
        board: e.detail.state
    }));
});

window.addEventListener("load", () => {
    const prev = localStorage.getItem("saveState");

    if (!prev) {
        board.resetBoard();
        return;
    }

    const prevState = JSON.parse(prev);
    const prevDate = new Date(prevState.time);
    console.log(`Restoring state from ${prevDate}`);

    board.state = prevState.board;
});
