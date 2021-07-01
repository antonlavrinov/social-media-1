import React, { useState, useEffect, useContext } from "react";

// import { IUserData } from "../../../interfaces/IUserData";
import { Separator } from "../../../styled-components/global";

import FriendsNavigation from "../FriendsNavigation";
import { useQuery } from "../../../hooks/useQuery";
import { useHttp } from "../../../hooks/useHttp";
import { AuthContext } from "../../../context/AuthContext";
import FriendRequestCard from "./FriendRequestCard";
import styled from "styled-components";

const FriendRequestList = () => {
  const { request, loading } = useHttp();
  const [friendRequests, setFriendRequests] = useState<any>([]);
  const { meUserData, setMeUserData } = useContext(AuthContext);
  const query = useQuery();

  const loadFriendRequests = async () => {
    try {
      const res = await request(`/api/pending_friend_requests`, "GET");
      setFriendRequests(res.friendRequests);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadFriendRequests();
  }, []);

  const tabs = [
    {
      title: "Pending",
      url: "all_requests",
      count: friendRequests.filter(
        (el: any) => el.recipient._id === meUserData?._id
      ).length,
    },
    {
      title: "Out requests",
      url: "out_requests",
      count: friendRequests.filter(
        (el: any) => el.requester._id === meUserData?._id
      ).length,
    },
  ];

  return (
    <>
      {/* pending requests where i'm a recipient and he is a requester */}
      {query.get("section") === "all_requests" && (
        <FriendsNavigation loading={loading} tabs={tabs} activeTab={tabs[0]}>
          {!loading &&
            friendRequests
              .filter((el: any) => el.recipient._id === meUserData?._id)
              .map((friendRequest: any, idx: number) => {
                return (
                  <React.Fragment key={friendRequest._id}>
                    <FriendRequestCard
                      friend={friendRequest.requester}
                      friendRequestType={"pending"}
                      friendRequestId={friendRequest._id}
                      setFriendRequests={setFriendRequests}
                    />
                    <Separator />
                  </React.Fragment>
                );
              })}
        </FriendsNavigation>
      )}
      {/* pending requests where i'm a requester and he is a recipient */}
      {query.get("section") === "out_requests" && (
        <FriendsNavigation tabs={tabs} activeTab={tabs[1]}>
          {friendRequests
            .filter((el: any) => el.requester._id === meUserData?._id)
            .map((friendRequest: any, idx: number) => {
              return (
                <React.Fragment key={friendRequest._id}>
                  <FriendRequestCard
                    friend={friendRequest.recipient}
                    friendRequestType={"out_sent"}
                    friendRequestId={friendRequest._id}
                    setFriendRequests={setFriendRequests}
                  />
                  <Separator />
                </React.Fragment>
              );
            })}
        </FriendsNavigation>
      )}
    </>
  );
};

export default FriendRequestList;
