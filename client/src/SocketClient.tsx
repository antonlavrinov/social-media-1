import React, { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
// import { ConversationContext } from "./context/ConversationContext";
import { MessagesContext } from "./context/MessagesContext";
import { OnlineContext } from "./context/OnlineContext";
import useNotistack from "./hooks/useNotistack";

export const SocketClient = () => {
  const {
    meUserData,
    socket,
    // notifications,
    setNotifications,
    // conversations,
    setConversations,
  } = useContext(AuthContext);
  const { setOnline } = useContext(OnlineContext);
  // const { conversation, setConversation } = useContext(ConversationContext);
  // console.log("SFJBFHF", conversation);
  const { handleNotification } = useNotistack();

  useEffect(() => {
    socket.on("createNotificationToClient", (notification: any) => {
      // console.log("createNotificationToClient", notification);
      setNotifications((prevState: any) => {
        console.log("setting notifications...");
        return [notification, ...prevState];
      });
      handleNotification(
        notification,
        // `${notification.user.firstName} ${notification.user.lastName} ${notification.text}`,
        "default"
      );
    });

    return () => socket.off("createNotificationToClient");
  }, [socket]);

  useEffect(() => {
    socket.on("joinUserToClient", (users: any) => {
      // console.log("ONLINE USERS CLIENT", users);
      setOnline(users);
    });

    return () => socket.off("joinUserToClient");
  }, [socket]);

  useEffect(() => {
    socket.on("disconnectUserToClient", (users: any) => {
      // console.log("disconnect users", users);
      setOnline(users);
    });

    return () => socket.off("disconnectUserToClient");
  }, [socket]);

  useEffect(() => {
    socket.on("createMessageNotificationToClient", (notification: any) => {
      // console.log("createNotificationToClient", notification);
      // setNotifications((prevState: any) => {
      //   console.log("setting notifications...");
      //   return [notification, ...prevState];
      // });
      if (window.location.href.includes("conversation")) {
        return;
      }
      handleNotification(
        notification,
        // `${notification.user.firstName} ${notification.user.lastName} ${notification.text}`,
        "default"
      );
    });
    return () => socket.off("createMessageNotificationToClient");
  }, [socket]);

  useEffect(() => {
    socket.emit("joinUser", meUserData?._id);
    // console.log("emitted join user");
  }, [socket, meUserData?._id]);

  useEffect(() => {
    socket.emit("checkUsersOnline");
  }, [socket]);

  useEffect(() => {
    socket.on("checkUsersOnlineToMe", (users: any) => {
      // console.log("checkUsersOnlineToMe", users);
      setOnline(users);
    });

    return () => {
      socket.off("checkUsersOnlineToMe");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("createMessageToClient", (message: any) => {
      console.log("createMessageToClient", message);

      // if (!window.location.href.includes("id")) {

      setConversations((prevState: any) => {
        console.log("set conversations");

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
      console.log("createConversationToClient", conversation);

      // if (!window.location.href.includes("id")) {

      setConversations((prevState: any) => {
        console.log("set conversations");
        return [conversation, ...prevState];
      });

      return () => {
        socket.off("createConversationToClient");
      };
    });
  }, [socket]);

  useEffect(() => {
    socket.on("readConversationToClient", (message: any) => {
      console.log("readConversationToClient", message);

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

        console.log("setConversations in sockets", updatedConversation);

        // console.log("conversationIdx", conversationIdx);

        const newConversations = [
          ...prevState.slice(0, conversationIdx),
          updatedConversation,
          ...prevState.slice(conversationIdx + 1),
        ];

        // console.log("newConversations", newConversations);

        return newConversations;
      });

      // if (!window.location.href.includes("id")) {

      // setConversations((prevState: any) => {
      //   console.log("set conversations");

      //   const newArr = prevState.filter(
      //     (el: any) => el._id !== message.conversation._id
      //   );

      //   const currentConv = prevState.find(
      //     (el: any) => el._id === message.conversation._id
      //   );
      //   const updatedConv = {
      //     ...currentConv,
      //     messages: [...currentConv.messages, message],
      //   };

      //   return [...newArr, updatedConv];
      // });

      return () => {
        socket.off("readConversationToClient");
      };
    });
  }, [socket]);

  // useEffect(() => {
  //   socket.on("readMessageToClient", (message: any) => {
  //     console.log("readMessageToClient conversations", message);

  //     // if (!window.location.href.includes("conversation")) return;

  //   });

  //   return () => {
  //     socket.off("readMessageToClient");
  //   };
  // }, [socket]);

  return <></>;
};
