import { useState, useCallback, useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import { useAuth } from "./AuthProvider";
import { sendMessage, uploadFile } from "../utils/sendMessage";

export default function MessageInput() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuth();
  const emojiPickerRef = useRef(null);

  const handleTyping = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (input.trim()) {
      sendMessage(input, setInput, setIsTyping);
    }
  }, [input]);

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

  // Закрытие эмодзи-панели при клике вне её области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative">
        {isTyping && (
          <p className="absolute top-[-20px] left-0 text-sm text-gray-500">
            Печатает {user?.displayName || "Аноним"}...
          </p>
        )}

        <div className="flex justify-between items-center mt-5">
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 left-0 z-50"
            >
              <Picker
                onEmojiSelect={(emoji) => setInput(input + emoji.native)}
              />
            </div>
          )}

          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            className="w-full p-1 border rounded-md"
            placeholder="Введите сообщение..."
          />

          <button
            onClick={handleSendMessage}
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
      </div>
    </>
  );
}
