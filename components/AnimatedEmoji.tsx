const AnimatedEmoji = ({ code }: { code: string }) => {
  return (
    <picture style={{ verticalAlign: "middle" }}>
      <source
        srcSet={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`}
        type="image/webp"
      />
      <img
        src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.gif`}
        alt="emoji"
        width="32"
        height="32"
        style={{ verticalAlign: "middle" }}
      />
    </picture>
  );
};

export default AnimatedEmoji;
