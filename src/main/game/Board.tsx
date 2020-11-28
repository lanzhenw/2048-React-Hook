import React from 'react'
import style from "./Board.module.css"

interface IProp {
    board: number[][]
}
const Board:React.FunctionComponent<IProp> = (props) => {
    let board = props.board
    return (
        <div className={style.gameBoard}>
        {board.map((row, i) => (
          <div key={i} className={style.row}>
            {row.map((col, j) => (
              <span key={j} className={style['block-value-' + board[i][j]]}>{board[i][j]}</span>
            ))}
          </div>
        ))}
      </div>
    )
}

export default Board
