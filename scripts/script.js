function Player(iconURL, name, letter, color) {
  const score = 0;

  const getIconURL = () => iconURL;
  const getName = () => name;
  const getLetter = () => letter;
  const getColor = () => color;
  const getScore = () => score;

  const increaseScore = () => {
    score++;
  };

  return { getIconURL, getName, getLetter, getColor, getScore, increaseScore };
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
  const playerOneIcon = document.querySelector(
    ".dialog__form-container--player-one .dialog__image",
  );
  const playerTwoIcon = document.querySelector(
    ".dialog__form-container--player-two .dialog__image",
  );
  const playerOneIconSelector = document.querySelector("#avatar-one");
  const playerTwoIconSelector = document.querySelector("#avatar-two");
  const playerOneColor = document.querySelector("#color-one");
  const playerTwoColor = document.querySelector("#color-two");

  const leftProfileIcon = document.querySelector(".profile-left__image");
  const leftProfileName = document.querySelector(".profile-left__user-name");
  const leftProfileScore = document.querySelector(".profile-left__score");

  const rightProfileIcon = document.querySelector(".profile-right__image");
  const rightProfileName = document.querySelector(".profile-right__user-name");
  const rightProfileScore = document.querySelector(".profile-right__score");

  const gameStatus = document.querySelector(".game-status__text");
  const gameBoardEl = document.querySelector(".game-board");

  // private function

  const startGame = () => {
    // generate both players and send them off to nirvana
    const playerOne = Player(
      playerOneIcon.getAttribute("src"),
      playerOneName.value,
      playerOneLetter.value,
      playerOneColor.value,
    );
    const playerTwo = Player(
      playerTwoIcon.getAttribute("src"),
      playerTwoName.value,
      playerTwoLetter.value,
      playerTwoColor.value,
    );

    TicTacToeController.startGame(playerOne, playerTwo);
  };

  // public functions

  const displayCurrentPlayer = (is) => {
    if (is === true) {
      leftProfileIcon.parentElement.classList.add(
        "profile-left__image--current",
      );
      rightProfileIcon.parentElement.classList.remove(
        "profile-right__image--current",
      );
      leftProfileName.classList.add("profile-left__user-name--current");
      rightProfileName.classList.remove("profile-right__user-name--current");
    } else {
      rightProfileIcon.parentElement.classList.add(
        "profile-right__image--current",
      );
      leftProfileIcon.parentElement.classList.remove(
        "profile-left__image--current",
      );
      rightProfileName.classList.add("profile-right__user-name--current");
      leftProfileName.classList.remove("profile-left__user-name--current");
    }
  };

  const setDefaultPage = () => {
    // set gameboard to default
    const gameBoardList = gameBoardEl.children;
    const textList = ["T", "I", "C", "T", "A", "C", "T", "O", "E"];

    for (let i = 0; i < gameBoardList.length; i++) {
      let cellElement = gameBoardList[i].children[0];
      cellElement.textContent = textList[i];

      cellElement.classList.add("game-board__cell--dancing");
    }

    setGameStatus("WAITING FOR GAME");
    leftProfileIcon.setAttribute("src", "./assets/icons/player-one.png");
    rightProfileIcon.setAttribute("src", "./assets/icons/player-two.png");

    leftProfileName.textContent = "N/A";
    rightProfileName.textContent = "N/A";

    leftProfileScore.textContent = "0";
    rightProfileScore.textContent = "0";

    toggleGlowingIcon(true);
  };

  const clearBoardDisplay = () => {
    const gameBoardList = gameBoardEl.children;

    for (let i = 0; i < gameBoardList.length; i++) {
      gameBoardList[i].children[0].textContent = "";
    }
  };

  const updatePlayerInformation = (playerOne, playerTwo) => {
    leftProfileIcon.setAttribute("src", playerOne.getIconURL());
    leftProfileName.textContent = playerOne.getName();
    leftProfileScore.textContent = playerOne.getScore();

    rightProfileIcon.setAttribute("src", playerTwo.getIconURL());
    rightProfileName.textContent = playerTwo.getName();
    rightProfileScore.textContent = playerTwo.getScore();
  };

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

  const toggleGlowingIcon = (force = false) => {
    const startButton = document.querySelector(
      ".dashboard-footer__button--start",
    );

    const className = "dashboard-footer__button--start-glowing";

    if (!force) {
      startButton.classList.contains(className)
        ? startButton.classList.remove(className)
        : startButton.classList.add(className);
    } else {
      startButton.classList.add(className);
    }
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
      toggleGlowingIcon();
      closeDialog();
      startGame(); // sending request to gameboard
    } else {
      console.log("Bad form validity");
    }
  });

  // load icon image
  [
    [playerOneIcon, playerOneIconSelector],
    [playerTwoIcon, playerTwoIconSelector],
  ].forEach((elArr) => {
    const icon = elArr[0];
    const iconSelector = elArr[1];

    iconSelector.addEventListener("input", () => {
      const reader = new FileReader();
      const file = iconSelector.files[0];
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        icon.setAttribute("src", reader.result);
      });
    });
  });

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
    displayCurrentPlayer,
    setDefaultPage,
    clearBoardDisplay,
    updatePlayerInformation,
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
  let playerOne = null;
  let playerTwo = null;
  let currPlayer = null;

  let gameArray = new Array(MAX_SPOTS).fill(null);
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

  const setPlayers = (newPlayerOne, newPlayerTwo) => {
    playerOne = newPlayerOne;
    playerTwo = newPlayerTwo;
    currPlayer = Math.floor(Math.random() * 10) < 5 ? playerOne : playerTwo; // randomly decide who starts game
  };

  const attemptSelectCell = (index) => {
    if (gameArray[index] === null) {
      gameArray[index] = currPlayer.getLetter();
      return true;
    } else {
      return false;
    }
  };

  const getCurrentTurn = () => currPlayer;
  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;
  const getGameArray = () => gameArray;

  return {
    setPlayers,
    attemptSelectCell,
    getCurrentTurn,
    getPlayerOne,
    getPlayerTwo,
    getGameArray,
  };
})();

// controller between UIController and gameBoard
const TicTacToeController = (() => {
  let pOne = null;
  let pTwo = null;

  const startGame = (playerOne, playerTwo) => {
    pOne = playerOne;
    pTwo = playerTwo;
    // setup players for both boards
    gameBoard.setPlayers(pOne, pTwo);
    UIController.updatePlayerInformation(pOne, pTwo);
    UIController.clearBoardDisplay();

    doRound();
  };

  const doRound = () => {
    const currTurn = gameBoard.getCurrentTurn();
    UIController.setGameStatus(`${currTurn.getName()} turn`);

    if (currTurn === pOne) {
      UIController.displayCurrentPlayer(true);
    } else {
      UIController.displayCurrentPlayer(false);
    }
  };

  return { startGame };
})();

function main() {
  // pre-run functions
  UIController.removeDialog();
  UIController.setDefaultPage();
  UIController.setPreviousTheme();

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
