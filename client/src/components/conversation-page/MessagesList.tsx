import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
// import { ConversationContext } from "../../context/ConversationContext";
import { Separator } from "../../styled-components/global";
import Message from "./Message";
import SendMessageBox from "./SendMessageBox";

const MessagesWrapper = styled.div``;

const Wrapper = styled.div`
  padding: 15px 0;
  height: 100%;
  min-height: 100%;
  display: flex;

  flex-direction: column;
  /* justify-content: flex-end;  */
`;

const Wrap = styled.div<{ height: number }>`
  overflow-y: auto;
  display: flex;
  flex-flow: column nowrap;
  /* &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid black;
  } */
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: none;
    /* box-shadow: inset 0 0 10px black; */
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: var(--color-dark-secondary);
    box-shadow: inset 0 0 5px $pale-orange;
  }

  ${(props) =>
    props.height &&
    `min-height: calc(${props.height}px - 250px);
      max-height: calc(${props.height}px - 250px);
  `}
  > :first-child {
    margin-top: auto !important;
  }
  /* flex-direction: row; */
`;

type Props = {
  conversation: any;
};

const MessagesList: React.FC<Props> = ({ conversation }) => {
  // const { conversation, setConversation } = useContext(ConversationContext);
  // const [messages, setMessages] = useState(conversation.messages);
  const { meUserData } = useContext(AuthContext);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  function handleResize() {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  useEffect(() => {
    document
      .getElementById(
        conversation.messages[conversation.messages.length - 1]._id
      )
      ?.scrollIntoView();
  }, [conversation]);

  //   console.log("MESSAGES", conversationMessages);
  return (
    <MessagesWrapper>
      {/* {console.log("STATE MESSAGES CHANGE", conversation)} */}
      {/* {console.log("STATE MESSAGES CHANGE", conversation.messages)} */}
      <Wrap height={dimensions.height}>
        {console.log("messages list updated")}
        <Wrapper>
          {conversation.messages.map((message: any) => {
            if (message.user._id === meUserData?._id) {
              return (
                <Message
                  key={message._id}
                  message={message}
                  isMe={true}
                  messages={conversation.messages}
                />
              );
            }
            return (
              <Message
                key={message._id}
                message={message}
                isMe={false}
                messages={conversation.messages}
              />
            );
          })}
        </Wrapper>
      </Wrap>
      {/* {console.log("dimentions", dimensions.height)} */}

      <Separator />
      <SendMessageBox conversation={conversation} />
    </MessagesWrapper>
  );
};

export default MessagesList;

// if (message.user._id === meUserData?._id) {
