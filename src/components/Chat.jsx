import { useReducer, useEffect, useState, useRef} from "react";
import {  messagesRef } from "../firebase";
import { query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function Chat() {
  const [messages, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_MESSAGES":
        return action.payload;
      default:
        return state;
    }
  }, []);

  const [msgLimit, setMsgLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const user = useAuth();

  useEffect(() => {
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
  if (messages.length > 0) {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}, [messages]);

  return (
    <div className="relative w-full max-w-md p-4 border rounded-md">
      <div className="absolute inset-0 bg-[url('/fon.png')] bg-contain bg-repeat opacity-10"></div>
      <div className="relative z-10">
        <MessageList
          messages={messages || []}
          loading={loading}
          messagesEndRef={messagesEndRef}
        />
        <MessageInput messagesEndRef={messagesEndRef} />
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
