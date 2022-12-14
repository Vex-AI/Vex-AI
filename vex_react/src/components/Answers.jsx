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

  const addSynons = (synon) => {
    if (synon.trim().length === 0)
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

    if (items.filter((obj) => obj.message.includes(synon)).length !== 0)
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
          message: [synon],
          answer: [],
        },
      ];
      db.setDB(newData);
      db.saveDatabase();
      return newData;
    });
  };

  const removeSynons = (index) => {
    setItems((prev) => {
      const newData = prev.filter((item, i) => index !== i);
      db.setDB(newData);
      db.saveDatabase();
      return newData;
    });
  };

  return (
    <Content>
      <ToastContainer />
      <InputSynon change={setInput} text={"Type here..."} value={input} />

      <Button
        color="lime"
        text={"Add"}
        onClick={() => {
          addSynons(input);
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

      <ListSynon
        items={items}
        remove={removeSynons}
        keys={["message", "answer"]}
      />
    </Content>
  );
};

export default Synons;

export default Answers;
