import React, { useState, useRef } from "react";
import "./css/Input.css";
import Database from "../classes/Database.js";
import Answer from "../classes/Answer";
import Utils from "../classes/Utils.js";

const Input = ({ send }) => {
  const util = new Utils();
  const dataBase = new Database(util.getSample("database"));

  const noAnswer = new Answer(util.getSample("answer"));
  const editText = useRef(null);
  const [input, setInput] = useState("");
  const Analyzer = (value) => {
    setInput("");
    let clean = util.clear(value);
    let res = dataBase.getAnswer(clean);
   // alert(JSON.stringify(res));
    if (res === null) res = dataBase.getAnswer([clean.join()]);

    if (res != null) return send(res, "vex");
    send(noAnswer.getAnswer(), "vex");
    editText.focus();
  };

  return (
    <div id="buttons">
      <img
        src="https://akveo.github.io/eva-icons/fill/png/128/plus-circle.png"
        alt="a circle with a plus in the center"
        className="icon"
        id="save"
      />
      <div className="input">
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type here..."
          value={input}
          id="text"
          ref={editText}
        />
        <img
          src="https://github.com/cookieukw/VexIA/blob/main/vex_react/src/images/send.png"
          className="icon"
          id="send"
          alt="a send message icon, resembling a spaceship "
          onClick={() => {
            send(input, "user");
            Analyzer("oi");
          }}
        />
      </div>
    </div>
  );
};

export default Input;
