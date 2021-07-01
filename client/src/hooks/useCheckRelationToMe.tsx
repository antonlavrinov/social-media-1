import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { IUserData } from "../interfaces/IUserData";

export const useCheckRelationToMe = (otherUserData: IUserData | null) => {
  const [relationToMe, setRelationToMe] = useState<null | any>(null);

  const { meUserData } = useContext(AuthContext);

  useEffect(() => {
    if (!otherUserData) {
      return;
    }
    const checkRelationToUser = (request: any): string => {
      console.log("check relation", relationToMe);
      if (!request) {
        return "not_friend";
      }
      const { recipient, requester, status } = request;
      if (
        (recipient === meUserData?._id || requester === meUserData?._id) &&
        status === "accepted"
      ) {
        return "friend";
      }
      if (recipient === meUserData?._id && status === "pending") {
        return "user_sent_request";
      }
      if (requester === meUserData?._id && status === "pending") {
        return "me_sent_request";
      }
      return "not_friend";
    };

    let status = checkRelationToUser(otherUserData.friendRequest);

    setRelationToMe(status);
  }, [otherUserData, meUserData?._id, relationToMe]);

  return { relationToMe, setRelationToMe };
};
