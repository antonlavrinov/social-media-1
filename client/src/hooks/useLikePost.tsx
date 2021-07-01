import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { IUserData } from "../interfaces/IUserData";
import { useHttp } from "./useHttp";
import useNotistack from "./useNotistack";

const useLikePost = (meUserData: IUserData | null, post: any) => {
  const [likes, setLikes] = useState<any>(post.likes);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [loadLike, setLoadLike] = useState<boolean>(false);
  const { socket } = useContext(AuthContext);
  const { request } = useHttp();
  const { handlePageNotification } = useNotistack();

  useEffect(() => {
    if (likes.find((like: IUserData) => like._id === meUserData!._id)) {
      setIsLike(true);
    }
  }, [likes, meUserData!._id]);

  const handleLikePost = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    setLikes([...likes, meUserData]);

    try {
      await request(`/api/post/like/${post._id}`, "PUT");

      if (post.user._id !== meUserData?._id) {
        const notification = await request(`/api/notify`, "POST", {
          text: "liked your post",
          url: `/profile/${post.user._id}`,
          recipients: [post.user._id],
        });
        socket.emit("createNotification", notification.notification);
      }

      setLoadLike(false);
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
      setLoadLike(false);
    }
    // }
  };
  const handleUnLikePost = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    const newArr = likes.filter((el: any) => el._id !== meUserData?._id);

    setLikes(newArr);
    try {
      await request(`/api/post/unlike/${post._id}`, "PUT");

      setLoadLike(false);
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
      setLoadLike(false);
    }
  };

  return {
    likes,
    isLike,
    setIsLike,
    loadLike,
    setLoadLike,
    handleLikePost,
    handleUnLikePost,
  };
};

export default useLikePost;
