import { useEffect, useState } from "react";

const avatars = ["/img/av_bird.jpg", "/img/av_bird2.jpg", "/img/av_cat.jpg"];

// Функция получения случайного аватара
const getRandomAvatar = () => {
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  console.log("RandomAvatar:", avatar);
  return avatar;
};

export function useUserAvatar(userId, userPhotoURL) {
  const [avatar, setAvatar] = useState(userPhotoURL || null);

  useEffect(() => {
    if (userPhotoURL) {
      setAvatar(userPhotoURL); // Если есть фото — используем его
      return;
    }

    // Загружаем сохранённые аватары из localStorage
    const storedAvatars = JSON.parse(localStorage.getItem("avatarMap") || "{}");

    if (storedAvatars[userId]) {
      setAvatar(storedAvatars[userId]); // Используем сохранённый аватар
    } else {
      const newAvatar = getRandomAvatar();
      storedAvatars[userId] = newAvatar;
      localStorage.setItem("avatarMap", JSON.stringify(storedAvatars));
      setAvatar(newAvatar);
    }
  }, [userId, userPhotoURL]); // Отслеживаем изменения userId и userPhotoURL

  return avatar;
}
