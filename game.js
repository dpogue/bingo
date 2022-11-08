const btnNew = document.getElementById("btn-new");
const btnHelp = document.getElementById("btn-help");
const board = document.getElementById("board");
const dlgHelp = document.getElementById("dlg-help");

btnNew.addEventListener("click", () => {
    board.resetBoard();
});

btnHelp.addEventListener("click", () => {
    dlgHelp.showModal();
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
