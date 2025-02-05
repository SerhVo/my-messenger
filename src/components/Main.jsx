import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import Chat from "./Chat";
import Login from "./Login";

export default function Main() {
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(user); // <-- Начальное значение

  useEffect(() => {
    setCurrentUser(user); // Обновляем состояние при изменении `user`
  }, [user]);

  const handleLogout = async () => {
    await logout(); // Выход
    setCurrentUser(null); // Очистка состояния, чтобы перерисовался Login
  };

  return (
    <div className="flex flex-col items-center p-4">
      <img
        src="/img/logo.png"
        alt="logo"
        className="w-20 h-20 p-2 object-fit"
      />
      <h1 className="text-2xl font-bold">Chat App</h1>

      {currentUser ? (
        <>
          <div className="flex justify-between items-center p-1">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <img
                src="/img/av_bird2.jpg"
                alt="Default Avatar"
                className="w-10 h-10 rounded-full"
              />
            )}
            <p className="text-sm text-gray-500 ml-10">
              Привет, {currentUser.displayName || "Аноним"}!
            </p>
            <button
              onClick={handleLogout} // <-- Используем новую функцию
              className="m-2 p-1 bg-gray-200 hover:bg-gray-500 text-sm hover:text-white rounded-md"
            >
              Выйти
            </button>
          </div>

          <Chat />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
