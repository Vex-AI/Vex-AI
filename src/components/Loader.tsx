import ClimbLoader from "../anim/loaders/ClimbLoader";
import RippleLoader from "../anim/loaders/RippleLoader";
import GridLoader from "../anim/loaders/GridLoader";
import RotateLoader from "../anim/loaders/RotateLoader";
import RingLoader from "../anim/loaders/RingLoader";
import EllipsisLoader from "../anim/loaders/EllipsisLoader";
import FaceBookLoader from "../anim/loaders/FaceBookLoader";
import BoxLoader from "../anim/loaders/BoxLoader";
import ScaleLoader from "../anim/loaders/ScaleLoader";
import CircleLoader from "../anim/loaders/CircleLoader";
import BlockLoader from "../anim/loaders/BlockLoader";
import FlipLoader from "../anim/loaders/FlipLoader";

interface LoaderProps {
  color?: string;
}

const loaders = [
  ClimbLoader,
  RippleLoader,
  GridLoader,
  RotateLoader,
  RingLoader,
  EllipsisLoader,
  FaceBookLoader,
  BoxLoader,
  ScaleLoader,
  CircleLoader,
  BlockLoader,
  FlipLoader,
];

const Loader: React.FC<LoaderProps> = ({ color = "#fff" }) => {
  const randomIndex = Math.floor(Math.random() * loaders.length);
  const LoaderComponent = loaders[randomIndex];

  return (
    <div
      style={{
        width: "120px",
        height: "120px",
      }}
    >
      <LoaderComponent color={color} />
    </div>
  );
};

export default Loader;
