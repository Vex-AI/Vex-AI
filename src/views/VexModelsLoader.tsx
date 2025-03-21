import { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonIcon,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  useIonRouter,
  IonContent,
} from "@ionic/react";
import {
  cloudDownloadOutline,
  cloudDoneOutline,
  arrowBack,
} from "ionicons/icons";
import { db, ISynon } from "../classes/vexDB";
//@ts-ignore

interface VexModel {
  id: number;
  name: string;
  language?: string;
  author?: string;
  path?: string;
}

interface IFile {
  filePath: string;
  fileName: string;
  installed: boolean;
}

const VexModelsLoader: React.FC = () => {
  const [filesList, setFilesList] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useIonRouter();
  const navigate = (path: string) => {
    router.push(path, "root", "replace");
  };
  const synonsImport = async (fileContent: string, name: string) => {
    try {
      const jsonData = JSON.parse(fileContent);
      const sys: ISynon[] = jsonData.data;

      if (!Array.isArray(sys)) {
        console.error("Invalid JSON format");
        return;
      }

      await db.synons.clear();
      await db.synons.bulkAdd(sys);

      localStorage.setItem(name, "true");
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  useEffect(() => {
    const getList = async () => {
      /* @vite-ignore */
      const fileListGlob = import.meta.glob("/src/vexModels/*.json");
      const fileList: string[] = Object.keys(fileListGlob);
      setFilesList([]);

      fileList.forEach((filePath: string) => {
        const regex = /([^/]+)\.json$/;
        //@ts-ignore
        const fileName = filePath?.match(regex)[1];

        setFilesList((old: IFile[]) => {
          return [
            ...old,
            { fileName, filePath, installed: !!localStorage.getItem(filePath) },
          ];
        });
      });
    };
    getList();
  }, []);

  const handleFileImport = async (filePath: string) => {
    try {
      const jsonData = await import(filePath);
      const sys: ISynon[] = jsonData.data;

      if (!Array.isArray(sys)) {
        console.error("Invalid JSON format");
        return;
      }

      await db.synons.clear();
      await db.synons.bulkAdd(sys);

      localStorage.setItem(filePath, "true");
      setFilesList((prevFiles) =>
        prevFiles.map((file: IFile) =>
          file.filePath === filePath ? { ...file, installed: true } : file
        )
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                navigate("home");
              }}
              color="light"
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {filesList.map((file: IFile) => (
            <IonCard key={file.filePath}>
              <IonCardHeader>
                <IonCardTitle color="light">{file.fileName}</IonCardTitle>
              </IonCardHeader>
              <IonItem>
                {file.installed ? (
                  <IonButton color="tertiary" shape="round" disabled>
                    <IonIcon slot="start" icon={cloudDoneOutline} />
                    Installed
                  </IonButton>
                ) : (
                  <IonButton
                    color="tertiary"
                    shape="round"
                    onClick={() => handleFileImport(file.filePath)}
                  >
                    <IonIcon slot="start" icon={cloudDownloadOutline} />
                    Install
                  </IonButton>
                )}
              </IonItem>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default VexModelsLoader;
