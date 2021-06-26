import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/useHttp";
import useNotistack from "../hooks/useNotistack";
import { useUploadImages } from "../hooks/useUploadImages";
import styled from "styled-components";
import {
  Button,
  ContentBoxContainer,
  Separator,
  svgPrimaryStyle,
  TextArea,
} from "../styled-components/global";
import { Modal } from "react-responsive-modal";
import { ReactComponent as Cross } from "../assets/icons/cross-icon.svg";
import { ReactComponent as ImageUploadIcon } from "../assets/icons/image-upload-icon.svg";
import Emojis from "./Emojis";
import Spinner from "./Spinner";

const Wrapper = styled.div``;

const SendMessagePopup = styled.div`
  min-width: 450px;
  position: relative;
`;

const ButtonsWrapper = styled.div`
  margin-left: auto;
`;

const CrossIcon = styled(Cross)`
  fill: var(--icon-color-secondary);
  position: absolute;
  top: 15px;
  right: 15px;
  :hover {
    cursor: pointer;
  }
`;

const ImageUpload = styled.div`
  /* position: absolute;
  top: 18px;
  right: 55px; */
  svg {
    ${svgPrimaryStyle}
  }
`;

const PreviewImagesWrapper = styled.div`
  display: flex;

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
    top: auto;
    right: auto;
  }
`;

const TextAreaWrapper = styled.div`
  position: relative;
  svg {
    top: 0;
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
  modalIsOpen: boolean;
  openModal: any;
  closeModal: any;
  userData: any;
};

const SendMessageModal: React.FC<Props> = ({
  modalIsOpen,
  openModal,
  closeModal,
  userData,
}) => {
  console.log("USER DATA", userData);
  const [content, setContent] = useState<string>("");
  const { conversations, setConversations, meUserData, socket } =
    useContext(AuthContext);
  const {
    images,
    setImages,
    handleUploadImages,
    handleRemoveImage,
    imageLoading,
  } = useUploadImages();
  const { handlePageNotification } = useNotistack();

  const { request } = useHttp();
  const ref = useRef<HTMLFormElement>(null);
  const imageUploadRef = useRef<null | HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleChooseEmoji = (emoji: string): void => {
    setContent(content + emoji);
  };

  const existingConversation = conversations.find((el: any) => {
    const func = (user: any) => user._id === userData?._id;
    return el.users.some(func);
  });
  console.log("existingConversation", existingConversation);

  const handleCreateConversation = async () => {
    try {
      const res = await request("/api/conversation", "POST", {
        content,
        images,
        userIds: [userData?._id],
      });

      setContent("");
      setImages([]);

      setConversations((prevState: any) => {
        return [res.conversation, ...prevState];
      });

      console.log("res create conversation", res);

      const notification = {
        user: meUserData,
        recipients: [userData],
        text: `sent you a message: ${res.newMessage.content.slice(0, 70)}${
          res.newMessage.content.length > 70 ? "..." : ""
        }`,
        url: `/conversation/${res.conversation._id}`,
      };

      socket.emit("createConversation", res.conversation);
      socket.emit("createMessageNotification", notification);
      closeModal();
      handlePageNotification({ type: "success", text: res.message });
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
    }
  };

  const handleCreateMessage = async (existingConversation: any) => {
    try {
      const res = await request("/api/message", "POST", {
        content,
        images,
        conversationId: existingConversation._id,
      });

      setContent("");
      setImages([]);

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

      console.log("res create message", res);

      const notification = {
        user: meUserData,
        recipients: [userData],
        text: `sent you a message: ${res.newMessage.content.slice(0, 70)}${
          res.newMessage.content.length > 70 ? "..." : ""
        }`,
        url: `/conversation/${res.conversation._id}`,
      };

      socket.emit("createMessage", res.newMessage);
      console.log("notific", notification);
      socket.emit("createMessageNotification", notification);
      closeModal();
      handlePageNotification({ type: "success", text: res.message });
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((!content && images.length === 0) || imageLoading) {
      return;
    }

    const existingConversation = conversations.find((el: any) => {
      const func = (user: any) => user._id === userData?._id;
      return el.users.some(func);
    });

    if (existingConversation) {
      handleCreateMessage(existingConversation);
    } else {
      handleCreateConversation();
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
    <Modal
      center
      closeIcon={<div></div>}
      open={modalIsOpen}
      onClose={closeModal}
      focusTrapped={false}
      // animationDuration={0}
      classNames={{
        overlay: "customOverlay",
        modal: "customModal",
      }}
    >
      <SendMessagePopup>
        <CrossIcon onClick={closeModal} />
        <ContentBoxContainer>
          Write a message to {userData.firstName}
        </ContentBoxContainer>
        <Separator />
        <form ref={ref} onSubmit={handleSubmit}>
          <ContentBoxContainer>
            <Emojis handleChooseEmoji={handleChooseEmoji} />
            <TextArea
              $focuse
              placeholder={"Write something..."}
              style={{ resize: "none" }}
              onChange={handleChange}
              value={content}
              onKeyDown={handleKeyPress}
            />
          </ContentBoxContainer>
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

          <Separator />
          <ContentBoxContainer style={{ display: "flex" }}>
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
            <ButtonsWrapper>
              <Button
                size="small"
                color="secondary"
                marginRight="10px"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </Button>
              <Button size="small" type="submit">
                Send
              </Button>
            </ButtonsWrapper>
          </ContentBoxContainer>
        </form>
      </SendMessagePopup>
    </Modal>
  );
};

export default SendMessageModal;
