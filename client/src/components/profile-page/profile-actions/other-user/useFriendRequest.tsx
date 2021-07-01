import React, { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

import { useHttp } from "../../../../hooks/useHttp";
import { v4 as uuidv4 } from "uuid";

export const useFriendRequest = (
  userData: any,
  setUserData: any,
  relationToMe: string,
  setRelationToMe: any
) => {
  const { request, loading } = useHttp();

  const { meUserData, setMeUserData, socket } = useContext(AuthContext);

  const handleSendFriendRequest = async () => {
    try {
      const newId = uuidv4();

      const newFriendRequest = {
        createdAt: new Date().toISOString(),
        recipient: userData._id,
        requester: meUserData?._id,
        status: "pending",
        _id: newId,
      };

      setUserData({ ...userData, friendRequest: newFriendRequest });
      setRelationToMe("me_sent_request");
      const res = await request("/api/friend-request/create", "POST", {
        userId: userData._id,
      });

      setUserData({ ...userData, friendRequest: res.friendRequest });

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
      setRelationToMe("user_sent_request");

      const newId = uuidv4();

      const newFriendRequest = {
        createdAt: new Date().toISOString(),
        recipient: meUserData?._id,
        requester: userData._id,
        status: "pending",
        _id: newId,
      };

      setUserData((prevState: any) => {
        const friends = prevState.friends.filter((friend: any) => {
          return friend._id !== meUserData?._id;
        });
        return {
          ...prevState,
          friendRequest: newFriendRequest,
          friends,
        };
      });
      setMeUserData((prevState: any) => {
        const meFriends = prevState?.friends?.filter((friend: any) => {
          return friend._id !== userData?._id;
        });
        return {
          ...prevState,
          friendRequest: newFriendRequest,
          friends: meFriends,
        };
      });

      const res = await request(
        `/api/friend-request/unfriend/${userData.friendRequest._id}`,
        "PUT",
        { userId: userData._id }
      );

      setUserData((prevState: any) => {
        return {
          ...prevState,
          friendRequest: res.friendRequest,
        };
      });
      setMeUserData((prevState: any) => {
        return {
          ...prevState,
          friendRequest: res.friendRequest,
        };
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      setRelationToMe("friend");

      const newId = uuidv4();

      const newFriendRequest = {
        createdAt: new Date().toISOString(),
        recipient: meUserData?._id,
        requester: userData._id,
        status: "accepted",
        _id: newId,
      };

      setUserData((prevState: any) => {
        return {
          ...prevState,
          friendRequest: newFriendRequest,
          friends: [...prevState?.friends, meUserData],
        };
      });

      setMeUserData((prevState: any) => {
        return {
          ...prevState,
          friends: [...prevState?.friends, userData],
        };
      });

      const res = await request(
        `/api/friend-request/accept/${userData.friendRequest._id}`,
        "PUT",
        { userId: userData._id }
      );

      setUserData((prevState: any) => {
        return {
          ...prevState,
          friendRequest: res.friendRequest,
        };
      });

      // setMeUserData((prevState: any) => {
      //   return {
      //     ...prevState
      //   };
      // });

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
      setRelationToMe("not_friends");
      setUserData({ ...userData, friendRequest: null });

      const res = await request(
        `/api/friend-request/cancel/${userData.friendRequest._id}`,
        "DELETE",
        { userId: userData._id }
      );
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
    loading,
  };
};
