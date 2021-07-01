import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "./useHttp";

export const useLoadUser = (slugId: string) => {
  const [userData, setUserData] = useState<any>(null);
  const [isPersonal, setIsPersonal] = useState<boolean>(false);
  const { meUserData, setMeUserData, accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { request } = useHttp();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    if (slugId === meUserData?._id) {
      setIsPersonal(true);
    } else {
      setIsPersonal(false);
    }

    request(`/api/user/${slugId}`, "GET")
      .then((res) => {
        setUserData(res.userData);
        setLoading(false);
      })
      .catch((err) => {
        history.push("/not-found");
        setUserData(null);
        setLoading(false);
      });
  }, [slugId, meUserData?._id, request, history]);

  return {
    userData,
    setUserData,
    isPersonal,
    loading,
    meUserData,
    setMeUserData,
  };
};
