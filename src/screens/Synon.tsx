import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { MdAdd } from "react-icons/md";
import { Dispatch } from "redux";
import { v4 } from "uuid";
import { connect } from "react-redux";
import { RootState } from "../store/";
import utils from "../classes/utils";
import { wordsModalStyle } from "../themes/themes";
import {
  addReplyToSynon,
  addWordToSynon,
  deleteSynon,
  getAllSynons,
  setSynons,
  addSynon,
  deleteWordFromSynon,
  deleteReplyFromSynon,
} from "../store/reducers/vexReducer";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, NavigateFunction } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

import Container from "../components/Container";
import Input from "../components/Input";
import StarsBG from "../components/StarsBG";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import List from "../components/List";
import TextItem from "../components/TextItem";
import Loader from "../components/Loader";
import AlertComponent from "../components/AlertComponent";
import Modal from "react-modal";

const SynonItem = lazy(() => import("../components/SynonItem"));

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

interface ISynonProps {
  dispatch: Dispatch;
  synons: ISynon[];
}

const AddButton = styled(IconButton)({
  color: "#fff",
  backgroundColor: "#1b6d57",
  borderRadius: "10px",
  margin: "1rem 1rem 0 1rem",
  padding: "4rem 83rem 1rem 3rem",
  transition: "all 1s ease-in-out",
  "&:hover": {
    backgroundColor: "#3f3f3f",
  },
});

const CancelButton = styled(IconButton)({
  color: "#fff",
  margin: "1rem",
  backgroundColor: "#FF0060C4",
  borderRadius: "10px",
  padding: "1rem 83rem 1rem 3rem",
  "&:hover": {
    backgroundColor: "#3f3f3f",
  },
});

Modal.setAppElement("#root");

