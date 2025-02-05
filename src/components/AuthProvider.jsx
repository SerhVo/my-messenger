import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Убираем `logout`
import { signIn, signInAnon, signUp } from "../utils/authFunctions";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Исправленный logout
const logout = async () => {
  await signOut(auth); // Используем Firebase auth напрямую
  setUser(null); // Обновляем состояние после выхода
};

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signInAnon, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
