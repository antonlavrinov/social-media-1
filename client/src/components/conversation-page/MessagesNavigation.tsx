import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import {
  Avatar,
  ContentBox,
  ContentBoxContainer,
  CustomLink,
  Separator,
  svgSecondaryStyle,
} from "../../styled-components/global";
import { ReactComponent as ArrowIcon } from "../../assets/icons/arrow-icon_left.svg";
import { IUser } from "../../pages/EditProfilePage";
import { Link, useHistory } from "react-router-dom";
import SendMessageBox from "./SendMessageBox";
// import { ConversationContext } from "../../context/ConversationContext";
import { AuthContext } from "../../context/AuthContext";
import { OnlineContext } from "../../context/OnlineContext";

const Wrapper = styled.div`
  width: 550px;
  max-height: 50vh;

  .contentBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const NavigationHeader = styled.div``;

const NavigationBody = styled.div``;

const NavigationHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    align-self: center;
    margin-right: 15px;
  }
  /* a {
    display: block;
  } */
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  /* height: 100%; */
  background: none;
  padding: 20px 18px;
  svg {
    ${svgSecondaryStyle}
    width: 5px;
    margin-right: 8px;
  }
  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
`;

const UserStatus = styled.div`
  /* font-size: 13px; */
  text-align: center;
  color: var(--text-color-secondary);
`;

// const AvatarWrapper = styled.div`
//   padding: 20px 15px;
// `;

type Props = {
  conversation: any;
};

const MessagesNavigation: React.FC<Props> = ({ children, conversation }) => {
  const { online } = useContext(OnlineContext);
  // const { conversation } = useContext(ConversationContext);

  const history = useHistory();

  if (!conversation) {
    history.push("/messages");
    // return <></>;
  }

  const { meUserData } = useContext(AuthContext);

  // return <>{console.log("NAVIGATION", conversation)}</>;
  // const otherUsers = conversation.users.filter(
  //   (el: IUser) => el._id !== meUserData?._id
  // );
  return (
    <Wrapper>
      <ContentBox className="contentBox">
        {/* <ContentBoxContainer> */}
        <NavigationHeader>
          <NavigationHeaderWrapper>
            <BackButton to={`/messages`}>
              <ArrowIcon />
              Back
            </BackButton>
            {conversation.users.length > 1 ? (
              <>
                {conversation.users.map((user: IUser) => {
                  return <div>{user.firstName}</div>;
                })}
              </>
            ) : (
              <>
                <div>
                  <CustomLink
                    color="black"
                    to={`/profile/${conversation.users[0]._id}`}
                  >
                    {conversation.users[0].firstName}{" "}
                    {conversation.users[0].lastName}
                  </CustomLink>
                  {online[
                    conversation.users[0]?._id
                      ? conversation.users[0]?._id
                      : "d"
                  ] && <UserStatus>online</UserStatus>}
                </div>

                <Link to={`/profile/${conversation.users[0]._id}`}>
                  <Avatar src={conversation.users[0].avatar} size="small" />
                </Link>
              </>
            )}
          </NavigationHeaderWrapper>
          <Separator />
        </NavigationHeader>
        <NavigationBody>{children}</NavigationBody>
      </ContentBox>
    </Wrapper>
  );
};

export default MessagesNavigation;
