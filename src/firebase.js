import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBaFcANMR9Ff0mowQlCpE0cMgv9rJj87oI",
  authDomain: "my-messenger-f0a59.firebaseapp.com",
  projectId: "my-messenger-f0a59",
  storageBucket: "my-messenger-f0a59.firebasestorage.app",
  messagingSenderId: "526759938419",
  appId: "1:526759938419:web:e31f5ddc97b96a0a889d06",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const messagesRef = collection(db, "messages");
export const storage = getStorage(app); // Инициализация Storage

