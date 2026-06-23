import { useState } from "react";

const AnimatedEmoji = ({ code }: { code: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    try {
      const nativeEmoji = code
        .split('_')
        .map(c => parseInt(c, 16))
        .map(n => String.fromCodePoint(n))
        .join('');
      return (
        <span 
          className="inline-flex w-8 h-8 items-center justify-center text-[24px] leading-none" 
          style={{ verticalAlign: "middle" }}
        >
          {nativeEmoji}
        </span>
      );
    } catch {
      return null;
    }
  }

  return (
    <picture className="inline-flex w-8 h-8 items-center justify-center shrink-0" style={{ verticalAlign: "middle" }}>
      <source
        srcSet={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`}
        type="image/webp"
      />
      <img
        src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.gif`}
        alt="emoji"
        width="32"
        height="32"
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
      />
    </picture>
  );
};

export default AnimatedEmoji;
