import React, { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { OnlineContext } from "./context/OnlineContext";
import useNotistack from "./hooks/useNotistack";

export const SocketClient = () => {
  const { meUserData, socket, setNotifications, setConversations } =
    useContext(AuthContext);
  const { setOnline } = useContext(OnlineContext);
  const { handleNotification } = useNotistack();

  useEffect(() => {
    socket.on("createNotificationToClient", (notification: any) => {
      setNotifications((prevState: any) => {
        return [notification, ...prevState];
      });
      handleNotification(notification, "default");
    });

    return () => socket.off("createNotificationToClient");
  }, [socket]);

  useEffect(() => {
    socket.on("joinUserToClient", (users: any) => {
      setOnline(users);
    });

    return () => socket.off("joinUserToClient");
  }, [socket]);

  useEffect(() => {
    socket.on("disconnectUserToClient", (users: any) => {
      setOnline(users);
    });

    return () => socket.off("disconnectUserToClient");
  }, [socket]);

  useEffect(() => {
    socket.on("createMessageNotificationToClient", (notification: any) => {
      if (window.location.href.includes("conversation")) {
        return;
      }
      handleNotification(notification, "default");
    });
    return () => socket.off("createMessageNotificationToClient");
  }, [socket]);

  useEffect(() => {
    socket.emit("joinUser", meUserData?._id);
  }, [socket, meUserData?._id]);

  useEffect(() => {
    socket.emit("checkUsersOnline");
  }, [socket]);

  useEffect(() => {
    socket.on("checkUsersOnlineToMe", (users: any) => {
      setOnline(users);
    });

    return () => {
      socket.off("checkUsersOnlineToMe");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("createMessageToClient", (message: any) => {
      setConversations((prevState: any) => {
        const newArr = prevState.filter(
          (el: any) => el._id !== message.conversation._id
        );

        const currentConv = prevState.find(
          (el: any) => el._id === message.conversation._id
        );

        const updatedConv = {
          ...currentConv,
          messages: [...currentConv.messages, message],
        };
        return [updatedConv, ...newArr];
      });

      return () => {
        socket.off("createConversationsToClient");
      };
    });
  }, [socket]);

  useEffect(() => {
    socket.on("createConversationToClient", (conversation: any) => {
      setConversations((prevState: any) => {
        return [conversation, ...prevState];
      });

      return () => {
        socket.off("createConversationToClient");
      };
    });
  }, [socket]);

  useEffect(() => {
    socket.on("readConversationToClient", (message: any) => {
      setConversations((prevState: any) => {
        const conversation = prevState.find(
          (el: any) => el._id === message.conversation._id
        );

        const conversationIdx = prevState.findIndex(
          (el: any) => el._id === message.conversation._id
        );

        const conversationMsgIdx = conversation.messages.findIndex(
          (el: any) => el._id === message._id
        );
        const messages = [
          ...conversation.messages.slice(0, conversationMsgIdx),
          message,
          ...conversation.messages.slice(conversationMsgIdx + 1),
        ];

        const updatedConversation = {
          ...conversation,
          messages,
        };

        const newConversations = [
          ...prevState.slice(0, conversationIdx),
          updatedConversation,
          ...prevState.slice(conversationIdx + 1),
        ];

        return newConversations;
      });

      return () => {
        socket.off("readConversationToClient");
      };
    });
  }, [socket]);

  return <></>;
};
