import React, { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";
import { Button, ContentBox, Separator } from "../styled-components/global";
import Conversation from "../components/messages-page/Conversation";
import { useHistory } from "react-router-dom";

const Wrapper = styled.div`
  width: 550px;
`;

const NoConversations = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 50px;
  div {
    font-size: 18px;
    color: var(--text-color-secondary);
  }
`;

const MessagesPage = () => {
  const { conversations } = useContext(AuthContext);
  const history = useHistory();

  return (
    <Wrapper>
      <ContentBox style={{ minHeight: "500px" }}>
        {conversations.length > 0 ? (
          <>
            {conversations.map((conv: any) => {
              return (
                <React.Fragment key={conv._id}>
                  <Conversation conversation={conv} />
                  <Separator />
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <NoConversations>
            <div>No conversations yet...</div>
            <Button
              marginTop="10px"
              size="small"
              onClick={() => history.push("/search")}
            >
              Find friends
            </Button>
          </NoConversations>
        )}
      </ContentBox>
    </Wrapper>
  );
};

export default MessagesPage;
