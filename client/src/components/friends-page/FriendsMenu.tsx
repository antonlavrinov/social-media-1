import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import {
  ContentBox,
  ContentBoxContainer,
} from "../../styled-components/global";

const Wrapper = styled.div`
  flex-grow: 1;
`;

const Select = styled.div<{ selected: boolean }>`
  padding: 15px;
  position: relative;
  :last-child {
    border-top: var(--border-primary);
  }
  :hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
  ${(props) =>
    props.selected &&
    `
        background: var(--color-secondary);
        
        :before {
          content: '';
          position: absolute;
          height: 100%;
          top: 0;
          left: 0;
          border-left: 3px solid var(--color-primary);
        }
  `}
`;

type Props = {
  menuItems: any;
};

const FriendsMenu: React.FC<Props> = ({ menuItems }) => {
  const [selectedItem, setSelectedItem] = useState<any>(menuItems[0]);
  const history = useHistory();

  return (
    <Wrapper>
      <ContentBox>
        {menuItems.map((item: any, idx: number) => {
          return (
            <Select
              selected={selectedItem.title === item.title}
              key={idx}
              onClick={() => {
                history.push(`/friends?section=${item.url}`);
                setSelectedItem(item);
              }}
            >
              {item.title}
            </Select>
          );
        })}
      </ContentBox>
    </Wrapper>
  );
};

export default FriendsMenu;
