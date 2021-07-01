import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import {
  Avatar,
  ContentBox,
  CustomDate,
  CustomLink,
  Separator,
  svgSecondaryStyle,
} from "../../../../styled-components/global";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { ReactComponent as CogwheelIcon } from "../../../../assets/icons/cogwheel-icon.svg";
import { useTippyVisibility } from "../../../../hooks/useTippyVisibility";
import Tippy from "@tippyjs/react";
import { useHttp } from "../../../../hooks/useHttp";
import useNotistack from "../../../../hooks/useNotistack";
import { UserContext } from "../../../../context/UserContext";
import { AuthContext } from "../../../../context/AuthContext";
import useLikeComment from "../../../../hooks/useLikeComment";
import { ReactComponent as LikeIconDisabledFilled } from "../../../../assets/icons/like-icon_filled.svg";
import { ReactComponent as LikeIconLiked } from "../../../../assets/icons/like-icon_liked.svg";

const CommentWrapper = styled.div`
  padding: 15px 0;
  display: flex;
  align-items: flex-start;
  position: relative;
`;

const CommentContent = styled.div`
  position: relative;
`;

const CommentText = styled.div``;

const CommentInfo = styled.div`
  display: flex;
`;

const CommentOptions = styled.div`
  position: absolute;
  top: 15px;
  right: 0;
  svg {
    ${svgSecondaryStyle}
  }
`;

const EditPopup = styled.div``;
const EditPopupSelect = styled.div`
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

const LikeIconWrapper = styled.div<{ liked: boolean }>`
  position: absolute;
  bottom: 15px;
  right: 0;
  display: flex;
  align-items: center;
  svg {
    ${svgSecondaryStyle}
    margin-right: 3px;
    position: relative;

    ${(props) =>
      props.liked &&
      `
      fill: var(--color-red);
      margin-right: 0;
      :hover {
        fill: var(--color-red);
      }
    `}
  }
`;

const LikeCount = styled.div`
  margin-left: 3px;
`;

type Props = {
  comment: any;
  setComments: React.Dispatch<React.SetStateAction<any>>;
  post: any;
};

const Comment: React.FC<Props> = ({ comment, setComments, post }) => {
  const { visible, show, hide } = useTippyVisibility();
  const [canDelete, setCanDelete] = useState<boolean>(true);
  const { request } = useHttp();
  const { handlePageNotification } = useNotistack();
  const { isPersonal } = useContext(UserContext);
  const { meUserData } = useContext(AuthContext);

  useEffect(() => {
    //can delete
    if (isPersonal) {
      setCanDelete(true);
    } else {
      if (
        comment.user._id === meUserData?._id ||
        post.user._id === meUserData?._id
      ) {
        setCanDelete(true);
      } else {
        setCanDelete(false);
      }
    }
  }, [comment.user._id, meUserData!._id]);

  const { handleLikeComment, handleUnLikeComment, isLike, likes } =
    useLikeComment(comment, meUserData);

  const handleDeleteComment = async (postId: string) => {
    try {
      setComments((prevState: any) => {
        const newArr = prevState.filter((el: any) => el._id !== comment._id);
        return newArr;
      });
      const res = await request(`/api/comment/${comment._id}`, "DELETE", {
        postId,
      });

      handlePageNotification({ type: "success", text: res.message });
    } catch (e) {
      console.log(e);
      handlePageNotification({ type: "success", text: e.message });
    }
  };

  const editPopup = (
    <ContentBox onClick={hide}>
      <EditPopup>
        {canDelete && (
          <EditPopupSelect onClick={handleDeleteComment.bind(null, post._id)}>
            Delete
          </EditPopupSelect>
        )}
      </EditPopup>
    </ContentBox>
  );
  const date = DateTime.fromISO(comment.createdAt).toLocaleString({
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  });
  return (
    <>
      <CommentWrapper>
        <Avatar
          marginRight="10px"
          size="medium-small"
          src={comment.user.avatar}
        />
        <CommentContent>
          <CustomLink
            style={{ marginBottom: "5px", display: "block" }}
            to={`/profile/${comment.user._id}`}
          >
            {comment.user.firstName} {comment.user.lastName}
          </CustomLink>
          <CommentText>{comment.content}</CommentText>
          <CommentInfo>
            <CustomDate style={{ marginTop: "5px" }}>{date}</CustomDate>
          </CommentInfo>
        </CommentContent>
        {canDelete && (
          <Tippy
            content={editPopup}
            interactive={true}
            placement={"bottom-end"}
            trigger="click"
            duration={0}
            offset={[0, 5]}
            visible={visible}
            onClickOutside={hide}
          >
            <CommentOptions onClick={visible ? hide : show}>
              <CogwheelIcon />
            </CommentOptions>
          </Tippy>
        )}
        {isLike ? (
          <LikeIconWrapper onClick={handleUnLikeComment} liked={true}>
            <LikeIconLiked />
            {likes.length > 0 && <LikeCount>{likes.length}</LikeCount>}
          </LikeIconWrapper>
        ) : (
          <LikeIconWrapper onClick={handleLikeComment} liked={false}>
            <LikeIconDisabledFilled />
            {likes.length > 0 && likes.length}
          </LikeIconWrapper>
        )}
      </CommentWrapper>
      <Separator className="separator" />
    </>
  );
};

export default Comment;
