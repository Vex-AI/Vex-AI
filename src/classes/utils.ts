import diacritics from "diacritics";
import { toast } from "react-toastify";
import i18n from "./translation";
//import jwt, { Secret } from "jsonwebtoken";
//const key: Secret = import.meta.env.VITE_ENCRYPT_KEY ?? "cookie1234";

export default {
  /*encrypt(content: string): string {
    const token: string = jwt.sign(content, key);
    return token;
  },
  decrypt(token: string): any {
    try {
      const decoded: any = jwt.verify(token, key);
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  },*/
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
      .map((word) => diacritics.remove(word));
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
