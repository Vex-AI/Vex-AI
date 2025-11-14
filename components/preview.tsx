interface PreviewProps {
  style: React.CSSProperties;
  text: string;
}

const Preview = ({ style, text }: PreviewProps) => {
  return (
    <div
      className="rounded-xl shadow-md w-full sticky top-0 z-20 cursor-pointer select-none"
      style={{
        ...style,
        padding: "1rem",
        textAlign: "center",
        transition: "all .25s ease",
      }}
    >
      <h2
        className="font-semibold text-lg"
        style={{ color: style.color ?? "#fff" }}
      >
        {text}
      </h2>
    </div>
  );
};

export default Preview;
