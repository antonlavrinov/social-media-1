import { useSnackbar } from "notistack";
import React, { forwardRef } from "react";
import styled from "styled-components";
import { Avatar } from "../styled-components/global";
import { ReactComponent as CrossIcon } from "../assets/icons/cross-icon.svg";

const Wrapper = styled.div<{ type?: "success" | "error" }>`
  background: var(--color-dark-grey);
  border-radius: var(--border-radius-primary);
  padding: 15px;
  padding-right: 30px;
  display: flex;
  min-width: 344px !important;
  max-width: 344px !important;
  position: relative;
  svg {
    position: absolute;
    top: 10px;
    right: 10px;
    fill: rgba(256, 256, 256, 0.5);
    :hover {
      cursor: pointer;
    }
  }
`;

const NotificationInfo = styled.div``;

const NotificationText = styled.div`
  color: white;
`;

const CustomNotification = forwardRef<
  HTMLDivElement,
  {
    id: string | number;
    message: any | React.ReactNode;
    type?: "success" | "error";
  }
>(({ id, message, type }, ref) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <Wrapper ref={ref}>
      <Avatar
        style={{ marginRight: "10px" }}
        src={message.user.avatar}
        size="small"
      />
      <NotificationInfo>
        <NotificationText>
          {message.user.firstName} {message.user.lastName} {message.text}
        </NotificationText>
      </NotificationInfo>
      <CrossIcon onClick={() => closeSnackbar(id)} />
    </Wrapper>
  );
});

export default CustomNotification;
