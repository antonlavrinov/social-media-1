import React from "react";
import styled from "styled-components";
import Comment from "./Comment";

const PostCommentsWrapper = styled.div`
  padding: 0 15px;
  .separator {
    :last-child {
      display: none;
    }
  }
`;

type Props = {
  comments: any;
  setComments: React.Dispatch<React.SetStateAction<boolean>>;
  post: any;
};

const PostComments: React.FC<Props> = ({ comments, setComments, post }) => {
  return (
    <PostCommentsWrapper>
      {comments.map((comment: any) => {
        return (
          <Comment
            comment={comment}
            key={comment._id}
            setComments={setComments}
            post={post}
          />
        );
      })}
    </PostCommentsWrapper>
  );
};

export default PostComments;
