import React, { useState, useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import { useHttp } from "../../../hooks/useHttp";
import useNotistack from "../../../hooks/useNotistack";
import { useUploadImages } from "../../../hooks/useUploadImages";
import {
  Button,
  svgPrimaryStyle,
  TextArea,
} from "../../../styled-components/global";
import Emojis from "../../Emojis";
import { ReactComponent as ImageUploadIcon } from "../../../assets/icons/image-upload-icon.svg";
import { ReactComponent as ImageRemoveIcon } from "../../../assets/icons/image-remove-icon.svg";
import { AuthContext } from "../../../context/AuthContext";
import { UserContext } from "../../../context/UserContext";
import Spinner from "../../Spinner";

const PostEditContent = styled.div`
  position: relative;
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
  /* margin-left: 15px;
  margin-bottom: 13px; */

  /* margin-top: 1px; */
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 100px;
  margin-right: 10px;
`;

const ImageRemoveIconWrapper = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  :hover {
    cursor: pointer;
  }
  svg {
    fill: white;
    width: 10px;
  }
`;

const PostEditFooter = styled.div`
  display: flex;
  margin-top: 10px;
  svg {
    ${svgPrimaryStyle}
  }
`;

const PostImage = styled.img`
  width: 100%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

type Props = {
  post: any;
  isPersonal: boolean;
  handleEditMode: (boolean: boolean) => any;
};

const PostEdit: React.FC<Props> = ({ post, isPersonal, handleEditMode }) => {
  const [editText, setEditText] = useState<string>("");
  const { userData, setUserData } = useContext(UserContext);

  const { request } = useHttp();
  const { handlePageNotification } = useNotistack();

  const ref = useRef<null | HTMLInputElement>(null);
  const {
    handleUploadImages,
    handleRemoveImage,
    images,
    setImages,
    imageLoading,
  } = useUploadImages();

  useEffect(() => {
    setEditText(post.content);
    setImages(post.images);
  }, [post]);

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const handleChooseEmoji = (emoji: string): void => {
    // console.log("emoji", emoji);
    setEditText(editText + emoji);
  };

  const handleSubmitUpdatedPost = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (imageLoading) {
      return;
    }
    try {
      const updatedPost = {
        content: editText,
        images,
      };
      const res = await request(
        `http://localhost:5000/api/post/${post._id}`,
        "PUT",
        updatedPost
      );

      const postIdx = userData!.wall.findIndex((el) => el._id === post._id);
      const pst = userData!.wall[postIdx];
      pst["content"] = editText;
      pst["images"] = images;
      const newWallArr = [
        ...userData!.wall.slice(0, postIdx),
        pst,
        ...userData!.wall.slice(postIdx + 1),
      ];
      setUserData({ ...userData, wall: newWallArr });
      handlePageNotification({ type: "success", text: res.message });
      handleEditMode(false);
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
      handleEditMode(false);
    }
  };

  // console.log("new post", post);

  return (
    <PostEditContent style={{ marginTop: "15px" }}>
      <form onSubmit={handleSubmitUpdatedPost}>
        <Emojis handleChooseEmoji={handleChooseEmoji} />
        <TextArea
          $focuse={true}
          value={editText}
          onChange={handleEditChange}
          style={{ resize: "none" }}
          minRows={4}
        />
        {images.length > 0 && (
          <ImagesPreviewWrapper exists={imageLoading || images.length > 0}>
            <>
              {imageLoading && (
                <ImageLoading>
                  <Spinner />
                </ImageLoading>
              )}
              {images.map((image: any) => {
                return (
                  <PreviewImageWrapper key={image.public_id}>
                    <ImageRemoveIconWrapper
                      onClick={handleRemoveImage.bind(null, image)}
                    >
                      <ImageRemoveIcon />
                    </ImageRemoveIconWrapper>

                    <PostImage src={image.url} alt={"post image"} />
                  </PreviewImageWrapper>
                );
              })}
            </>
          </ImagesPreviewWrapper>
        )}

        <PostEditFooter>
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
          <ButtonsWrapper>
            <Button
              size="small"
              color="secondary"
              marginRight="10px"
              onClick={() => handleEditMode(false)}
            >
              Cancel
            </Button>
            <Button size="small">Publish</Button>
          </ButtonsWrapper>
        </PostEditFooter>
      </form>
    </PostEditContent>
  );
};

export default PostEdit;
