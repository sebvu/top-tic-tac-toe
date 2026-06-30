function Player(name, letter) {
  const score = 0;

  const getName = () => name;
  const getLetter = () => letter;
  const getScore = () => score;

  const increaseScore = () => {
    score++;
  };

  return { getName, getLetter, getScore, increaseScore };
}

const UIController = (() => {})();

function main() {
  // tic tac toe logic handler
  const gameBoard = (() => {
    const MAX_SPOTS = 9;

    const playerOne = Player("Jester", "X");
    const playerTwo = Player("Cristal", "O");

    const getPlayerOne = () => playerOne;
    const getPlayerTwo = () => playerTwo;

    const startGame = () => {
      let currPlayer = // randomly decide who starts game
        Math.floor(Math.random() * 10) < 5 ? playerOne : playerTwo;
      let gameArray = new Array(MAX_SPOTS).fill(null);

      const checkCompletionFromCell = (index) => {
        let rowIndex = index % 3;
        let colIndex = Math.floor(index / 3);

        if (
          // verify column
          (gameArray[colIndex * 3] === gameArray[colIndex * 3 + 1] &&
            gameArray[colIndex * 3 + 1] === gameArray[colIndex * 3 + 2]) ||
          // verify row
          (gameArray[0 + rowIndex] === gameArray[3 + rowIndex] &&
            gameArray[3 + rowIndex] === gameArray[6 + rowIndex])
        ) {
          return true;
        } else {
          return false;
        }
      };

      const attemptSelectCell = (index) => {
        if (gameArray[index] === null) {
          gameArray[index] = currPlayer.letter;
          return true;
        } else {
          return false;
        }
      };
    };

    return { getPlayerOne, getPlayerTwo, startGame };
  })();

  gameBoard.startGame();
}

main();
