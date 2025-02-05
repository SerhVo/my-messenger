import { useState, useCallback } from "react";
import Picker from "@emoji-mart/react";
import { useAuth } from "./AuthProvider";
import { sendMessage, uploadFile } from "../utils/sendMessage";


export default function MessageInput() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuth();

  const handleTyping = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }, []);

  // Отправка сообщения
  const handleSendMessage = useCallback(() => {
    if (input.trim()) {
      sendMessage(input, setInput, setIsTyping);
    }
  }, [input]);

  // Отправка при нажатии Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    await uploadFile(file, setInput);
  };

  return (
    <>
      {isTyping && (
        <p className="text-sm text-gray-500">
          Печатает {user?.displayName || "Аноним"}...
        </p>
      )}

      <div className="flex justify-between items-center mt-2">
        {showEmojiPicker && (
          <Picker onEmojiSelect={(emoji) => setInput(input + emoji.native)} />
        )}

        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown} // <-- Обработка Enter
          className="w-full p-1 border rounded-md"
          placeholder="Введите сообщение..."
        />

        <button
          onClick={handleSendMessage} // <-- Теперь без debounce
          className="ml-2 p-2 bg-sky-500 text-white rounded-md"
        >
          Отправить
        </button>

        <button
          className="ml-2 cursor-pointer text-3xl"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </button>

        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="cursor-pointer ml-2 text-3xl">
          📷
        </label>
      </div>
    </>
  );
}
