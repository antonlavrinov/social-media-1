import React, { useContext, useEffect, useState } from "react";

import FriendList from "../FriendList";
import styled from "styled-components";

import { AuthContext } from "../../../context/AuthContext";
import { useQuery } from "../../../hooks/useQuery";
import FriendRequestList from "./FriendRequestList";

import FriendsMenu from "../FriendsMenu";
import { useHttp } from "../../../hooks/useHttp";
import Spinner from "../../Spinner";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const PersonalFriendsPage = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const { meUserData } = useContext(AuthContext);
  let query = useQuery();
  const { request } = useHttp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      request(`/api/friends/${meUserData?._id}`, "GET").then((res: any) => {
        setFriends(res.friends);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
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
  return (
    <Wrapper>
      {(query.get("section") === "all" ||
        query.get("section") === "online" ||
        query.get("section") === null) && (
        <FriendList friends={friends} isPersonal />
      )}

      {/* requests */}
      {(query.get("section") === "all_requests" ||
        query.get("section") === "out_requests") && <FriendRequestList />}
      <FriendsMenu
        menuItems={[
          { title: "All friends", url: "all" },
          { title: "Friend requests", url: "all_requests" },
        ]}
      />
    </Wrapper>
  );
};

export default PersonalFriendsPage;
