import Container from "../components/Container";
import Input from "../components/Input";
import StarsBG from "../components/StarsBG";
import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import Cancel from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import List from "../components/List";
import TextItem from "../components/TextItem";
import Modal from "react-modal";
import { Dispatch } from "redux";
import { v4 } from "uuid";
import {
  addReplyToSynon,
  addWordToSynon,
  deleteSynon,
  getAllSynons,
  getAllMessages,
  addSynon,
  deleteWordFromSynon,
  deleteReplyFromSynon,
  setSynons,
} from "../store/reducers/vexReducer";
import { RootState } from "../store/";
import utils from "../classes/utils";
import { wordsModalStyle } from "../themes/themes";
import { connect } from "react-redux";
const { log } = console;
import SynonItem from "../components/SynonItem";
import Drawer from "../components/Drawer";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, NavigateFunction } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}
interface IMessage {
  content: string;
  isVex: boolean;
  hour: string;
  date: string;
  id: string;
  createdAt?: number;
}

const AddButton = styled(IconButton)({
  color: "#fff",
  backgroundColor: "#1b6d57",
  borderRadius: "10px",
  margin: "1rem 1rem 0 1rem",
  padding: "4rem 83rem 1rem 3rem",
  transition:"all 1s ease-in-out",
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

interface ISynonProps {
  dispatch: Dispatch;
  synons: ISynon[];
}
const Synon: React.FC<ISynonProps> = ({ dispatch, synons }) => {
  const navigate: NavigateFunction = useNavigate();

  const [word, setWord] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [synonID, setSynonID] = useState<string>("");
  const words: string[] =
    synons.find((item) => item.id === synonID)?.word || [];
  const replies: string[] =
    synons.find((item) => item.id === synonID)?.reply || [];
  const [wordModal, setWordModal] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>("");
  const [replyModal, setReplyModal] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<string>("");

  useEffect(() => {
    (async () => {
      const syns: ISynon[] = await getAllSynons();
      dispatch(setSynons(syns));
    })();
  }, []);

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
        }}
      >
        <IconButton
          onClick={() => navigate("/home")}
          color="primary"
          style={{ padding: "1rem" }}
          aria-label="Adicionar"
        >
          <ClearIcon
            style={{ padding: "5px 10px 5px 10px" }}
            aria-label="back button"
          />
        </IconButton>
      </Container>
      <ToastContainer />
      <Drawer />
      <StarsBG />
      <Input
        sx={{
          margin: "0 2rem 1rem 2rem",
        }}
      >
        <TextField
          label="Write a word"
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
          label="Write a reply"
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
        aria-label="add button"
        onClick={() => {
          if (!word) return utils.mkToast("Write a word");
          if (!reply) return utils.mkToast("Write a reply");

          if (synons.some((synon) => synon.word.includes( utils.clear(word).join(" "))))
            return utils.mkToast("This word is already registered");

          dispatch(
            addSynon({
              word: [utils.clear(word).join(" ")],
              reply: [reply],
              id: v4(),
            })
          );
          setWord("");
          setReply("");
        }}
      >
        <MdAdd size={28} />
      </AddButton>
      <List style={{ justifyContent: "flex-start" }}>
        {synons.map((syn) => (
          <SynonItem
            syn={syn}
            key={syn.id}
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
        ))}
      </List>
      <Modal isOpen={wordModal} style={wordsModalStyle}>
        <Input>
          <TextField
            label="Write a new word"
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
          aria-label="add button"
          onClick={() => {
            if (newWord.trim().length === 0)
              return utils.mkToast("Write a new word");

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
          aria-label="cancel button"
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
            Cancel
          </p>
          <Cancel height={28} width={28} />
        </CancelButton>
        {synonID &&
          words.map((w, index) => (
            <TextItem
              title={w}
              key={index}
              onDeleteWord={() => {
                if (words.length == 1)
                  return utils.mkToast("You must have at least 1 word");
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
            label="Write a new reply"
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
          aria-label="add button"
          onClick={() => {
            if (newReply.trim().length === 0)
              return utils.mkToast("Write a new reply");

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
          aria-label="cancel button"
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
            Cancel
          </p>
          <Cancel height={28} width={28} />
        </CancelButton>
        {synonID &&
          replies.map((r, index) => (
            <TextItem
              title={r}
              key={index}
              onDeleteWord={() => {
                if (replies.length == 1)
                  return utils.mkToast("You must have at least 1 reply");
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
