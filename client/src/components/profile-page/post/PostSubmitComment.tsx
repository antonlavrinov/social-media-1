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

const PostCommentWrapper = styled.div`
  form {
    display: flex;
    align-items: flex-start;
    padding: 10px 15px;
  }
`;

const UserAvatar = styled.img`
  width: 37px;
  height: 37px;
  margin-right: 15px;
  border-radius: 100px;
`;

const ButtonWrapper = styled.button`
  margin-left: 10px;
  padding-top: 5px;
  background: none;
  svg {
    ${svgPrimaryStyle}
    fill: var(--color-dark-secondary);
    :hover {
      fill: var(--text-color-secondary);
    }
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
    const res = await request("/api/comment", "POST", {
      content: text,
      postId: post._id,
    });

    // console.log("comment res", res);
    setText("");
    setComments((prevState) => {
      return [...prevState, res.comment];
    });

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
      // e.stopPropagation();
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
        {/* <ButtonWrapper type="submit" disabled={!text}>
          <PublishCommentIcon />
        </ButtonWrapper> */}
      </form>
    </PostCommentWrapper>
  );
};

export default PostSubmitComment;
