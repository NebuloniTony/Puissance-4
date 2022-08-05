import { Puissance4 } from "./puissance4.js";

let nbrPlayers = prompt("Combien de joueurs ? (2 à 4 joueurs)");
let height = prompt("Combien de lignes ?");
let width = prompt("Combien de colonnes ?");

const game = new Puissance4(height, width);

for (let i = 0; i < nbrPlayers; i++) {
    let name = prompt("Nom du joueur " + (i + 1) + " ?");
    let color = prompt("Couleur du joueur " + (i + 1) + " ?");
    
    game.addPlayer(name, color);
}

game.initBoard();
game.showBoard();