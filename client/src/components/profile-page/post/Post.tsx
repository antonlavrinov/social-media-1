import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { IPost, IUserData } from "../../../interfaces/IUserData";
import { DateTime } from "luxon";
import { useHttp } from "../../../hooks/useHttp";
import { UserContext } from "../../../context/UserContext";
import { AuthContext } from "../../../context/AuthContext";
import useNotistack from "../../../hooks/useNotistack";
import Tippy from "@tippyjs/react";

import {
  Avatar,
  ContentBox,
  ContentBoxContainer,
  CustomLink,
  Separator,
  svgPrimaryStyle,
} from "../../../styled-components/global";
import { ReactComponent as CogwheelIcon } from "../../../assets/icons/cogwheel-icon.svg";
import { ReactComponent as LikeIconDisabled } from "../../../assets/icons/like-icon_disabled.svg";
import { ReactComponent as LikeIconLiked } from "../../../assets/icons/like-icon_liked.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment-icon.svg";

import PostEdit from "./PostEdit";
import { useTippyVisibility } from "../../../hooks/useTippyVisibility";
import PostSubmitComment from "./PostSubmitComment";
import PostComments from "./comments/Comments";
import useLikePost from "../../../hooks/useLikePost";

const IconsWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 5px;
  right: 5px;
`;

const PostImage = styled.img`
  width: 100%;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 100px;
  margin-right: 15px;
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  margin-bottom: 3px;
`;

const PostDate = styled.div`
  color: var(--text-color-secondary);
`;

const PostOptions = styled.div`
  margin-left: auto;
  svg {
    ${svgPrimaryStyle}
  }
`;

const EditPostPopup = styled.div``;

const EditPostPopupSelect = styled.div`
  display: flex;
  padding: 15px 15px;
  align-items: center;
  border-top: var(--border-primary);

  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
  :first-child {
    border-top: none;
  }
`;

const PostFooter = styled.div`
  display: flex;
`;

const PostContent = styled.div``;

const PostText = styled.div`
  padding-top: 20px;
`;

const PostImagesWrapper = styled.div`
  padding-top: 15px;
`;

const LikeIconWrapper = styled.div<{ liked: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 10px;

  svg {
    ${svgPrimaryStyle}

    ${(props) =>
      props.liked &&
      `
      fill: var(--color-red);
      :hover {
        fill: var(--color-red);
      }
    `}
  }
`;

const CommentIconWrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    ${svgPrimaryStyle}
  }
`;

const LikeCount = styled.div`
  margin-left: 5px;
  /* color: var(--text-color-secondary); */
  font-size: 16px;
  top: 2px;
