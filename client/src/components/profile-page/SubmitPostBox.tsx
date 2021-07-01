import React, { useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useHttp } from "../../hooks/useHttp";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { IUserData } from "../../interfaces/IUserData";
import {
  Avatar,
  ContentBoxContainer,
  Separator,
  svgPrimaryStyle,
  TextArea,
} from "../../styled-components/global";
import { Button } from "../../styled-components/global";
import { ReactComponent as EmojiIcon } from "../../assets/icons/emoji-icon.svg";
import { ReactComponent as ImageUploadIcon } from "../../assets/icons/image-upload-icon.svg";
import { ReactComponent as CrossIcon } from "../../assets/icons/cross-icon.svg";
import Emojis from "../Emojis";
import { useUploadImages } from "../../hooks/useUploadImages";
import useNotistack from "../../hooks/useNotistack";
import Spinner from "../Spinner";
import { v4 as uuidv4 } from "uuid";

const PostBoxWrapper = styled.div`
  form {
    display: flex;
    flex-direction: column;
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

      padding-top: 10px;
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
    fill: white;
    width: 20px;
  }
`;

const FormMainWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  svg {
    ${svgPrimaryStyle}
  }
`;

const FormFooter = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    ${svgPrimaryStyle}
  }
`;

type Props = {
  userData: IUserData | null;
  setUserData: any;
  isPersonal: boolean;
  meUserData: IUserData | null;
  setMeUserData: any;
  handleClickOutside?: () => void;
};

const SubmitPostBox: React.FC<Props> = ({
  userData,
  setUserData,
  isPersonal,
  meUserData,
  setMeUserData,
}) => {
  const [content, setContent] = React.useState<string>("");
  const [isFocus, setIsFocus] = React.useState<boolean>(false);

  const {
    images,
    setImages,
    handleUploadImages,
    handleRemoveImage,
    imageLoading,
  } = useUploadImages();
  const { socket } = useContext(AuthContext);
  const { request } = useHttp();
  const { handlePageNotification } = useNotistack();
  const formWrapperRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  useOnClickOutside(formRef, () => {
    setIsFocus(false);
  });

  const ref = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    setContent("");
  }, [userData?._id]);

  const handleChange = (e: any): void => {
    setContent(e.target.value);
    console.log(e);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if ((!content && images.length === 0) || imageLoading) {
      return;
    }
    try {
      const newId = uuidv4();

      const newPost = {
        comments: [],
        content,
        createdAt: new Date().toISOString(),
        images: [],
        likes: [],
        repostedBy: [],
        updatedAt: new Date().toISOString(),
        user: {
          firstName: meUserData?.firstName,
          lastName: meUserData?.lastName,
          avatar: meUserData?.avatar,
          _id: meUserData?._id,
        },
        _id: newId,
      };

      setContent("");
      setImages([]);
      setIsFocus(false);
      setUserData({
        ...userData,
        wall: [newPost, ...userData!.wall],
      });

      const res = await request("/api/post", "POST", {
        content,
        images,
        userId: userData?._id,
      });

      setUserData((prevState) => {
        const newPostsFromApi = prevState.wall.filter(
          (el) => el._id !== newPost._id
        );

        return { ...prevState, wall: [res.post, ...newPostsFromApi] };
      });

      if (!isPersonal) {
        const notification = await request(`/api/notify`, "POST", {
          text: "posted something on your page",
          url: `/profile/${userData?._id}`,
          recipients: [userData?._id],
        });
        socket.emit("createNotification", notification.notification);
      }

      handlePageNotification({ type: "success", text: res.message });
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", message: e.message });
    }
  };

  const handleChooseEmoji = (emoji: string): void => {
    setContent(content + emoji);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      formRef?.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
      e.preventDefault();
    }
  };

  return (
    <PostBoxWrapper ref={formWrapperRef}>
      <form ref={formRef} style={{ width: "100%" }} onSubmit={handleSubmit}>
        <ContentBoxContainer>
          <FormMainWrapper>
            <Avatar
              marginRight="10px"
              size="medium-small"
              src={meUserData?.avatar}
            />
            <TextArea
              placeholder="What's on your mind?"
              style={{ paddingRight: "40px", resize: "none" }}
              $focuse={isFocus || !!content || images.length > 0}
              onChange={handleChange}
              value={content}
              minRows={isFocus || !!content || images.length > 0 ? 4 : 1}
              onClick={() => {
                if (!isFocus) {
                  setIsFocus(true);
                }
              }}
              onKeyPress={handleKeyPress}
            />

            {(isFocus || content || images.length > 0) && (
              <Emojis handleChooseEmoji={handleChooseEmoji} />
            )}
            {!isFocus && !(content || images.length > 0) && (
              <label>
                <ImageUploadIcon />
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadImages}
                  ref={ref}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </FormMainWrapper>
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
        </ContentBoxContainer>

        {(isFocus || content || images.length > 0) && (
          <>
            <Separator />
            <ContentBoxContainer>
              <FormFooter>
                <label>
                  <ImageUploadIcon />

                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                    ref={ref}
                    style={{ display: "none" }}
                  />
                </label>

                <Button
                  disabled={!content && images.length === 0}
                  type="submit"
                  size="small"
                >
                  Publish
                </Button>
              </FormFooter>
            </ContentBoxContainer>
          </>
        )}
      </form>
    </PostBoxWrapper>
  );
};

export default SubmitPostBox;