const Synon: React.FC<ISynonProps> = ({ dispatch, synons }) => {
  const navigate: NavigateFunction = useNavigate();
  const { t } = useTranslation();
  const [word, setWord] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [synonID, setSynonID] = useState<string>("");

  const words: string[] = useMemo(
    () => synons.find((item) => item.id === synonID)?.word || [],
    [synons, synonID]
  );
  const replies: string[] = useMemo(
    () => synons.find((item) => item.id === synonID)?.reply || [],
    [synons, synonID]
  );
  const [wordModal, setWordModal] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>("");
  const [replyModal, setReplyModal] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<string>("");

  const handleAddSynon = useCallback(() => {
    if (!word) return utils.mkToast(t("write_word"));
    if (!reply) return utils.mkToast(t("write_reply"));

    if (
      synons.some((synon) => synon.word.includes(utils.clear(word).join(" ")))
    ) {
      return utils.mkToast(t("allready_registered_word"));
    }

    dispatch(
      addSynon({
        word: [utils.clear(word).join(" ")],
        reply: [reply],
        id: v4(),
      })
    );
    setWord("");
    setReply("");
  }, [dispatch, synons, word, reply]);

  useEffect(() => {
    (async () => {
      const syns: ISynon[] = await getAllSynons();
      dispatch(setSynons(syns));
    })();
  }, [dispatch]);

  return (
    <Container
      style={{
        justifyContent: "flex-start",
      }}
    >
      <Container
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          minHeight: "0px",
          height: "50px",
          backgroundColor: "transparent",
          margin: "1rem 0 1rem 0",
        }}
      >
        <IconButton
          onClick={() => navigate("/home")}
          color="primary"
          style={{ padding: "1rem" }}
          aria-label={t("add") as string}
        >
          <ClearIcon
            style={{
              fill: "white",
              padding: "5px",
              width: "50px",
              height: "50px",
            }}
            aria-label={t("back_button") as string}
          />
        </IconButton>
      </Container>
      <ToastContainer />
      <StarsBG />
      <Input sx={{ margin: "0 2rem 1rem 2rem" }}>
        <TextField
          label={t("write_word")}
          variant="outlined"
          value={word}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setWord(event.target.value);
          }}
          fullWidth
        />
      </Input>
      <Input sx={{ margin: "0 2rem 0 2rem" }}>
        <TextField
          label={t("write_reply")}
          variant="outlined"
          value={reply}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setReply(event.target.value)
          }
          fullWidth
        />
      </Input>
      <AddButton
        color="primary"
        style={{ padding: "5px 10px 5px 10px" }}
        aria-label={t("add_button") as string}
        onClick={handleAddSynon}
      >
        <MdAdd size={28} />
      </AddButton>
      <AlertComponent message={t("warningDB")} keyName={"warningDB"} />
      <List style={{ justifyContent: "flex-start" }}>
        {synons.map((syn) => (
          <Suspense key={syn.id} fallback={<Loader />}>
            <SynonItem
              syn={syn}
              onDeleteSynon={() => {
                dispatch(deleteSynon(syn.id));
              }}
              onAddWord={() => {
                setSynonID(syn.id);
                setWordModal(true);
              }}
              onAddReply={() => {
                setSynonID(syn.id);
                setReplyModal(true);
              }}
            />
          </Suspense>
        ))}
      </List>
      <Modal isOpen={wordModal} style={wordsModalStyle}>
        <Input>
          <TextField
            label={t("write_new_word")}
            variant="outlined"
            value={newWord}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewWord(event.target.value)
            }
            fullWidth
          />
        </Input>
        <AddButton
          color="primary"
          style={{ padding: "5px 10px 5px 10px" }}
          aria-label={t("add_button") as string}
          onClick={() => {
            if (newWord.trim().length === 0)
              return utils.mkToast(t("write_new_word"));

            dispatch(
              addWordToSynon({
                id: synonID,
                value: newWord,
              })
            );
            setNewWord("");
          }}
        >
          <MdAdd size={28} />
        </AddButton>
        <CancelButton
          color="primary"
          style={{ padding: "5px 10px 5px 10px" }}
          aria-label={t("cancel_button") as string}
          onClick={() => {
            setSynonID("");
            setWordModal(false);
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              margin: " 0 1rem 0 1rem",
            }}
          >
            {t("cancel")}
          </p>
        </CancelButton>
        {synonID &&
          words.map((w, index) => (
            <TextItem
              title={w}
              key={index}
              onDeleteWord={() => {
                if (words.length === 1) return utils.mkToast(t("min_word"));
                dispatch(
                  deleteWordFromSynon({
                    id: synonID,
                    value: w,
                  })
                );
              }}
            />
          ))}
      </Modal>
      <Modal isOpen={replyModal} style={wordsModalStyle}>
        <Input>
          <TextField
            label={t("write_new_reply")}
            variant="outlined"
            value={newReply}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewReply(event.target.value)
            }
            fullWidth
          />
        </Input>
        <AddButton
          color="primary"
          style={{ padding: "5px 10px 5px 10px" }}
          aria-label={t("add_button") as string}
          onClick={() => {
            if (newReply.trim().length === 0)
              return utils.mkToast(t("write_new_reply"));
            dispatch(
              addReplyToSynon({
                id: synonID,
                value: newReply,
              })
            );
            setNewReply("");
          }}
        >
          <MdAdd size={28} />
        </AddButton>
        <CancelButton
          color="primary"
          style={{ padding: "5px 10px 5px 10px" }}
          aria-label={t("cancel_button") as string}
          onClick={() => {
            setSynonID("");
            setReplyModal(false);
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              margin: " 0 1rem 0 1rem",
            }}
          >
            {t("cancel")}
          </p>
        </CancelButton>
        {synonID &&
          replies.map((r, index) => (
            <TextItem
              title={r}
              key={index}
              onDeleteWord={() => {
                if (replies.length === 1) return utils.mkToast(t("min_reply"));
                dispatch(
                  deleteReplyFromSynon({
                    id: synonID,
                    value: r,
                  })
                );
              }}
            />
          ))}
      </Modal>
    </Container>
  );
};

export default connect((state: RootState) => ({
  synons: state.vex.synons,
}))(Synon);
