// import { useAuth } from "./AuthProvider";
// import { signInWithGoogle, logout } from "../firebase";
// import Chat from "./Chat";
// import Login from "./Login";

// export default function Main() {
//   const user = useAuth();

//   return (
//     <div className="flex flex-col items-center p-4">
//       <img
//         src="./public/img/logo.png"
//         alt="logo"
//         className="w-20 h-20 p-2 object-fit"
//       />

//       <h1 className="text-2xl font-bold">Chat App</h1>

//       {/* {user ? (
//         <>
//           <p className="text-sm text-gray-500">
//             Привет, {user.email || "Аноним"}!
//           </p>
//           <button
//             onClick={logout}
//             className="bg-gray-200 text-red-500 p-1 rounded-md mt-2 mb-2 cursor-pointer"
//           >
//             Выйти
//           </button>
//           <Chat />
//         </>
//       ) : (
//         <Login />
//       )}
//     </div>
//   );
// } */}

//       {user && (
//         <div className="flex items-center">
//           <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//             Welcome, {user.email}!
//           </p>
//           <button
//             onClick={logout}
//             className="m-2 p-1 bg-gray-200 hover:bg-gray-500 text-sm hover:text-white rounded-md"
//           >
//             Выйти
//           </button>
//         </div>
//       )}

//       {user ? (
//         <Chat />
//       ) : (
//         <button
//           className="m-2 p-1 bg-gray-200 hover:bg-gray-500 text-sm hover:text-white rounded-md"
//           onClick={signInWithGoogle}
//         >
//           Войти через Google
//         </button>
//       )}
//     </div>
//   );
// }
