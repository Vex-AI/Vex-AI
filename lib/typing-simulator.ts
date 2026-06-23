export const calculateOrganicTypingTime = (text: string): number => {
  const chars = text.length;
  const cps = 4.5 + Math.random() * 3.5;
  
  const typoPause = Math.random() < 0.35 ? 200 + Math.random() * 1200 : 0;
  
  const punctuationPause = (text.match(/[.,!?;:]/g)?.length || 0) * (40 + Math.random() * 80);
  
  let time = (chars / cps) * 1000 + typoPause + punctuationPause;
  
  return Math.min(Math.max(800, time), 15000);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
