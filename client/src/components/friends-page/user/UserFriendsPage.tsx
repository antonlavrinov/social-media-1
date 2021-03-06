import React, { useState, useEffect, useContext } from "react";
import { OnlineContext } from "../../../context/OnlineContext";

import { useHttp } from "../../../hooks/useHttp";
import { useQuery } from "../../../hooks/useQuery";
import { Separator } from "../../../styled-components/global";
import FriendCard from "../FriendCard";
import Spinner from "../../Spinner";
import FriendsNavigation from "../FriendsNavigation";
import styled from "styled-components";

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const UserFriendsPage = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const { online } = useContext(OnlineContext);

  const query = useQuery();
  const id = query.get("id");

  const { request, loading } = useHttp();

  useEffect(() => {
    request(`/api/friends/${id}`, "GET").then((res: any) => {
      setFriends(res.friends);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "550px" }}>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </div>
    );
  }

  const onlineFriends = friends.filter((el: any) => online[el._id]);

  const tabs = [
    { title: "All friends", url: "all", count: friends.length },
    { title: "Online", url: "online", count: onlineFriends.length },
  ];
  return (
    <>
      {(query.get("section") === "all" || query.get("section") === null) && (
        <FriendsNavigation tabs={tabs} activeTab={tabs[0]}>
          {friends.length === 0 ? (
            <div>No friends yet...</div>
          ) : (
            <>
              {friends.map((friend) => {
                return (
                  <>
                    <FriendCard friend={friend} key={friend._id} />
                    <Separator />
                  </>
                );
              })}
            </>
          )}
        </FriendsNavigation>
      )}
      {query.get("section") === "online" && (
        <FriendsNavigation
          // count={friends.length}
          tabs={tabs}
          activeTab={tabs[1]}
        >
          {onlineFriends.length === 0 ? (
            <div>No friends online</div>
          ) : (
            <>
              {onlineFriends.map((friend) => {
                return (
                  <>
                    <FriendCard friend={friend} key={friend._id} />
                    <Separator />
                  </>
                );
              })}
            </>
          )}
        </FriendsNavigation>
      )}
    </>
  );
};

export default UserFriendsPage;
