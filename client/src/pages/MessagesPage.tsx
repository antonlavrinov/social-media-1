import React, { useEffect, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/useHttp";
import styled from "styled-components";
import { ContentBox, Separator } from "../styled-components/global";
import Conversation from "../components/messages-page/Conversation";
import { MessagesContext } from "../context/MessagesContext";
import { useQuery } from "../hooks/useQuery";
import MessagesNavigation from "../components/conversation-page/MessagesNavigation";
import MessagesList from "../components/conversation-page/MessagesList";
// import { ConversationContext } from "../context/ConversationContext";
import ConversationPage from "./ConversationPage";
const Wrapper = styled.div`
  width: 550px;
`;

// const Empty = styled.div``;

const NoConversations = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  div {
    font-size: 18px;
    color: var(--text-color-secondary);
  }
`;

const MessagesPage = () => {
  const { conversations, setConversations } = useContext(AuthContext);
  // const { conversation, setConversation } = useContext(ConversationContext);
  // const [conversation, setConversation] = useState(null);
  // const { meUserData } = useContext(AuthContext);
  // const { request, loading } = useHttp();
  // useEffect(() => {
  //   request(`/api/conversations`, "GET").then((res) => {
  //     console.log("conversations", res);
  //     setConversations(res.conversations);
  //   });
  // }, []);

  // const query = useQuery();

  // console.log("conversations BEFORE EFFECT", conversations);
  // console.log("set Conversation", conversations);

  return (
    <Wrapper>
      <ContentBox style={{ minHeight: "500px" }}>
        {conversations.length > 0 ? (
          <>
            {conversations.map((conv: any) => {
              return (
                <React.Fragment key={conv._id}>
                  <Conversation
                    conversation={conv}
                    // setConversations={setConversations}
                  />
                  <Separator />
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <NoConversations>
            <div>No conversations yet...</div>
          </NoConversations>
        )}
        {/* {conversations.length === 0 && <div>Пока нет бесед...</div>} */}
      </ContentBox>
    </Wrapper>

    // </Message/sContext.Provider>
  );
};

export default MessagesPage;

// <ListItem alignItems="flex-start" key={idx}>
//               {conversation.users.length < 2 && (
//                 <ListItemAvatar>
//                   <Avatar alt="Remy Sharp" src={conversation.users[0].avatar} />
//                 </ListItemAvatar>
//               )}

//               <Link to={`/conversation/${conversation._id}`}>
//                 {conversation.users[0].firstName +
//                   " " +
//                   conversation.users[0].lastName}
//               </Link>
//               <div>{conversation.messages[0].content}</div>
//               <div>{date}</div>
//             </ListItem>
