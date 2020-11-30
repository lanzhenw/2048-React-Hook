import React from 'react'
import style from "./Board.module.css"

interface IProp {
    board: number[][],
    newIdx: string[]
}
const Board:React.FunctionComponent<IProp> = ({board, newIdx}) => {
  
    return (
        <div className={style.gameBoard}>
        {board.map((row, i) => (
          <div key={i} className={style.row}>
            {row.map((col, j) => {
        
              return (
                newIdx.includes(i+"-"+j) 
                        ? (<span key={j} className={[style['block-value-' + board[i][j]], style.new].join(" ")}
                        data-testid={i + "-" + j}>{board[i][j]}</span>) 
                        :  (<span key={j} className={style['block-value-' + board[i][j]]}
                      data-testid={i + "-" + j}>{board[i][j]}</span>)
               
              )
              
            })}
          </div>
        ))}
      </div>
    )
}

export default Board
