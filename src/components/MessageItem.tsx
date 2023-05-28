import React from "react";
import { Button, styled } from "@mui/material";
import Swipe from "./Swipe";
import { useSwipeable } from "react-swipeable";
const { log } = console;
import cssStyles from "./css/MessageItem.module.css";
import Ripple from "react-ripplejs";

interface MessageData {
  content: string;
  isVex: boolean;
  hour: string;
  date: string;
}

interface CustomStyle extends React.CSSProperties {
  rippleColor?: string;
}
interface MessageProps {
  message: MessageData;
  onItemDelete: () => void;
  styles: CustomStyle;
}

interface Style {
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  textColor: string;
}

const MessageItem: React.FC<MessageProps> = ({
  message,
  onItemDelete = () => {},
  styles,
}) => {
  return (
    <Swipe onItemDelete={onItemDelete}>
      <Ripple
        opacity={"0.5"}
        background={styles.rippleColor}
        style={styles}
        className={`${cssStyles.message} ${
          message.isVex ? cssStyles.vex : cssStyles.user
        }`}
      >
        <span>{message.content}</span>
        <span className={cssStyles.date}>{message.hour}</span>
      </Ripple>
    </Swipe>
  );
};

export default MessageItem;
