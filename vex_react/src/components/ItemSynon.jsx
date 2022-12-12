import React from "react";
import "./css/ItemSynon.css";
const ItemSynon = ({ item, index, remove }) => {
  return (
    <li className="item-base">
      <div className="item-title-base">
        <p className="item-title">{item.message[0]}</p>
        <div className="icons">
          <img
            alt="a pencil icon"
            className="icon"
            src={process.env.PUBLIC_URL + "/icons/edit.svg"}
          />
          <img
            alt='an "x"icon'
            className="icon"
            src={process.env.PUBLIC_URL + "/icons/remove.svg"}
            onClick={() => remove(index)}
          />
        </div>
      </div>
      <p className="item-all">{item.message.join(", ")}</p>
    </li>
  );
};

export default ItemSynon;
