import React, { useEffect, useState } from 'react'
import style from "./Game.module.css"
import {Text, ActionButton, IIconProps, Stack, TooltipHost, ITooltipHostStyles, ITextField} from "office-ui-fabric-react"
import useEventListener from "@use-it/event-listener"
import Board from './Board/Board'
import Success from './Dialog/Success'
import GameEnding from './Dialog/GameEnding';
import LogScore from './Dialog/LogScore'
import { isMoved, deepCopy, addNewNumber, shiftMatrixLeft, shiftMatrixRight, merge2Left, merge2Right, rotateRight, rotateLeft, isGameOver, hasReached2048, passDirectionCheck, IAddNew } from './Logic';



const upIcon: IIconProps = {iconName: "Up"}
const downIcon: IIconProps = {iconName: "Down"}
const leftIcon: IIconProps = {iconName: "Back"}
const rightIcon: IIconProps = {iconName: "Forward"}

interface IState {
    board: number[][],
    newIdx: string[]
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



//   =======================================================================================================
//   =======================================================================================================
//                                  Game Component
//   =======================================================================================================
//   =======================================================================================================

const Game: React.FunctionComponent = () => {
    let initialState: IState = {
        board: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        newIdx: [],
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
            const getRandomSquare1: IAddNew = addNewNumber([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])
            const getRandomSquare2: IAddNew = addNewNumber(getRandomSquare1.board)
            const newBoard = getRandomSquare2.board
            const newIdx:string[] = []
            newIdx.push(getRandomSquare2.index[0]+ "-" + getRandomSquare2.index[1])
            newIdx.push(getRandomSquare1.index[0]+ "-" + getRandomSquare1.index[1])
            setstate(state => ({...initialState, board: newBoard, score: 0, newIdx: newIdx}))
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

        // update the state changes based on the moves: we will first check whether the board has valid moves, 
        // then we will check if the game is over, last if the user has reached 2048 for the first time, we show a success message. 
       
        if (isMoved(state.board, boardCopy)) {
            const getNew = addNewNumber(boardCopy)
            boardCopy = getNew.board
            const idx:string = getNew.index[0] + "-" + getNew.index[1]
            newscore += 2
            if (isGameOver(boardCopy)) {
                setstate(prevState => ({...prevState, board: boardCopy, newIdx: [idx], score: newscore, showFailureDialog: true, move: false}))
            } else {
                if (hasReached2048(boardCopy)) {
                    if (!state.hasReached2048){
                        setstate(prevState => ({...prevState, board: boardCopy, newIdx: [idx], hasReached2048: true, score: newscore, showSuccessDialog: true, move: false}))
                    }
                } else {
                    setstate(prevState => ({...prevState, board: boardCopy, newIdx: [idx], score: newscore , move: false}))
                }
            }
        } else {
            setstate(prevState => ({...prevState, board: boardCopy, showErrorDialog: true, move: false}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.move])


    useEffect(() => {
        console.log("submitting form")
        // need to set newIdx to [], so new square animation won't repeat
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isProcessing])

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
    const handleUp: () => void = () => {setstate(s => ({...s, direction: "up", move: true, newIdx: []}))}
    const handleDown: () => void = () => {setstate(s => ({...s, direction: "down", move: true, newIdx: []}))}
    const handleLeft: () => void = () => {setstate(s => ({...s, direction: "left", move: true, newIdx: []}))}
    const handleRight: () => void = () => {setstate(s => ({...s, direction: "right", move: true, newIdx: []}))}
    // dialog buttons eventhandlers to be passed as props to child components
    const closeSuccessDialog: () => void = () => {setstate(s => ({...s, showSuccessDialog: false, hasReached2048: true, newIdx: []}))}
    const closeFailureDialog: () => void = () => {setstate(s => ({...s, showFailureDialog: false, newIdx: []}))}
    const onStartNewGame: () => void = () => {setstate(s => ({...s, showFailureDialog: false, reset: true, newIdx: []}))}
    const logScore: () => void = () => {setstate(s => ({...s, showScoreDialog: true, newIdx: []}))}
    const closeScoreDialog: () => void = () => { setstate(s => ({...s, showScoreDialog:false, newIdx: []}))}

    const calloutProps = {gapSpace: 0}
    const hostStyles: Partial<ITooltipHostStyles> = {root : { display: "inline-block"}}

    // call api to send user's score
    const passValidation = (input?: string) => {
        return !input ? false
            : input.trim() === "" 
            ? false 
            : input.length < 3
            ? false : true
    }
     const  onHandleSubmitScore = (input?:string) => {
        if (!passValidation(input)) return
        setstate(s => ({...s, isProcessing: true}))
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
          <Board board={state.board} newIdx={state.newIdx}/>
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