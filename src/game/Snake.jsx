// src/game/Snake.js

class Snake {
  constructor(startX, startY, startSize, blockWidth, blockHeight, color) {
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.color = color || '#00FF00';
    this.direction = 'right';
    this.segments = [];

    // Inicializa la serpiente con tamaño y posición dados
    let Xpos = startX;
    let Ypos = startY;
    this.segments.push({ Xpos, Ypos });
    for (let i = 1; i < startSize; i++) {
      Xpos -= blockWidth;
      this.segments.push({ Xpos, Ypos });
    }
  }

  move(width, height) {
    // Mueve la cabeza según la dirección
    let head = { ...this.segments[0] };

    switch (this.direction) {
      case 'left':
        head.Xpos = head.Xpos <= 0 ? width - this.blockWidth : head.Xpos - this.blockWidth;
        break;
      case 'up':
        head.Ypos = head.Ypos <= 0 ? height - this.blockHeight : head.Ypos - this.blockHeight;
        break;
      case 'right':
        head.Xpos = head.Xpos >= width - this.blockWidth ? 0 : head.Xpos + this.blockWidth;
        break;
      case 'down':
        head.Ypos = head.Ypos >= height - this.blockHeight ? 0 : head.Ypos + this.blockHeight;
        break;
      default:
        break;
    }

    // Mueve cada segmento a la posición del segmento anterior
    this.segments.pop();
    this.segments.unshift(head);
  }

  changeDirection(newDirection) {
    // Evita dirección opuesta directa
    const opposites = { left: 'right', right: 'left', up: 'down', down: 'up' };
    if (newDirection !== opposites[this.direction]) {
      this.direction = newDirection;
    }
  }

  grow() {
    // Añade un segmento al final duplicando el último
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
