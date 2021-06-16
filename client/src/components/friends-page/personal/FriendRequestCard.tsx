import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { OnlineContext } from "../../../context/OnlineContext";
import { useHttp } from "../../../hooks/useHttp";
import { IUserData } from "../../../interfaces/IUserData";

import {
  Avatar,
  Button,
  CustomLink,
  AvatarOnlineWrapper,
} from "../../../styled-components/global";

import { FriendCardInfo, FriendCardWrapper } from "../styles";

type Props = {
  friend: IUserData;
  friendRequestType?: "pending" | "out_sent";
  friendRequestId?: any;
  setFriendRequests: React.Dispatch<any>;
};

const FriendRequestCard: React.FC<Props> = ({
  friend,
  friendRequestType,
  friendRequestId,
  setFriendRequests,
}) => {
  const { meUserData, setMeUserData, socket } = useContext(AuthContext);
  const { online } = useContext(OnlineContext);
  const { request } = useHttp();

  const handleAcceptFriendRequest = async (
    user: IUserData,
    friendRequestId: string
  ) => {
    try {
      await request(
        `http://localhost:5000/api/friend-request/accept/${friendRequestId}`,
        "PUT",
        { userId: user._id }
      );
      setMeUserData({
        ...meUserData,
        friends: [...meUserData?.friends, user],
      });
      setFriendRequests((prevState: any) => {
        const newArr = prevState.filter(
          (el: any) => el.requester._id !== user._id
        );
        return newArr;
      });

      const notification = {
        user: meUserData,
        recipients: [user],
        text: `accepted your friend request`,
        url: "/friends",
      };

      const resNotif = await request(
        "http://localhost:5000/api/notify",
        "POST",
        {
          ...notification,
        }
      );
      socket.emit("createNotification", resNotif.notification);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelFriendRequest = async (
    user: IUserData,
    friendRequestId: string
  ) => {
    // console.log("data", user, friendRequestId);
    try {
      await request(
        `http://localhost:5000/api/friend-request/cancel/${friendRequestId}`,
        "DELETE",
        { userId: user._id }
      );
      setFriendRequests((prevState: any) => {
        const newArr = prevState.filter(
          (el: any) => el.recipient._id !== user._id
        );
        return newArr;
      });
    } catch (e) {
      console.log(e);
    }
  };

  // console.log("AAAA", friend);

  return (
    <FriendCardWrapper>
      <AvatarOnlineWrapper
        onlineType={online[friend._id ? friend._id : "ds"] ? true : false}
      >
        <Avatar
          size="medium"
          src={friend.avatar}
          style={{ marginRight: "15px" }}
        />
      </AvatarOnlineWrapper>

      <FriendCardInfo>
        <CustomLink
          style={{ marginBottom: "10px", display: "block" }}
          color="black"
          to={`/profile/${friend._id}`}
        >
          {friend.firstName} {friend.lastName}
        </CustomLink>
        {friendRequestType === "pending" ? (
          <Button
            size="small"
            onClick={() => handleAcceptFriendRequest!(friend, friendRequestId)}
          >
            Accept
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => handleCancelFriendRequest!(friend, friendRequestId)}
          >
            Unsubscribe
          </Button>
        )}
      </FriendCardInfo>
    </FriendCardWrapper>
  );
};

export default FriendRequestCard;
