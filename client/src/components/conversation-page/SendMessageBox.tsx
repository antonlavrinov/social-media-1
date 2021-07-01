import React, { useState, useContext, useRef, useEffect } from "react";
import styled from "styled-components";
// import { scroll } from "react-scroll";
import { ReactComponent as ImageUploadIcon } from "../../assets/icons/image-upload-icon.svg";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/useHttp";
import { useUploadImages } from "../../hooks/useUploadImages";
import {
  Avatar,
  svgPrimaryStyle,
  TextArea,
} from "../../styled-components/global";
import Emojis from "../Emojis";
import { ReactComponent as CrossIcon } from "../../assets/icons/cross-icon.svg";
import Spinner from "../Spinner";
import { v4 as uuidv4 } from "uuid";

const PostCommentWrapper = styled.div`
  position: relative;
  form {
    display: flex;
    align-items: flex-start;
    padding: 10px 15px;
  }
  textarea {
    display: block;
    border: 1px solid var(--text-color-secondary);
    border-radius: var(--border-radius-primary);
    padding: 11px;
    padding-right: 65px;
    width: 100%;
    position: relative;
    overflow-y: hidden;
    ::placeholder {
      color: var(--text-color-secondary);
    }
  }
`;

const ImageUpload = styled.div`
  position: absolute;
  top: 18px;
  right: 55px;
  svg {
    ${svgPrimaryStyle}
  }
`;

const PreviewImagesWrapper = styled.div`
  display: flex;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 100px;
  margin-right: 10px;
`;

const DeleteImageIcon = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }
  svg {
    width: 20px;
    fill: white;
  }
`;

const PreviewImage = styled.img<{ count?: number }>`
  width: 100%;
  height: 100px;
  object-fit: cover;
  margin-right: 5px;
  ${(props) =>
    props.count === 2 &&
    `
    width: 50%;
    height: auto;
  `}
`;

const ImagesPreviewWrapper = styled.div<{ exists: boolean }>`
  display: flex;
  ${(props) =>
    props.exists &&
    `
      padding: 15px;
      padding-top: 0;
    `}
`;

const ImageLoading = styled.div`
  width: 100px;
  height: 100px;
  background: var(--color-secondary);
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  conversation: any;
};

const SendMessageBox: React.FC<Props> = ({ conversation }) => {
  const [text, setText] = useState<string>("");
  const {
    images,
    setImages,
    handleUploadImages,
    handleRemoveImage,
    imageLoading,
  } = useUploadImages();
  const ref = useRef<HTMLFormElement>(null);
  const imageUploadRef = useRef<null | HTMLInputElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const { meUserData, socket, setConversations } = useContext(AuthContext);
  const { request } = useHttp();
  const handleChange = (e: any): void => {
    setTextAreaHeight("auto");
    setText(e.target.value);
  };

  const handleChooseEmoji = (emoji: string): void => {
    setText(text + emoji);
  };

  const handleCreateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!text && images.length === 0) || imageLoading) {
      return;
    }

    const newMessageId = uuidv4();

    const newMessage = {
      content: text,
      conversation: {
        createdAt: new Date().toISOString(),
        messages: [...conversation.messages],
        updatedAt: new Date().toISOString(),
        users: [...conversation.users],
        _id: conversation._id,
      },
      user: {
        firstName: meUserData?.firstName,
        lastName: meUserData?.lastName,
        avatar: meUserData?.avatar,
        _id: meUserData?._id,
      },
      createdAt: new Date().toISOString(),
      images,
      isRead: false,
      updatedAt: new Date().toISOString(),
      _id: newMessageId,
    };

    setText("");
    setImages([]);

    setConversations((prevState: any) => {
      //new array of conversations
      const newArr = prevState.filter(
        (el: any) => el._id !== newMessage.conversation._id
      );

      const currentConv = prevState.find(
        (el: any) => el._id === newMessage.conversation._id
      );
      const updatedConv = {
        ...currentConv,
        messages: [...currentConv.messages, newMessage],
      };

      return [updatedConv, ...newArr];
    });

    const res = await request("/api/message", "POST", {
      content: text,
      images,
      conversationId: conversation._id,
    });

    setConversations((prevState: any) => {
      const newArr = prevState.filter(
        (el: any) => el._id !== res.newMessage.conversation._id
      );

      const currentConv = prevState.find(
        (el: any) => el._id === res.newMessage.conversation._id
      );

      const apiMessages = currentConv.messages.filter(
        (el: any) => el._id !== newMessageId
      );
      const updatedConv = {
        ...currentConv,
        messages: [...apiMessages, res.newMessage],
      };

      return [updatedConv, ...newArr];
    });

    const notification = {
      user: meUserData,
      recipients: [...conversation.users],
      text: `sent you a message: ${res.newMessage.content.slice(0, 70)}${
        res.newMessage.content.length > 70 ? "..." : ""
      }`,
      url: `/${conversation}/${conversation._id}`,
    };

    socket.emit("createMessage", res.newMessage);
    socket.emit("createMessageNotification", notification);
  };
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      ref?.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <PostCommentWrapper>
      <form ref={ref} onSubmit={handleCreateMessage}>
        <Avatar
          size="medium-small"
          style={{ marginRight: "15px" }}
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

        <ImageUpload>
          <label>
            <ImageUploadIcon />
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleUploadImages}
              onKeyPress={handleKeyPress}
              ref={imageUploadRef}
              style={{ display: "none" }}
            />
          </label>
        </ImageUpload>

        <Emojis handleChooseEmoji={handleChooseEmoji} />
      </form>
      <ImagesPreviewWrapper exists={imageLoading || images.length > 0}>
        <>
          {imageLoading && (
            <ImageLoading>
              <Spinner />
            </ImageLoading>
          )}
          {images.length > 0 && (
            <PreviewImagesWrapper>
              {images.map((image, idx) => {
                return (
                  <PreviewImageWrapper key={image.public_id}>
                    <DeleteImageIcon
                      onClick={handleRemoveImage.bind(null, image)}
                    >
                      <CrossIcon />
                    </DeleteImageIcon>
                    <PreviewImage src={image.url} />
                  </PreviewImageWrapper>
                );
              })}
            </PreviewImagesWrapper>
          )}
        </>
      </ImagesPreviewWrapper>
    </PostCommentWrapper>
  );
};

export default SendMessageBox;
