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
// import { ConversationContext } from "../../context/ConversationContext";

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

const PreviewImagesWrapper = styled.div`
  display: flex;
  /* margin-left: 15px;
  margin-bottom: 13px; */

  /* margin-top: 1px; */
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
  // setConversation: React.Dispatch<React.SetStateAction<any[]>>;
};

const SendMessageBox: React.FC<Props> = ({
  // setConversation,
  conversation,
}) => {
  const [text, setText] = useState<string>("");
  const {
    images,
    setImages,
    handleUploadImages,
    handleRemoveImage,
    imageLoading,
  } = useUploadImages();
  // const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const ref = useRef<HTMLFormElement>(null);
  const imageUploadRef = useRef<null | HTMLInputElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  // const { conversation } = useContext(ConversationContext);
  const { meUserData, socket, setConversations } = useContext(AuthContext);
  const { request } = useHttp();
  const handleChange = (e: any): void => {
    // console.log("change", e.target);
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
    const res = await request("http://localhost:5000/api/message", "POST", {
      content: text,
      images,
      conversationId: conversation._id,
    });

    // console.log("comment res", res);
    setText("");
    setImages([]);

    // setConversation((prevState: any) => {
    //   const messages = [...prevState?.messages, res.newMessage];
    //   const newConversation = {
    //     ...prevState,
    //     messages,
    //   };
    //   // console.log("state new", newConversation);

    //   return newConversation;
    // });

    setConversations((prevState: any) => {
      const newArr = prevState.filter(
        (el: any) => el._id !== res.newMessage.conversation._id
      );

      const currentConv = prevState.find(
        (el: any) => el._id === res.newMessage.conversation._id
      );
      const updatedConv = {
        ...currentConv,
        messages: [...currentConv.messages, res.newMessage],
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

    // document.getElementById(res.newMessage._id)?.scrollIntoView();
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

  // useEffect(() => {
  //   // setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
  //   setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);
  //   console.log(textAreaRef.current!.scrollHeight);
  // }, [text]);
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

        {/* <textarea
          ref={textAreaRef}
          rows={1}
          style={{
            minHeight: textAreaHeight,
            resize: "none",
          }}
          placeholder={"Write something..."}
          onKeyDown={handleKeyPress}
          onChange={handleChange}
          value={text}
        /> */}
        <ImageUpload>
          <label>
            <ImageUploadIcon />
            <input
              type="file"
              name="file"
              accept="image/*"
              // multiple
              onChange={handleUploadImages}
              onKeyPress={handleKeyPress}
              ref={imageUploadRef}
              style={{ display: "none" }}
            />
          </label>
        </ImageUpload>

        <Emojis handleChooseEmoji={handleChooseEmoji} />
        {/* <ButtonWrapper type="submit" disabled={!text}>
          <PublishCommentIcon />
        </ButtonWrapper> */}
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
