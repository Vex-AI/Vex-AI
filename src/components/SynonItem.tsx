import { Box, Typography, Divider } from "@mui/material";
import { styled } from "@mui/system";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

type SynonProps = {
  syn: ISynon;
  onAddWord?: () => void;
  onDeleteSynon?: () => void;
  onAddReply?: () => void;
};

const StyledBox = styled(Box)({
  backgroundColor: "#0E8BAAB8",
  color: "#cfd8dc",
  borderRadius: "10px",
  padding: "2rem",
  borderBottom: "8px",
  borderColor: "#fff",
  margin: "1rem",
  boxSizing: "border-box",
  animation: "vexScale 0.4s forwards",
  "&:hover": {
    backgroundColor: "#068a1c",
    transition: "background .7s ease-in-out",
  },
});

const StyledDivider = styled(Divider)({
  backgroundColor: "#cfd8dc",
  margin: "8px 0",
});

const StyledIcon = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  color: "#000",
  padding: "1rem",
  borderRadius: "10%",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  marginRight: "8px",
  "&:hover": {
    backgroundColor: "#C7D425E8",
    transition: "background .7s ease-in-out",
  },
});

const SynonItem: React.FC<SynonProps> = ({
  syn,
  onDeleteSynon,
  onAddWord,
  onAddReply,
}) => {
  const reply: string = syn.reply.join(", ");
  const word: string = syn.word.join(", ");
  return (
    <StyledBox>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          {word.length > 20 ? `${word.slice(0, 20)}...` : word}
        </Typography>
        <StyledIcon onClick={onAddWord}>
          <ControlPointDuplicateIcon />
        </StyledIcon>
        <StyledIcon onClick={onAddReply}>
          <ReplyAllIcon />
        </StyledIcon>
        <StyledIcon onClick={onDeleteSynon}>
          <DeleteOutlineIcon />
        </StyledIcon>
      </Box>
      <StyledDivider />
      <Typography sx={{ width: "100%" }}>
        {reply.length > 20 ? `${reply.slice(0, 20)}...` : reply}
      </Typography>
    </StyledBox>
  );
};

export default SynonItem;
