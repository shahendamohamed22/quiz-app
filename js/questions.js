

export class Question {
  constructor({ question, correct_answer, incorrect_answers, category, difficulty }) {
    this.text = question;
    this.correctAnswer = correct_answer;
    this.category = category;
    this.difficulty = difficulty;
    this.answers = this.#shuffle([...incorrect_answers, correct_answer]);
  }

  #shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  isCorrect(selectedAnswer) {
    return selectedAnswer === this.correctAnswer;
  }
}

