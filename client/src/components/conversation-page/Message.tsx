import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import {
  Avatar,
  CustomLink,
  svgSecondaryStyle,
} from "../../styled-components/global";
import { useHistory } from "react-router-dom";
import { DateTime } from "luxon";
import { useHttp } from "../../hooks/useHttp";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash-icon.svg";
import { AuthContext } from "../../context/AuthContext";

const Wrapper = styled.div<{ isRead: boolean }>`
  padding: 15px;
  display: flex;
  position: relative;
  margin-top: auto;
  img {
    margin-right: 15px;
  }
  svg {
    position: absolute;
    top: 15px;
    right: 15px;
    display: none;
    ${svgSecondaryStyle}
  }
  :hover {
    background: var(--color-secondary);
    svg {
      display: block;
    }
  }
  ${(props) =>
    !props.isRead &&
    `
    background: var(--color-secondary);
  `}
`;

const MessageInfo = styled.div``;

const MessageHeader = styled.div`
  margin-bottom: 5px;
`;

const Date = styled.span`
  color: var(--text-color-secondary);
`;

const MessageContent = styled.div``;

const Image = styled.img`
  width: 300px;
  height: auto;
  margin-top: 5px;
`;

type Props = {
  isMe: boolean;
  message: any;
  messages: any;
};

const Message: React.FC<Props> = ({ message, isMe, messages }) => {
  const date = DateTime.fromISO(message.createdAt).toLocaleString({
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  });

  const { request } = useHttp();
  const history = useHistory();
  const { socket, setConversations } = useContext(AuthContext);

  const handleReadMessage = async () => {
    try {
      setConversations((prevState: any) => {
        const newMessage = {
          ...message,
          isRead: true,
        };
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
          newMessage,
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

      const res = await request(`/api/read_message/${message._id}`, "PUT");

      socket.emit("readMessage", res.readMsg);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteMessage = async () => {
    const response = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!response) {
      return;
    }

    if (messages.length === 1) {
      try {
        await request(
          `/api/conversation/${message.conversation._id}`,
          "DELETE"
        );
        history.push("/messages");
        setConversations((prevState: any) => {
          const newArr = prevState.filter((el: any) => {
            return el._id !== message.conversation._id;
          });
          return newArr;
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await request(`/api/message/${message._id}`, "DELETE");
        setConversations((prevState: any) => {
          const conversation = prevState.find(
            (el: any) => el._id === message.conversation._id
          );

          const conversationIdx = prevState.findIndex(
            (el: any) => el._id === message.conversation._id
          );

          const newMessagesArr = conversation.messages.filter((el: any) => {
            return el._id !== message._id;
          });

          const updatedConversation = {
            ...conversation,
            messages: newMessagesArr,
          };

          const newConversations = [
            ...prevState.slice(0, conversationIdx),
            updatedConversation,
            ...prevState.slice(conversationIdx + 1),
          ];

          return newConversations;
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (!isMe && !message.isRead) {
      console.log("read");
      handleReadMessage();
    }
  }, []);

  return (
    <Wrapper isRead={message.isRead}>
      <Avatar size="medium-small" src={message.user.avatar} />
      <MessageInfo>
        <MessageHeader>
          <CustomLink to={`/profile/${message.user._id}`}>
            {message.user.firstName} {message.user.lastName}
          </CustomLink>
          {"  "}
          <Date>{date}</Date>
        </MessageHeader>
        {message.content && <MessageContent>{message.content}</MessageContent>}

        {message.images &&
          message.images.map((image: any, idx: number) => {
            return <Image key={idx} src={image.url} />;
          })}
      </MessageInfo>
      <TrashIcon onClick={handleDeleteMessage} />
      <div style={{ position: "absolute", bottom: 0 }} id={message._id}></div>
    </Wrapper>
  );
};

export default Message;
