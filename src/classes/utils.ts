import diacritics from "diacritics";
import { toast } from "react-toastify";
import i18n from "./translation";

export default {
  async getResponse() {
    const responsePromise = await import(
      `../response/response_${i18n.language}.json`
    );
    const response = await responsePromise.default;
    const randomIndex: number = Math.floor(Math.random() * response.length);
    return response[randomIndex];
  },
  async readFile(path: string) {
    const response: any = await fetch(path);
    return response.text();
  },
  inherits(a: any, b: any) {
    Object.setPrototypeOf(a.prototype, b.prototype);
  },

  clear(message: string) {
    return message
      .replace(/<@.?[0-9]*?>/g, "")
      .replace(/(https?:\/\/[^\s]+)/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(" ")
      .filter((e) => String(e).trim())
      .map((word: string) => diacritics.remove(word));
  },
  mkToast(message: string) {
    toast(message, {
      position: "bottom-right",
      autoClose: 1700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  },
  scrollToBottom: (query = "ion-content") => {
    const list: NodeListOf<HTMLIonContentElement> =
      document.querySelectorAll(query);
    if (list.length) {
      const content: HTMLIonContentElement = list[list.length - 1];
      content.scrollToBottom();
    }
  },
  scrollTwoBottom: () => {
    let list = document.querySelector("ion-content");
    return list && list.scrollToBottom();
  },
  formatHour: (time: string) => {
    // Cria um objeto Date com a hora fornecida.
    // Adiciona uma data fictícia para criar um objeto Date.
    const [hours, minutes] = time.split(":"); // Divide a string no caractere ':'
    return `${hours}:${minutes}`; // Retorna a hora no formato "HH:mm"
  },
  formatDate: (timestamp: number): string => {
    const today = new Date();
    const messageDate = new Date(timestamp);

    // Função para formatar a data no formato "dia/mês(abreviado)/ano"
    const formatDate = (date: Date): string => {
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    if (messageDate.toDateString() === today.toDateString()) {
      return "Hoje";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    }

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    if (messageDate.toDateString() === twoDaysAgo.toDateString()) {
      return "Anteontem";
    }

    return formatDate(messageDate);
  },
};
