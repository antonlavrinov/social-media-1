import { useState, useCallback, useEffect } from "react";
import io from "socket.io-client";
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
      const allNotifications = await request("/api/notifies", "GET", null, {
        Authorization: `Bearer ${token}`,
      });

      setNotifications(allNotifications.notifications);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getConversations = useCallback(async (token) => {
    const res = await request(`/api/conversations`, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
    setConversations((prevState) => {
      return res.conversations;
    });
  }, []);

  const login = useCallback(async (jwtToken: string, data: IUserData) => {
    setMeUserData(data);
    setAccessToken(jwtToken);
    await getNotifications(jwtToken);
    await getConversations(jwtToken);

    localStorage.setItem(storageName, "true");
  }, []);

  const logout = useCallback((): void => {
    setAccessToken(null);
    setMeUserData(null);
    localStorage.removeItem(storageName);
  }, []);

  const refreshToken = useCallback(async () => {
    const firstLogin = localStorage.getItem(storageName);

    if (firstLogin) {
      try {
        const data = await request("/api/auth/refresh_token", "POST");

        login(data.accessToken, data.userData);

        console.log("firing ready");
        setReady(true);
      } catch (e) {
        console.log(e);
        setReady(true);
      }
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshToken();

    const socketItem = io();
    setSocket(socketItem);

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
