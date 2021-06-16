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
  // console.log("commentttttt", likes);

  useEffect(() => {
    if (likes.find((like: IUserData) => like._id === meUserData!._id)) {
      setIsLike(true);
    }
    // console.log("likes", likes);
  }, [likes, meUserData!._id]);

  const handleLikeComment = async () => {
    if (loadLike) return;
    // if (likes.find((like: IUserData) => like._id !== meUserData!._id)) {
    setIsLike(true);
    setLoadLike(true);
    setLikes([...likes, meUserData]);
    // console.log("postid", post._id);
    try {
      await request(
        `http://localhost:5000/api/comment/like/${comment._id}`,
        "PUT"
      );

      if (comment.user._id !== meUserData?._id) {
        console.log("i can like this comment", comment);
        const notification = await request(
          `http://localhost:5000/api/notify`,
          "POST",
          {
            text: "liked your comment",
            url: `/profile/${comment.user._id}`,
            recipients: [comment.user._id],
          }
        );
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
    // console.log("newArr", newArr);
    setLikes(newArr);
    try {
      await request(
        `http://localhost:5000/api/comment/unlike/${comment._id}`,
        "PUT"
      );
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
