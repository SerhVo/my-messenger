import { useState, useEffect } from "react";

const avatars = ["/img/av_bird.jpg", "/img/av_bird2.jpg", "/img/av_cat.jpg"];

const getRandomAvatar = () =>
  avatars[Math.floor(Math.random() * avatars.length)];

export function useUserAvatar(userId, userPhotoURL) {
  // Загружаем аватары из localStorage при монтировании
  const [avatarMap, setAvatarMap] = useState(() => {
    try {
      const storedAvatars = localStorage.getItem("avatarMap");
      return storedAvatars ? JSON.parse(storedAvatars) : {};
    } catch (error) {
      console.error("Ошибка при загрузке аватаров:", error);
      return {};
    }
  });

  useEffect(() => {
    if (!userId || userPhotoURL) return; // Если есть userPhotoURL, используем его

    setAvatarMap((prevMap) => {
      if (prevMap[userId]) return prevMap; // Уже есть аватар, ничего не делаем

      const newAvatar = getRandomAvatar();
      const updatedMap = { ...prevMap, [userId]: newAvatar };

      try {
        localStorage.setItem("avatarMap", JSON.stringify(updatedMap));
      } catch (error) {
        console.error("Ошибка при сохранении аватара:", error);
      }

      return updatedMap;
    });
  }, [userId, userPhotoURL]); // Добавляем `userPhotoURL` в зависимости

  return userPhotoURL || avatarMap[userId] || getRandomAvatar();
}
