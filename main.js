function findEmpty(board) {
  // Here we find the next empty cell (so a 0)
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] == 0) return [row, col];
    }
  }
  return false;
}

function addError(row, col) {
  const cell = document.getElementById("input " + (row * 9 + col + 1));
  cell.classList.add("error");

  return false;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function placeable(board, num, row, col) {
  // Checking the horizontal- ,vertical lines and a 3x3 area to see if we can place the number
  const boxRow = 3 * Math.floor(row / 3);
  const boxCol = 3 * Math.floor(col / 3);

  if (board[row].includes(num)) return false;

  for (let k = 0; k < 9; k++) {
    if (num == board[k][col]) return false;
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] == num) return false;
    }
  }
  return true;
}

function isValid(board) {
  // Validating the given sudoku board
  let valid = true;

  for (let row = 0; row < 9; row++) {
    const rowSet = new Set();
    const colSet = new Set();
    const boxSet = new Set();

    for (let col = 0; col < 9; col++) {
      const currentRow = board[row][col];
      const currentCol = board[col][row];
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(col / 3);
      const boxCol = 3 * (row % 3) + (col % 3);
      const boxVal = board[boxRow][boxCol];
      const cell = document.getElementById("input " + (row * 9 + col + 1));

      // Checks for invalid characters and duplicates
      if (isNaN(cell.value) || cell.value < 0 || cell.value > 9) {
        valid = addError(row, col);
      }

      if (currentRow && rowSet.has(currentRow)) {
        valid = addError(row, col);
      }

      if (currentCol && colSet.has(currentCol)) {
        valid = addError(col, row);
      }

      if (boxVal && boxSet.has(boxVal)) {
        valid = addError(boxRow, boxCol);
      }

      rowSet.add(currentRow);
      colSet.add(currentCol);
      boxSet.add(boxVal);
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
    if (row.length == 9) {
      sudoku.push(row);
      row = [];
    }
  }
  return sudoku;
}

async function solve(board, logicCheck) {
  // Here we find the next empty slot and check what we can place there. Then we place it and do it again until it is solved.
  const empty = findEmpty(board);
  if (!empty) return true;
  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (placeable(board, num, row, col)) {
      board[row][col] = num;

      const cell = document.getElementById("input " + (row * 9 + col + 1));
      cell.value = num;
      cell.classList.add("solved");

      if (await solve(board, logicCheck)) return true;
      board[row][col] = 0;
      cell.value = "";
    }
    if (logicCheck) await delay(1); // A little delay to see the logic otherwise it is too fast to see
  }
  return false;
}

// We make the 9x9 grid where you input the sudoku values
const grid = document.getElementById("sudoku-grid");
let done = true;

for (let i = 0; i < 81; i++) {
  const input = document.createElement("input");
  input.id = "input " + (i + 1);
  input.autocomplete = "off";

  input.addEventListener("input", () => {
    if (!isNaN(input.value) && input.value >= 0 && input.value <= 9) {
      input.classList.remove("error");
    }
  });
  grid.appendChild(input);
}

async function main() {
  // Here we actually get the solving going by pressing the solve button in the html
  const sudoku = getSudokuValues();
  const result = document.getElementById("result");
  const checkbox = document.getElementById("logic");
  const logic = checkbox.checked;

  result.innerHTML = "Solving...";

  if (!isValid(sudoku)) {
    result.innerHTML = "Invalid input! <br> Double check.";
    return;
  }

  done = false;
  if (!(await solve(sudoku, logic))) {
    result.innerHTML = "No Solution!";
  } else {
    result.innerHTML = "Solved.";
  }
  done = true;
}

function re() {
  // Refreshing the grid
  const inputs = document.querySelectorAll(".sudoku-grid input");
  const result = document.getElementById("result");

  if (done) {
    inputs.forEach((input) => {
      input.value = "";
      input.classList.remove("solved", "error");
    });
    result.innerHTML = "Input a sudoku to solve it!";
  } else {
    result.innerHTML = "Please wait until solving is finished!!";
  }
}
