import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signInAnon, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Регистрация по e-mail
const signUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Ошибка регистрации:", error.message);
  }
};

// Вход по e-mail
const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Ошибка входа:", error.message);
  }
};

// Анонимный вход
const signInAnon = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Ошибка анонимного входа:", error.message);
  }
};

// Выход
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Ошибка выхода:", error.message);
  }
};
