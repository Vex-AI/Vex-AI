import { Box, Typography, Divider } from "@mui/material";
import { styled } from "@mui/system";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import cssStyles from "./css/MessageItem.module.css";
import Ripple from "react-ripplejs";
import { motion } from "framer-motion";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

interface SynonProps {
  syn: ISynon;
  onAddWord?: () => void;
  onDeleteSynon?: () => void;
  onAddReply?: () => void;
  index: number;
}

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

interface CustomStyle extends React.CSSProperties {
  rippleColor?: string;
}

const SynonItem: React.FC<SynonProps> = ({
  syn,
  onDeleteSynon,
  onAddWord,
  onAddReply,
  index,
}) => {
  const vexStyleString: string | null = localStorage.getItem("vexStyle");
  const vexStyle: CustomStyle = vexStyleString
    ? (JSON.parse(vexStyleString) as CustomStyle)
    : {};

  const reply: string = syn.reply.join(", ");
  const word: string = syn.word.join(", ");
  return (
    <motion.div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
    >
      <Ripple
        opacity={"0.5"}
        background={cssStyles.rippleColor}
        style={vexStyle}
        className={`${cssStyles.message} ${cssStyles.vex}`}
      >
          <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
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
      </Ripple>
    </motion.div>
  );
};

export default SynonItem;
