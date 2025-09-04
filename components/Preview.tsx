import { IonCard, IonCardContent, IonText } from "@ionic/react";

interface PreviewProps {
  style: React.CSSProperties;
  text: string;
}

const Preview: React.FC<PreviewProps> = ({ style, text }) => {
  return (
    <IonCard
      button
      style={{
        ...style,
        padding: "1rem",
        position: "sticky",
        top: 0,
        textAlign: "center",
        zIndex: 10,
      }}
    >
      <IonCardContent>
        <IonText color="light" style={{ color: style.color }}>
          <h2>{text}</h2>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default Preview;
