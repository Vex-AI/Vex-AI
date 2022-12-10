/* Imports */
import React, { useState, useRef } from "react";
import "./css/Input.css";

/* Classes */
import Database from "../classes/Database.js";

/* Components */
import Answer from "../classes/Answer";
import Utils from "../classes/Utils.js";
import TypeBar from "./TypeBar";

const Input = ({ send, scroll }) => {
  const util = new Utils();
  const dataBase = new Database(util.getSample("database"));
  const [isOpen, setOpen] = useState(false);
  const noAnswer = new Answer(util.getSample("answer"));
  const editText = useRef(null);
  const [input, setInput] = useState("");

  const Analyzer = (value) => {
    setInput("");
    let clean = util.clear(value);
    let res = dataBase.getAnswer(clean);
    //alert(JSON.stringify(res));
    if (res === null) res = dataBase.getAnswer([clean.join()]);

    if (res != null) return send(res, "vex");
    send(noAnswer.getAnswer(), "vex");
    editText.focus();
  };

  return (
    <div id="typebar">
      <TypeBar open={isOpen} />
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
            src={process.env.PUBLIC_URL + "/images/send.png"}
            className="icon"
            id="send"
            alt="a send message icon, resembling a spaceship "
            onClick={() => {
              if (input.trim().length === 0) return;
              setOpen(true);
              send(input, "user");
              Analyzer(input);
              setOpen(false);
              scroll();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
