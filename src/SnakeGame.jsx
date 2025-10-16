import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import Snake from './game/Snake.jsx'
import SnakeBody from './game/SnakeBody.jsx'
import Apple from './game/Apple.jsx'

class SnakeGame extends React.Component {
  //
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
      foods: [],  // se cambio a array para permitir multiples alimentos
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

  // Generate two food positions avoiding snake bodies and overlap
    let foods = []
    for (let i = 0; i < 2; i++) {
      let foodX, foodY
      do {
        foodX = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth
        foodY = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight
      } while (
        snake1.occupiesPosition(foodX, foodY) ||
        snake2.occupiesPosition(foodX, foodY) ||
        foods.some(f => f.Xpos === foodX && f.Ypos === foodY)
      )
      foods.push({ Xpos: foodX, Ypos: foodY })
    }

    this.setState({
      width,
      height,
      blockWidth,
      blockHeight,
      snakes: [snake1, snake2],
      foods,
      isGameOver: false,
      score: [0, 0],
      newHighScore: false,
      gameLoopTimeout: 50,
    })
  }

  gameLoop() {
    let timeoutId = setTimeout(() => {
      if (!this.state.isGameOver) {
        let snakes = this.state.snakes.map(snake => {
          snake.move(this.state.width, this.state.height)
          if (snake.isSelfCollision()) {
            this.setState({ isGameOver: true })
          }
          return snake
        })

        let foods = [...this.state.foods]
        let scores = [...this.state.score]
        let highScore = this.state.highScore
        let newHighScore = this.state.newHighScore
        let gameLoopTimeout = this.state.gameLoopTimeout

        snakes.forEach((snake, idx) => {
          let head = snake.segments[0]
          foods.forEach((food, foodIdx) => {
            if (head.Xpos === food.Xpos && head.Ypos === food.Ypos) {
              snake.grow()
              // Respawn the eaten food avoiding all snakes and other foods
              let newFoodX, newFoodY
              do {
                newFoodX = Math.floor(Math.random() * ((this.state.width - this.state.blockWidth) / this.state.blockWidth + 1)) * this.state.blockWidth
                newFoodY = Math.floor(Math.random() * ((this.state.height - this.state.blockHeight) / this.state.blockHeight + 1)) * this.state.blockHeight
              } while (
                snakes.some(s => s.occupiesPosition(newFoodX, newFoodY)) ||
                foods.some((f, i) => i !== foodIdx && f.Xpos === newFoodX && f.Ypos === newFoodY)
              )
              foods[foodIdx] = { Xpos: newFoodX, Ypos: newFoodY }

              // Update score for that snake
              scores[idx] += 1
              if (scores[idx] > highScore) {
                highScore = scores[idx]
                localStorage.setItem('snakeHighScore', highScore)
                newHighScore = true
              }
              if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5
            }
          })
        })

        this.setState({
          snakes,
          foods,
          score: scores,
          highScore,
          newHighScore,
          gameLoopTimeout,
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

         {this.state.foods.map((food, idx) => (
          <Apple
            key={idx}
            Xpos={food.Xpos}
            Ypos={food.Ypos}
            blockWidth={this.state.blockWidth}
            blockHeight={this.state.blockHeight}
            color={this.state.appleColor}
          />
        ))}

        <div id='Score' style={{ fontSize: this.state.width / 20 }}>
          HIGH-SCORE: {this.state.highScore} &ensp;&ensp;&ensp;&ensp; SCORE: {this.state.score.reduce((a, b) => a + b, 0)}
        </div>
      </div>
    )
  }
}

export default SnakeGame
