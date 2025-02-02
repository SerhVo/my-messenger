import { useEffect, useState } from "react";

const avatars = ["/img/av_bird.jpg", "/img/av_bird2.jpg", "/img/av_cat.jpg"];

const getRandomAvatar = () => {
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  console.log("RandomAvatar:", avatar);
  return avatar;
};

export function useUserAvatar(userId, userPhotoURL) {
  const [avatar, setAvatar] = useState(userPhotoURL || null);

  useEffect(() => {
    if (userPhotoURL) {
      setAvatar(userPhotoURL);
      return;
    }

    const storedAvatars = JSON.parse(localStorage.getItem("avatarMap") || "{}");

    if (storedAvatars[userId]) {
      setAvatar(storedAvatars[userId]);
    } else {
      const newAvatar = getRandomAvatar();
      storedAvatars[userId] = newAvatar;
      localStorage.setItem("avatarMap", JSON.stringify(storedAvatars));
      setAvatar(newAvatar);
    }
  }, [userId, userPhotoURL]);

  return avatar;
}
