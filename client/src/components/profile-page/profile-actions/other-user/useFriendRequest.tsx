import React, { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

import { useHttp } from "../../../../hooks/useHttp";

export const useFriendRequest = (
  userData: any,
  setUserData: any,
  relationToMe: string,
  setRelationToMe: any
) => {
  const { request } = useHttp();

  const { meUserData, setMeUserData, socket } = useContext(AuthContext);

  const handleSendFriendRequest = async () => {
    try {
      const res = await request("/api/friend-request/create", "POST", {
        userId: userData._id,
      });

      setUserData({ ...userData, friendRequest: res.friendRequest });
      setRelationToMe("me_sent_request");

      const notification = {
        user: meUserData,
        recipients: [userData],
        text: `sent you a friend request`,
        url: "/friends?section=all_requests",
      };

      const resNotif = await request("/api/notify", "POST", {
        ...notification,
      });
      socket.emit("createNotification", resNotif.notification);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendUnFriendRequest = async () => {
    try {
      const res = await request(
        `/api/friend-request/unfriend/${userData.friendRequest._id}`,
        "PUT",
        { userId: userData._id }
      );

      setRelationToMe("user_sent_request");

      setUserData((prevState: any) => {
        const friends = prevState.friends.filter((friend: any) => {
          return friend._id !== meUserData?._id;
        });
        return {
          ...prevState,
          friendRequest: res.friendRequest,
          friends,
        };
      });
      setMeUserData((prevState: any) => {
        const meFriends = prevState?.friends?.filter((friend: any) => {
          return friend._id !== userData?._id;
        });
        return {
          ...prevState,
          friendRequest: res.friendRequest,
          friends: meFriends,
        };
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      const res = await request(
        `/api/friend-request/accept/${userData.friendRequest._id}`,
        "PUT",
        { userId: userData._id }
      );

      setRelationToMe("friend");

      setUserData((prevState: any) => {
        return {
          ...prevState,
          friendRequest: res.friendRequest,
          friends: [...prevState?.friends, meUserData],
        };
      });

      setMeUserData((prevState: any) => {
        return {
          ...prevState,
          friends: [...prevState?.friends, userData],
        };
      });

      const notification = {
        user: meUserData,
        recipients: [userData],
        text: `accepted your friend request`,
        url: "/friends",
      };

      const resNotif = await request("/api/notify", "POST", {
        ...notification,
      });
      socket.emit("createNotification", resNotif.notification);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      const res = await request(
        `/api/friend-request/cancel/${userData.friendRequest._id}`,
        "DELETE",
        { userId: userData._id }
      );

      setRelationToMe("not_friends");

      setUserData({ ...userData, friendRequest: null });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    handleSendFriendRequest,
    handleCancelFriendRequest,
    handleSendUnFriendRequest,
    handleAcceptFriendRequest,
    relationToMe,
  };
};
