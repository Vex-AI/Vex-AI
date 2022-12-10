class Database {
  constructor(db) {
    this.db = JSON.parse(localStorage.getItem("db")) || db;
  }

  setDB(data) {
    this.db = data;
  }

  getSynons(word) {
    for (let pos in this.db) {
      let object = this.db[pos];
      const synons = object.message;
      if (synons.includes(word)) return synons;
    }
    return null;
  }

  getAnswer(words) {
    if (!Array.isArray(words)) words = [words];
    for (let pos in words) {
      let msg_index = words[pos];
      for (let index in this.db) {
        let item = this.db[index];
        if (item.message.includes(msg_index)) {
          let answer = item.answer;
          return /*`${answer}`; */ answer[
            Math.floor(Math.random() * answer.length - 1)
          ];
        }
      }
    }
    return null;
  }

  removeData(value) {
    this.setDB(
      this.db.map((item) =>
        item.messages.filter((message) => message !== value)
      )
    );
  }

  putSynon(synon, index) {
    let object = this.db[index];
    if (index > this.db.length - 1) return null;
    const messages = object.message;
    if (!messages.includes(synon)) {
      messages.push(synon);
      this.setDB(
        this.db.map((item, i) => {
          if (index === i) return messages;
          return item;
        })
      );
      return true;
    }
    return false;
  }
  saveDatabase() {
    localStorage.setItem("db", JSON.stringify(this.db));
  }
  loadDatabase() {
    this.db = JSON.parse(localStorage.getItem("db"));
  }
}

export default Database;