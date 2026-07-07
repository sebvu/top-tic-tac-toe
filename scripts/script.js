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
  const dialogElement = document.querySelector(".dialog");
  const dialogForm = document.querySelector(".dialog__form");
  const playerIconLabels = document.querySelectorAll(
    ".player-p--avatar > label",
  );
  const exitButton = document.querySelector(".dialog__exit-button");
  const playerOneName = document.querySelector("#name-one");
  const playerTwoName = document.querySelector("#name-two");
  const playerOneLetter = document.querySelector("#letter-one");
  const playerTwoLetter = document.querySelector("#letter-two");
  const gameStatus = document.querySelector(".game-status__text");

  // public functions

  const setGameStatus = (status) => {
    gameStatus.textContent = status;
  };

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

  const toggleGlowingIcon = () => {
    const startButton = document.querySelector(
      ".dashboard-footer__button--start",
    );

    const className = "dashboard-footer__button--start-glowing";

    startButton.classList.contains(className)
      ? startButton.classList.remove(className)
      : startButton.classList.add(className);
  };

  const removeDialog = () => {
    dialogElement.remove();
  };

  const closeDialog = () => {
    dialogElement.close();
  };

  const getStartGameDialog = () => {
    /* dialog must exist in dom before opening */
    document.querySelector("body").appendChild(dialogElement);

    return dialogElement;
  };

  // dialog specific event listeners

  dialogElement.addEventListener("close", () => {
    removeDialog();
  });
  // make change icons tab clickable
  playerIconLabels.forEach((el) => {
    el.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key === "Enter") {
        el.click();
      }
    });
  });

  exitButton.addEventListener("click", () => {
    closeDialog();
  });

  dialogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // trigger all validity checks
    [playerOneName, playerTwoName, playerOneLetter, playerTwoLetter].forEach(
      (el) => {
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
    );

    if (dialogForm.checkValidity()) {
      console.log("Validity is good. Starting game.");
    } else {
      console.log("Bad form validity");
    }
  });

  [playerOneName, playerTwoName].forEach((el) => {
    ["input", "select"].forEach((type) => {
      el.addEventListener(type, () => {
        if (
          playerOneName.value.toLowerCase() ===
          playerTwoName.value.toLowerCase()
        ) {
          [playerOneName, playerTwoName].forEach((elValidity) => {
            elValidity.setCustomValidity(
              "Names must be unique from each other.",
            );
          });
        } else {
          [playerOneName, playerTwoName].forEach((elValidity) => {
            elValidity.setCustomValidity("");
          });
        }
      });
    });
  });

  [playerOneLetter, playerTwoLetter].forEach((el) => {
    ["input", "select"].forEach((type) => {
      el.addEventListener(type, () => {
        if (
          playerOneLetter.value.toLowerCase() ===
          playerTwoLetter.value.toLowerCase()
        ) {
          [playerOneLetter, playerTwoLetter].forEach((elValidity) => {
            elValidity.setCustomValidity(
              "Letters must be unique from eac other.",
            );
          });
        } else {
          [playerOneLetter, playerTwoLetter].forEach((elValidity) => {
            elValidity.setCustomValidity("");
          });
        }
      });
    });
  });

  return {
    setGameStatus,
    setPreviousTheme,
    toggleTheme,
    toggleGlowingIcon,
    removeDialog,
    closeDialog,
    getStartGameDialog,
  };
})();

// tic tac toe logic handler
const gameBoard = (() => {
  const MAX_SPOTS = 9;
  const playerOne = Player("Jester", "X");
  const playerTwo = Player("Cristal", "O");

  let gameArray = new Array(MAX_SPOTS).fill(null);
  let currPlayer = Math.floor(Math.random() * 10) < 5 ? playerOne : playerTwo; // randomly decide who starts game

  // private

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

  // public

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
  // pre-run functions
  UIController.setPreviousTheme();
  UIController.removeDialog();
  UIController.toggleGlowingIcon();

  const themeToggler = document.querySelector(
    ".dashboard-footer__button--theme",
  );
  const startGameButton = document.querySelector(
    ".dashboard-footer__button--start",
  );

  // === event listeners ===
  themeToggler.addEventListener("click", () => {
    UIController.toggleTheme();
  });

  startGameButton.addEventListener("click", () => {
    const dialog = UIController.getStartGameDialog();

    dialog.showModal();
  });
}

main();
