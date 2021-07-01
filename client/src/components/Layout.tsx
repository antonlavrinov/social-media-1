import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile-icon.svg";
import { ReactComponent as MessagesIcon } from "../assets/icons/messages-icon.svg";
import { ReactComponent as FriendsIcon } from "../assets/icons/friends-icon.svg";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow-more-icon.svg";

import {
  Avatar,
  ContentBox,
  NotificationsCount,
  svgSecondaryStyle,
} from "../styled-components/global";
import Search from "./Search";
import { AuthContext } from "../context/AuthContext";
import Tippy from "@tippyjs/react";
import { useHttp } from "../hooks/useHttp";
import Notifications from "./profile-page/Notifications";
import { useTippyVisibility } from "../hooks/useTippyVisibility";
import Footer from "./Footer";
import RecentUsers from "./RecentUsers";

const Logo = styled(Link)`
  font-size: 25px;
  font-size: 28px;
  font-family: var(--font-family-secondary);
  font-weight: 700;
  color: var(--text-color-link);
  display: flex;
  align-items: center;
  margin-right: 55px;
  margin-left: 5px;
  svg {
    fill: var(--color-primary);
    min-width: 10px;
    margin-right: 10px;
  }
  :hover {
    font-size: 25px;
    font-size: 28px;
    font-family: var(--font-family-secondary);
    font-weight: 700;
    color: var(--text-color-link);
  }
`;

const Container = styled.div`
  width: 960px;
  margin: 0 auto;
`;

const MainWrapper = styled.div`
  display: flex;
`;

const Header = styled.header`
  border-bottom: var(--border-primary);
  box-shadow: var(--shadow-primary);
  margin-bottom: 15px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  /* padding: 20px 0; */
  position: relative;
`;

const Navigation = styled.nav``;

const NavigationLink = styled(Link)`
  font-size: var(--font-size-secondary);
  display: flex;
  align-items: center;
  padding: 5px 5px;
  border-radius: var(--border-radius-primary);
  position: relative;
  color: var(--color-black);
  /* font-weight: 600; */
  svg {
    margin-right: 3px;
    height: var(--icon-size-primary);
    width: var(--icon-size-primary);
    height: 35px;
    width: 35px;
    fill: var(--color-primary);
  }
  :hover {
    background: var(--color-secondary);
    font-size: var(--font-size-secondary);
  }
`;

const NavigationLinkIcon = styled.div`
  display: flex;
  margin-right: 5px;
  position: relative;
`;

const UserNavbar = styled.div`
  display: flex;
  align-items: center;

  margin-left: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;

  height: 100%;
  padding: 15px 5px;
  img {
    align-self: center;
  }
  :hover {
    cursor: pointer;
    background: var(--color-secondary);
  }
`;

const UserName = styled.div`
  font-size: var(--text-size-secondary);
  margin-right: 10px;
`;

const SearchWrapper = styled.div`
  padding: 15px 0;
`;
const UserInfoPopup = styled.div``;

const UserInfoPopupSelect = styled.div`
  display: flex;
  padding: 15px 15px;
  align-items: center;
  border-top: var(--border-primary);

  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
  :first-child {
    border-top: none;
  }
`;

const LeftNav = styled.div`
  min-width: 165px;
  margin-right: 15px;
`;

const Layout: React.FC = ({ children }) => {
  const {
    logout,
    meUserData,
    notifications,
    setNotifications,
    conversations,
    socket,
  } = useContext(AuthContext);
  const { visible, show, hide } = useTippyVisibility();

  const { request } = useHttp();

  const handleLogOut = async () => {
    try {
      await request("/api/auth/logout", "POST");
      socket.disconnect();

      logout();
    } catch (e) {
      console.log(e);
    }
  };

  let unReadMessagesCount = 0;
  conversations.forEach((conversation: any) => {
    conversation.messages.forEach((message: any) => {
      if (!message.isRead && message.user._id !== meUserData?._id) {
        unReadMessagesCount++;
      }
    });
  });

  const userInfoPopup = (
    <ContentBox>
      <UserInfoPopup onClick={visible ? hide : show}>
        <Link to={`/profile/edit/${meUserData?._id}`}>
          <UserInfoPopupSelect>Edit profile</UserInfoPopupSelect>
        </Link>
        <UserInfoPopupSelect onClick={handleLogOut}>
          Sign out
        </UserInfoPopupSelect>
      </UserInfoPopup>
    </ContentBox>
  );

  return (
    <>
      <Header>
        <Container>
          <HeaderWrapper>
            <Logo to="/">intouch</Logo>
            <SearchWrapper>
              <Search meUserData={meUserData} />
            </SearchWrapper>

            <UserNavbar>
              <Notifications
                setNotifications={setNotifications}
                notifications={notifications}
              />

              <Tippy
                content={userInfoPopup}
                interactive={true}
                placement={"bottom-end"}
                trigger="click"
                duration={0}
                offset={[0, 0]}
                onClickOutside={hide}
                visible={visible}
              >
                <UserInfo onClick={visible ? hide : show}>
                  <Avatar
                    marginRight="10px"
                    size="medium-small"
                    src={meUserData?.avatar}
                  />
                  <UserName>{meUserData?.firstName}</UserName>
                  <ArrowIcon />
                </UserInfo>
              </Tippy>
            </UserNavbar>
          </HeaderWrapper>
        </Container>
      </Header>
      <Container>
        <MainWrapper>
          <LeftNav>
            <Navigation>
              <NavigationLink to={`/profile/${meUserData?._id}`}>
                <NavigationLinkIcon>
                  <ProfileIcon />
                </NavigationLinkIcon>
                Profile
              </NavigationLink>
              <NavigationLink to={`/messages`}>
                <NavigationLinkIcon>
                  <MessagesIcon />
                  {unReadMessagesCount !== 0 && (
                    <NotificationsCount top="-7px" right="-3px">
                      {unReadMessagesCount}
                    </NotificationsCount>
                  )}
                </NavigationLinkIcon>
                Messages
              </NavigationLink>
              <NavigationLink to={`/friends`}>
                <NavigationLinkIcon>
                  <FriendsIcon />
                </NavigationLinkIcon>
                Friends
              </NavigationLink>
            </Navigation>
            <RecentUsers />
          </LeftNav>

          <main>{children}</main>
        </MainWrapper>
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
