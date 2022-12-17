/* Imports */
import React, { useState, useRef, } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Input.css";
import "react-toastify/dist/ReactToastify.css";

/* Classes */
import Database from "../classes/Database.js";

/* Components */
import Answer from "../classes/Answer";
import Utils from "../classes/Utils.js";
import TypeBar from "./TypeBar";
import { ToastContainer, toast } from "react-toastify";
import Icon from "./Icon";

const Input = ({ send }) => {
  const util = new Utils();
  const dataBase = new Database();
 const navigate = useNavigate();
  const noAnswer = new Answer(util.getSample("answer"));
  const editText = useRef(null);
  const [input, setInput] = useState("");
  const [type, setType] = useState(false);
  const Analyzer = (value) => {
    setInput("");
    setType(true);
    let clean = util.clear(value);
    let res = dataBase.getAnswer(clean);

    if (res === null) res = dataBase.getAnswer([clean.join()]);

    if (res != null) return send(res, "vex");
    send(noAnswer.getAnswer(), "vex", () => {
      setType(false);
    });
    editText.focus();
  };

  return (
    <div id="typebar">
      <ToastContainer />
      <TypeBar open={type} />
      <div id="buttons">
        <Icon
          fileName={"plus.svg"}
          alt={"a circle with a plus in the center"}
          id="save"
          onClick={()=> navigate("/synons")}
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
          <Icon
            fileName={"/send.svg"}
            id="send"
            alt={"a send message icon, resembling a spaceship"}
            onClick={() => {
              if (input.trim().length === 0)
                return toast("Fill in the text field! ", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
              send(input, "user");
              Analyzer(input);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
