class Database {
  constructor(array) {
    this.array = array
  }

  putData(message, answer, bool) {
    if (this.array.hasOwnProperty(message) && !bool) {
      return false
    }

    this.array[message] = answer
    return true
  }

  removeData(message) {
    if (this.array.hasOwnProperty(message)) {
      delete this.array[message]
      return true
    }
    return false
  }

  getAnswer(word) {

    if (word in this.array) {
      return this.array[word]
    }
    return null
  }
}

const vex = new Database(db)
