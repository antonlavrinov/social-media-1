import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { IUserData } from "../interfaces/IUserData";
import { useHttp } from "./useHttp";

// const storageName = "firstLogin";

export const useLoadUser = (slugId: string) => {
  const [userData, setUserData] = useState<any>(null);
  const [isPersonal, setIsPersonal] = useState<boolean>(false);
  const { meUserData, setMeUserData, accessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { request } = useHttp();
  const history = useHistory();

  // console.log("slugId", slugId);

  useEffect(() => {
    // console.log("accessToken", accessToken);
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
        // console.log("USER", res);
      })
      .catch((err) => {
        history.push("/not-found");
        setUserData(null);
        setLoading(false);
      });

    // if (slugId === meUserData?._id) {
    //   setUserData(meUserData);
    //   setIsPersonal(true);
    //   // console.log("me USER", meUserData);
    // } else {
    //   setLoading(true);
    //   setIsPersonal(false);
    //   request(`/api/user/${slugId}`, "GET")
    //     .then((res) => {
    //       setUserData(res.userData);
    //       setLoading(false);
    //       // console.log("USER", res);
    //     })
    //     .catch((err) => {
    //       history.push("/not-found");
    //       setUserData(null);
    //       setLoading(false);
    //     });
    //   // setUserData(null);
    // }
  }, [slugId, meUserData?._id]);

  return {
    userData,
    setUserData,
    isPersonal,
    loading,
    meUserData,
    setMeUserData,
  };
};
