class Database {
  constructor() {
    this.db = localStorage.getItem("db")
      ? JSON.parse(localStorage.getItem("db"))
      : [];
  }

  setDB(data) {
    this.db = data;
  }

  getSynons(word) {
    let search = this.db.find((item) => item.message.includes(word));
    if (search) return search.message;
    return null;
  }

  getAnswer(words) {
    if (!Array.isArray(words)) words = [words];
    for (let pos in words) {
      let word = words[pos];
      let search = this.db.find((item) => item.message.includes(word));
      if (search)
        return search.answer[Math.floor(Math.random() * search.answer.length)];
      return null;
    }
  }

  saveDatabase() {
    localStorage.setItem("db", JSON.stringify(this.db));
  }

  loadDatabase() {
    this.db = JSON.parse(localStorage.getItem("db"));
  }

  getDB() {
    return this.db;
  }
}

export default Database;
