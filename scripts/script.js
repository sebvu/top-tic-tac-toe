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

// UI handler
const UIController = (() => {
  const STORAGE_THEME_NAME = "theme";
  const THEME_ATTR = "data-theme";

  // private functions

  const getBaseDialog = () => {
    const dialog = document.createElement("dialog");

    dialog.classList.add(...["dialog", "--context-md"]);
    dialog.setAttribute("popover", "");

    // ensure dialog removal when closed
    dialog.addEventListener("close", () => {
      dialog.remove();
    });

    return dialog;
  };

  const setDialogInDOM = (dialog) => {
    const body = document.querySelector("body");

    body.appendChild(dialog);
  }

  // public functions

  const setPreviousTheme = () => {
    const storedTheme = localStorage.getItem(STORAGE_THEME_NAME);
    if (storedTheme)
      document.documentElement.setAttribute(THEME_ATTR, storedTheme);
  };

  const toggleTheme = () => {
    const newTheme =
      document.documentElement.getAttribute(THEME_ATTR) === "light"
        ? "dark"
        : "light";

    document.documentElement.setAttribute(THEME_ATTR, newTheme);
    localStorage.setItem(STORAGE_THEME_NAME, newTheme);
  };

  const getStartGameDialog = () => {
    const dialog = getBaseDialog();

    setDialogInDOM(dialog);

    return dialog;
  };

  return { setPreviousTheme, toggleTheme, getStartGameDialog };
})();

// tic tac toe logic handler
const gameBoard = (() => {
  const MAX_SPOTS = 9;
  const playerOne = Player("Jester", "X");
  const playerTwo = Player("Cristal", "O");

  let gameArray = new Array(MAX_SPOTS).fill(null);
  let currPlayer = Math.floor(Math.random() * 10) < 5 ? playerOne : playerTwo; // randomly decide who starts game

  const checkCompletionFromCell = (index) => {
    let rowIndex = index % 3;
    let colIndex = Math.floor(index / 3);

    if (
      // verify column
      (gameArray[colIndex * 3] !== null &&
        gameArray[colIndex * 3] === gameArray[colIndex * 3 + 1] &&
        gameArray[colIndex * 3 + 1] === gameArray[colIndex * 3 + 2]) ||
      // verify row
      (gameArray[0 + rowIndex] !== null &&
        gameArray[0 + rowIndex] === gameArray[3 + rowIndex] &&
        gameArray[3 + rowIndex] === gameArray[6 + rowIndex])
    ) {
      return true;
    } else {
      return false;
    }
  };

  const flipCurrPlayer = () => {
    currPlayer = currPlayer === playerOne ? playerTwo : playerOne;
  };

  const attemptSelectCell = (index) => {
    if (gameArray[index] === null) {
      gameArray[index] = currPlayer.getLetter();
      return true;
    } else {
      return false;
    }
  };

  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;
  const getGameArray = () => gameArray;

  return {
    getPlayerOne,
    getPlayerTwo,
    getGameArray,
    attemptSelectCell,
  };
})();

function main() {
  const themeToggler = document.querySelector(
    ".dashboard-footer__button--theme",
  );
  const startGameButton = document.querySelector(
    ".dashboard-footer__button--start",
  );

  UIController.setPreviousTheme();

  // === event listeners ===
  themeToggler.addEventListener("click", () => {
    UIController.toggleTheme();
  });

  startGameButton.addEventListener("click", () => {
    const startGameDialog = UIController.getStartGameDialog();

    startGameDialog.showModal();
  });
}

main();
