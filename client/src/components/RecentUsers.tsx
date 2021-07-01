import React, { useEffect, useState } from "react";
import { useHttp } from "../hooks/useHttp";
import styled from "styled-components";
import { Avatar, CustomLink, Separator } from "../styled-components/global";

import Spinner from "./Spinner";
const Wrapper = styled.div`
  padding: 5px 8px;
  border: var(--border-primary);
  border-radius: var(--border-radius-primary);
  margin-top: 20px;
  border-radius: var(--border-radius-primary);
  box-shadow: var(--shadow-primary);
  .separator {
    :last-child {
      display: none;
    }
  }
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
`;

const Title = styled.div`
  font-size: 14px;
  margin-bottom: 8px;

  color: var(--text-color-secondary);
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`;

const RecentUsers = () => {
  const { request, loading } = useHttp();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    request("/api/search/users?search=", "GET").then((res) => {
      setUsers(res.users);
    });
  }, []);
  if (loading) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  if (users.length === 0) <></>;
  return (
    <Wrapper>
      <Title>Recently joined:</Title>
      <Separator />
      {users.map((user: any) => {
        return <User key={user._id} user={user} />;
      })}
    </Wrapper>
  );
};

export default RecentUsers;

const User = ({ user }) => {
  return (
    <CardWrapper>
      <Avatar
        size="extra-small"
        src={user.avatar}
        style={{ marginRight: "8px" }}
      />

      <CardInfo>
        <CustomLink
          style={{ marginBottom: "5px", display: "block" }}
          color="black"
          to={`/profile/${user._id}`}
        >
          {user.firstName} {user.lastName}
        </CustomLink>
      </CardInfo>
    </CardWrapper>
  );
};
