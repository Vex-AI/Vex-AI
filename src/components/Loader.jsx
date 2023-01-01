/* Imports */
import "./css/Loader.css";

/* Components */
import CircleLoader from "./animations/loaders/CircleLoader";
import FlipLoader from "./animations/loaders/FlipLoader";
import ScaleLoader from "./animations/loaders/ScaleLoader";
import EllipsisLoader from "./animations/loaders/EllipsisLoader";
import FaceBookLoader from "./animations/loaders/FaceBookLoader";
import RingLoader from "./animations/loaders/RingLoader";
import GridLoader from "./animations/loaders/GridLoader";
import RippleLoader from "./animations/loaders/RippleLoader";
import RotateLoader from "./animations/loaders/RotateLoader";
import BoxLoader from "./animations/loaders/BoxLoader";
import ClimbLoader from "./animations/loaders/ClimbLoader";
import BlockLoader from "./animations/loaders/BlockLoader";

const Loader = ({ color }) => {
  const random = Math.floor(Math.random() * 11);
  const renderLoad = () => {
    switch (random) {
      case 0:
        return <ClimbLoader color={color} />;
      case 1:
        return <RippleLoader color={color} />;
      case 2:
        return <GridLoader color={color} />;
      case 3:
        return <RotateLoader color={color} />;
      case 4:
        return <RingLoader color={color} />;
      case 5:
        return <EllipsisLoader color={color} />;
      case 6:
        return <FaceBookLoader color={color} />;
      case 7:
        return <BoxLoader color={color} />;
      case 8:
        return <ScaleLoader color={color} />;
      case 9:
        return <CircleLoader color={color} />;
      case 10:
        return <BlockLoader color={color} />;
      case 11:
        return <FlipLoader color={color} />;
      default:
        return;
    }
  };
  return <div id="base">{renderLoad()}</div>;
};
export default Loader;
