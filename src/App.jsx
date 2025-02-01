import { AuthProvider, useAuth } from "./components/AuthProvider";
import Chat from "./components/Chat";
import Login from "./components/Login";

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Chat App</h1>

      {user ? (
        <>
          <p className="text-sm text-gray-500">
            Привет, {user.email || "Аноним"}!
          </p>
          <button
            onClick={logout}
            className="bg-red-500 text-white p-2 rounded-md mt-2"
          >
            Выйти
          </button>
          <Chat />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
