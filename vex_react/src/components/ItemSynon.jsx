import React from "react";
import "./css/ItemSynon.css";
const ItemSynon = ({ title, subtitle, children }) => {
  return (
    <li className="item-base">
      <div className="item-title-base">
        <p className="item-title">{title}</p>
        <div className="icons">
{children}
        </div>
      </div>
      <p className="item-all">{subtitle}</p>
    </li>
  );
};

export default ItemSynon;
