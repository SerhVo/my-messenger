import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./components/AuthProvider";
import Main from "./components/Main";

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
