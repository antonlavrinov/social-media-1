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

  // console.log("commentttttt", likes);

  useEffect(() => {
    // console.log("likesssss", likes);
    if (likes.find((like: IUserData) => like._id === meUserData!._id)) {
      setIsLike(true);
    }
    // console.log("likes", likes);
  }, [likes, meUserData!._id]);

  const handleLikePost = async () => {
    if (loadLike) return;
    // if (likes.find((like: IUserData) => like._id !== meUserData!._id)) {
    setIsLike(true);
    setLoadLike(true);
    setLikes([...likes, meUserData]);
    // console.log("postid", post._id);
    try {
      await request(`http://localhost:5000/api/post/like/${post._id}`, "PUT");

      //notification recipients

      // let recipientsArr;
      // if (post.user._id === )
      // console.log("post.user._id", post.user._id);
      if (post.user._id !== meUserData?._id) {
        console.log("not my post");
        const notification = await request(
          `http://localhost:5000/api/notify`,
          "POST",
          {
            text: "liked your post",
            url: `/profile/${post.user._id}`,
            recipients: [post.user._id],
          }
        );
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
    // console.log("newArr", newArr);
    setLikes(newArr);
    try {
      await request(`http://localhost:5000/api/post/unlike/${post._id}`, "PUT");

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
