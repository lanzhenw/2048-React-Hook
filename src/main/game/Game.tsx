import React, { forwardRef, useEffect, useState } from 'react'
import style from "./Game.module.css"
import {Text, ActionButton, IIconProps, Stack, TooltipHost, ITooltipHostStyles, IRefObject, ITextField} from "office-ui-fabric-react"
import useEventListener from "@use-it/event-listener"
import Board from './Board'
import Success from './Dialog/Success'
import { GameEnding } from './Dialog/GameEnding';
import LogScore from './Dialog/LogScore'



const upIcon: IIconProps = {iconName: "Up"}
const downIcon: IIconProps = {iconName: "Down"}
const leftIcon: IIconProps = {iconName: "Back"}
const rightIcon: IIconProps = {iconName: "Forward"}

interface IState {
    board: number[][],
    move: boolean, // this is used in useEffect to detect a new user direction movement
    direction?: string,
    getNew: boolean,
    score: number,
    showSuccessDialog: boolean,
    hasReached2048: boolean,
    showFailureDialog: boolean, 
    reset: boolean, 
    showScoreDialog: boolean,
    isProcessing: boolean,
}

// ====================================================================
//      Pure Functions that changes the board based on game movement
// ====================================================================
export const isMoved:(oldboard: number[][], newboard: number[][]) => boolean = (oldboard: number[][], newboard:number[][]) => {
    if (JSON.stringify(oldboard) === JSON.stringify(newboard)) {
      return false
    } else {
      return true
    }
  }

