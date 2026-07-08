function Player(iconURL, name, letter, color, direction) {
  let score = 0;

  const getIconURL = () => iconURL;
  const getName = () => name;
  const getLetter = () => letter;
  const getColor = () => color;
  const getScore = () => score;

  const increaseScore = () => {
    score++;
  };

  // either left or right, lowercase. depending if on left or right of screen
  const getDirection = () => direction;

  return {
    getIconURL,
    getName,
    getLetter,
    getColor,
    getScore,
    increaseScore,
    getDirection,
  };
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
  const gameBoardCellContainer = document.querySelectorAll(
    ".game-board__cell-container",
  );

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
  const leftProfileLetter = document.querySelector(".profile-left__letter");
  const leftProfileScore = document.querySelector(".profile-left__score");

  const rightProfileIcon = document.querySelector(".profile-right__image");
  const rightProfileName = document.querySelector(".profile-right__user-name");
  const rightProfileLetter = document.querySelector(".profile-right__letter");
  const rightProfileScore = document.querySelector(".profile-right__score");

  const isInfinite = document.querySelector("#infinite");
  const roundsToWin = document.querySelector("#rounds");

  const gameStatus = document.querySelector(".game-status__text");
  const gameWinCondition = document.querySelector(
    ".game-status__win-condition",
  );
  const gameBoardEl = document.querySelector(".game-board");

  // private function

  const startGame = () => {
    // generate both players and send them off to nirvana
    const playerOne = Player(
      playerOneIcon.getAttribute("src"),
      playerOneName.value,
      playerOneLetter.value,
      playerOneColor.value,
      "left",
    );
    const playerTwo = Player(
      playerTwoIcon.getAttribute("src"),
      playerTwoName.value,
      playerTwoLetter.value,
      playerTwoColor.value,
      "right",
    );

    TicTacToeController.startGame(
      playerOne,
      playerTwo,
      isInfinite.checked,
      roundsToWin.value,
    );
  };

  // public functions

  const highlightCells = (cellsArr) => {
    const cells = gameBoardEl.children;

    console.log(cellsArr);
    for (let index of cellsArr) {
      cells[index].classList.add("game-board__cell-container--winner");
      cells[index].children[0].style.animationName = "";
      cells[index].children[0].style.animationDuration = "";
      cells[index].children[0].classList.add("game-board__cell--dancing");
    }
  };

  const newRoundAnimation = () => {
    const transitionContainer = document.querySelector(
      ".game-board__transitionDiv",
    );

    // disabled to avoid bugs during transition
    const startButton = document.querySelector(
      ".dashboard-footer__button--start",
    );

    startButton.setAttribute("disabled", "");

    const animationDuration = 3000;
    const activeClass = "game-board__transitionDiv--active";

    transitionContainer.classList.add(activeClass);

    setTimeout(() => {
      displayCurrentBoard();
    }, animationDuration / 2);

    setTimeout(() => {
      transitionContainer.classList.remove(activeClass);
      startButton.removeAttribute("disabled");
    }, animationDuration - 100);
  };

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

  const displayCurrentBoard = (oldBoard = null) => {
    const board = gameBoard.getGameArray();
    const gameBoardList = gameBoardEl.children;

    console.log(oldBoard);
    console.log(gameBoard.getGameArray());

    for (let i = 0; i < board.length; i++) {
      const currentCellContainer = gameBoardList[i];
      currentCellContainer.classList.remove(
        "game-board__cell-container--winner",
      );

      const currentCell = gameBoardList[i].children[0];
      currentCell.style.animationName = "";
      currentCell.classList.remove("game-board__cell--dancing");

      if (board[i][0]) {
        if (oldBoard && board[i][0] !== oldBoard[i][0]) {
          currentCell.style.animationName = "openTransition";
          currentCell.style.animationDuration = "0.5s";
        }
        currentCell.textContent = board[i][0];

        currentCell.style.color =
          board[i][1] === "left"
            ? gameBoard.getPlayerOne().getColor()
            : gameBoard.getPlayerTwo().getColor();
      } else {
        currentCell.textContent = "";
      }
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
    setGameWinCondition("N/A");
    leftProfileIcon.setAttribute("src", "./assets/icons/player-one.png");
    rightProfileIcon.setAttribute("src", "./assets/icons/player-two.png");

    leftProfileName.textContent = "Player One";
    rightProfileName.textContent = "Player Two";

    leftProfileLetter.textContent = "X";
    rightProfileLetter.textContent = "O";

    leftProfileLetter.style.color = "cyan";
    rightProfileLetter.style.color = "red";

    leftProfileScore.textContent = "0";
    rightProfileScore.textContent = "0";

    toggleGlowingIcon(true);
  };

  const clearBoardDisplay = () => {
    const gameBoardList = gameBoardEl.children;

    for (let i = 0; i < gameBoardList.length; i++) {
      const cellContainer = gameBoardList[i];
      const cell = gameBoardList[i].children[0];

      cellContainer.classList.remove("game-board__cell-container--winner");
      cell.style.animationName = "";
      cell.textContent = "";
      cell.classList.remove("game-board__cell--dancing");
    }
  };

  const updatePlayerInformation = () => {
    const playerOne = gameBoard.getPlayerOne();
    const playerTwo = gameBoard.getPlayerTwo();

    leftProfileIcon.setAttribute("src", playerOne.getIconURL());
    leftProfileName.textContent = playerOne.getName();
    leftProfileLetter.textContent = playerOne.getLetter();
    leftProfileLetter.style.color = playerOne.getColor();
    leftProfileScore.textContent = playerOne.getScore();

    rightProfileIcon.setAttribute("src", playerTwo.getIconURL());
    rightProfileName.textContent = playerTwo.getName();
    rightProfileLetter.textContent = playerTwo.getLetter();
    rightProfileLetter.style.color = playerTwo.getColor();
    rightProfileScore.textContent = playerTwo.getScore();
  };

  const setGameWinCondition = (rounds, isInf = false) => {
    if (isInf) {
      gameWinCondition.textContent = "INF ROUNDS";
    } else {
      gameWinCondition.textContent = `WIN ${rounds} ROUNDS`;
    }
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

  const toggleGlowingIcon = (on = true) => {
    const startButton = document.querySelector(
      ".dashboard-footer__button--start",
    );

    const className = "dashboard-footer__button--start-glowing";

    if (!on) {
      startButton.classList.remove(className);
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

    // automatically trigger the infinite round disabled styling
    isInfinite.dispatchEvent(new Event("change", { bubbles: true }));

    return dialogElement;
  };

  const getGameBoardEl = () => gameBoardEl;

  // dialog specific event listeners

  isInfinite.addEventListener("change", () => {
    if (isInfinite.checked === true) {
      roundsToWin.setAttribute("disabled", "");
    } else {
      roundsToWin.removeAttribute("disabled");
    }
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
      toggleGlowingIcon(false);
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
  [...playerIconLabels, ...gameBoardCellContainer].forEach((el) => {
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
              "Letters must be unique from each other.",
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
    highlightCells,
    newRoundAnimation,
    displayCurrentPlayer,
    displayCurrentBoard,
    setDefaultPage,
    clearBoardDisplay,
    updatePlayerInformation,
    setGameWinCondition,
    setGameStatus,
    setPreviousTheme,
    toggleTheme,
    toggleGlowingIcon,
    removeDialog,
    closeDialog,
    getStartGameDialog,
    getGameBoardEl,
  };
})();

// tic tac toe logic handler
const gameBoard = (() => {
  const MAX_SPOTS = 9;
  let playerOne = null;
  let playerTwo = null;
  let currPlayer = null;

  let gameArray = new Array(MAX_SPOTS).fill([null, null]);
  // private

  const checkCompletionFromCell = (index) => {
    const checkIndexes = () => {
      return (
        gameArray[winningIndexes[0]][0] !== null &&
        gameArray[winningIndexes[0]][0] === gameArray[winningIndexes[1]][0] &&
        gameArray[winningIndexes[1]][0] === gameArray[winningIndexes[2]][0]
      );
    };

    const rowIndex = index % 3;
    const colIndex = Math.floor(index / 3);
    let winningIndexes = [];

    // verify column
    winningIndexes = [colIndex * 3, colIndex * 3 + 1, colIndex * 3 + 2];
    if (checkIndexes()) return [true, winningIndexes];

    // verify row
    winningIndexes = [0 + rowIndex, 3 + rowIndex, 6 + rowIndex];
    if (checkIndexes()) return [true, winningIndexes];

    // verify diagonals
    if (index % 2 === 0) {
      winningIndexes = [0, 4, 8];
      if (checkIndexes()) return [true, winningIndexes];
      winningIndexes = [2, 4, 6];
      if (checkIndexes()) return [true, winningIndexes];
    }

    return false;
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
    if (gameArray[index][0] === null) {
      gameArray[index] = [currPlayer.getLetter(), currPlayer.getDirection()];
      return true;
    } else {
      return false;
    }
  };

  const getCurrentTurn = () => currPlayer;
  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;
  const getGameArray = () => gameArray;

  const clearGameArray = () => {
    gameArray = new Array(MAX_SPOTS).fill([null, null]);
  };

  const checkTie = () => {
    for (let el of gameArray) {
      if (el[0] === null) {
        return false;
      }
    }
    return true;
  };

  return {
    checkCompletionFromCell,
    flipCurrPlayer,
    setPlayers,
    attemptSelectCell,
    getCurrentTurn,
    getPlayerOne,
    getPlayerTwo,
    getGameArray,
    clearGameArray,
    checkTie,
  };
})();

// controller between UIController and gameBoard
const TicTacToeController = (() => {
  let pOne = null;
  let pTwo = null;
  let isInf = null;
  let goalRounds = null;
  const gameBoardEl = UIController.getGameBoardEl();

  const checkWinCondition = (pOne, pTwo) => {
    if (pOne.getScore() === goalRounds) {
      console.log(`${pOne.getName()} wins the game!`);
      return pOne;
    } else if (pTwo.getScore() === goalRounds) {
      console.log(`${pTwo.getName()} wins the game!`);
      return pTwo;
    } else {
      return null;
    }
  };

  // clickEventHandler
  const clickBoardEventHandler = (e) => {
    const target = e.target;
    const cellIndex = Array.prototype.indexOf.call(
      gameBoardEl.children,
      target,
    );
    console.log(cellIndex);
    const preActionBoard = [...gameBoard.getGameArray()];
    if (cellIndex !== -1 && gameBoard.attemptSelectCell(cellIndex)) {
      UIController.displayCurrentBoard(preActionBoard);
      const currentRoundResult = gameBoard.checkCompletionFromCell(cellIndex);
      if (currentRoundResult[0]) {
        const currPlayer = gameBoard.getCurrentTurn();

        UIController.highlightCells(currentRoundResult[1]);

        console.log(`${currPlayer.getName()} wins round!`);
        currPlayer.increaseScore();
        UIController.updatePlayerInformation();
        gameNextAction();
      } else if (gameBoard.checkTie()) {
        console.log("tie");
        gameNextAction(true);
      } else {
        gameBoard.flipCurrPlayer();
        const currPlayer = gameBoard.getCurrentTurn();

        UIController.setGameStatus(`${currPlayer.getName()} TURN`);
        UIController.displayCurrentPlayer(currPlayer.getDirection() === "left");
      }
    }
  };

  const startGame = (playerOne, playerTwo, isInfinite, roundsToWin) => {
    pOne = playerOne;
    pTwo = playerTwo;
    isInf = isInfinite;
    if (isInf === true) {
      goalRounds = 999999; // essentially infinity
    } else {
      goalRounds = roundsToWin * 1;
    }
    console.log(
      `${pOne.getName()}\n${pTwo.getName()}\n${isInf}\n${goalRounds}`,
    );
    // setup players for both boards
    gameBoard.setPlayers(pOne, pTwo);
    UIController.updatePlayerInformation();
    UIController.clearBoardDisplay();
    UIController.setGameWinCondition(goalRounds, isInf);
    gameBoard.clearGameArray();

    doRound();
  };

  const gameNextAction = (tie = false) => {
    gameBoardEl.removeEventListener("click", clickBoardEventHandler);
    const gameWinner = checkWinCondition(pOne, pTwo);
    if (gameWinner === null || tie) {
      UIController.setGameStatus(
        tie ? "TIED" : `${gameBoard.getCurrentTurn().getName()} WON ROUND`,
      );
      gameBoard.flipCurrPlayer();
      gameBoard.clearGameArray();
      setTimeout(UIController.newRoundAnimation, 1000);
      setTimeout(() => {
        doRound();
        console.log("next round");
      }, 4000);
    } else {
      UIController.setGameStatus(`${gameWinner.getName()} WON!!!!`);
    }
  };

  const doRound = () => {
    const currTurn = gameBoard.getCurrentTurn();
    UIController.setGameStatus(`${currTurn.getName()} turn`);

    if (currTurn === pOne) {
      UIController.displayCurrentPlayer(true);
    } else {
      UIController.displayCurrentPlayer(false);
    }

    gameBoardEl.addEventListener("click", clickBoardEventHandler);
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
