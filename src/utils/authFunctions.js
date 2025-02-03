import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Инициализация Toast
export const showToast = (message, type = "info") => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

// Регистрация по e-mail
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    showToast("Регистрация успешна!", "success");
    return { user: userCredential.user, error: null };
  } catch (error) {
    showToast(`Ошибка регистрации: ${error.message}`, "error");
    return { user: null, error: error.message };
  }
};

// Вход по e-mail
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    showToast("Вход выполнен успешно!", "success");
    return { user: userCredential.user, error: null };
  } catch (error) {
    showToast(`Ошибка входа: ${error.message}`, "error");
    return { user: null, error: error.message };
  }
};

// Анонимный вход
export const signInAnon = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    showToast("Вы вошли анонимно!", "success");
    return { user: userCredential.user, error: null };
  } catch (error) {
    showToast(`Ошибка анонимного входа: ${error.message}`, "error");
    return { user: null, error: error.message };
  }
};

// Выход
export const logout = async () => {
  try {
    await signOut(auth);
    showToast("Вы успешно вышли!", "info");
    return { success: true, error: null };
  } catch (error) {
    showToast(`Ошибка выхода: ${error.message}`, "error");
    return { success: false, error: error.message };
  }
};
