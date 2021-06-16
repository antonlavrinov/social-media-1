import React, { useState, useContext } from "react";
import { useHttp } from "../../hooks/useHttp";
import { IUserData } from "../../interfaces/IUserData";
import {
  ContentBox,
  ContentBoxContainer,
  Separator,
} from "../../styled-components/global";
import FriendCard from "./FriendCard";
// import styled from "styled-components";
import FriendsNavigation from "./FriendsNavigation";
import { useQuery } from "../../hooks/useQuery";
import { OnlineContext } from "../../context/OnlineContext";
import styled from "styled-components";

const NoFriends = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  div {
    font-size: 18px;
    color: var(--text-color-secondary);
  }
`;

type Props = {
  friends: IUserData[];
  isPersonal?: boolean;
};

const FriendList: React.FC<Props> = ({ friends, isPersonal }) => {
  const query = useQuery();
  const { online } = useContext(OnlineContext);

  const onlineFriends = friends.filter((el: any) => online[el._id]);

  const tabs = [
    { title: "All friends", url: "all", count: friends.length },
    { title: "Online", url: "online", count: onlineFriends.length },
  ];

  return (
    <>
      {(query.get("section") === "all" || query.get("section") === null) && (
        <FriendsNavigation
          // count={friends.length}
          tabs={tabs}
          activeTab={tabs[0]}
        >
          {friends.length === 0 ? (
            <NoFriends>
              <div>No friends yet...</div>
            </NoFriends>
          ) : (
            <>
              {friends.map((friend, idx) => {
                return (
                  <React.Fragment key={idx}>
                    {/* {idx !== 0 && <Separator />} */}
                    <FriendCard friend={friend} isPersonal={isPersonal} />
                    <Separator />
                  </React.Fragment>
                );
              })}
            </>
          )}
        </FriendsNavigation>
      )}
      {query.get("section") === "online" && (
        <FriendsNavigation
          // count={onlineFriends.length}
          tabs={tabs}
          activeTab={tabs[1]}
        >
          {onlineFriends.length === 0 ? (
            <NoFriends>
              <div>No friends online...</div>
            </NoFriends>
          ) : (
            <>
              {onlineFriends.map((friend, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <FriendCard friend={friend} isPersonal={isPersonal} />
                    <Separator />
                  </React.Fragment>
                );
              })}
            </>
          )}
        </FriendsNavigation>
      )}
    </>
  );
};

export default FriendList;
