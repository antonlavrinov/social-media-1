import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { IUserData } from "../interfaces/IUserData";
import { useHttp } from "./useHttp";
import useNotistack from "./useNotistack";

const useLikeComment = (comment: any, meUserData: IUserData | null) => {
  const [likes, setLikes] = useState<any>(comment.likes);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [loadLike, setLoadLike] = useState<boolean>(false);
  const { request } = useHttp();
  const { socket } = useContext(AuthContext);
  const { handlePageNotification } = useNotistack();

  useEffect(() => {
    if (likes.find((like: IUserData) => like._id === meUserData!._id)) {
      setIsLike(true);
    }
  }, [likes, meUserData!._id]);

  const handleLikeComment = async () => {
    if (loadLike) return;

    setIsLike(true);
    setLoadLike(true);
    setLikes([...likes, meUserData]);

    try {
      await request(`/api/comment/like/${comment._id}`, "PUT");

      if (comment.user._id !== meUserData?._id) {
        const notification = await request(`/api/notify`, "POST", {
          text: "liked your comment",
          url: `/profile/${comment.user._id}`,
          recipients: [comment.user._id],
        });
        socket.emit("createNotification", notification.notification);
      } else {
        console.log("my comment");
      }

      setLoadLike(false);
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
      setLoadLike(false);
    }
    // }
  };
  const handleUnLikeComment = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    const newArr = likes.filter((el: any) => el._id !== meUserData?._id);

    setLikes(newArr);
    try {
      await request(`/api/comment/unlike/${comment._id}`, "PUT");
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
    handleLikeComment,
    handleUnLikeComment,
  };
};

export default useLikeComment;
