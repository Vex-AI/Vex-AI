import React from "react";
import ItemDatabase from "./ItemSynon";
import "./css/ListSynon.css";
const ListSynon = ({ items, remove }) => {
  return (
    <ul id="list-database">
      {items.map((item, index) => {
        return (
          <ItemDatabase key={index} item={item} remove={remove} index={index} />
        );
      })}
    </ul>
  );
};

export default ListSynon;
