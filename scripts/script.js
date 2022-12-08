import { Bataille } from "./modules/bataille.js";

let gameInProgress = false;

document.getElementById("start-game").addEventListener("click", (e) => {
  e.preventDefault();
  if (!gameInProgress) {
    let game = new Bataille();
    gameInProgress = true;
    e.target.style.display = "none";
  } else {
    let game = new Bataille();
    e.target.style.display = "none";
  }
});