`;

type Props = {
  post: any;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
};

const Post: React.FC<Props> = ({ post, setEditMode, editMode }) => {
  const [comments, setComments] = useState<any>([...post.comments]);

  //updating

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const { visible, show, hide } = useTippyVisibility();
  const { handlePageNotification } = useNotistack();

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const date = DateTime.fromISO(post.createdAt).toLocaleString({
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  });

  // console.log("POST", post);

  const { request } = useHttp();
  const { userData, setUserData, isPersonal } = useContext(UserContext);
  const { meUserData, setMeUserData } = useContext(AuthContext);
  // const { handleNotification } = useNotistack();

  const { isLike, handleUnLikePost, handleLikePost, likes } = useLikePost(
    meUserData,
    post
  );

  useEffect(() => {
    //can delete
    if (isPersonal) {
      setCanDelete(true);
      // setCanEdit(true);
      // console.log("meUserData wall", meUserData);
      const thisPost = userData!.wall!.find((el: IPost) => el._id === post._id);
      if (thisPost.user._id === meUserData?._id) {
        setCanEdit(true);
      } else {
        console.log("you cannot edit this post");
        setCanEdit(false);
      }
    } else {
      if (
        userData!.wall!.find(
          (el: IPost) => el.user._id === meUserData!._id && el._id === post._id
        )
      ) {
        setCanDelete(true);
        setCanEdit(true);
      } else {
        setCanEdit(false);
        setCanDelete(false);
      }
    }
  }, [post._id, meUserData!._id]);

  const handleDeletePost = async () => {
    try {
      const res = await request(
        `http://localhost:5000/api/post/${post._id}`,
        "DELETE"
      );

      const updatedPosts = userData!.wall.filter((el) => el._id !== post._id);
      // console.log("updatedPosts", updatedPosts);
      setUserData({ ...userData, wall: updatedPosts });
      handlePageNotification({ type: "success", text: res.message });
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "error", text: e.message });
      // handleNotification(e.message, "error");
    }
  };

  const handleEditMode = (boolean: boolean) => {
    if (boolean) {
      if (!editMode) {
        setIsEdit(true);
        setEditMode(true);
      }
    } else {
      setIsEdit(false);
      setEditMode(false);
    }
  };

  const editPostPopup = (
    <ContentBox onClick={hide}>
      <EditPostPopup>
        {canEdit && (
          <EditPostPopupSelect onClick={() => handleEditMode(true)}>
            Редактировать
          </EditPostPopupSelect>
        )}
        {canDelete && (
          <EditPostPopupSelect onClick={handleDeletePost}>
            Удалить
          </EditPostPopupSelect>
        )}
      </EditPostPopup>
    </ContentBox>
  );
  return (
    <ContentBox key={post._id} style={{ marginBottom: "15px" }}>
      <ContentBoxContainer>
        <PostHeader>
          <Avatar size="medium" marginRight="15px" src={post.user?.avatar} />
          <UserInfo>
            <CustomLink
              to={`/profile/${post.user?._id}`}
              style={{ marginBottom: "5px", display: "block" }}
            >
              {post.user?.firstName} {post.user?.lastName}
            </CustomLink>
            <PostDate>{date}</PostDate>
          </UserInfo>
          {(canEdit || canDelete) && (
            <Tippy
              content={editPostPopup}
              interactive={true}
              placement={"bottom-end"}
              trigger="click"
              duration={0}
              offset={[0, 5]}
              visible={visible}
              onClickOutside={hide}
              // hideOnClick={"toggle"}
            >
              <PostOptions onClick={visible ? hide : show}>
                <CogwheelIcon />
              </PostOptions>
            </Tippy>
          )}
        </PostHeader>
        {isEdit ? (
          <PostEdit
            handleEditMode={handleEditMode}
            post={post}
            isPersonal={isPersonal}
          />
        ) : (
          <>
            {post.content && (
              <PostContent>
                <PostText>{post.content}</PostText>
              </PostContent>
            )}
            {post.images.length > 0 && (
              <PostImagesWrapper>
                {post.images.map((image: any) => {
                  return <PostImage src={image.url} alt={"post image"} />;
                })}
              </PostImagesWrapper>
            )}
          </>
        )}
      </ContentBoxContainer>
      <Separator />
      <ContentBoxContainer>
        <PostFooter>
          {isLike ? (
            <LikeIconWrapper onClick={handleUnLikePost} liked={true}>
              <LikeIconLiked />
              {likes.length > 0 && <LikeCount>{likes.length}</LikeCount>}
            </LikeIconWrapper>
          ) : (
            <LikeIconWrapper onClick={handleLikePost} liked={false}>
              <LikeIconDisabled />
              {likes.length > 0 && <LikeCount>{likes.length}</LikeCount>}
            </LikeIconWrapper>
          )}
          <CommentIconWrapper>
            <CommentIcon />
            {comments.length > 0 && <LikeCount>{comments.length}</LikeCount>}
          </CommentIconWrapper>
        </PostFooter>
      </ContentBoxContainer>
      <Separator />
      <PostComments comments={comments} setComments={setComments} post={post} />
      <PostSubmitComment post={post} setComments={setComments} />
    </ContentBox>
  );
};

export default Post;
