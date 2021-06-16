import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/useHttp";
import UserFriendsPage from "../components/friends-page/user/UserFriendsPage";
import PersonalFriendsPage from "../components/friends-page/personal/PersonalFriendsPage";
import { useQuery } from "../hooks/useQuery";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 550px;
`;

const FriendsPage = () => {
  const query = useQuery();

  return (
    <Wrapper>
      {!query.get("id") ? <PersonalFriendsPage /> : <UserFriendsPage />}
    </Wrapper>
  );
};

export default FriendsPage;
