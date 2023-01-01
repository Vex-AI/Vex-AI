/* Imports */
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
/* Components */
import Loader from "./Loader";
import Content from "./Content";

const Splash = () => {
  const navigate = useNavigate();
  const color = "#fff";
  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  }, [navigate]);
  return (
    <Content>
      <Loader color={color} />
    </Content>
  );
};
export default Splash;
