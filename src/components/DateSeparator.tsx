import { IonItem, IonLabel } from "@ionic/react";
import utils from "../classes/utils";

interface DateSeparatorProps {
  date: number;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <IonItem
      lines="none"
      style={{
        "--background": "#057b70",
        borderRadius: "15px",
        textAlign: "center",
        margin: "auto",
        width: "fit-content",
      }}
    >
      <IonLabel className="date-separator">{utils.formatDate(date)}</IonLabel>
    </IonItem>
  );
};

export default DateSeparator;
