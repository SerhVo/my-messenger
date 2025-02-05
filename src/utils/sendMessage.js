import { addDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { encryptMessage } from "../utils/encryption";
import { auth, messagesRef, storage } from "../firebase";

export const sendMessage = async (input, setInput, setIsTyping) => {
  if (
    !auth.currentUser ||
    input.trim().length < 1 ||
    input.trim().length > 500
  ) {
    return;
  }

  try {
    const encryptedText = encryptMessage(input);
    await addDoc(messagesRef, {
      text: encryptedText,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || "Аноним", // ✅ Сохраняем displayName
      photoURL: auth.currentUser.photoURL,
      createdAt: new Date(),
      likes: [],
    });

    setInput("");
    setIsTyping(false);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
  }
};

export const uploadFile = async (file, setInput) => {
  if (!file) return;

  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(messagesRef, {
      imageUrl,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || "Аноним", // ✅ Добавляем displayName
      photoURL: auth.currentUser.photoURL,
      createdAt: new Date(),
      likes: [],
    });

    setInput("");
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);
  }
};
