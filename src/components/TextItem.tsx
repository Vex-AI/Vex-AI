
import styled from "styled-components";
import { Box } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const Title = styled.span`
  flex: 1;
`;

const Base = styled(Box)({
  backgroundColor: "#0E8BAAB8",
  display: "flex",
  justifyContent: "space-between",
  color: "#cfd8dc",
  borderRadius: "10px",
  padding: "1rem",
  height: "auto",
  width: "100%",
  borderBottom: "8px",
  borderColor: "#fff",
  margin: ".7rem 1rem .7rem 1rem",
  "&:hover": {
    backgroundColor: "#068a1c",
    transition: "background .7s ease-in-out",
  },
});

const StyledIcon = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  color: "black",
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
interface ITextItemProps {
  title: string;
  onDeleteWord: () => void;
}

const TextItem: React.FC<ITextItemProps> = ({ title, onDeleteWord }) => {
  return (
    <Base>
      <Title>{title}</Title>
      <StyledIcon onClick={onDeleteWord}>
        <DeleteForeverIcon />
      </StyledIcon>
    </Base>
  );
};

export default TextItem;
