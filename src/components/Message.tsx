import { IonItem, IonLabel } from "@ionic/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Style {
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
  textColor: string;
  rippleColor: string;
}

interface MessageProps {
  content: string;
  isVex: boolean;
  hour: string;
  date: number
}

const Message: React.FC<MessageProps> = ({ content, isVex, hour }) => {
  const [style, setStyle] = useState<Style | null>(null);

  useEffect(() => {
    const loadStyles = () => {
      const userStyle = localStorage.getItem("userStyle");
      const vexStyle = localStorage.getItem("vexStyle");

      if (isVex && vexStyle) {
        return JSON.parse(vexStyle);
      } else if (!isVex && userStyle) {
        return JSON.parse(userStyle);
      }
      return null; 
    };

    setStyle(loadStyles());
  }, [isVex]);

  const messageStyle = style
    ? {
        borderTopLeftRadius: `${style.borderTopLeftRadius}px`,
        borderTopRightRadius: `${style.borderTopRightRadius}px`,
        borderBottomLeftRadius: `${style.borderBottomLeftRadius}px`,
        borderBottomRightRadius: `${style.borderBottomRightRadius}px`,
        borderWidth: `${style.borderWidth}px`,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        borderStyle: "solid",
        transition: "all 0.3s ease",
      }
    : undefined;

  const labelStyle = style ? { color: style.textColor } : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IonItem
        className={`message ${isVex ? "message-vex" : "message-other"}`}
        lines="none"
        style={messageStyle}
      >
        <IonLabel style={labelStyle}>
          <p>{content}</p>
          <small>{hour}</small>
        </IonLabel>
      </IonItem>
    </motion.div>
  );
};

export default Message;
