import { useState } from "react";
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
import { decryptMessage, encryptMessage } from "../utils/encryption";
import PropTypes from "prop-types";

export default function MessageList({ messages, loading, messagesEndRef }) {
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState("");

  // Функция сохранения отредактированного сообщения
  const handleSaveEdit = async (msgId) => {
    if (!editedText.trim()) return;
    await updateDoc(doc(db, "messages", msgId), {
      text: encryptMessage(editedText),
    });
    setEditingMessage(null);
  };

  return (
    <div className="h-64 overflow-auto border-b">
      {loading && <p>Загрузка сообщений...</p>}
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative flex flex-col p-2 mb-1 rounded-md ${
            msg.uid === auth.currentUser?.uid ? "bg-blue-200" : "bg-green-200"
          }`}
          onMouseEnter={() => setHoveredMessage(msg.id)}
          onMouseLeave={() => setHoveredMessage(null)}
        >
          {/* Верхняя часть: Аватар, имя */}
          <ul className="flex justify-between items-center w-full">
            <li className="flex items-center">
              <img
                src={msg.photoURL}
                alt="User Avatar"
                className="w-6 h-6 rounded-full mr-2"
              />
              <p className="text-xs font-bold text-blue-900">
                {msg.displayName || "Аноним"}
                {msg.uid === auth.currentUser?.uid && " (Вы)"}
              </p>
            </li>
            <li className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  updateDoc(doc(db, "messages", msg.id), {
                    likes: (msg.likes || []).includes(auth.currentUser?.uid)
                      ? arrayRemove(auth.currentUser.uid)
                      : arrayUnion(auth.currentUser.uid),
                  })
                }
              >
                ❤️ {msg.likes?.length ?? 0}
              </button>
            </li>
          </ul>

          {/* Текст сообщения или редактирование */}
          {editingMessage === msg.id ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="flex-1 p-1 border rounded-md"
              />
              <button
                onClick={() => handleSaveEdit(msg.id)}
                className="text-green-600 hover:text-green-800"
              >
                ✅
              </button>
            </div>
          ) : (
            <span
              className="flex flex-wrap mt-1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  marked(decryptMessage(msg.text || ""))
                ),
              }}
            />
          )}

          {/* Кнопки редактирования и удаления */}
          {msg.uid === auth.currentUser?.uid && hoveredMessage === msg.id && (
            <div className="absolute top-2 right-11 flex gap-2">
              <button
                onClick={() => {
                  setEditingMessage(msg.id);
                  setEditedText(decryptMessage(msg.text || ""));
                }}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                🖊️
              </button>
              <button
                onClick={() => deleteDoc(doc(db, "messages", msg.id))}
                className="text-gray-600 hover:text-red-600 transition"
              >
                🗑
              </button>
            </div>
          )}
        </motion.div>
      ))}

      {messages.length === 0 && (
        <p>Нет сообщений. Придумайте что-нибудь новое!</p>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      displayName: PropTypes.string,
      photoURL: PropTypes.string,
      likes: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  messagesEndRef: PropTypes.object.isRequired,
};
