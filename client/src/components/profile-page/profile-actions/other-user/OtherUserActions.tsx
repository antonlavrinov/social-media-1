import React, { useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useCheckRelationToMe } from "../../../../hooks/useCheckRelationToMe";
import FriendRequestButton from "./FriendRequestButton";
import SendMessageButton from "./SendMessageButton";

const OtherUserActions = () => {
  const { userData, setUserData } = useContext(UserContext);
  const { relationToMe, setRelationToMe } = useCheckRelationToMe(userData);

  return (
    <div>
      <SendMessageButton userData={userData} />
      <FriendRequestButton
        relationToMe={relationToMe}
        setRelationToMe={setRelationToMe}
      />
    </div>
  );
};

export default OtherUserActions;
