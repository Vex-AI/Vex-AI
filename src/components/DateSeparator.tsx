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
                margin: "2rem"
                //width: "fit-content",
            }}
        >
            <IonLabel
                style={{
                    fontWeight: "600"
                    // paddingLeft: "1rem",
                    //    paddingRight: "1rem"
                }}
                className="date-separator"
            >
                {utils.formatDate(date)}
            </IonLabel>
        </IonItem>
    );
};

export default DateSeparator;
