class Puissance4 {
    height;
    width;
    players = [];
    board = [];
    whosPlaying = 0;
    turn = 1;
    isGameDone = false;

    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    addPlayer(name, color) {
        if (this.players.length >= 4) return false;
        if (this.players.find((player) => player.name === name || player.color === color)) return false;

        this.players.push(new Player(name, color));
        return true;
    }

    getCurrentPlayer() {
        return this.players[this.whosPlaying];
    }

    nextPlayer() {
        this.whosPlaying = this.whosPlaying >= this.players.length - 1 ? 0 : ++this.whosPlaying;
    }

    initBoard() {
        this.board = [];

        for (let i = 0; i < this.height; i++) {
            this.board.push([]);
            for (let j = 0; j < this.width; j++) {
                this.board[i].push(``);
            }
        }

        this.title = `C'est au tour de ${this.getCurrentPlayer().name} | Tour : ${this.turn}`;
    }

    replay() {
        this.turn = 1;
        this.initBoard();
        this.whosPlaying = 0;
        this.isGameDone = false;

        this.showBoard();
    }

    showBoard() {
        let gameDiv = document.getElementById("puissance4");
        gameDiv.innerHTML = "";

        let table = document.createElement("table");
        table.className = "p4_board";
        let tbody = document.createElement("tbody");

        for (const lineKey in this.board) {
            const line = this.board[lineKey];
            const tr = document.createElement("tr");

            for (const colKey in line) {
                const col = line[colKey];

                const td = document.createElement("td");
                td.setAttribute("id", `${lineKey};${colKey}`);
                td.addEventListener("click", () => {
                    if (!this.isGameDone) this.addCoin(colKey);
                });

                if (col !== "") {
                    td.className = "p4_coin";
                    td.style = `background-color: ${col.color};`
                } else {
                    td.className = "p4_coin";
                    td.innerHTML = col;
                }
                
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);

        const titleDiv = document.createElement('div');
        titleDiv.id = "titleDiv";

        const currentPlayerTitle = document.createElement("h2");
        currentPlayerTitle.innerHTML = this.title;

        titleDiv.appendChild(currentPlayerTitle);
        
        gameDiv.appendChild(titleDiv);
        gameDiv.appendChild(table);

        for (const player of this.players) {
            const scoreDiv = document.createElement("h3");
            scoreDiv.innerHTML = `${player.name} - ${player.win}`;
            gameDiv.appendChild(scoreDiv);
        }
    }

    getCase(line, col) {
        return this.board[line][col];
    }

    setCase(line, col, value) {
        this.board[line][col] = value;
    }

    addCoin(col) {
        for (let line = this.height - 1; line >= 0; line--) {
            if (this.getCase(line, col) === "") {
                this.setCase(line, col, this.getCurrentPlayer());
                this.turn++;
                this.checkWin(col, line);
                return;
            }
        }
    }

    checkWin(col, line) {       
        const player = this.getCurrentPlayer();

        col = Number(col);

        const ways = {
            'NE': 0,
            'NW': 0,
            'E': 0,
            'S': 0,
            'SE': 0,
            'SW': 0,
            'W': 0
        };

        // On part du jeton posé, et on fait +1 à chaque tour de boucle dans chaque direction
        for (let v = 1; v < 4; v++) {
            // Check South | Si la ligne est supérieur à 0 & la pièce en dessous est identique
            if (line + v < this.height && (v - 1) === ways['S'] && this.getCase(line + v, col) === player) {
                ways['S']++;
            }

            // Check East | Si la colonne est inférieur au maximum & la pièce à droite est identique
            if (col + v < this.width && (v - 1) === ways['E'] && this.getCase(line, col + v) === player) {
                ways['E']++;
            }

            // Check West | Si la colonne est supérieur à 0 & la pièce à gauche est identique
            if (col - v >= 0 && (v - 1) === ways['W'] && this.getCase(line, col - v) === player) {
                ways['W']++;
            }

            // Check SouthEast | Si la ligne est supérieur à 0 & la colonne est inférieur au maximum & la pièce en bas à droit est identique
            if (
                col + v < this.width
                && (v - 1) === ways['SE']
                && line + v < this.height
                && this.getCase(line + v, col + v) === player
            ) {
                ways['SE']++;
            }

            // Check SouthWest | Si la ligne est supérieur à 0 & la colonne est supérieur à 0 & la pièce en bas à gauche est identique
            if (
                col - v >= 0
                && (v - 1) === ways['SW']
                && line + v < this.height
                && this.getCase(line + v, col - v) === player
            ) {
                ways['SW']++;
            }

            // Check NorthEast | Si la ligne est inférieur au maximum & la colonne est inférieur au maximum & la pièce en haut à droit est identique
            if (
                line - v >= 0
                && (v - 1) === ways['NE']
                && col + v < this.width
                && this.getCase(line - v, col + v) === player
            ) {
                ways['NE']++;
            }

            // Check NorthWest | Si la ligne est inférieur au maximum & la colonne est inférieur au maximum & la pièce en bas à droit est identique
            if (
                line - v >= 0
                && (v - 1) === ways['NW']
                && col - v >= 0
                && this.getCase(line - v, col - v) === player
            ) {
                ways['NW']++;
            }
        }

        // On prends toutes les possibilités de win, et on compte
        let check = [
            ways['S'],
            ways['E'],
            ways['W'],
            ways['E'] + ways['W'],
            ways['NE'] + ways['SW'],
            ways['NW'] + ways['SE']
        ];

        const win = check.find(c => c >= 3);
        if (win || (this.turn > this.height * this.width)) {
            if (win) {
                player.win++;
                this.title = `Le vainqueur est ${this.getCurrentPlayer().name}`;
            } else {
                this.title = `Match nul !`;
            }

            this.isGameDone = true;
            this.showBoard();

            const replayButton = document.createElement('button');
            replayButton.innerText = "Rejouer";
            replayButton.addEventListener('click', () => this.replay());

            const titleDiv = document.getElementById("titleDiv");
            titleDiv.appendChild(replayButton);

            return;
        }
        
        // Si la partie n'est pas fini, on passe au joueur suivant
        this.nextPlayer();
        this.title = `C'est au tour de ${this.getCurrentPlayer().name} | Tour : ${this.turn}`;
        this.showBoard();
    }
}

class Player {
    name;
    color;
    win = 0;

    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
}

export { Puissance4, Player };
