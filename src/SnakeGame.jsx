import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import Snake from './game/Snake.jsx'
import SnakeBody from './game/SnakeBody.jsx'
import Apple from './game/Apple.jsx'

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
      snakes: [], // Ahora guardamos dos serpientes
      apple: {},
      directionChanged: false,
      isGameOver: false,
      snakeColors: [this.props.snakeColor || this.getRandomColor(), this.getRandomColor()],
      appleColor: this.props.appleColor || this.getRandomColor(),
      score: [0, 0], // Puntajes independientes para cada serpiente
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

    // Creación de dos instancias Snake con posiciones y colores distintos
    let snake1 = new Snake(
      width / 3,
      height / 2,
      this.state.startSnakeSize,
      blockWidth,
      blockHeight,
      this.state.snakeColors[0]
    )
    let snake2 = new Snake(
      (width / 3) * 2,
      height / 2,
      this.state.startSnakeSize,
      blockWidth,
      blockHeight,
      this.state.snakeColors[1]
    )

    // Generar posición inicial aleatoria de apple que no esté sobre ninguna serpiente
    let appleXpos =
      Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    let appleYpos =
      Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight
    while (snake1.occupiesPosition(appleXpos, appleYpos) || snake2.occupiesPosition(appleXpos, appleYpos)) {
      appleYpos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    this.setState({
      width,
      height,
      blockWidth,
      blockHeight,
      snakes: [snake1, snake2],
      apple: { Xpos: appleXpos, Ypos: appleYpos },
      isGameOver: false,
      score: [0, 0],
      newHighScore: false,
      gameLoopTimeout: 50,
    })
  }

  gameLoop() {
    let timeoutId = setTimeout(() => {
      if (!this.state.isGameOver) {
        let snakes = this.state.snakes.map((snake, index) => {
          snake.move(this.state.width, this.state.height)
          if (snake.isSelfCollision()) {
            this.setState({ isGameOver: true })
          }
          return snake
        })

        let apple = this.state.apple
        // Revisar colisión de manzana con cada serpiente y actualizar puntaje
        snakes.forEach((snake, idx) => {
          let head = snake.segments[0]
          if (head.Xpos === apple.Xpos && head.Ypos === apple.Ypos) {
            snake.grow()
            let newAppleX =
              Math.floor(Math.random() * ((this.state.width - this.state.blockWidth) / this.state.blockWidth + 1)) *
              this.state.blockWidth
            let newAppleY =
              Math.floor(Math.random() * ((this.state.height - this.state.blockHeight) / this.state.blockHeight + 1)) *
              this.state.blockHeight
            while (snakes.some(s => s.occupiesPosition(newAppleX, newAppleY))) {
              newAppleX =
                Math.floor(Math.random() * ((this.state.width - this.state.blockWidth) / this.state.blockWidth + 1)) *
                this.state.blockWidth
              newAppleY =
                Math.floor(Math.random() * ((this.state.height - this.state.blockHeight) / this.state.blockHeight + 1)) *
                this.state.blockHeight
            }
            apple = { Xpos: newAppleX, Ypos: newAppleY }

            // Actualizar puntaje de la serpiente que comió
            let newScores = [...this.state.score]
            newScores[idx] += 1

            let highScore = this.state.highScore
            let newHighScore = this.state.newHighScore
            let gameLoopTimeout = this.state.gameLoopTimeout
            if (newScores[idx] > highScore) {
              highScore = newScores[idx]
              localStorage.setItem('snakeHighScore', highScore)
              newHighScore = true
            }
            if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5

            this.setState({
              score: newScores,
              highScore,
              newHighScore,
              gameLoopTimeout,
            })
          }
        })

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

    // Control para la serpiente 1 (flechas)
    let snake1 = this.state.snakes[0]
    // Control para la serpiente 2 (WASD)
    let snake2 = this.state.snakes[1]

    switch (event.keyCode) {
      // Serpiente 1
      case 37: // left arrow
        snake1.changeDirection('left')
        break
      case 38: // up arrow
        snake1.changeDirection('up')
        break
      case 39: // right arrow
        snake1.changeDirection('right')
        break
      case 40: // down arrow
        snake1.changeDirection('down')
        break

      // Serpiente 2
      case 65: // A
        snake2.changeDirection('left')
        break
      case 87: // W
        snake2.changeDirection('up')
        break
      case 68: // D
        snake2.changeDirection('right')
        break
      case 83: // S
        snake2.changeDirection('down')
        break

      default:
        return
    }

    this.setState({
      directionChanged: true,
      snakes: [snake1, snake2],
    })
  }

  render() {
    if (!this.state) return null

    if (this.state.isGameOver) {
      return (
        <GameOver
          width={this.state.width}
          height={this.state.height}
          highScore={this.state.highScore}
          newHighScore={this.state.newHighScore}
          score={this.state.score.reduce((a, b) => a + b, 0)}
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

        <Apple
          Xpos={this.state.apple.Xpos}
          Ypos={this.state.apple.Ypos}
          blockWidth={this.state.blockWidth}
          blockHeight={this.state.blockHeight}
          color={this.state.appleColor}
        />

        <div id='Score' style={{ fontSize: this.state.width / 20 }}>
          HIGH-SCORE: {this.state.highScore} &ensp;&ensp;&ensp;&ensp; SCORE: {this.state.score.reduce((a, b) => a + b, 0)}
        </div>
      </div>
    )
  }
}

export default SnakeGame
