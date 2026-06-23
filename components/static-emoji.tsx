const StaticEmoji = ({ code }: { code: string }) => {
  return (
    <img
      src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.png`}
      alt="emoji"
      width="32"
      height="32"
      className="inline-block"
      style={{ verticalAlign: "middle" }}
    />
  );
};

export default StaticEmoji;
