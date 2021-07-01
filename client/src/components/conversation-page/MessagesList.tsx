import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
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
`;

const Wrap = styled.div<{ height: number }>`
  overflow-y: auto;
  display: flex;
  flex-flow: column nowrap;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: none;
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
`;

type Props = {
  conversation: any;
};

const MessagesList: React.FC<Props> = ({ conversation }) => {
  const { meUserData } = useContext(AuthContext);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // function handleResize() {
  //   setDimensions({
  //     height: window.innerHeight,
  //     width: window.innerWidth,
  //   });
  // }

  useLayoutEffect(() => {
    function updateSize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    document
      .getElementById(
        conversation.messages[conversation.messages.length - 1]._id
      )
      ?.scrollIntoView();
  }, [conversation]);

  return (
    <MessagesWrapper>
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

      <Separator />
      <SendMessageBox conversation={conversation} />
    </MessagesWrapper>
  );
};

export default MessagesList;
