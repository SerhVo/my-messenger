import { useState, useMemo, useCallback } from "react";
import { auth, messagesRef, storage } from "../firebase";
import { addDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import debounce from "lodash.debounce";
import Picker from "@emoji-mart/react";
import { encryptMessage } from "../utils/encryption";

export default function MessageInput({ messagesEndRef }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //   const messagesEndRef = useRef(null); // Прокрутка вниз

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
          setIsTyping(false); // Сбрасываем "печатает"

          // Прокрутка вниз
        //   setTimeout(() => {
        //     messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
        //   }, 100);
        } catch (error) {
          console.error("Ошибка при отправке сообщения:", error);
        }
      }, 500),
    [input]
  );

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
    setInput("");
    // Прокрутка вниз после загрузки файла
    // setTimeout(() => {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, 100);
  };

  return (
    <div className="flex justify-between items-center  mt-2">
      {showEmojiPicker && (
        <Picker onEmojiSelect={(emoji) => setInput(input + emoji.native)} />
      )}
      {/* Показываем "печатает..." */}
      {isTyping && <p className="text-sm text-gray-500">Печатает...</p>}
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleTyping();
        }}
        className="w-full p-1 border rounded-md"
        placeholder="Введите сообщение..."
      />
      <button
        onClick={debouncedSendMessage}
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
  );
}