const deepCopy: (arg0: any) => any = (x) => {
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
  
const getRandomNumber: (arr: number[][]) => number[] = (arr: number[][]) => {
    // it returns a random index in the array
    let r = Math.floor(Math.random() * arr.length)
    return arr[r]
  }
  
const addNewNumber: (board:number[][]) => number[][]= (board:number[][]) => {
    const newboard:number[][] = deepCopy(board)
    const emptyCordinates = getBlankCordinates(board)
    const cor: number[] = getRandomNumber(emptyCordinates)
    newboard[cor[0]][cor[1]] = 2
    return newboard
  }
  
const shiftRowLeft: (row: number[])=>number[] = (row) => {
    let arr = row.filter(val => val)
    let missing = row.length - arr.length
    let zeros = Array(missing).fill(0)
    arr = arr.concat(zeros)
    return arr
  }
  
const shiftMatrixLeft: (board: number[][]) => number[][] = (board) => {
    const newboard = []
    for (let col = 0; col < board.length; col++) {
      let row = board[col]
      let newrow = shiftRowLeft(row)
      newboard.push(newrow)
    }
    return newboard
  }
  
const shiftRowRight: (row: number[]) => number[] = (row) => {
    let arr = row.filter(val => val)
    let missing = row.length - arr.length
    let zeros = Array(missing).fill(0)
    arr = zeros.concat(arr)
    return arr
  }
  
const shiftMatrixRight: (board: number[][]) => number[][] = (board) => {
    let newboard = []   
  
    for (let col = 0; col < board.length; col++) {
      let row = board[col]
      let newrow = shiftRowRight(row)
      newboard.push(newrow)
    }
   
    return newboard
  }
  
const merge2Right: (board: number[][], score: number) => {board: number[][], score: number} = (board, score) => {
    for (let col = 0; col < board.length; col++) {
      for (let row = board[col].length - 1; row > 0; row--) {
        if (board[col][row] > 0 && board[col][row] === board[col][row - 1]) {
          board[col][row] = 2 * board[col][row]
         
          score = score + board[col][row]
          console.log("+ ", board[col][row])
          
          board[col][row - 1] = 0
          board[col] = shiftRowRight(board[col])
        }
      }
    }
  
    return { board, score }
  }
  
const merge2Left: (board: number[][], score: number) => {board: number[][], score: number}  = (board, score) => {
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
  
const rotateRight: (board: number[][]) => number[][] = (board) => {
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
  
const rotateLeft: (board: number[][]) => number[][] = (board) => {
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
  
  export const isGameOver: (board:number[][]) => boolean = (board) => {
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

//   =======================================================================================================
//   =======================================================================================================
//                                  Game Component
//   =======================================================================================================
//   =======================================================================================================

const Game: React.FunctionComponent = () => {
    let initialState: IState = {
        board: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        direction: undefined,
        move: false,
        getNew: false,
        showSuccessDialog: false,
        hasReached2048: false,
        showFailureDialog: false,
        score: 0, 
        reset: false,
        showScoreDialog: false,
        isProcessing:false,
    }
    const [state, setstate] = useState(initialState)
    const nameRef: React.RefObject<ITextField> = React.createRef()
    useEffect(() => {
        setstate(state => ({...initialState, reset: true}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // when user press "play a new game", reset the game and refresh the board
    useEffect(() => {
        if (state.reset) {
            let randomNewBoard: number[][] = addNewNumber(addNewNumber([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]))
            setstate(state => ({...initialState, board: randomNewBoard, score: 0}))
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.reset])

    useEffect(() => {
        let boardCopy:number[][] = deepCopy(state.board)
        let newscore:number = state.score
        if (!state.move) return
        if (!passDirectionCheck(state.direction)) return 
        switch(state.direction) {
            case "right": 
                boardCopy = shiftMatrixRight(boardCopy)
                boardCopy = merge2Right(boardCopy, state.score).board
                newscore = merge2Right(boardCopy, state.score).score
                break;
            case "left":
                boardCopy = shiftMatrixLeft(boardCopy)
                boardCopy = merge2Left(boardCopy, state.score).board
                newscore = merge2Left(boardCopy, state.score).score
                break;
            case "up":
                boardCopy = rotateRight(boardCopy)
                boardCopy = shiftMatrixRight(boardCopy)
                boardCopy = merge2Right(boardCopy, state.score).board
                newscore = merge2Right(boardCopy, state.score).score
                boardCopy = rotateLeft(boardCopy)
                break;
            case "down":
                boardCopy = rotateRight(boardCopy)
                boardCopy = shiftMatrixLeft(boardCopy)
                boardCopy = merge2Left(boardCopy, state.score).board
                newscore = merge2Left(boardCopy, state.score).score
                boardCopy = rotateLeft(boardCopy)
                break;
        }

        // update the state changes based on the moves: 
        // we will first check whether the board has valid moves, 
        // then we will check if the game is over, 
        // last if the user has reached 2048 for the first time, we show a success message. 
        
        if (isMoved(state.board, boardCopy)) {
            boardCopy = addNewNumber(boardCopy)
            newscore += 2
         
            if (isGameOver(boardCopy)) {
                setstate(prevState => ({...prevState, board: boardCopy, score: newscore , showFailureDialog: true, move: false}))
            } else {
                if (hasReached2048(boardCopy)) {
                    if (!state.hasReached2048){
                        setstate(prevState => ({...prevState, board: boardCopy, hasReached2048: true, score: newscore, showSuccessDialog: true, move: false}))
                    }
                } else {
                    setstate(prevState => ({...prevState, board: boardCopy, score: newscore , move: false}))
                }
            }
        } else {
            setstate(prevState => ({...prevState, board: boardCopy, showErrorDialog: true, move: false}))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.move])

    // keyboard event handler
    const keyboardHandler = (ev:KeyboardEvent) => {
        switch(ev.code) {
            case "ArrowUp": 
                handleUp()
                break;
            case "ArrowDown":
                handleDown()
                break;
            case "ArrowLeft":
                handleLeft()
                break;
            case "ArrowRight":
                handleRight()
                break;
        }
    }

    useEventListener("keydown", keyboardHandler)
    
    // button event handler that mutate the state
    const start:() => void = () => { setstate(state => ({...state, reset: true}))}
    const handleUp: () => void = () => {setstate(s => ({...s, direction: "up", move: true}))}
    const handleDown: () => void = () => {setstate(s => ({...s, direction: "down", move: true}))}
    const handleLeft: () => void = () => {setstate(s => ({...s, direction: "left", move: true}))}
    const handleRight: () => void = () => {setstate(s => ({...s, direction: "right", move: true}))}
    // dialog buttons eventhandlers to be passed as props to child components
    const closeSuccessDialog: () => void = () => {setstate(s => ({...s, showSuccessDialog: false, hasReached2048: true}))}
    const closeFailureDialog: () => void = () => {setstate(s => ({...s, showFailureDialog: false}))}
    const onStartNewGame: () => void = () => {setstate(s => ({...s, showFailureDialog: false, reset: true}))}
    const logScore: () => void = () => {setstate(s => ({...s, showScoreDialog: true}))}
    const closeScoreDialog: () => void = () => { setstate(s => ({...s, showScoreDialog:false}))}

    const calloutProps = {gapSpace: 0}
    const hostStyles: Partial<ITooltipHostStyles> = {root : { display: "inline-block"}}

    // call api
    const passValidation = (input?: string) => {
        return !input ? false
            : input.trim() === "" 
            ? false 
            : input.length < 3
            ? false : true
    }
     const  onHandleSubmitScore =  async (input?:string) => {
        if (!passValidation(input)) return
        setstate(s => ({...s, isProcessing: true}))
        // call api, change isProcessing
        // in response 
    }

  return (
      <div className={style.container}>
          <Stack tokens={{childrenGap: 10}} horizontal horizontalAlign="space-between">
            <Text variant="xxLarge" className={style.gameTitle}> 2048</Text>

            <Text variant="xxLarge"  className={style.gameTitle}> Score: {state.score}</Text>
          </Stack>
          <Stack tokens={{childrenGap: 10}} horizontal horizontalAlign="center">
            <ActionButton iconProps={{iconName:"Play"}} title="start-new-game" onClick={() => start()}>
                  New Game
              </ActionButton>
              <ActionButton iconProps={upIcon} title="move up" ariaLabel="up" onClick={() => handleUp()}/>
              <ActionButton iconProps={downIcon} title="move down" ariaLabel="down" onClick={() => handleDown()}/>
              <ActionButton iconProps={leftIcon} title="move left" ariaLabel="left" onClick={() => handleLeft()}/>
              <ActionButton iconProps={rightIcon} title="move right" ariaLabel="right" onClick={() => handleRight()}/>
          </Stack>
          <Board board={state.board}/>
          <TooltipHost 
            content="This is a math game. You can press up, down, left, right keys or use the buttons to control the direction movement. After each move, adjacent tiles will merge along the moving direction. Can you reach 2048?"
            calloutProps={calloutProps}
            styles={hostStyles}
            closeDelay={500}
            className={style.instruction}
            >
                <Text variant="xLarge" className={style.instruction}>How to play?</Text>
          </TooltipHost>
          <Success 
            showDialog={state.showSuccessDialog} 
            closeDialog={closeSuccessDialog}
            logScore={logScore}/>
          <GameEnding 
            hideDialog={!state.showFailureDialog}
            closeDialog={closeFailureDialog}
            logScore={logScore} 
            onRefresh={onStartNewGame}
            hasWon={state.hasReached2048}/>
          <LogScore
            hideDialog={!state.showScoreDialog}
            isProcessing={state.isProcessing}
            closeDialog={closeScoreDialog}
            onSubmit={onHandleSubmitScore}
            score={state.score} 
            forwardRef={nameRef}/>
      </div>
  )
}

export default Game