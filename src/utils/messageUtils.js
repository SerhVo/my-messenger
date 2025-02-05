import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { encryptMessage } from "../utils/encryption";

// Функция лайка/дизлайка сообщения
export const handleLikeMessage = async (msgId, likes) => {
  if (!auth.currentUser) return;

  const messageRef = doc(db, "messages", msgId);
  const userLiked = likes?.includes(auth.currentUser.uid);

  await updateDoc(messageRef, {
    likes: userLiked
      ? arrayRemove(auth.currentUser.uid)
      : arrayUnion(auth.currentUser.uid),
  });
};

// Функция сохранения отредактированного сообщения
export const handleSaveEdit = async (msgId, newText, setEditingMessage) => {
  if (!newText.trim()) return;

  await updateDoc(doc(db, "messages", msgId), {
    text: encryptMessage(newText),
  });

  setEditingMessage(null);
};

// Функция удаления сообщения
export const handleDeleteMessage = async (msgId) => {
  await deleteDoc(doc(db, "messages", msgId));
};
