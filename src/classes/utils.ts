import diacritics from "diacritics";
import { toast } from "react-toastify";

export default {
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
      .map((word) => diacritics.remove(word))
      
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
};
