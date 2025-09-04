import { useState, useEffect, useCallback, useMemo } from "react";
import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonToast,
  IonCheckbox,
  IonList,
  IonRange,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { chevronBack, save, trash } from "ionicons/icons";
import { ChromePicker } from "react-color";
import Preview from "@/components/Preview";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { mkToast } from "@/lib/utils";

interface Style {
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  borderColor: string;
  borderWidth: number;
  "--background": string;
  color: string;
  "--ripple-color": string;
  padding: string;
}

const defaultStyle: Style = {
  borderTopRightRadius: 10,
  borderTopLeftRadius: 10,
  borderBottomRightRadius: 10,
  borderBottomLeftRadius: 10,
  borderColor: "#fff",
  borderWidth: 2,
  "--background": "rgba(220, 17, 47, 0.9)",
  color: "#fff",
  "--ripple-color": "#000",
  padding: "10px",
};

const Customize: React.FC = () => {
  const { t } = useTranslation();

  const [key, setKey] = useState<string>("vexStyle");
  const navigate = useNavigate();
  const go = (path: string) => {
    navigate(path, { replace: true });
  };
  const savedStyle: Style = useMemo(() => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) as string)
      : defaultStyle;
  }, [key]);

  const [style, setStyle] = useState<Style>(savedStyle);

  const updateStyle = useCallback(
    (newStyle: Partial<Style>) =>
      setStyle((prev) => ({ ...prev, ...newStyle })),
    []
  );

  const toggleStyle = useCallback(() => {
    setKey((prevKey) => (prevKey === "vexStyle" ? "userStyle" : "vexStyle"));
  }, []);

  const saveStyles = useCallback(() => {
    localStorage.setItem(key, JSON.stringify(style));
    mkToast(t("saved_success", { key }));
  }, [style, key, t]);

  useEffect(() => {
    const storedStyle = localStorage.getItem(key);
    if (storedStyle) {
      setStyle(JSON.parse(storedStyle));
    } else {
      setStyle(defaultStyle);
    }
  }, [key]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => go("/home")}>
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{t("customization")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Preview
        style={{
          ...style,
          borderWidth: `${style.borderWidth}px`,
          padding: "1rem",
          minWidth: "230px",
          textAlign: "center",
          borderStyle: "solid",
          transition: "all .3s ease-in-out",
        }}
        text={key === "vexStyle" ? t("vex_message") : t("user_message")}
      />
      <IonContent className="ion-padding">
        <IonList
          style={{
            textAlign: "center",
          }}
        >
          <IonCheckbox
            style={{
              transition: "all 1s ease",
              border: "1px solid white",
              margin: "auto",
            }}
            labelPlacement="start"
            className="ion-padding"
            color="light"
            checked={key === "vexStyle"}
            onIonChange={toggleStyle}
          >
            {key === "vexStyle" ? t("isVex") : t("isUser")}
          </IonCheckbox>

          {[
            {
              label: t("topLeftRadius"),
              value: style.borderTopLeftRadius,
              key: "borderTopLeftRadius",
            },
            {
              label: t("topRightRadius"),
              value: style.borderTopRightRadius,
              key: "borderTopRightRadius",
            },
            {
              label: t("bottomLeftRadius"),
              value: style.borderBottomLeftRadius,
              key: "borderBottomLeftRadius",
            },
            {
              label: t("bottomRightRadius"),
              value: style.borderBottomRightRadius,
              key: "borderBottomRightRadius",
            },
            {
              label: t("borderWidth"),
              value: style.borderWidth,
              key: "borderWidth",
              max: 10,
            },
          ].map(({ label, value, key, max = 30 }) => (
            <IonCard
              style={{ border: "1px solid white" }}
              key={key}
              className="ion-padding"
            >
              <IonCardHeader>
                <IonCardTitle color="light">{label}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonRange
                  min={0}
                  pin={true}
                  ticks={true}
                  snaps={true}
                  max={max}
                  value={value}
                  onIonChange={(e: CustomEvent) =>
                    updateStyle({ [key]: e.detail.value as number })
                  }
                />
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        <IonCard
          style={{
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          color="medium"
        >
          <IonCardHeader>
            <IonCardTitle color="light">{t("backgroundColor")}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ChromePicker
              color={style["--background"]}
              onChange={(color) => updateStyle({ "--background": color.hex })}
            />
          </IonCardContent>
        </IonCard>

        <IonCard
          style={{
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          color="medium"
        >
          <IonCardHeader>
            <IonCardTitle color="light">{t("ripple_color")}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ChromePicker
              color={style["--ripple-color"]}
              onChange={(color) => updateStyle({ "--ripple-color": color.hex })}
            />
          </IonCardContent>
        </IonCard>

        <IonCard
          style={{
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          color="medium"
        >
          <IonCardHeader>
            <IonCardTitle color="light">{t("text_color")}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <ChromePicker
              color={style.color}
              onChange={(color: any) => updateStyle({ color: color.hex })}
            />
          </IonCardContent>
        </IonCard>
        <IonButton
          expand="block"
          shape="round"
          color="primary"
          onClick={saveStyles}
        >
          <IonIcon icon={save} slot="start" />
          {t("save_styles")}
        </IonButton>
        <IonButton
          color="danger"
          shape="round"
          expand="block"
          onClick={() => {
            localStorage.removeItem(key);
            mkToast(t("deleted_success", { key }));
          }}
        >
          <IonIcon icon={trash} slot="start" />
          {t("delete_styles")}
        </IonButton>

        <IonToast />
      </IonContent>
    </IonPage>
  );
};

export default Customize;
