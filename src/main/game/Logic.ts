
// ====================================================================
//      Pure Functions that changes the board based on user's movement
// ====================================================================
export const isMoved:(oldboard: number[][], newboard: number[][]) => boolean = (oldboard: number[][], newboard:number[][]) => {
    if (JSON.stringify(oldboard) === JSON.stringify(newboard)) {
      return false
    } else {
      return true
    }
  }

export const deepCopy: (arg0: any) => any = (x) => {
    return JSON.parse(JSON.stringify(x))
}
  
export const getBlankCordinates:(board: number[][]) => number[][] | [] = (board:number[][]) => {
    // this takes in this.state.board, returns an array of blank coordinates
    const blankCoordinates = []
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) { blankCoordinates.push([row, col]) }
      }
    }
    return blankCoordinates
  }
  
  export const getRandomNumber: (arr: number[][]) => number[] = (arr: number[][]) => {
    // it returns a random index in the array
    let r = Math.floor(Math.random() * arr.length)
    return arr[r]
  }
  
  export interface IAddNew {
    board: number[][],
    index: [number, number]
  }
  export const addNewNumber: (board:number[][]) => IAddNew= (board:number[][]) => {
    const newboard:number[][] = deepCopy(board)
    const emptyCordinates = getBlankCordinates(board)
    const cor: number[] = getRandomNumber(emptyCordinates)
    newboard[cor[0]][cor[1]] = 2
    return {board: newboard, index: [cor[0], cor[1]]}
  }
  
  export const shiftRowLeft: (row: number[])=>number[] = (row) => {
    let arr = row.filter(val => val)
    let missing = row.length - arr.length
    let zeros = Array(missing).fill(0)
    arr = arr.concat(zeros)
    return arr
  }
  
  export const shiftMatrixLeft: (board: number[][]) => number[][] = (board) => {
    const newboard = []
    for (let col = 0; col < board.length; col++) {
      let row = board[col]
      let newrow = shiftRowLeft(row)
      newboard.push(newrow)
    }
    return newboard
  }
  
  export const shiftRowRight: (row: number[]) => number[] = (row) => {
    let arr = row.filter(val => val)
    let missing = row.length - arr.length
    let zeros = Array(missing).fill(0)
    arr = zeros.concat(arr)
    return arr
  }
  
  export const shiftMatrixRight: (board: number[][]) => number[][] = (board) => {
    let newboard = []   
  
    for (let col = 0; col < board.length; col++) {
      let row = board[col]
      let newrow = shiftRowRight(row)
      newboard.push(newrow)
    }
   
    return newboard
  }
  
  export const merge2Right: (board: number[][], score: number) => {board: number[][], score: number} = (board, score) => {
    for (let col = 0; col < board.length; col++) {
      for (let row = board[col].length - 1; row > 0; row--) {
        if (board[col][row] > 0 && board[col][row] === board[col][row - 1]) {
          board[col][row] = 2 * board[col][row]
         
          score = score + board[col][row]
          // console.log("+ ", board[col][row])
          
          board[col][row - 1] = 0
          board[col] = shiftRowRight(board[col])
        }
      }
    }
  
    return { board, score }
  }
  
  export const merge2Left: (board: number[][], score: number) => {board: number[][], score: number}  = (board, score) => {
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[col].length; row++) {
        if (board[col][row] > 0 && board[col][row] === board[col][row + 1]) {
          board[col][row] = 2 * board[col][row]
          score = score + board[col][row]
          console.log("+ ", board[col][row])
          board[col][row + 1] = 0
          board[col] = shiftRowLeft(board[col])
        }
      }
    }
  
    return { board, score }
  }
  
  export const rotateRight: (board: number[][]) => number[][] = (board) => {
    // transpose
    let newboard = []
    for (let col = 0; col < board.length; col++) {
      const newRow = []
      // swap rows
      for (let row = board[col].length - 1; row >= 0; row--) {
        newRow.push(board[row][col])
      }
      newboard.push(newRow)
    }
    return newboard
  }
  
  export const rotateLeft: (board: number[][]) => number[][] = (board) => {
    // transpose and swap columns
    let newboard = []
    for (let col = board.length - 1; col >= 0; col--) {
      const newRow = []
      for (let row = board[col].length - 1; row >= 0; row--) {
        newRow.unshift(board[row][col])
      }
      newboard.push(newRow)
    }
    return newboard
  }
  
  export  const isGameOver: (board:number[][]) => boolean = (board) => {
    if (getBlankCordinates(board).length !== 0) return false 
        else if (canMakeNewMove(board)) {
            return false
        } else {
            return true
        }

  }

  export const canMakeNewMove: (board: number[][]) => boolean = (board) => {
      let newboard1 = merge2Right(board, 0).board
      let newboard2 = merge2Left(board, 0).board
      let newboard3 = rotateLeft(merge2Right(rotateRight(board), 0).board)
      let newboard4 = rotateRight(merge2Left(rotateLeft(board), 0).board)
    
      if (isMoved(board, newboard1) || isMoved(board, newboard2) 
      || isMoved(board, newboard3) || isMoved(board, newboard4))
        return true
        return false
  }

  export const hasReached2048: (board: number[][]) => boolean = (board) => {
    board.forEach(row => {
        row.forEach(cell => {
            if (cell >= 2048) {
                return true
            }
        })
    })  
    return false
  }

  export const passDirectionCheck: (direction: string | undefined) => boolean = (direction) => {
      if (direction === "left" || direction === "right" || direction === "up" || direction === "down") {
          return true
      } else return false
  }