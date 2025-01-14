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

    // We show the result in the html site if theres no solution we print that. 
    // The given values will stay black but the solvied values will change to blue.    
    if (solve(sudoku)) {
        let inva = false;

        //Checking if the user gave an invalid input
        for(let k = 0; k < 81; k++){
            let check = document.getElementById('input ' + (k + 1));
            if(isNaN(check.value) || check.value < 0 || check.value > 9){
                inva = true;
                check.classList.add('error');
            }
        }

        if(inva){
            result.innerHTML = "Invalid input!";
        }else{
            for(let o = 0; o < 81; o++){
                let inp = document.getElementById('input ' + (o + 1));
                if(sudoku[Math.floor(o / 9)][o % 9] != inp.value){
                    inp.classList.add('solved');
                }
                inp.value = sudoku[Math.floor(o / 9)][o % 9];
            }
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
