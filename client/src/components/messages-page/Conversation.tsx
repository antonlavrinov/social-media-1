import React, { useContext } from "react";
import styled from "styled-components";
import {
  Avatar,
  AvatarOnlineWrapper,
  svgSecondaryStyle,
} from "../../styled-components/global";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash-icon.svg";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";
import { AuthContext } from "../../context/AuthContext";
import { OnlineContext } from "../../context/OnlineContext";

const Wrapper = styled.div`
  position: relative;
  display: flex;

  :hover {
    cursor: pointer;
    background: var(--color-secondary);
    svg {
      display: block;
    }
  }
  svg {
    position: absolute;
    top: 15px;
    right: 10px;
    display: none;
    ${svgSecondaryStyle}
  }
`;

const WrapperLink = styled(Link)`
  display: flex;
  width: 100%;
  padding: 15px;
`;

const ConversationInfo = styled.div`
  width: 100%;
`;

const ConversationLastUser = styled.div`
  margin-bottom: 10px;
`;

const ConversationLastText = styled.div<{ isRead: boolean }>`
  background: none;
  padding: none;
  color: var(--text-color-secondary);
  flex-grow: 1;
  ${(props) =>
    !props.isRead &&
    `
    background: rgba(18, 62, 165, 0.07);
  padding: 5px 7px;
  border-radius: 3px;
  color: var(--text-color-primary);
    
  `}
`;

const Date = styled.div`
  position: absolute;
  top: 15px;
  right: 30px;
  color: var(--text-color-secondary);
`;

const ConversationLastTextWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  img {
    margin-right: 5px;
  }
`;

const Count = styled.div`
  width: 15px;
  height: 15px;
  background: var(--color-primary);
  border-radius: 100px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

type Props = {
  conversation: any;
};

const Conversation: React.FC<Props> = ({ conversation }) => {
  const date = DateTime.fromISO(conversation.createdAt).toLocaleString({
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  });

  const { request } = useHttp();
  const { meUserData, setConversations } = useContext(AuthContext);
  const { online } = useContext(OnlineContext);

  const unReadMessagesCount = conversation.messages.filter(
    (el: any) => el.isRead === false && el.user._id !== meUserData?._id
  ).length;
  conversation.messages.forEach((el: any) => {});

  const handleDeleteConversation = async () => {
    const res = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (res) {
      try {
        setConversations((prevState: any) => {
          const newState = prevState.filter(
            (el: any) => el._id !== conversation._id
          );
          return newState;
        });

        const response = await request(
          `/api/conversation/${conversation._id}`,
          "DELETE"
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  const lastMessage = conversation.messages[conversation.messages.length - 1];
  console.log("lastMessage", lastMessage);
  return (
    <Wrapper>
      <WrapperLink to={`/conversation/${conversation._id}`}>
        {conversation.users.length === 1 && (
          <AvatarOnlineWrapper
            onlineType={
              online[
                conversation.users[0]._id ? conversation.users[0]._id : "ds"
              ]
                ? true
                : false
            }
          >
            <Avatar
              style={{ marginRight: "15px" }}
              size="medium"
              src={conversation.users[0].avatar}
            />
          </AvatarOnlineWrapper>
        )}

        <ConversationInfo>
          {conversation.users.map((user: any) => {
            console.log("user", user);
            return (
              <ConversationLastUser key={user._id}>
                {user.firstName} {user.lastName}
              </ConversationLastUser>
            );
          })}
          {lastMessage?.user === meUserData?._id ? (
            <ConversationLastTextWrapper>
              <Avatar src={meUserData?.avatar} size="extra-small" />
              {lastMessage.content && (
                <ConversationLastText isRead={lastMessage.isRead}>
                  {lastMessage.content}
                </ConversationLastText>
              )}
              {!lastMessage.content && lastMessage.images.length > 0 && (
                <ConversationLastText isRead={lastMessage.isRead}>
                  Photo
                </ConversationLastText>
              )}
            </ConversationLastTextWrapper>
          ) : (
            <ConversationLastTextWrapper>
              {lastMessage?.content && (
                <ConversationLastText isRead={lastMessage?.isRead}>
                  {lastMessage?.content}
                </ConversationLastText>
              )}
              {!lastMessage?.content && lastMessage?.images.length > 0 && (
                <ConversationLastText isRead={lastMessage?.isRead}>
                  Photo
                </ConversationLastText>
              )}
              {unReadMessagesCount > 0 && <Count>{unReadMessagesCount}</Count>}
            </ConversationLastTextWrapper>
          )}
        </ConversationInfo>
        <Date>{date}</Date>
      </WrapperLink>

      <TrashIcon onClick={handleDeleteConversation} />
    </Wrapper>
  );
};

export default Conversation;
