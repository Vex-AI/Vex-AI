import { useEffect, useState } from "react";

const TimeLeftForStreak: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("");

  const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeDifference = midnight.getTime() - now.getTime();
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    setTimeLeft(`${hours}h ${minutes}m`);
  };

  useEffect(() => {
    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000 * 60);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{timeLeft} left for today's streak!</span>;
};

export default TimeLeftForStreak;
