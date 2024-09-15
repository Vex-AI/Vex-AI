import { IonItem, IonLabel } from "@ionic/react";
import utils from "../classes/utils";

interface DateSeparatorProps {
  date: number;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  return (
    <IonItem lines="none">
      <IonLabel className="date-separator">
        {utils.formatDate(date)}
      </IonLabel>
    </IonItem>
  );
};

export default DateSeparator;
