import React from "react";
import ItemDatabase from "./ItemSynon";
import "./css/ListSynon.css";
const ListSynon = ({ items, remove, keys }) => {
  return (
    <ul id="list-database">
      {items.map((item, index) => {
        return (
          <ItemDatabase
            key={index}
            remove={remove}
            index={index}
            title={item[keys[0]][0]}
            subtitle={item[keys[1]].join(", ")}
          />
        );
      })}
    </ul>
  );
};

export default ListSynon;
