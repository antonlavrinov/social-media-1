import React, { useContext } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  ContentBoxContainer,
  Separator,
} from "../../styled-components/global";
import { OnlineContext } from "../../context/OnlineContext";

const FriendsWrapper = styled.div``;

const Friend = styled.div`
  display: flex;
  justify-content: center;
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
  }
`;

const FriendAvatar = styled.img`
  border-radius: 100px;
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-bottom: 5px;
`;

const FriendsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
`;

const FriendsTitle = styled(Link)`
  display: block;
  margin-bottom: 10px;
`;

const FriendsTitleCount = styled.span`
  color: var(--text-color-secondary);
`;

const NoFriends = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  div {
    display: block;
    font-size: 18px;
    color: var(--text-color-secondary);
  }
  span {
    color: var(--text-color-secondary);
  }
`;

type FriendsProps = {
  friends: any;
  _id: string;
  isPersonal: boolean;
};

const Friends: React.FC<FriendsProps> = ({ friends, _id, isPersonal }) => {
  const { online } = useContext(OnlineContext);

  const onlineFriends = friends.filter((el: any) => online[el._id]);
  const history = useHistory();

  return (
    <FriendsWrapper>
      <ContentBoxContainer>
        <FriendsTitle to={isPersonal ? `/friends` : `/friends?id=${_id}`}>
          Friends <FriendsTitleCount>{friends.length}</FriendsTitleCount>
        </FriendsTitle>
        {friends.length > 0 ? (
          <FriendsList>
            {friends.slice(0, 6).map((friend: any) => {
              const slicedName =
                friend.firstName.length < 9
                  ? friend.firstName
                  : friend.firstName.slice(0, 9) + "...";
              return (
                <Friend key={friend._id}>
                  <Link to={`/profile/${friend._id}`}>
                    <FriendAvatar src={friend.avatar} />
                    {slicedName}
                  </Link>
                </Friend>
              );
            })}
          </FriendsList>
        ) : (
          <FriendsList style={{ minHeight: "100px", display: "flex" }}>
            <NoFriends>
              <div>No friends yet...</div>
              {isPersonal ? (
                <Button
                  marginTop="10px"
                  size="small"
                  onClick={() => history.push("/search")}
                >
                  Find friends
                </Button>
              ) : null}
            </NoFriends>
          </FriendsList>
        )}
      </ContentBoxContainer>
      {onlineFriends.length > 0 && (
        <>
          <Separator />
          <ContentBoxContainer>
            {" "}
            <FriendsTitle to={isPersonal ? `/friends` : `/friends?id=${_id}`}>
              Online{" "}
              <FriendsTitleCount>{onlineFriends.length}</FriendsTitleCount>
            </FriendsTitle>
            <FriendsList>
              {onlineFriends.slice(0, 6).map((friend: any) => {
                const slicedName =
                  friend.firstName.length < 9
                    ? friend.firstName
                    : friend.firstName.slice(0, 9) + "...";
                return (
                  <Friend key={friend._id}>
                    <Link to={`/profile/${friend._id}`}>
                      <FriendAvatar src={friend.avatar} />
                      {slicedName}
                    </Link>
                  </Friend>
                );
              })}
            </FriendsList>
          </ContentBoxContainer>
        </>
      )}
    </FriendsWrapper>
  );
};

export default Friends;
