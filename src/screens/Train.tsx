import { Dispatch } from "redux";
import { connect } from "react-redux";
import StarsBG from "../components/StarsBG";
import Container from "../components/Container";
import { useState, useMemo, useCallback, useEffect } from "react";
import util from "../classes/utils";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";
import BayesClassifier from "bayes";
import { db } from "../classes/vexDB";
import { RootState } from "../store/";
import { useTranslation } from "react-i18next";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

interface ITrainProps {
  dispatch: Dispatch;
}

const theme = createTheme({
  palette: {
    text: {
      primary: "#ffffff",
    },
  },
});

const Train: React.FC<ITrainProps> = ({ dispatch }) => {
  const [content, setContent] = useState<string>("");
  const [classifier, setClassifier] = useState<any>(null);
  const { t } = useTranslation();

  const trainModel = useCallback(() => {
    (async () => {
      util.mkToast(t("trainingStarted"));
      const search: ISynon[] = await db.getAllSynons();
      search.forEach((synon: ISynon) => {
        synon.reply.forEach(async (r: string) => {
          synon.word.forEach(async (w: string) => {
            await classifier.learn(w, r);
          });
        });
      });
      await db.saveModelToDB(classifier.toJson());
      util.mkToast(t("trainingCompleted"));
    })();
  }, [classifier, t]);

  const retrainModel = useCallback(() => {
    setClassifier(BayesClassifier());
    trainModel();
  }, [trainModel]);

  useEffect(() => {
    const fetchData = () => {
      db.loadModelFromDB()
        .then((data: any) => {
          setClassifier(data);
        })
        .catch((error: any) => {
          util.mkToast("Error on load classifier:" + error);
          setClassifier(BayesClassifier());
        });
    };

    fetchData();
  }, []);

  const getSynonsToFile = useCallback(() => {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = ".vex";

    input.addEventListener("change", (event: Event) => {
      const file: File | undefined = (event.target as HTMLInputElement)
        ?.files?.[0];
      const reader: FileReader = new FileReader();

      if (file) {
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          const contents = e.target?.result as string | null;
          try {
            if (contents) {
              const jsonData: ISynon[] = JSON.parse(contents);

              if (!Array.isArray(jsonData)) {
                util.mkToast(t("invalidSynonsArray"));
                return;
              }
              await db.synons.clear();
              await db.synons.bulkAdd(jsonData);

              util.mkToast(t("synonsAdded"));
            }
          } catch (error) {
            util.mkToast(t("fileProcessingError") + error);
            console.log("Error processing file:", error);
          }
        };

        reader.readAsText(file);
      }
    });

    input.click();
  }, [t]);

  const saveSynonsToFile = useCallback(async () => {
    const synons: ISynon[] = await db.synons.toArray();

    if (synons.length === 0) {
      util.mkToast(t("noSynonsData"));
      return;
    }

    const id: number = Math.floor(Math.random() * 10000);
    const fileName: string = `vex_db_${id}.vex`;
    const fileContents: string = JSON.stringify(synons);

    const blob: Blob = new Blob([fileContents], { type: "application/json" });
    const url: string = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }, [t]);

  return (
    <ThemeProvider theme={theme}>
      <Container style={{ rowGap: "2rem" }}>
        <StarsBG />
        <ToastContainer />

        {/* <TextField
          value={content}
          type="text"
          onChange={(e) => setContent(e.target.value.toLowerCase())}
          placeholder={t("placeholderText") as string}
        />*/
        /*  <Button
          variant="contained"
          onClick={async () => {
            if (!content) {
              util.mkToast(t("fillField"));
              return;
            }
            const result = await classifier.categorize(content);
            console.log({ content, result });
            util.mkToast(result);
          }}
          startIcon={<YoutubeSearchedForIcon />}
        >
          {t("predict")}
        </Button>
*/
        /* <Button
          variant="contained"
          onClick={() => trainModel()}
          startIcon={<ModelTrainingIcon />}
        >
          {t("train")}
        </Button>*/}

        <Button
          variant="contained"
          onClick={() => getSynonsToFile()}
          startIcon={<FileUploadIcon />}
        >
          {t("importData")}
        </Button>

        <Button
          variant="contained"
          onClick={() => saveSynonsToFile()}
          startIcon={<SaveAltIcon />}
        >
          {t("exportData")}
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default connect((state: RootState) => ({
  synons: state.vex.synons,
}))(Train);
