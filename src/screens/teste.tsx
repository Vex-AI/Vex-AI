import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
const writeSecretFile = async () => {
  await Filesystem.writeFile({
    path: "text.txt",
    data: "This is a test",
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
};

const Nada: React.FC = () => {
  const click = () => {
    writeSecretFile();
    console.log(9);
  };
  return (
    <>
      oi
      <button onClick={() => click()}>cligue agui</button>
    </>
  );
};

export default Nada;
