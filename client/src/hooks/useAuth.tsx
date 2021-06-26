import { useState, useCallback, useEffect } from "react";
import io from "socket.io-client";
import { useHistory } from "react-router";
import { IUserData } from "../interfaces/IUserData";
import { useHttp } from "./useHttp";

const storageName = "firstLogin";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);
  const [notifications, setNotifications] = useState<any>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [meUserData, setMeUserData] = useState<null | IUserData>(null);
  const [online, setOnline] = useState<any[]>([]);

  const { request } = useHttp();

  const getNotifications = useCallback(async (token) => {
    try {
      // console.log("making a request to notifications", accessToken);
      const allNotifications = await request("/api/notifies", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("notifications from server", allNotifications);
      setNotifications(allNotifications.notifications);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getConversations = useCallback(async (token) => {
    // console.log("making a request to conversations", accessToken);
    const res = await request(`/api/conversations`, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    setConversations((prevState) => {
      return res.conversations;
    });
  }, []);

  const login = useCallback(async (jwtToken: string, data: IUserData) => {
    // console.log("jwtToken", jwtToken);
    setMeUserData(data);
    setAccessToken(jwtToken);
    await getNotifications(jwtToken);
    await getConversations(jwtToken);

    // console.log("logged in", data, jwtToken);
    // console.log("happended");

    localStorage.setItem(storageName, "true");
    // history.push("/profile/:id");
    // console.log(history);

    // localStorage.setItem(
    //   storageName,
    //   JSON.stringify({
    //     userData: data,
    //     token: jwtToken,
    //   })
    // );
  }, []);

  const logout = useCallback((): void => {
    setAccessToken(null);
    setMeUserData(null);
    localStorage.removeItem(storageName);
  }, []);

  const refreshToken = useCallback(async () => {
    const firstLogin = localStorage.getItem(storageName);
    // console.log("use effect");

    if (firstLogin) {
      // console.log("exists");

      try {
        // console.log("start refreshing token");
        const data = await request(
          "/api/auth/refresh_token",
          "POST"
          // null,
          // {}
        );
        // console.log("complete refreshing token", data.accessToken);
        login(data.accessToken, data.userData);

        console.log("firing ready");
        setReady(true);

        // console.log("client", data.userData);
      } catch (e) {
        console.log(e);
        setReady(true);
      }
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // console.log("accessToken", accessToken);

    refreshToken();

    const socketItem = io();
    setSocket(socketItem);
    // const data = JSON.parse(localStorage.getItem(storageName)!);
    // // request('');
    // if (data && data.token) {
    //   login(data.token, data.userData);
    // }
    return () => {
      socketItem.close();
    };
  }, []);

  return {
    login,
    logout,
    accessToken,
    meUserData,
    setMeUserData,
    ready,
    socket,
    notifications,
    setNotifications,
    conversations,
    setConversations,
    online,
    setOnline,
  };
};
