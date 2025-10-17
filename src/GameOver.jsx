import React from 'react'

function GameOver(props) {
  return (
    <div
      id='GameBoard'
      style={{
        width: props.width,
        height: props.height,
        borderWidth: props.width / 50,
      }}>
      <div id='GameOver' style={{ fontSize: props.width / 15 }}>
        <div id='GameOverText'>GAME OVER</div>
        <div>Score 1: {props.score[0]}</div>
        <div>Score 2: {props.score[1]}</div>
        <div>
          {props.newHighScore ? 'New local ' : 'Local '}high score:{' '}
          {props.highScore}
        </div>
        <div id='PressSpaceText'>Press Space to restart</div>
      </div>
    </div>
  )
}


export default GameOver
