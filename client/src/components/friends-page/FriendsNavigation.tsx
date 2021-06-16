import React, { useState } from "react";
import { ContentBox, Separator } from "../../styled-components/global";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";

const FriendsNavigationWrapper = styled.div`
  width: 550px;
  margin-right: 15px;
`;

const TabsWrapper = styled.div`
  display: flex;
`;

const Tab = styled.div<{ selected: boolean }>`
  padding: 15px 15px;
  display: block;
  position: relative;
  :hover {
    cursor: pointer;
    background: var(--color-secondary);
  }
  ${(props) =>
    props.selected &&
    `
:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: var(--color-primary);
  }
  `}
`;

type Props = {
  tabs: ITab[];
  activeTab: ITab;
  // count: number;
};

interface ITab {
  title: string;
  url: string;
  count: number;
}

const FriendsNavigation: React.FC<Props> = ({
  tabs,
  children,
  activeTab,
  // count,
}) => {
  const history = useHistory();
  const query = useQuery();

  return (
    <FriendsNavigationWrapper>
      <ContentBox style={{ minHeight: 500 }}>
        <TabsWrapper>
          {tabs.map((tab) => {
            return (
              <Tab
                key={tab.url}
                selected={tab.title === activeTab.title}
                onClick={() =>
                  history.push(
                    `/friends?section=${tab.url}${
                      query.get("id") ? `&id=${query.get("id")}` : ""
                    }`
                  )
                }
              >
                {tab.title}{" "}
                <span style={{ color: "var(--text-color-secondary)" }}>
                  {tab.count}
                </span>
              </Tab>
            );
          })}
        </TabsWrapper>
        <Separator />
        {children}
      </ContentBox>
    </FriendsNavigationWrapper>
  );
};

export default FriendsNavigation;
