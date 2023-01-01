
class Answer {
  constructor(answer_data) {
    this.answer_data = answer_data;
  }
  setAnswer(answer_data) {
    this.answer_data = answer_data;
  }

  addAnswer(value) {
    this.answer_data.push(value);
  }

  getAnswer() {
    let ps =
      this.answer_data[Math.floor(Math.random() * this.answer_data.length)];
    return ps;
  }

  removeAnswer(index) {
    this.answer_data.splice(index);
  }
}

export default Answer;
