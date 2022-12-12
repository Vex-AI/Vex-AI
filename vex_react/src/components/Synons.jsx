import React, { useState } from "react";
import Content from "./Content";
import ListSynon from "./ListSynon";
import Button from "./Button";
import InputSynon from "./InputSynon";
import Database from "../classes/Database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Synons = () => {
  const [input, setInput] = useState("");
  const db = new Database();

  const [items, setItems] = useState(
    localStorage.getItem("db") ? JSON.parse(localStorage.getItem("db")) : []
  );

  const addAnswer = (answer) => {
    if (answer.trim().length === 0)
      return toast("Fill in the text field! ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

    if (items.filter((obj) => obj.message.includes(answer)).length !== 0)
      return toast("This information has already been recorded !", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    setItems((prev) => {
      const newData = [
        ...prev,
        {
          message: [answer],
          answer: [],
        },
      ];
      db.setDB(newData);
      db.saveDatabase();
      return newData;
    });
  };

  const removeAnswer = (index) => {
    setItems((prev) => {
      const newData = prev.filter((item, i) => index !== i);
      db.setDB(newData);
      db.saveDatabase();
      return newData;
    });
  };

  return (
    <Content
      styles={{
        justifyContent: "flex-start !important",
      }}
    >
      <ToastContainer />
      <InputSynon change={setInput} text={"Type here..."} value={input} />

      <Button
        color="lime"
        text={"Add"}
        onClick={() => {
          addAnswer(input);
          setInput("");
        }}
      />

      <Button
        color="red"
        text={"Press and hold to erase everything"}
        onClick={() =>
          toast("🦄 Wow so easy!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
      />

      <ListSynon items={items} remove={removeAnswer} />
    </Content>
  );
};

export default Synons;
