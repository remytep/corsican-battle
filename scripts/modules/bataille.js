export { Bataille };

class Bataille {
  constructor() {
    this.turn = document.getElementById("turn");
    this.messages = document.getElementById("messages");
    this.pile = document.getElementById("middlepile");
    this.player1Pile = document.getElementById("player1pile");
    this.player2Pile = document.getElementById("player2pile");
    this.claimable = false;
    //this.claimable = true;
    this.cards = [];
    this.div = document.querySelector("#game");
    this.numbers = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "D",
      "R",
      "V",
    ];
    this.colors = ["carreau", "coeur", "pique", "trefle"];
    this.numbers.forEach((number) => {
      this.colors.forEach((color) => {
        this.cards.push(number + "-" + color + ".png");
      });
    });
    this.gameStart();
  }
  gameStart() {
    this.game = true;
    this.turn.innerHTML = "";
    this.messages.innerHTML = "";
    document.getElementById("middlepilecounter").innerHTML = "";
    this.pile.style.backgroundImage = "url('')";
    this.distributeCards();
    this.middlePile = [];
    this.gameTurn = 1;
    this.turn.innerHTML = "Turn " + this.gameTurn + " : Player 1 starts.";
    document.addEventListener(
      "keyup",
      (e) => {
        this.playerControls(e);
      },
      true
    );
  }
  shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  distributeCards() {
    this.cards = this.shuffleCards(this.cards);
    this.player1Deck = [];
    this.player2Deck = [];
    for (let i = 0; i < this.cards.length; i++) {
      if (i % 2 == 0) {
        this.player1Deck.push(this.cards[i]);
      } else {
        this.player2Deck.push(this.cards[i]);
      }
    }
  }

  player1Turn() {
    if (this.game) {
      if (this.gameTurn % 2 == 1) {
        this.turnMechanic(1);
      } else {
        document.getElementById("player1small").innerHTML =
          "It is not your turn yet.";
      }
    }
  }

  player2Turn() {
    if (this.game) {
      if (this.gameTurn % 2 == 0) {
        this.turnMechanic(2);
      } else {
        document.getElementById("player2small").innerHTML =
          "It is not your turn yet.";
      }
    }
  }
  playerControls(e) {
    switch (e.key) {
      case "q":
        this.checkGameState();
        this.player1Turn();
        break;
      case "w":
        this.checkGameState();
        this.claimPile(1);
        break;
      case "o":
        this.checkGameState();
        this.player2Turn();
        break;
      case "p":
        this.checkGameState();
        this.claimPile(2);
        break;
    }
  }
  turnMechanic(playernumber) {
    document.getElementById("player1small").innerHTML = "";
    document.getElementById("player2small").innerHTML = "";
    let playedCard;
    if (this.player1Deck != [] || this.player2Deck != []) {
      if (playernumber == 1) {
        playedCard = this.player1Deck.pop();
      } else {
        playedCard = this.player2Deck.pop();
      }
      if (playedCard != undefined) {
        this.pile.style.backgroundImage = "url('./images/" + playedCard + "')";
        this.updateDecks();
        this.middlePile.push(playedCard);
        this.gameTurn++;
        let nextplayer = playernumber == 1 ? 2 : 1;
        this.messages.innerHTML = "";
        this.turn.innerHTML =
          "Turn " + this.gameTurn + " : It's player " + nextplayer + "'s turn.";
        this.checkGameState();
      }
    } else {
      this.checkGameState();
    }
    let length = this.middlePile.length;
    if (this.middlePile.length > 1) {
      if (
        this.stripCardName(this.middlePile[length - 2]) ==
        this.stripCardName(this.middlePile[length - 1])
      ) {
        this.claimable = true;
      } else {
        this.claimable = false;
      }
    }

    this.checkGameState();
  }

  stripCardName(string) {
    return string.substring(0, 2).replace("-", "");
  }

  updateDecks() {
    this.player1Pile.innerHTML = this.player1Deck.length;
    this.player2Pile.innerHTML = this.player2Deck.length;
    let middlelength = this.middlePile.length + 1;
    document.getElementById("middlepilecounter").innerHTML =
      middlelength + " cards";
  }

  claimPile(playernumber) {
    if (this.claimable) {
      if (playernumber == 1) {
        this.player1Deck = this.player1Deck.concat(this.middlePile);
        this.middlePile = [];
        this.messages.innerHTML = "Player 1 has claimed the pile.";
        this.updateDecks();
        this.claimable = false;
        this.checkGameState();
      } else {
        this.player2Deck = this.player2Deck.concat(this.middlePile);
        this.middlePile = [];
        this.messages.innerHTML = "Player 2 has claimed the pile.";
        this.updateDecks();
        this.claimable = false;
        this.checkGameState();
      }
    } else {
      if (playernumber == 1) {
        this.player2Deck = this.player2Deck.concat(this.middlePile);
        this.middlePile = [];
        this.messages.innerHTML =
          "Player 1 has wrongly claimed the pile. Player 2 gets the pile.";
        this.updateDecks();
        this.checkGameState();
      } else {
        this.player1Deck = this.player1Deck.concat(this.middlePile);
        this.middlePile = [];
        this.messages.innerHTML =
          "Player 2 has wrongly claimed the pile. Player 1 gets the pile.";
        this.updateDecks();
        this.checkGameState();
      }
    }
    this.pile.style.backgroundImage = "url('')";
  }

  checkGameState() {
    if (
      this.player1Deck.length == 0 &&
      this.player2Deck.length == 0 &&
      this.claimable == false
    ) {
      this.endMessage = "Game has ended without a winner. Remake ?";
      this.endGame();
    } else if (
      this.player1Deck.length == 0 &&
      this.player2Deck.length > 1 &&
      this.claimable == false
    ) {
      this.endMessage = "Game has ended. Player 2 wins.";
      this.endGame();
    } else if (
      this.player2Deck.length == 0 &&
      this.player1Deck.length > 1 &&
      this.claimable == false
    ) {
      this.endMessage = "Game has ended. Player 1 wins.";
      this.endGame();
    } else {
      //console.log("else");
    }
  }

  endGame() {
    this.game = false;
    this.messages.innerHTML = this.endMessage;
    this.turn.innerHTML = "";
    document.getElementById("start-game").innerHTML = "Restart game";
    document.getElementById("start-game").style.display = "block";
  }
}
