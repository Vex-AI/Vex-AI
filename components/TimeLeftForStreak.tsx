import  { useEffect, useState } from 'react';

const TimeLeftForStreak: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState('');

  // Função para calcular o tempo restante até a meia-noite
  const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Define a meia-noite de hoje

    const timeDifference = midnight.getTime() - now.getTime();
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    setTimeLeft(`${hours}h ${minutes}m`);
  };

  useEffect(() => {
    // Atualiza o tempo restante a cada minuto
    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000 * 60); // Atualiza a cada minuto

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, []);

  return <span>{timeLeft} left for today's streak!</span>;
};

export default TimeLeftForStreak;
