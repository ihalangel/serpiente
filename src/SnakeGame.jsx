import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import Snake from './game/Snake.jsx'
import SnakeBody from './game/SnakeBody.jsx'
import Apple from './game/Apple.jsx'
import {  checkSnakeCollision } from './game/Collision.jsx'
import Scoring  from './game/Scoring.jsx'

class SnakeGame extends React.Component {
  //
  constructor(props) {
    super(props)
    this.scoring = new Scoring([0, 0]);
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
      isMoving: [false, false], // movimiento individual por serpiente
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
  if (this.state.isGameOver) return;

  let timeoutId = setTimeout(() => {
    if (!this.state.isGameOver) {
      let gameOver = false;

      // Mover sólo serpientes activas y chequear auto-colisión y colisión pared
      let snakes = this.state.snakes.map((snake, idx) => {
        if (this.state.isMoving[idx]) {
          const moved = snake.move(this.state.width, this.state.height);
          if (!moved) gameOver = true;
          if (snake.isSelfCollision()) gameOver = true;
        }
        return snake;
      });

      // Chequear colisiones entre serpientes
      snakes.forEach((snake, idx) => {
        const otherSnakes = snakes.filter((_, i) => i !== idx);
        if (checkSnakeCollision(snake, otherSnakes)) gameOver = true;
      });

      // Terminar juego si colisionó
      if (gameOver) {
        this.setState({ isGameOver: true, timeoutId: 0 });
        return;
      }

      // Manejo de comida y actualización de puntajes con Scoring
      let foods = [...this.state.foods];
      let scores = this.scoring.getScores();
      let highScore = this.state.highScore;
      let newHighScore = this.state.newHighScore;
      let gameLoopTimeout = this.state.gameLoopTimeout;

      snakes.forEach((snake, idx) => {
        let head = snake.segments[0];
        foods.forEach((food, foodIdx) => {
          if (head.Xpos === food.Xpos && head.Ypos === food.Ypos) {
            snake.grow();
            // Reposicionar alimento evitando colisiones
            let newFoodX, newFoodY;
            do {
              newFoodX = Math.floor(Math.random() * ((this.state.width - this.state.blockWidth) / this.state.blockWidth + 1)) * this.state.blockWidth;
              newFoodY = Math.floor(Math.random() * ((this.state.height - this.state.blockHeight) / this.state.blockHeight + 1)) * this.state.blockHeight;
            } while (
              snakes.some(s => s.occupiesPosition(newFoodX, newFoodY)) ||
              foods.some((f, i) => i !== foodIdx && f.Xpos === newFoodX && f.Ypos === newFoodY)
            );
            foods[foodIdx] = { Xpos: newFoodX, Ypos: newFoodY };

            // Incrementar puntaje usando el objeto Scoring
            scores = this.scoring.incrementScore(idx);

            if (scores[idx] > highScore) {
              highScore = scores[idx];
              localStorage.setItem('snakeHighScore', highScore);
              newHighScore = true;
            }
            if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5;
          }
        });
      });

      // Actualiza estado con nuevos datos
      this.setState({
        snakes,
        foods,
        score: scores,
        highScore,
        newHighScore,
        gameLoopTimeout,
        directionChanged: false,
      });
    }

    this.gameLoop();
  }, this.state.gameLoopTimeout);

  this.setState({ timeoutId });
}


  
  componentWillUnmount() {
    clearTimeout(this.state.timeoutId)
    window.removeEventListener('keydown', this.handleKeyDown)
  }



 resetGame() {
    clearTimeout(this.state.timeoutId);
    this.scoring = new Scoring([0, 0]); // Reiniciar Scoring con 0,0
    this.initGame();
    this.setState({
      isMoving: [false, false], // ambas inician quietas
      directionChanged: false,
      isGameOver: false,
      score: [0, 0],
      newHighScore: false,
    });
  }

  
  getRandomColor() {
    let hexa = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) color += hexa[Math.floor(Math.random() * 16)]
    return color
  }


  handleKeyDown(event) {
    if (this.state.isGameOver && event.keyCode === 32) {
      this.resetGame();
      return;
    }
    if (this.state.directionChanged) return;

    let snake1 = this.state.snakes[0];
    let snake2 = this.state.snakes[1];
    let isMoving = [...this.state.isMoving];

    switch (event.keyCode) {
      // Serpiente 1 (flechas)
      case 37:
        snake1.changeDirection('left');
        isMoving[0] = true;
        break;
      case 38:
        snake1.changeDirection('up');
        isMoving[0] = true;
        break;
      case 39:
        snake1.changeDirection('right');
        isMoving[0] = true;
        break;
      case 40:
        snake1.changeDirection('down');
        isMoving[0] = true;
        break;

      // Serpiente 2 (WASD)
      case 65:
        snake2.changeDirection('left');
        isMoving[1] = true;
        break;
      case 87:
        snake2.changeDirection('up');
        isMoving[1] = true;
        break;
      case 68:
        snake2.changeDirection('right');
        isMoving[1] = true;
        break;
      case 83:
        snake2.changeDirection('down');
        isMoving[1] = true;
        break;

      default:
        return;
    }

    this.setState({
      directionChanged: true,
      snakes: [snake1, snake2],
      isMoving: isMoving,
    }, () => {
      // Si alguna serpiente no estaba moviéndose, iniciamos el juego
      if (isMoving.some(m => m) && !this.state.timeoutId) {
        this.gameLoop();
      }
    });
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
  score={this.state.score}  // pasar array en vez de suma
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

        <div id='Score' style={{ fontSize: this.state.width / 30 }}>
  HIGH-SCORE: {this.state.highScore} &ensp;&ensp;&ensp;&ensp;
  SCORE 1: {this.state.score[0]} &ensp;&ensp;&ensp;&ensp;
  SCORE 2: {this.state.score[1]}
</div>

      </div>
    )
  }
}

export default SnakeGame
