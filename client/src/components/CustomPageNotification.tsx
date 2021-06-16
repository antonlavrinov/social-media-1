import { useSnackbar } from "notistack";
import React, { forwardRef } from "react";
import styled from "styled-components";
import { Avatar } from "../styled-components/global";
import { ReactComponent as CrossIcon } from "../assets/icons/cross-icon.svg";

const Wrapper = styled.div<{ type?: "success" | "error" }>`
  background: var(--color-green);
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
  ${(props) =>
    props.type === "error" &&
    `
    background: var(--color-red);
  `}
`;

const NotificationInfo = styled.div``;

const NotificationText = styled.div`
  color: white;
`;

type MessageType = {
  type: "error" | "success";
  text: string;
};

const CustomPageNotification = forwardRef<
  HTMLDivElement,
  {
    id: string | number;
    message: any | React.ReactNode;
  }
>(({ id, message }, ref) => {
  const { closeSnackbar } = useSnackbar();
  console.log("mes", message);

  return (
    <Wrapper ref={ref} type={message.type}>
      <NotificationInfo>
        <NotificationText>{message.text}</NotificationText>
      </NotificationInfo>
      <CrossIcon onClick={() => closeSnackbar(id)} />
    </Wrapper>
  );
});

export default CustomPageNotification;
