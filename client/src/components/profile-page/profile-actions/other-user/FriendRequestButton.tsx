import { Button } from "../../../../styled-components/global";
import React, { useContext, memo } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useFriendRequest } from "./useFriendRequest";

type Props = {
  relationToMe: string;
  setRelationToMe: any;
};

const FriendRequestButton: React.FC<Props> = ({
  relationToMe,
  setRelationToMe,
}) => {
  const { userData, setUserData } = useContext(UserContext);
  const {
    handleSendFriendRequest,
    handleCancelFriendRequest,
    handleSendUnFriendRequest,
    handleAcceptFriendRequest,
    loading,
  } = useFriendRequest(userData, setUserData, relationToMe, setRelationToMe);

  return (
    <div>
      {console.log("relation to me", relationToMe)}
      {relationToMe === "not_friend" && (
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={!loading ? handleSendFriendRequest.bind(null) : () => {}}
          width="fullwidth"
        >
          Send friend request
        </Button>
      )}
      {relationToMe === "friend" && (
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          color="secondary"
          width="fullwidth"
          onClick={!loading ? handleSendUnFriendRequest : () => {}}
        >
          Unfriend
        </Button>
      )}
      {relationToMe === "user_sent_request" && (
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          width="fullwidth"
          onClick={!loading ? handleAcceptFriendRequest : () => {}}
        >
          Accept friend request
        </Button>
      )}
      {relationToMe === "me_sent_request" && (
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          width="fullwidth"
          onClick={!loading ? handleCancelFriendRequest : () => {}}
        >
          Unsubscribe
        </Button>
      )}
    </div>
  );
};

export default memo(FriendRequestButton);
