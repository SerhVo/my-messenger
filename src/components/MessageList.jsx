import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { decryptMessage } from "../utils/encryption";
import { useUserAvatar } from "./RandomAvatar";
import PropTypes from "prop-types";
import { useAuth } from "./AuthProvider";

export default function MessageList({ messages, loading, messagesEndRef }) {
  const user = useAuth();
  const avatar = useUserAvatar(user.id, user.photoURL);
  return (
    <div className="h-64 overflow-auto border-b">
      {loading && <p>Загрузка сообщений...</p>}
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`message flex justify-between items-center p-2 rounded-md ${
            msg.uid === auth.currentUser.uid ? "bg-blue-200" : "bg-green-200"
          }`}
        >
          <img
            src={avatar}
            alt="User Avatar" // Используем полученный аватар
            className="w-10 h-10 rounded-full"
          />
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                marked(decryptMessage(msg.text || ""))
              ),
            }}
          />
          <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                updateDoc(doc(db, "messages", msg.id), {
                  likes: (msg.likes || []).includes(auth.currentUser.uid)
                    ? arrayRemove(auth.currentUser.uid)
                    : arrayUnion(auth.currentUser.uid),
                })
              }
            >
              ❤️ {msg.likes?.length ?? 0}
            </button>
            {msg.uid === auth.currentUser.uid && (
              <button onClick={() => deleteDoc(doc(db, "messages", msg.id))}>
                🗑
              </button>
            )}
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} /> {/* Теперь ref будет работать */}
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      photoURL: PropTypes.string,
      likes: PropTypes.arrayOf(PropTypes.string), // Список лайков
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired, // Ожидаем `loading` типа `bool`
  messagesEndRef: PropTypes.object.isRequired, // Добавил проверку `ref`
};
