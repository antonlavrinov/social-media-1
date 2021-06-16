import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import MessagesNavigation from "../components/conversation-page/MessagesNavigation";
import MessagesList from "../components/conversation-page/MessagesList";
// import { ConversationContext } from "../context/ConversationContext";
import { useLoadConversation } from "../hooks/useLoadConversation";
// import { SocketMessagesClient } from "../SocketMessagesClient";
import { AuthContext } from "../context/AuthContext";

const ConversationPage = () => {
  const { id } = useParams<any>();
  const { conversations } = useContext(AuthContext);
  const history = useHistory();
  // const { conversation, setConversation, loading } = useLoadConversation(id);

  console.log("conversationsSSS", conversations);

  const conversation = conversations.find((el: any) => el._id === id);
  if (!conversation) {
    return <></>;
  }
  console.log("CONVERSATION", conversation);
  // if (conversations.length === 0) {
  // }

  // return <></>;

  return (
    <>
      {/* <SocketMessagesClient /> */}
      <MessagesNavigation conversation={conversation}>
        <MessagesList conversation={conversation} />
      </MessagesNavigation>
    </>
  );
};

export default ConversationPage;

// //{" "}
// <ConversationContext.Provider value={{ conversation, setConversation }}></ConversationContext.Provider>
//   //{" "}
//   </ConversationContext.Provider>
