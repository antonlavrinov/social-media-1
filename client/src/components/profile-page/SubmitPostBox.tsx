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

const PostBoxWrapper = styled.div`
  form {
    display: flex;
    flex-direction: column;
    /* justify-content: flex-end; */
    /* align-items: flex-end; */
  }
`;

// const InputInitial = styled.input`
//   border: none;
// `;

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
    fill: white;
    width: 20px;
  }
`;

const FormMainWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  svg {
    ${svgPrimaryStyle}/* position: absolute; */
    /* top: 0;
    right: 8px; */
  }
`;

const FormFooter = styled.div`
  /* padding: 15px 0; */
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
  // const [images, setImages] = React.useState<any[]>([]);
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
    // console.log("outside");
  });

  const ref = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    setContent("");
  }, [userData?._id]);

  // const handleChange = (
  //   e: React.ChangeEventHandler<HTMLTextAreaElement>
  // ): void => {
  //   // setContent(e.target.value);
  //   console.log(e);
  // };

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
      const res = await request("/api/post", "POST", {
        content,
        images,
        userId: userData?._id,
      });

      setUserData({
        ...userData,
        wall: [res.post, ...userData!.wall],
      });

      if (!isPersonal) {
        const notification = await request(`/api/notify`, "POST", {
          text: "posted something on your page",
          url: `/profile/${userData?._id}`,
          recipients: [userData?._id],
        });
        socket.emit("createNotification", notification.notification);
      }

      setContent("");
      setImages([]);
      setIsFocus(false);
      console.log("RES", res.message);
      handlePageNotification({ type: "success", text: res.message });
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", message: e.message });
    }

    // console.log("submit");
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
      // e.stopPropagation();
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
            {/* {(isFocus || content || images.length > 0) && <EmojiIcon />} */}
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
                {/* <ImageUpload>
                  
                </ImageUpload> */}
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

// <label>
//   Choose file
//   <input
//     type="file"
//     name="file"
//     accept="image/*"
//     multiple
//     onChange={handleUploadImages}
//     ref={ref}
//   />
// </label>
// <CustomButton
//   variant="contained"
//   color="primary"
//   style={{ width: "30%" }}
//   type="submit"
//   disabled={!content && images.length === 0}
// >
//   Опубликовать
// </CustomButton>
