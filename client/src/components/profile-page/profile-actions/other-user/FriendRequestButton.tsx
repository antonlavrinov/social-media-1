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
  } = useFriendRequest(userData, setUserData, relationToMe, setRelationToMe);
  // console.log("relationtome", relationToMe);
  return (
    <div>
      {console.log("relation to me", relationToMe)}
      {relationToMe === "not_friend" && (
        <Button onClick={handleSendFriendRequest.bind(null)} width="fullwidth">
          Добавить в друзья
        </Button>
      )}
      {relationToMe === "friend" && (
        <Button
          color="secondary"
          width="fullwidth"
          onClick={handleSendUnFriendRequest}
        >
          Убрать из друзей
        </Button>
      )}
      {relationToMe === "user_sent_request" && (
        <Button width="fullwidth" onClick={handleAcceptFriendRequest}>
          Принять заявку
        </Button>
      )}
      {relationToMe === "me_sent_request" && (
        <Button width="fullwidth" onClick={handleCancelFriendRequest}>
          Отменить заявку
        </Button>
      )}
    </div>
  );
};

export default memo(FriendRequestButton);
