import { useContext } from "react";
import { useParams } from "react-router-dom";
import MessagesNavigation from "../components/conversation-page/MessagesNavigation";
import MessagesList from "../components/conversation-page/MessagesList";

import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import styled from "styled-components";

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const ConversationPage = () => {
  const { id } = useParams<any>();
  const { conversations } = useContext(AuthContext);

  const conversation = conversations.find((el: any) => el._id === id);
  if (!conversation) {
    return (
      <div style={{ minHeight: "550px" }}>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </div>
    );
  }

  return (
    <>
      <MessagesNavigation conversation={conversation}>
        <MessagesList conversation={conversation} />
      </MessagesNavigation>
    </>
  );
};

export default ConversationPage;
