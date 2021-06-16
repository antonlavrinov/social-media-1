import React, { useEffect, useState, useContext } from "react";
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
import { Socket } from "dgram";
import { AuthContext } from "../../context/AuthContext";
// import { ConversationContext } from "../../context/ConversationContext";
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
  // const [message, setMessage] = useState(msg);
  const date = DateTime.fromISO(message.createdAt).toLocaleString(
    // DateTime.DATETIME_MED
    {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    }
  );

  const { request } = useHttp();
  const history = useHistory();
  const { socket, setConversations } = useContext(AuthContext);
  // const { setConversation } = useContext(ConversationContext);

  const handleReadMessage = async () => {
    console.log("handle read message", message);
    try {
      const res = await request(
        `http://localhost:5000/api/read_message/${message._id}`,
        "PUT"
      );

      console.log("res", res);

      // setConversation((prevState: any) => {
      //   const msgIdx = prevState?.messages.findIndex(
      //     (el: any) => el._id === res.readMsg._id
      //   );

      //   const messages = [
      //     ...prevState?.messages.slice(0, msgIdx),
      //     res.readMsg,
      //     ...prevState?.messages.slice(msgIdx, prevState?.messages.length - 1),
      //   ];

      //   // const convNoMessage = prevState?.messages.filter(
      //   //   (el: any) => el._id !== message._id
      //   // );

      //   const newConversation = {
      //     ...prevState,
      //     messages,
      //   };
      //   console.log("new conversation", newConversation);
      //   return newConversation;
      // });

      setConversations((prevState: any) => {
        // console.log("message", message);
        console.log("i'm setting conversations with this message", res.readMsg);
        const conversation = prevState.find(
          (el: any) => el._id === res.readMsg.conversation._id
        );

        const conversationIdx = prevState.findIndex(
          (el: any) => el._id === res.readMsg.conversation._id
        );

        const conversationMsgIdx = conversation.messages.findIndex(
          (el: any) => el._id === res.readMsg._id
        );
        const messages = [
          ...conversation.messages.slice(0, conversationMsgIdx),
          res.readMsg,
          ...conversation.messages.slice(conversationMsgIdx + 1),
        ];

        console.log("messages", messages);

        const updatedConversation = {
          ...conversation,
          messages,
        };

        console.log("updated conversation", updatedConversation);

        // console.log("conversationIdx", conversationIdx);

        const newConversations = [
          ...prevState.slice(0, conversationIdx),
          updatedConversation,
          ...prevState.slice(conversationIdx + 1),
        ];

        console.log("newConversations", newConversations);

        return newConversations;
      });
      // setMessage((prevState: any) => {
      //   // console.log("READ CONV", newCon);
      //   return {
      //     ...prevState,
      //     isRead: true,
      //   };
      // });
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
          `http://localhost:5000/api/conversation/${message.conversation._id}`,
          "DELETE"
        );
        history.push("/messages");
        setConversations((prevState: any) => {
          // console.log("message", message);
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
        const res = await request(
          `http://localhost:5000/api/message/${message._id}`,
          "DELETE"
        );
        setConversations((prevState: any) => {
          // console.log("message", message);
          console.log("i'm deleting a message", res.readMsg);
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
    // console.log("is me", isMe);
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
