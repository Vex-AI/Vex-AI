// components/Message.tsx
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from "@ionic/react";
import { motion } from "framer-motion";
import { useEffect, Fragment, useMemo, useState } from "react";
import { trash } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { MessageProps, Style } from "@/types";
import { getCodePoint, getRandomAnimation } from "@/lib/utils";
import StaticEmoji from "./StaticEmoji";
import AnimatedEmoji from "./AnimatedEmoji";

const animationVariants = {
  scaleUp: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
  slideIn: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.4 },
  },
  rotateEnter: {
    opacity: 0,
    rotate: -15,
    scale: 0.9,
    transition: { duration: 0.35 },
  },
  popIn: {
    opacity: 0,
    scale: 0.5,
    y: 20,
    transition: { type: "spring", stiffness: 200 },
  },
};

const Message: React.FC<MessageProps> = ({ content, isVex, hour, onClose }) => {
  const [style, setStyle] = useState<Style | null>(null);
  const { t } = useTranslation();
  const processedContent = useMemo(() => processContent(content), [content]);
  const [randomAnimation] = useState<keyof typeof animationVariants>(() =>
    getRandomAnimation(animationVariants)
  );

  useEffect(() => {
    const loadStyles = () => {
      const userStyle = localStorage.getItem("userStyle");
      const vexStyle = localStorage.getItem("vexStyle");

      return JSON.parse((isVex && vexStyle) || (!isVex && userStyle) || "null");
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
        "--background": style["--background"],
        color: style.textColor,
        borderStyle: "solid",
        transition: "all 0.3s ease",
      }
    : undefined;

  const labelStyle = style ? { color: style.textColor } : undefined;

  return (
    <motion.div
      initial={randomAnimation}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.5,
        },
      }}
      variants={animationVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ originX: isVex ? 0 : 1 }}
    >
      <IonItemSliding>
        <IonItemOptions side={isVex ? "start" : "end"}>
          <IonItemOption onClick={onClose} expandable color="danger">
            <IonIcon slot="icon-only" icon={trash} />
            {t("deleteMessage")}
          </IonItemOption>
        </IonItemOptions>

        <IonItem
          button
          className={`message ${isVex ? "message-vex" : "message-other"}`}
          lines="none"
          style={messageStyle}
        >
          <IonLabel style={labelStyle}>
            <p>
              {processedContent.map((part, index) => (
                <Fragment key={index}>{part}</Fragment>
              ))}
            </p>
            <small>{hour}</small>
          </IonLabel>
        </IonItem>
      </IonItemSliding>
    </motion.div>
  );
};

export default Message;

function processContent(content: string) {
  const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
  const tokens: (string | any)[] = [];
  let lastIndex = 0;
  let animatedCount = 0;

  let match;
  while ((match = emojiRegex.exec(content)) !== null) {
    const start = match.index;
    const end = emojiRegex.lastIndex;
    const emoji = match[0];

    if (start > lastIndex) {
      tokens.push(content.substring(lastIndex, start));
    }

    const code = getCodePoint(emoji);
    if (animatedCount < 10) {
      tokens.push(<AnimatedEmoji code={code} key={start} />);
      animatedCount++;
    } else {
      tokens.push(<StaticEmoji code={code} key={start} />);
    }

    lastIndex = end;
  }

  if (lastIndex < content.length) {
    tokens.push(content.substring(lastIndex));
  }

  return tokens;
}
