import {
  IonFooter,
  IonToolbar,
  IonAvatar,
  IonText,
  IonLabel,
} from "@ionic/react";
import { motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <IonFooter>
        <IonToolbar
          style={{
            backgroundColor: "#212121",
            borderTop: "1px solid white",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IonAvatar style={{ marginRight: "8px" }}>
              <img src={"/cookieukw.jpg"} alt={"name"} />
            </IonAvatar>
            <IonText color="light">
              <p>
                {t("developedBy")}&nbsp;
                <a
                  href={"html_url"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  CookieUkw
                </a>
              </p>
            </IonText>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            <IonLabel color="light">
              © {new Date().getFullYear()} {t("allRights")}
            </IonLabel>
          </div>
        </IonToolbar>
      </IonFooter>
    </motion.div>
  );
};

export default Footer;
