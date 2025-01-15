function findEmpty(board) {

    // Here we find the next empty cell (so a 0)
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == 0) return [i, j];
        }
    }
    return false;
}

function placeable(board, num, row, col) {

    // Checking the horizontal- ,vertical lines and a 3x3 area to see if we can place the number
    const box_row = 3 * Math.floor(row / 3);
    const box_col = 3 * Math.floor(col / 3);

    if (board[row].includes(num)) return false;

    for (let i = 0; i < 9; i++) {
        if (num == board[i][col]) return false;
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[box_row + i][box_col + j] === num) return false;
        }
    }
    // If the number is not in any of these then placeable = True in other words you can place the number there    
    return true;
}

function solve(board) {

    // Here we find the next empty slot and check what we can place there. Then we place it and do it again until it is solved.
    const empty = findEmpty(board);
    if (!empty) return true;
    
    // If we do not find any empty places then we have solved the sudoku :D
    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
        if (placeable(board, num, row, col)) {
            board[row][col] = num;
            if (solve(board)) return true;
            
            board[row][col] = 0;
        } 
    }
    return false;
}

function getSudokuValues() {

    // Here we take the given values from the grid and edit it into the proper format to solve it.
    const inputs = document.querySelectorAll('.sudoku-grid input');
    const values = Array.from(inputs).map(input => input.value || 0);

    let row = [];
    let sudoku = [];

    for(let i = 0; i < values.length; i++){
        row.push(parseInt(values[i]));
        if(row.length == 9){
            sudoku.push(row);
            row = [];
        }
    }
    return sudoku;
}

function isValid(board){

    // Validating the given sudoku board
    for(let i = 0; i < 9; i++) {
        let row_set = new Set();
        let col_set = new Set();
        let box_set = new Set();

        let inva = false;

        for(let k = 0; k < 9; k++) {
            if(board[i][k] != 0) {
                if (row_set.has(board[i][k])) return false;
                row_set.add(board[i][k]);
            }

            if(board[k][i] != 0) {
                if(col_set.has(board[k][i])) return false;
                col_set.add(board[k][i]);
            }

            const box_row = 3 * Math.floor(i / 3) + Math.floor(k / 3);
            const box_col = 3 * (i % 3) + (k % 3);

            if (board[box_row][box_col] != 0) {
                if(box_set.has(board[box_row][box_col])) return false;
                box_set.add(board[box_row][box_col]);
            }
        }
        
    }

    let err = false;
    for(let j = 0; j < 81; j++){
        let check = document.getElementById('input ' + (j + 1));
        if(isNaN(check.value) || check.value < 0 || check.value > 9){
            check.classList.add('error');
            err = true;
        }
    }
    if(err) return false;
    
    return true;
}

// We make the 9x9 grid where you input the sudoku values   
const grid = document.getElementById('sudoku-grid');

for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.id = "input " + (i + 1);
    input.autocomplete = "off";

    input.addEventListener('input', () => {
        if (!isNaN(input.value) && input.value >= 0 && input.value <= 9) {
            input.classList.remove('error');
        }
    });
    grid.appendChild(input);
}

function main() {

    // Here we actually get the solving going by pressing the solve button in the html
    let sudoku = getSudokuValues();
    const result = document.getElementById('result');
    result.innerHTML = "Input a sudoku to solve it!";

    if(!isValid(sudoku)) {
        result.innerHTML = "Invalid input! <br> Double check.";
        return
    }
 
    // The given values will stay black but the solvied values will change to blue.    
    if (solve(sudoku)) { 
        for(let o = 0; o < 81; o++){
            let inp = document.getElementById('input ' + (o + 1));
            if(sudoku[Math.floor(o / 9)][o % 9] != inp.value){
                inp.classList.add('solved');
            }
            inp.value = sudoku[Math.floor(o / 9)][o % 9];
        }
    } else {
        result.innerHTML = "No Solution!";
    }
}

function re() {

    // Refreshing the grid
    const inputs = document.querySelectorAll('.sudoku-grid input');
    const result = document.getElementById('result');

    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('solved', 'error');
    });
    result.innerHTML = "Input a sudoku to solve it!";
}
