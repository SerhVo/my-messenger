import {
  useReducer,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { auth, db, storage, messagesRef } from "../firebase";
import {
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { encryptMessage, decryptMessage } from "../utils/encryption";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Picker from "@emoji-mart/react"; // Правильный импорт
import { useUserAvatar } from "./RandomAvatar";
import { useAuth } from "./AuthProvider";

export default function Chat() {
  const [messages, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_MESSAGES":
        return action.payload;
      default:
        return state;
    }
  }, []);

  const [input, setInput] = useState("");
  const [msgLimit, setMsgLimit] = useState(20);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const user = useAuth();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    const q = query(messagesRef, orderBy("createdAt"), limit(msgLimit));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "SET_MESSAGES", payload: newMessages });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [msgLimit]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const debouncedSendMessage = useMemo(
    () =>
      debounce(async () => {
        if (
          !auth.currentUser ||
          input.trim().length < 1 ||
          input.trim().length > 500
        )
          return;
        try {
          const encryptedText = encryptMessage(input);
          await addDoc(messagesRef, {
            text: encryptedText,
            uid: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL,
            createdAt: new Date(),
            likes: [],
          });
          setInput("");
        } catch (error) {
          console.error("Ошибка при отправке сообщения:", error);
        }
      }, 500),
    [input]
  );

  const sendMessage = useCallback(() => {
    debouncedSendMessage();
  }, [debouncedSendMessage]);

  const handleTyping = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(messagesRef, {
      imageUrl,
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL,
      createdAt: new Date(),
      likes: [],
    });
  };

  // Получаем аватары заранее
  const avatarsMap = useMemo(() => {
    const map = {};
    messages.forEach((msg) => {
      map[msg.uid] = useUserAvatar(msg.uid, msg.photoURL);
    });
    return map;
  }, [messages]);

  return (
    <div className="relative w-full max-w-md p-4 border rounded-md">
      <div className="absolute inset-0 bg-[url('/fon.png')] bg-contain bg-repeat opacity-10"></div>
      <div className="relative z-10">
        <div className="h-64 overflow-auto border-b">
          {loading && <p>Загрузка сообщений...</p>}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`message flex justify-between items-center p-2 rounded-md ${
                msg.uid === auth.currentUser.uid
                  ? "bg-blue-200"
                  : "bg-green-200"
              }`}
            >
              <img
                src={avatarsMap[msg.uid]}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked(decryptMessage(msg.text))),
                }}
              />
              <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    updateDoc(doc(db, "messages", msg.id), {
                      likes: msg.likes.includes(auth.currentUser.uid)
                        ? arrayRemove(auth.currentUser.uid)
                        : arrayUnion(auth.currentUser.uid),
                    })
                  }
                >
                  ❤️ {msg.likes?.length ?? 0}
                </button>
                {msg.uid === auth.currentUser.uid && (
                  <button
                    onClick={() => deleteDoc(doc(db, "messages", msg.id))}
                  >
                    🗑
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {isTyping && (
          <p className="text-sm text-gray-500">Кто-то печатает...</p>
        )}
        <div className="flex items-center mt-2">
          {showEmojiPicker && (
            <Picker onEmojiSelect={(emoji) => setInput(input + emoji.native)} />
          )}
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            className="w-full p-2 border rounded-md"
            placeholder="Введите сообщение..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-sky-500 text-white rounded-md"
          >
            Отправить
          </button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            😊
          </button>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="cursor-pointer">
            📷
          </label>
        </div>
        <button
          onClick={() => setMsgLimit(msgLimit + 20)}
          className="p-2 bg-gray-200 rounded-md mt-2"
        >
          Загрузить больше
        </button>
      </div>
    </div>
  );
}
