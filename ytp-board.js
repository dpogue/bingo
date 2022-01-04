const stations = {
    WF: "Waterfront",
    BU: "Burrard",
    GV: "Granville",
    ST: "Stadium",
    MN: "Main Street",
    BW: "Broadway",
    NA: "Nanaimo",
    TN: "29th Avenue",
    JY: "Joyce",
    PT: "Patterson",
    MT: "Metrotown",
    RO: "Royal Oak",
    ED: "Edmonds",
    TS: "22nd Street",
    NW: "New Westminster",
    CO: "Columbia",
    SR: "Scott Road",
    GW: "Gateway",
    SC: "Surrey Central",
    KG: "King George",
    VC: "VCC-Clark",
    CM: "Commercial",
    RE: "Renfrew",
    RU: "Rupert",
    GM: "Gilmore",
    BR: "Brentwood",
    HO: "Holdom",
    SP: "Sperling",
    LC: "Lake City",
    PW: "Production Way",
    LH: "Lougheed",
    BD: "Braid",
    SA: "Sapperton",
    BQ: "Burquitlam",
    MC: "Moody Centre",
    IC: "Inlet Centre",
    CC: "Coquitlam",
    LN: "Lincoln",
    LA: "Lafarge"
};

if (typeof globalThis.structuredClone === "undefined") {
    // Super not accurate to spec, but sufficient for our game board state
    function structuredClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

function randomize(arr) {
    let len = arr.length;
    let rand = new Uint8Array(len);
    crypto.getRandomValues(rand);

    while (len > 1) {
        let k = rand[len - 1] % len;
        let t = arr[--len];
        arr[len] = arr[k];
        arr[k] = t;
    }
    return arr;
}

export class YTPBoardElement extends HTMLElement {
    #board = [];
    #table = null;

    connectedCallback() {
        this.#table = document.createElement("table");
        this.appendChild(this.#table);

        this.addEventListener("input", this.#onInput);
    }

    get state() {
        return structuredClone(this.#board);
    }

    set state(newstate) {
        this.#board = structuredClone(newstate);
        this.#renderBoard();
    }

    resetBoard() {
        this.#board = randomize(Object.keys(stations))
                        .slice(0, 24)
                        .map((_) => [false,_]);
        this.#board.splice(12, 0, [true,]);

        this.#renderBoard();
    }

    #renderBoard() {
        while (this.#table.rows.length > 0) {
            this.#table.deleteRow(-1);
        }

        for (let i = 0; i < 5; i++) {
            const row = this.#table.insertRow();
            const cells = this.#board.slice(i*5, i*5+5);

            cells.forEach(([state, stationID]) => {
                const cell = row.insertCell();

                if (stationID) {
                    cell.innerHTML = `
                        <input type="checkbox" id="${stationID}"${state ? " checked" : ""}>
                        <label for="${stationID}">${stations[stationID]}</label>`;
                } else {
                    cell.classList.add("empty");
                    cell.innerHTML = `<input type="checkbox" aria-label="Free Space" checked readonly>`;
                }
            });
        }
    }

    #onInput(e) {
        e.stopPropagation();

        const board = e.currentTarget;
        board.#updateStationState(e.srcElement.id, e.srcElement.checked);

        const evt = new CustomEvent("statechange", {
            bubbles: true,
            cancelable: false,
            detail: { state: board.state }
        });
        board.dispatchEvent(evt);
    }

    #updateStationState(id, checked) {
        const match = this.#board.filter(([_,stid]) => stid === id)[0];
        if (!match) {
            return;
        }

        match[0] = checked;
    }
};

window.customElements.define("ytp-board", YTPBoardElement);
