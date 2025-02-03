import CryptoJS from "crypto-js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "fallback_key";
console.log("🔑 SECRET_KEY:", SECRET_KEY);
export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error("❌ Ошибка при расшифровке:", error);
    return "Ошибка";
  }
};

/** Функция редактирования сообщения */
export const editMessage = async (id, newText) => {
  try {
    const encryptedText = CryptoJS.AES.encrypt(newText, SECRET_KEY).toString();
    await updateDoc(doc(db, "messages", id), { text: encryptedText });
  } catch (error) {
    console.error("❌ Ошибка при редактировании сообщения:", error);
  }
};
