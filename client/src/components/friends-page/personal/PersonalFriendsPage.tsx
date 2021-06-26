import React, { useContext, useEffect, useState } from "react";
import { IUserData } from "../../../interfaces/IUserData";
import FriendList from "../FriendList";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useQuery } from "../../../hooks/useQuery";
import FriendRequestList from "./FriendRequestList";
import FriendsNavigation from "../FriendsNavigation";
import FriendCard from "../FriendCard";
import { Separator } from "../../../styled-components/global";
import FriendsMenu from "../FriendsMenu";
import { useHttp } from "../../../hooks/useHttp";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const PersonalFriendsPage = () => {
  // const { meUserData } = useContext(AuthContext);
  const [friends, setFriends] = useState<any[]>([]);
  const { meUserData } = useContext(AuthContext);
  let query = useQuery();
  const { request, loading } = useHttp();
  // console.log("friends", friends);
  // console.log("query param", query.get("section"));

  // console.log("my friend requests", meUserData);
  useEffect(() => {
    request(`/api/friends/${meUserData?._id}`, "GET").then((res: any) => {
      // console.log("friends", res);
      setFriends(res.friends);
    });
  }, []);
  if (loading) {
    return <></>;
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
