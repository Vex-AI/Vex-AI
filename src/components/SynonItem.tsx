import React from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
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
  onAddWordSynon?: () => void;
  onDeleteSynon?: () => void;
  onAddReplySynon?: () => void;
  index: number;
}

const StyledIconButton = styled(IconButton)({
  backgroundColor: "#fff",
  color: "#000",
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
  onAddWordSynon,
  onAddReplySynon,
  index,
}) => {
  const vexStyleString: string | null = localStorage.getItem("vexStyle");
  const vexStyle: React.CSSProperties = vexStyleString
    ? (JSON.parse(vexStyleString) as React.CSSProperties)
    : {};

  const reply: string = syn.reply.join(", ");
  const word: string = syn.word.join(", ");

  return (
    <motion.div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Ripple
        opacity={"0.5"}
        background={cssStyles.rippleColor}
        style={{ ...vexStyle, overflow: "hidden", width: "100%" }}
        className={`${cssStyles.message} ${cssStyles.vex}`}
      >
        <Box
          sx={{
            zIndex: "10",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {word.length > 20 ? `${word.slice(0, 20)}...` : word}
          </Typography>{" "}
          <Typography sx={{ width: "100%", padding: "8px" }}>
            {reply.length > 20 ? `${reply.slice(0, 20)}...` : reply}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <StyledIconButton onClick={onAddWordSynon}>
              <ControlPointDuplicateIcon />
            </StyledIconButton>
            <StyledIconButton onClick={onAddReplySynon}>
              <ReplyAllIcon />
            </StyledIconButton>
            <StyledIconButton onClick={onDeleteSynon}>
              <DeleteOutlineIcon />
            </StyledIconButton>
          </Box>
        </Box>
        <Divider sx={{ width: "100%" }} />
      </Ripple>
    </motion.div>
  );
};

export default SynonItem;
