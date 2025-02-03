import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import Chat from "./components/Chat";
import Login from "./components/Login";
import { useUserAvatar } from "./components/RandomAvatar";
// import Main from "./components/Main";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Main />
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

function Main() {
  const { user, logout } = useAuth();
  const avatar = useUserAvatar(user?.id || "", user?.photoURL || "");

  return (
    <div className="flex flex-col items-center p-4">
      <img
        src="./public/img/logo.png"
        alt="logo"
        className="w-20 h-20 p-2 object-fit"
      />
      <h1 className="text-2xl font-bold">Chat App</h1>

      {user ? (
        <>
          <div className="flex justify-between items-center p-1">
            {avatar && (
              <img
                src={avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
            )}
            <p className="text-sm text-gray-500 ml-10">
              Привет, {user.email || "Аноним"}!
            </p>
            <button
              onClick={logout}
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
