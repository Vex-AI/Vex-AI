import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { flameOutline, timeOutline } from 'ionicons/icons';


const StreakPage: React.FC = () => {



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Streaks</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Current Streak</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="auto">
                  <IonIcon icon={flameOutline} size="large" />
                </IonCol>
                <IonCol>
                  <h2>0 days</h2>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Time Left Today</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="auto">
                  <IonIcon icon={timeOutline} size="large" />
                </IonCol>
                <IonCol>
                  <h2>4 hours left</h2>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Daily Goal Status</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {true ? (
              <p>You've met your daily goal! 🎉</p>
            ) : (
              <>
                <p>Use the app for 4 minutes to meet today's goal!</p>
                <IonButton expand="block">
                  Mark Daily Goal Complete
                </IonButton>
              </>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StreakPage;
