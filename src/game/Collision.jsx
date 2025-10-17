export function checkSnakeCollision(snake, otherSnakes) {
  const head = snake.segments[0]
  return otherSnakes.some(otherSnake =>
    otherSnake.segments.some(
      seg => seg.Xpos === head.Xpos && seg.Ypos === head.Ypos
    )
  )
}



