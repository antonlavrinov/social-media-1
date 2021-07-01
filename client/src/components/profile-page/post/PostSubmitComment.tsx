import React, { useState, useContext, useRef } from "react";
import styled from "styled-components";
import {
  Avatar,
  svgPrimaryStyle,
  TextArea,
} from "../../../styled-components/global";
import { ReactComponent as PublishCommentIcon } from "../../../assets/icons/publish-comment-icon.svg";
import Emojis from "../../Emojis";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/useHttp";
import { v4 as uuidv4 } from "uuid";

const PostCommentWrapper = styled.div`
  form {
    display: flex;
    align-items: flex-start;
    padding: 10px 15px;
  }
`;

type Props = {
  post: any;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
};

const PostSubmitComment: React.FC<Props> = ({ post, setComments }) => {
  const [text, setText] = useState<string>("");
  const ref = useRef<HTMLFormElement>(null);

  const { meUserData, socket } = useContext(AuthContext);
  const { request } = useHttp();
  const handleChange = (e: any): void => {
    setText(e.target.value);
  };

  const handleChooseEmoji = (emoji: string): void => {
    setText(text + emoji);
  };

  const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newId = uuidv4();

    const newComment = {
      content: text,
      createdAt: new Date().toISOString(),
      likes: [],
      updatedAt: new Date().toISOString(),
      user: {
        firstName: meUserData?.firstName,
        lastName: meUserData?.lastName,
        avatar: meUserData?.avatar,
        _id: meUserData?._id,
      },
      _id: newId,
    };

    setText("");
    setComments((prevState) => {
      return [...prevState, newComment];
    });
    const res = await request("/api/comment", "POST", {
      content: text,
      postId: post._id,
    });
    setComments((prevState) => {
      const newCommentsFromApi = prevState.filter(
        (el) => el._id !== newComment._id
      );
      return [...newCommentsFromApi, res.comment];
    });

    console.log("comment RES", res.comment);

    if (post.user._id !== meUserData?._id) {
      console.log("not my post");
      const notification = await request(`/api/notify`, "POST", {
        text: "left a comment under your post",
        url: `/profile/${post.user._id}`,
        recipients: [post.user._id],
      });
      socket.emit("createNotification", notification.notification);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      ref?.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
      e.preventDefault();
    }
  };
  return (
    <PostCommentWrapper>
      <form ref={ref} onSubmit={handleCreateComment}>
        <Avatar
          marginRight="10px"
          size="medium-small"
          src={meUserData?.avatar}
        />
        <TextArea
          $focuse
          placeholder={"Write something..."}
          style={{ resize: "none" }}
          onChange={handleChange}
          value={text}
          onKeyDown={handleKeyPress}
        />
        <Emojis handleChooseEmoji={handleChooseEmoji} />
      </form>
    </PostCommentWrapper>
  );
};

export default PostSubmitComment;
