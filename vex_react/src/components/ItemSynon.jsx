import React from "react";
import "./css/ItemSynon.css";
const ItemSynon = ({ title, subtitle, index, remove }) => {
  return (
    <li className="item-base">
      <div className="item-title-base">
        <p className="item-title">{title}</p>
        <div className="icons">
          <img
            alt="a pencil icon"
            className="icon"
            src={process.env.PUBLIC_URL + "/icons/edit.svg"}
          />
          <img alt="a fork icon" className="icon" src=
          {process.env.PUBLIC_URL + "/icons/fork.svg"}
          />
          <img
            alt='an "x"icon'
            className="icon"
            src={process.env.PUBLIC_URL + "/icons/remove.svg"}
            onClick={() => remove(index)}
          />
        </div>
      </div>
      <p className="item-all">{subtitle}</p>
    </li>
  );
};

export default ItemSynon;
