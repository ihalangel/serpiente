export default class Scoring {
  constructor(initialScores) {
    this.scores = initialScores || [0, 0];
  }

  // Incrementa el puntaje de la serpiente idx y devuelve la copia actualizada
  incrementScore(idx) {
    if (typeof this.scores[idx] === 'number') {
      this.scores[idx] += 1;
    }
    return [...this.scores];
  }

  // Retorna el puntaje actual (copia)
  getScores() {
    return [...this.scores];
  }
}