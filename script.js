document.addEventListener("DOMContentLoaded", () => {
  const gameTabs = document.querySelectorAll(".game-tab");
  const gamePanels = document.querySelectorAll(".game-panel");

  gameTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedGame = tab.dataset.game;

      gameTabs.forEach((btn) => btn.classList.remove("active"));
      gamePanels.forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");

      const targetPanel = document.getElementById(`panel-${selectedGame}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  let ticBoard = Array(9).fill("");
  let ticCurrentPlayer = "X";
  let ticGameOver = false;

  const ticCells = document.querySelectorAll(".tic-cell");
  const ticStatus = document.getElementById("tic-status");
  const resetTicButton = document.getElementById("reset-tic");

  const ticWinPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function updateTicStatus(message) {
    if (ticStatus) ticStatus.textContent = message;
  }

  function checkTicWinner() {
    for (const pattern of ticWinPatterns) {
      const [a, b, c] = pattern;
      if (ticBoard[a] && ticBoard[a] === ticBoard[b] && ticBoard[a] === ticBoard[c]) {
        return ticBoard[a];
      }
    }
    return null;
  }

  function resetTicGame() {
    ticBoard = Array(9).fill("");
    ticCurrentPlayer = "X";
    ticGameOver = false;

    ticCells.forEach((cell) => {
      cell.textContent = "";
    });

    updateTicStatus("Current turn: X");
  }

  ticCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = cell.dataset.index;

      if (ticBoard[index] || ticGameOver) return;

      ticBoard[index] = ticCurrentPlayer;
      cell.textContent = ticCurrentPlayer;

      const winner = checkTicWinner();
      if (winner) {
        ticGameOver = true;
        updateTicStatus(`Winner: ${winner}`);
        return;
      }

      const isDraw = ticBoard.every((item) => item !== "");
      if (isDraw) {
        ticGameOver = true;
        updateTicStatus("Draw game");
        return;
      }

      ticCurrentPlayer = ticCurrentPlayer === "X" ? "O" : "X";
      updateTicStatus(`Current turn: ${ticCurrentPlayer}`);
    });
  });

  if (resetTicButton) {
    resetTicButton.addEventListener("click", resetTicGame);
  }

  let secretNumber = Math.floor(Math.random() * 100) + 1;
  let guessTries = 0;

  const guessInput = document.getElementById("guess-input");
  const guessMessage = document.getElementById("guess-message");
  const guessTriesText = document.getElementById("guess-tries");
  const submitGuessButton = document.getElementById("submit-guess");
  const resetGuessButton = document.getElementById("reset-guess");

  function resetGuessGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    guessTries = 0;
    if (guessInput) guessInput.value = "";
    if (guessMessage) guessMessage.textContent = "Enter a number and start guessing.";
    if (guessTriesText) guessTriesText.textContent = "0";
  }

  function submitGuess() {
    if (!guessInput || !guessMessage || !guessTriesText) return;

    const value = Number(guessInput.value);

    if (!Number.isInteger(value) || value < 1 || value > 100) {
      guessMessage.textContent = "Please enter an integer from 1 to 100.";
      return;
    }

    guessTries += 1;
    guessTriesText.textContent = guessTries;

    if (value === secretNumber) {
      guessMessage.textContent = `Correct. You found it in ${guessTries} tries.`;
    } else if (value < secretNumber) {
      guessMessage.textContent = "Too low. Try a larger number.";
    } else {
      guessMessage.textContent = "Too high. Try a smaller number.";
    }
  }

  if (submitGuessButton) {
    submitGuessButton.addEventListener("click", submitGuess);
  }

  if (resetGuessButton) {
    resetGuessButton.addEventListener("click", resetGuessGame);
  }

  if (guessInput) {
    guessInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        submitGuess();
      }
    });
  }

  let reflexState = "idle";
  let reflexStartTime = 0;
  let reflexTimer = null;

  const startReflexButton = document.getElementById("start-reflex");
  const reflexArea = document.getElementById("reflex-area");
  const reflexMessage = document.getElementById("reflex-message");
  const reflexResult = document.getElementById("reflex-result");

  function setReflexAreaClass(className) {
    if (reflexArea) {
      reflexArea.className = `reflex-area ${className}`;
    }
  }

  function startReflexGame() {
    clearTimeout(reflexTimer);
    reflexState = "waiting";

    if (reflexMessage) reflexMessage.textContent = "Wait for green. Do not click yet.";
    if (reflexResult) reflexResult.textContent = "No result yet";
    if (reflexArea) reflexArea.textContent = "Wait";

    setReflexAreaClass("waiting");

    const delay = Math.floor(Math.random() * 2000) + 1200;

    reflexTimer = setTimeout(() => {
      reflexState = "ready";
      reflexStartTime = performance.now();

      if (reflexMessage) reflexMessage.textContent = "Click now.";
      if (reflexArea) reflexArea.textContent = "Click";

      setReflexAreaClass("ready");
    }, delay);
  }

  function resetReflexIdle() {
    reflexState = "idle";
    if (reflexArea) reflexArea.textContent = "Ready";
    setReflexAreaClass("neutral");
  }

  if (startReflexButton) {
    startReflexButton.addEventListener("click", startReflexGame);
  }

  if (reflexArea) {
    reflexArea.addEventListener("click", () => {
      if (reflexState === "waiting") {
        clearTimeout(reflexTimer);
        if (reflexMessage) reflexMessage.textContent = "Too early. Press Start to try again.";
        if (reflexResult) reflexResult.textContent = "Too early";
        resetReflexIdle();
        return;
      }

      if (reflexState === "ready") {
        const time = Math.round(performance.now() - reflexStartTime);
        if (reflexMessage) reflexMessage.textContent = "Completed.";
        if (reflexResult) reflexResult.textContent = `${time} ms`;
        resetReflexIdle();
      }
    });
  }
});
