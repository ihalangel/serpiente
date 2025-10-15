import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import Snake from './game/Snake.jsx' // Módulo con la lógica de la serpiente
import SnakeBody from './game/SnakeBody.jsx' // Nuevo componente visual para la serpiente

class SnakeGame extends React.Component {
  constructor(props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)

    this.state = {
      width: 0,
      height: 0,
      blockWidth: 0,
      blockHeight: 0,
      gameLoopTimeout: 50,
      timeoutId: 0,
      startSnakeSize: this.props.startSnakeSize || 6,
      snakes: [], // Array de instancias Snake
      apple: {},
      directionChanged: false,
      isGameOver: false,
      snakeColor: this.props.snakeColor || this.getRandomColor(),
      appleColor: this.props.appleColor || this.getRandomColor(),
      score: 0,
      highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
      newHighScore: false,
    }
  }

  componentDidMount() {
    this.initGame()
    window.addEventListener('keydown', this.handleKeyDown)
    this.gameLoop()
  }

  initGame() {
    let percentageWidth = this.props.percentageWidth || 40
    let width =
      document.getElementById('GameBoard').parentElement.offsetWidth *
      (percentageWidth / 100)
    width -= width % 30
    if (width < 30) width = 30
    let height = (width / 3) * 2
    let blockWidth = width / 30
    let blockHeight = height / 20

    let snake = new Snake(
      width / 2,
      height / 2,
      this.state.startSnakeSize,
      blockWidth,
      blockHeight,
      this.state.snakeColor
    )

    let appleXpos =
      Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    let appleYpos =
      Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight
    while (snake.occupiesPosition(appleXpos, appleYpos)) {
      appleYpos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    this.setState({
      width,
      height,
      blockWidth,
      blockHeight,
      snakes: [snake],
      apple: { Xpos: appleXpos, Ypos: appleYpos },
      isGameOver: false,
      score: 0,
      newHighScore: false,
      gameLoopTimeout: 50,
    })
  }

  gameLoop() {
    let timeoutId = setTimeout(() => {
      if (!this.state.isGameOver) {
        let snakes = this.state.snakes.map((snake) => {
          snake.move(this.state.width, this.state.height)
          if (snake.isSelfCollision()) {
            this.setState({ isGameOver: true })
          }
          return snake
        })

        let snakeHead = snakes[0].segments[0]
        let apple = this.state.apple
        if (snakeHead.Xpos === apple.Xpos && snakeHead.Ypos === apple.Ypos) {
          snakes[0].grow()

          let newAppleX =
            Math.floor(Math.random() * ((this.state.width - this.state.blockWidth) / this.state.blockWidth + 1)) *
            this.state.blockWidth
          let newAppleY =
            Math.floor(Math.random() * ((this.state.height - this.state.blockHeight) / this.state.blockHeight + 1)) *
            this.state.blockHeight
          while (snakes[0].occupiesPosition(newAppleX, newAppleY)) {
            newAppleX =
              Math.floor(Math.random() * ((this.state.width - this.state.blockWidth) / this.state.blockWidth + 1)) *
              this.state.blockWidth
            newAppleY =
              Math.floor(Math.random() * ((this.state.height - this.state.blockHeight) / this.state.blockHeight + 1)) *
              this.state.blockHeight
          }
          apple = { Xpos: newAppleX, Ypos: newAppleY }

          let score = this.state.score + 1
          let highScore = this.state.highScore
          let newHighScore = this.state.newHighScore
          let gameLoopTimeout = this.state.gameLoopTimeout
          if (score > highScore) {
            highScore = score
            localStorage.setItem('snakeHighScore', highScore)
            newHighScore = true
          }
          if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5

          this.setState({
            score,
            highScore,
            newHighScore,
            gameLoopTimeout,
          })
        }

        this.setState({
          snakes,
          apple,
          directionChanged: false,
        })
      }
      this.gameLoop()
    }, this.state.gameLoopTimeout)

    this.setState({ timeoutId })
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  resetGame() {
    this.initGame()
  }

  getRandomColor() {
    let hexa = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) color += hexa[Math.floor(Math.random() * 16)]
    return color
  }

  handleKeyDown(event) {
    if (this.state.isGameOver && event.keyCode === 32) {
      this.resetGame()
      return
    }
    if (this.state.directionChanged) return

    let snake = this.state.snakes[0]
    switch (event.keyCode) {
      case 37:
      case 65:
        snake.changeDirection('left')
        break
      case 38:
      case 87:
        snake.changeDirection('up')
        break
      case 39:
      case 68:
        snake.changeDirection('right')
        break
      case 40:
      case 83:
        snake.changeDirection('down')
        break
      default:
        break
    }

    this.setState({ directionChanged: true, snakes: [snake] })
  }

  render() {
    if (this.state.isGameOver) {
      return (
        <GameOver
          width={this.state.width}
          height={this.state.height}
          highScore={this.state.highScore}
          newHighScore={this.state.newHighScore}
          score={this.state.score}
        />
      )
    }

    return (
      <div
        id='GameBoard'
        style={{
          width: this.state.width,
          height: this.state.height,
          borderWidth: this.state.width / 50,
          position: 'relative',
        }}>
        {this.state.snakes.map((snake, idx) => (
          <SnakeBody
            key={idx}
            segments={snake.segments}
            blockWidth={this.state.blockWidth}
            blockHeight={this.state.blockHeight}
            color={snake.color}
          />
        ))}
        <div
          className='Block'
          style={{
            width: this.state.blockWidth,
            height: this.state.blockHeight,
            left: this.state.apple.Xpos,
            top: this.state.apple.Ypos,
            background: this.state.appleColor,
            position: 'absolute',
          }}
        />
        <div id='Score' style={{ fontSize: this.state.width / 20 }}>
          HIGH-SCORE: {this.state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE:{' '}
          {this.state.score}
        </div>
      </div>
    )
  }
}

export default SnakeGame
