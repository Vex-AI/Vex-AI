class Utils {
  getSample(type) {
    switch (type) {
      case "answer":
        return [
          "I didn't understand =(",
          "I don't have an answer... ",
          "Wha..what is this?? (⊙_⊙)",
        ];
      case "database":
        return [
          {
            message: ["hi", "hello", "hola", "oi"],
            answer: ["hiii ╰(*´︶`*)╯♡","alright?","こんばんは","oi","hola"],
          },
        ];
      case "message":
        return [
          {
            msg: "test",
            user: "vex",
            hour: this.getHours(),
          },
          {
            msg: "test",
            user: "vex",
            hour: this.getHours(),
          },
          {
            msg: "test",
            user: "vex",
            hour: this.getHours(),
          },
          {
            msg: "test",
            user: "vex",
            hour: this.getHours(),
          },
          {
            msg: "test",
            user: "vex",
            hour: this.getHours(),
          },
          {
            msg: "test",
            user: "vex",
            hour: this.getHours(),
          },
        ];
      default:
        return null;
    }
  }
  getHours() {
    let date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  }
  saveData(db) {
    localStorage.setItem("db", JSON.stringify(db));
  }
  clear(message) {
    let split = message
      //.replace(/<@.?[0-9]*?>/g, "")
      .replace("+v", "vex")
      .normalize("NFD")
      // .replace(/[^\x00-\x7F]/g, "")
      .toLowerCase()
      .split(" ")
      .filter((e) => String(e).trim());
    return split;
  }
}
export default Utils;
