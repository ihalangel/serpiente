class Snake {
  constructor(startX, startY, startSize, blockWidth, blockHeight, color) {
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.color = color || '#00FF00';
    this.direction = 'right';
    this.segments = [];

    // Initialize the snake with given size and position
    let Xpos = startX;
    let Ypos = startY;
    this.segments.push({ Xpos, Ypos });
    for (let i = 1; i < startSize; i++) {
      Xpos -= blockWidth;
      this.segments.push({ Xpos, Ypos });
    }
  }

move(width, height) {
  let head = { ...this.segments[0] };
  let newX = head.Xpos;
  let newY = head.Ypos;

  switch (this.direction) {
    case 'left':
      newX = head.Xpos - this.blockWidth;
      break;
    case 'up':
      newY = head.Ypos - this.blockHeight;
      break;
    case 'right':
      newX = head.Xpos + this.blockWidth;
      break;
    case 'down':
      newY = head.Ypos + this.blockHeight;
      break;
  }

  // Check collision with wall
  if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
    return false; // wall collision detected
  }

  // Update position if valid
  head.Xpos = newX;
  head.Ypos = newY;

  this.segments.pop();
  this.segments.unshift(head);

  return true; // successful move
}

  changeDirection(newDirection) {
    // Prevent direct opposite direction
    const opposites = { left: 'right', right: 'left', up: 'down', down: 'up' };
    if (newDirection !== opposites[this.direction]) {
      this.direction = newDirection;
    }
  }

  grow() {
    // Add a segment at the end by duplicating the last one
    const lastSegment = this.segments[this.segments.length - 1];
    this.segments.push({ ...lastSegment });
  }

  isSelfCollision() {
    const [head, ...body] = this.segments;
    return body.some(seg => seg.Xpos === head.Xpos && seg.Ypos === head.Ypos);
  }

  occupiesPosition(x, y) {
    return this.segments.some(seg => seg.Xpos === x && seg.Ypos === y);
  }
}

export default Snake;
