import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { signInWithGoogle } from "../firebase";

export default function Login() {
  const { signUp, signIn, signInAnon } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  // Фокус на поле email
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleAuth = async (authFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      await authFunction(...args); // ✅ Передаем аргументы корректно
    } catch (err) {
      setError(err.message || "Ошибка входа");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Вход в чат</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Ввод e-mail и пароля */}
      <input
        type="email"
        ref={emailRef}
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded-md mb-2 w-60"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded-md mb-2 w-60"
        disabled={loading}
      />

      {/* Кнопки */}
      <button
        onClick={() => handleAuth(signIn, email, password)}
        className={`bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md w-60 mb-2 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!email || !password || loading}
      >
        {loading ? "Вход..." : "Войти"}
      </button>

      <button
        onClick={() => handleAuth(signUp, email, password)}
        className={`bg-green-500 hover:bg-green-600 text-white p-2 rounded-md w-60 mb-2 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!email || !password || loading}
      >
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      <button
        className={`text-white bg-yellow-400 p-2 rounded-md w-60 mb-2 hover:bg-yellow-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => handleAuth(signInWithGoogle)}
        disabled={loading}
      >
        Войти через Google
      </button>

      <button
        onClick={() => handleAuth(signInAnon)}
        className={`bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md w-60 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        Войти анонимно
      </button>
    </div>
  );
}
