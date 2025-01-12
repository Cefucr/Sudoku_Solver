#RULES OF SUDOKU

#You can use only numbers from 1 to 9.
#Each 3×3 block can only contain numbers from 1 to 9.
#Each vertical column can only contain numbers from 1 to 9.
#Each horizontal row can only contain numbers from 1 to 9.
#Each number in the 3×3 block, vertical column or horizontal row can be used only once.

def findEmpty(board):
    # Here we find the next empty cell (so a 0)
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                return i, j
    return None

def placeable(board, num, row, col):
    # Here we check a 3x3 area to see if we can place the number
    box_row = 3 * (row // 3)
    box_col = 3 * (col // 3)

    if num in board[row]:
        return False
    
    for i in range(9):
        if num == board[i][col]:
            return False

    for r in range(box_row, box_row + 3):
        for c in range(box_col, box_col + 3):
          if num == board[r][c]:
              return False
    # If the number is not in any of these then placeable = True in other words you can place the number there    
    return True

def solve(board):
    # Here we find the next empty slot and check what we can place there. Then we place it and d it again until it is solved.
    empty = findEmpty(board)
    if not empty:
        return True
    # If we do not find any empty places then we have solved the sudoku :D

    row, col = empty
    for num in range(1, 10):
        
        if placeable(board, num, row, col):
            board[row][col] = num
            if solve(board):
                return True
            board[row][col] = 0

    return False

# Provide a sudoku board to solve 0 represents an empty space.
sudoku = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,0,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
]

if solve(sudoku):
    print("Solved:")
    for row in sudoku:
        print(row)
else:
    print("No solution.")
