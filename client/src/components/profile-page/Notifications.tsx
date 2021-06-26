import React, { useEffect, useState, useContext } from "react";
import Tippy from "@tippyjs/react";
import { Link, useHistory } from "react-router-dom";
import {
  Avatar,
  ContentBox,
  CustomLink,
  NotificationsCount,
  svgPrimaryStyleNoHover,
} from "../../styled-components/global";
import styled from "styled-components";
import { ReactComponent as NotificationsIcon } from "../../assets/icons/notifications-icon.svg";
import { DateTime } from "luxon";
import { useHttp } from "../../hooks/useHttp";
import { useTippyVisibility } from "../../hooks/useTippyVisibility";
import { AuthContext } from "../../context/AuthContext";

const NotificationsIconWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
  svg {
    ${svgPrimaryStyleNoHover}
  }

  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
`;

const NotificationsPopup = styled.div`
  min-width: 250px;
  /* min-height: 300px; */
  max-height: 300px;
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
`;

const NotificationsPopupSelect = styled(Link)<{ isRead: boolean }>`
  display: flex;
  padding: 20px 18px;
  align-items: flex-start;
  border-top: var(--border-primary);

  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
  :first-child {
    border-top: none;
  }
  ${(props) =>
    !props.isRead &&
    `
    background: var(--color-secondary);
  `}
`;

const NotificationInfo = styled.div``;

const NotificationText = styled.div`
  margin-bottom: 3px;
`;

const NotificationDate = styled.div`
  color: var(--text-color-secondary);
`;

type NotificationProps = {
  notification: any;
  visible: boolean;
};

const Notification: React.FC<NotificationProps> = ({
  notification,
  visible,
}) => {
  // const history = useHistory();
  const date = DateTime.fromISO(notification.createdAt).toLocaleString({
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  });
  const { request } = useHttp();
  const { setNotifications } = useContext(AuthContext);
  // console.log("NOTIFICATION", notification);

  const handleReadNotification = async () => {
    try {
      console.log("read notification", notification);
      const res = await request(`/api/notify/${notification._id}`, "PUT");
      console.log("i read notificatio", res);
      setNotifications((prevState: any) => {
        const notificIdx = prevState.findIndex(
          (el: any) => el._id === notification._id
        );

        const notific = {
          ...notification,
          isRead: true,
        };
        // console.log("notific", notific);
        // console.log("notificIdx", notificIdx);

        // console.log("first slice", [...prevState.slice(0, notificIdx)]);
        // console.log("second slice", [...prevState.slice(notificIdx + 1)]);

        const newArr = [
          ...prevState.slice(0, notificIdx),
          notific,
          ...prevState.slice(notificIdx + 1),
        ];
        // console.log("prevState", prevState);
        // console.log("newArr", newArr);

        return newArr;
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!notification.isRead) {
      handleReadNotification();
    }
  }, []);
  return (
    <NotificationsPopupSelect
      to={notification.url}
      isRead={notification.isRead}
    >
      <Avatar
        style={{ marginRight: "15px" }}
        size="small"
        src={notification.user.avatar}
      />
      <NotificationInfo>
        <NotificationText>
          <CustomLink to={`/profile/${notification.user._id}`}>
            {notification.user.firstName} {notification.user.lastName}
          </CustomLink>{" "}
          {notification.text}
        </NotificationText>
        <NotificationDate>{date}</NotificationDate>
      </NotificationInfo>
    </NotificationsPopupSelect>
  );
};

type Props = {
  setNotifications: React.Dispatch<any>;
  notifications: any;
};
const Notifications: React.FC<Props> = ({
  notifications,
  setNotifications,
}) => {
  // const count = notifications.length;
  // const [notificationsCount, setNotificationsCount] = useState<number>(count);
  // console.log("length", notificationsCount);
  const { visible, show, hide } = useTippyVisibility();

  const unreadNotifications = notifications.filter(
    (notif: any) => !notif.isRead
  );
  const notificationList: any = [];
  let iteration = 5;
  notifications.forEach((el: any) => {
    if (!el.isRead) {
      notificationList.push(el);
    } else if (iteration) {
      notificationList.push(el);
      iteration--;
    } else {
      return;
    }
  });
  const handleOpenPopup = () => {
    show();
  };
  const userNotificationsPopup = (
    <ContentBox>
      <NotificationsPopup onClick={visible ? hide : show}>
        {notificationList.length > 0 && visible ? (
          <>
            {notificationList.map((notification: any, idx: number) => {
              // console.log("not", notification);

              return (
                <Notification
                  key={idx}
                  visible={visible}
                  notification={notification}
                />
              );
            })}
          </>
        ) : (
          <div>No notifications yet...</div>
        )}
      </NotificationsPopup>
    </ContentBox>
  );
  return (
    <Tippy
      content={userNotificationsPopup}
      interactive={true}
      placement={"bottom-end"}
      trigger="click"
      duration={0}
      offset={[0, 0]}
      visible={visible}
      onClickOutside={hide}
      onMount={() => console.log("mounted!")}
    >
      <NotificationsIconWrapper onClick={visible ? hide : handleOpenPopup}>
        <NotificationsIcon />
        {unreadNotifications.length > 0 && (
          <NotificationsCount>{unreadNotifications.length}</NotificationsCount>
        )}
        {console.log("notifications", notifications)}
      </NotificationsIconWrapper>
    </Tippy>
  );
};

export default Notifications;
