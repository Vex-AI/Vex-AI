/* Imports */
import React, { useState } from "react";
import Database from "../classes/Database";
import "react-toastify/dist/ReactToastify.css";
import "./css/AddSynonModal.css";
import { dialog_addanswer_style, synons_style } from "../classes/styles";

/* Components */
import Content from "./Content";
import ListView from "./ListView";
import Button from "./Button";
import InputSynon from "./InputSynon";
import Dialog from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import ItemSynon from "./ItemSynon";
import Icon from "./Icon";

const Synons = () => {
  const mkToast = (msg) =>
    toast(msg, {
      position: "bottom-right",
      autoClose: 1700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const [input, setInput] = useState("");
  const [id, setID] = useState(0);
  const [answer, setAnswer] = useState("");

  const db = new Database();
  const [isOpen, setOpen] = useState(false);
  const [isSynonOpen, setSynonOpen] = useState(true);
  const [items, setItems] = useState(
    localStorage.getItem("db") ? JSON.parse(localStorage.getItem("db")) : []
  );

  const addItem = (synon) => {
    if (synon.trim().length === 0) return;

    if (items.filter((obj) => obj.message.includes(synon)).length !== 0)
      return mkToast("This information has already been recorded !");
    setItems((prev) => {
      const newData = [
        ...prev,
        {
          message: [synon],
          answer: [],
        },
      ];
      db.saveDatabase();
      db.setDB(newData);
      return newData;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => {
      const newData = prev.filter((item, i) => index !== i);
      db.setDB(newData);
      db.saveDatabase();
      return newData;
    });
  };

  const addAnswer = (answer) => {
    if (answer.length === 0) return mkToast("Fill the text field!");
    setItems((prev) => {
      const newData = prev.map((item, index) => {
        if (index === id)
          return {
            ...item,
            answer: [...item.answer, answer],
          };
        return item;
      });
      db.saveDatabase();
      db.setDB(newData);
      setAnswer("")
      return newData;
    });
  };

  const removeAnswer = (index) => {
    if (answer.length === 0) return mkToast("Fill the text field!");

    setItems((prev) => {
      let obj = prev[id];
      const newData = {
        ...obj,
        answer: obj.answer.filter((item, ind) => index !== ind),
      };
      db.saveDatabase();
      db.setDB(newData);
      setAnswer("")
      return prev.splice(id, 1, newData);
    });
  };
  
  const addSynon = (synon)=>{
    if (synon.length === 0) return mkToast("Fill the text field!");
    setItems((prev) => {
      const newData = prev.map((item, index) => {
        if (index === id)
          return {
            ...item,
            message: [...item.message, synon],
          };
        return item;
      });
      db.saveDatabase();
      db.setDB(newData);
      setAnswer("")
      return newData;
    });
  }
  
  const removeSynon = (index)=>{
    if (answer.length === 0) return mkToast("Fill the text field!");

    setItems((prev) => {
      let obj = prev[id];
      const newData = {
        ...obj,
        message: obj.message.filter((item, ind) => index !== ind),
      };
      db.saveDatabase();
      db.setDB(newData);
      setAnswer("")
      return prev.splice(id, 1, newData);
    });
  }
  
  return (
    <Content>
      <ToastContainer />
      <InputSynon change={setInput} text={"Type here..."} value={input} />

      <Button
        color="lime"
        text={"Add"}
        onClick={() => {
          addItem(input);
          setInput("");
        }}
      />

      <Button
        color="red"
        text={"Press and hold to erase everything"}
        onClick={() => mkToast("🦄 Wow so easy!")}
      />

      <ListView style={synons_style}>
        {items.map((item, index) => {
          return (
            <ItemSynon
              key={index}
              title={item.message.join(", ")}
              subtitle={item.answer?.join(", ")}
            >
              <Icon
                alt="a send icon"
                fileName="send.svg"
                onClick={() => {
                  setID(() => {
                    setOpen(true);
                    return index;
                  });
                }}
              />
              <Icon
                alt="a fork icon"
                fileName="fork.svg"
                onClick={() => {
                  setID(() => {
                    setSynonOpen(true);
                    return index;
                  });
                }}
              />
              <Icon
                alt="a trash icon"
                fileName="remove.svg"
                onClick={() => removeItem(index)}
              />
            </ItemSynon>
          );
        })}
      </ListView>
      <Dialog
        style={dialog_addanswer_style}
        isOpen={isOpen}
        ariaHideApp={false}
      >
        Add a reply
        <div>
          <p>Vex will reply for {items[id]?.message.join(", ")}: </p>
          <InputSynon change={setAnswer} text={"Type here..."} value={answer} />

          <Button
            color="lime"
            text={"Save"}
            onClick={() => addAnswer(answer)}
          />
          <Button color="red" text={"Cancel"} onClick={() => setOpen(false)} />
        </div>
        <ListView style={synons_style}>
          {items[id]?.answer?.map((item, index) => {
            return (
              <ItemSynon key={index} title={item} subtitle={""}>
                <Icon
                  alt="a trash icon"
                  fileName="remove.svg"
                  onClick={() => removeAnswer(index)}
                />
              </ItemSynon>
            );
          })}
        </ListView>
      </Dialog>
      <Dialog
        style={dialog_addanswer_style}
        isOpen={isSynonOpen}
        ariaHideApp={false}
      >
        <div>
          <p>Add synonyms for the same word </p>
          <InputSynon change={setAnswer} text={"Type here..."} value={answer} />

          <Button color="lime" text={"Save"} onClick={() => addSynon(answer)} />
          <Button color="red" text={"Cancel"} onClick={() => setSynonOpen(false)} />
        </div>
        <ListView style={synons_style}>
          {items[id]?.message?.map((item, index) => {
            return (
              <ItemSynon key={index} title={item} subtitle={""}>
                <Icon
                  alt="a trash icon"
                  fileName="remove.svg"
                  onClick={() => removeSynon(index)}
                />
              </ItemSynon>
            );
          })}
        </ListView>
      </Dialog>
    </Content>
  );
};

export default Synons;
