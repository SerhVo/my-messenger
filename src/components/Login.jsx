import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { signInWithGoogle } from "../firebase";

export default function Login() {
  const { signUp, signIn, signInAnon } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const formElement = document.querySelector("#login-form");
  // if (formElement) {
  //   formElement.getBoundingClientRect();
  // } else {
  //   console.warn("Форма входа не найдена.");
  // }
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Вход в чат</h2>

      {/* Ввод e-mail и пароля */}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded-md mb-2 w-60"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded-md mb-2 w-60"
      />

      {/* Кнопки */}
      <button
        onClick={() => signIn(email, password)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md w-60 mb-2"
      >
        Войти
      </button>
      <button
        onClick={() => signUp(email, password)}
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md w-60 mb-2"
      >
        Зарегистрироваться
      </button>
      <button
        className="text-white bg-yellow-400 p-2 rounded-md w-60 mb-2 hover:bg-yellow-600  hover:text-white "
        onClick={signInWithGoogle}
      >
        Войти через Google
      </button>
      <button
        onClick={signInAnon}
        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md w-60"
      >
        Войти анонимно
      </button>
    </div>
  );
}
