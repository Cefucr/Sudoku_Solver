// We make the 9x9 grid where you input the sudoku values
const grid = document.getElementById("sudoku-grid");
const gridSize = 9;
let done = true;

for (let i = 0; i < gridSize * gridSize; i++) {
  const input = document.createElement("input");
  input.id = "input " + (i + 1);
  input.autocomplete = "off";

  input.addEventListener("input", () => {
    if (!isNaN(input.value) && input.value >= 0 && input.value <= gridSize) {
      input.classList.remove("error");
    }
  });
  grid.appendChild(input);
}

function updateDOM(row, col, className, value) {
  const cell = document.getElementById("input " + (row * gridSize + col + 1));
  if (value !== null) cell.value = value;
  if (className) {
    cell.classList.add(className);
  } else {
    cell.classList.remove("error", "solved");
  }
}

function displayMessage(messageElementId, message) {
  const messageElement = document.getElementById(messageElementId);
  messageElement.innerHTML = message;
}

function findEmptySlot(board) {
  // Find the next empty slot in the sudoku board so we can place a number there
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, value] of row.entries()) {
      if (value === 0) return [rowIndex, colIndex];
    }
  }
  return false;
}

function addError(row, col) {
  updateDOM(row, col, "error", null);
  return false;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPlaceable(board, num, row, col) {
  const boxRow = 3 * Math.floor(row / 3);
  const boxCol = 3 * Math.floor(col / 3);

  // Checking if the numbers exits in the row
  if (board[row].includes(num)) return false;

  // Checking if the numbers exits in the column
  const colValues = board.map((row) => row[col]);
  for (const cell of colValues) {
    if (num === cell) return false;
  }
  // Checking the 3x3 area to see if the number is already exists
  for (let boxRowIndex = 0; boxRowIndex < 3; boxRowIndex++) {
    for (let boxColIndex = 0; boxColIndex < 3; boxColIndex++) {
      if (board[boxRow + boxRowIndex][boxCol + boxColIndex] == num)
        return false;
    }
  }
  return true;
}

function isValid(board) {
  let valid = true;

  for (let row = 0; row < gridSize; row++) {
    const rowSet = new Set();
    const colSet = new Set();
    const boxSet = new Set();

    for (let col = 0; col < gridSize; col++) {
      const currentRowVal = board[row][col];
      const currentColVal = board[col][row];
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(col / 3);
      const boxCol = 3 * (row % 3) + (col % 3);
      const boxVal = board[boxRow][boxCol];

      const cellCheck = (value, set, row, col) => {
        if (isNaN(value) || value < 0 || value > 9) {
          valid = addError(row, col);
        } else if (value && set.has(value)) {
          valid = addError(row, col);
        } else {
          set.add(value);
        }
      };
      // Checking the row, column and 3x3 area for duplicates
      cellCheck(currentRowVal, rowSet, row, col);
      cellCheck(currentColVal, colSet, col, row);
      cellCheck(boxVal, boxSet, boxRow, boxCol);
    }
  }
  return valid;
}

function getSudokuValues() {
  // Here we take the given values from the grid and edit it into the proper format to solve it.
  const inputs = document.querySelectorAll(".sudoku-grid input");
  const values = Array.from(inputs).map((input) => input.value || 0);
  const sudoku = [];
  let row = [];

  for (let i = 0; i < values.length; i++) {
    row.push(parseInt(values[i]));
    if (row.length === gridSize) {
      sudoku.push(row);
      row = [];
    }
  }
  return sudoku;
}

async function solve(board, solveSpeed) {
  // Here we find the next empty slot and check what we can place there.
  const empty = findEmptySlot(board);
  if (!empty) return true;
  const [row, col] = empty;

  for (let placeableNum = 1; placeableNum <= 9; placeableNum++) {
    if (isPlaceable(board, placeableNum, row, col)) {
      board[row][col] = placeableNum;

      // Here we place the number in the sudoku grid
      updateDOM(row, col, "solved", placeableNum);

      if (await solve(board, solveSpeed)) return true;
      board[row][col] = 0;
      updateDOM(row, col, null, "");
    }
    if (solveSpeed > 0) await delay(solveSpeed); // User can choose how fast the sudoku is solved
  }
  return false;
}

async function generator() {
  //In order to make the sudoku more unique we first place random numbers
  if (!done) {
    displayMessage("result", "Please wait until solving is finished!!");
    return;
  }
  displayMessage(
    "result",
    "Input a sudoku to solve it or generate one and solve it yourself!"
  );
  const difficulty = document.querySelector("#difficulty");
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let board = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  while (nums.length > 0) {
    const randRow = Math.floor(Math.random() * gridSize);
    const randCol = Math.floor(Math.random() * gridSize);
    const randNum = Math.floor(Math.random() * nums.length);

    board[randRow][randCol] = nums[randNum];
    nums.splice(randNum, 1);
  }
  //Just in case for some reason the board is invalid throw an error
  try {
    await solve(board, 0); //Here we solve the sudoku
  } catch (error) {
    console.error("Failed to solve the Sudoku board:", error);
    return;
  }
  // Removing some values because the higher the difficulty the more values we delete
  for (let i = 0; i < gridSize * gridSize - difficulty.value; i++) {
    let randRow = Math.floor(Math.random() * gridSize);
    let randCol = Math.floor(Math.random() * gridSize);
    while (board[randRow][randCol] === "") {
      randRow = Math.floor(Math.random() * gridSize);
      randCol = Math.floor(Math.random() * gridSize);
    }
    board[randRow][randCol] = "";
  }
  board = board.reverse(); //We reverse the board to make it seem more unique

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      updateDOM(row, col, null, board[row][col]);
    }
  }
}

async function solveBtn() {
  // Here we actually get the solving going by pressing the solve button in the html
  const sudoku = getSudokuValues();
  const slider = document.getElementById("speed");
  const speed = slider.value;

  displayMessage("result", "Solving...");

  if (!isValid(sudoku)) {
    displayMessage("result", "Invalid input! <br> Double check.");
    return;
  }

  done = false;
  if (!(await solve(sudoku, speed))) {
    displayMessage("result", "No Solution!");
  } else {
    displayMessage("result", "Solved.");
  }
  done = true;
}

function refreshBtn() {
  // Refreshing the grid
  const inputs = document.querySelectorAll(".sudoku-grid input");

  if (done) {
    inputs.forEach((input) => {
      input.value = "";
      input.classList.remove("solved", "error");
    });
    displayMessage(
      "result",
      "Input a sudoku to solve it or generate one and solve it yourself!"
    );
  } else {
    displayMessage("result", "Please wait until solving is finished!!");
  }
}
