// hooks/useVexMessage.ts - VERSÃO ISOLADA E FINAL

import { useState } from 'react';
import { analyzer } from '@/lib/analyzer';
import { sendMessage } from '@/lib/utils';

// O tipo de estado continua o mesmo.
export type ProcessingStatus = 'online' | 'processing';

export const useVexMessage = () => {
  // O estado é puramente lógico.
  const [status, setStatus] = useState<ProcessingStatus>('online');

  const sendVexMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setStatus('processing');

    try {
      const vexReply = await analyzer(userMessage);
      sendMessage(vexReply, true);
    } catch (error) {
      console.error("Ocorreu um erro ao processar a resposta de Vex:", error);
      sendMessage("Desculpe, tive um problema para processar sua mensagem.", true);
    } finally {
      setStatus('online');
    }
  };

  return {
    sendVexMessage,
    // A lógica de processamento continua simples.
    isProcessing: status === 'processing',
    // RETORNAMOS O ESTADO BRUTO. O componente vai decidir como exibi-lo.
    status,
  };
};