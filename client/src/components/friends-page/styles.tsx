import styled from "styled-components";
import { svgPrimaryStyle } from "../../styled-components/global";

export const Options = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  svg {
    ${svgPrimaryStyle}
  }
`;

export const FriendCardWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
`;

export const FriendCardInfo = styled.div``;
