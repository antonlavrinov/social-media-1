import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/useHttp";
import UserFriendsPage from "../components/friends-page/user/UserFriendsPage";
import PersonalFriendsPage from "../components/friends-page/personal/PersonalFriendsPage";
import { useQuery } from "../hooks/useQuery";
import {
  ContentBox,
  Separator,
  Input,
  ContentBoxContainer,
  CustomLink,
  AvatarOnlineWrapper,
  Avatar,
} from "../styled-components/global";
import Spinner from "../components/Spinner";
import styled from "styled-components";
import { useDebounce } from "../hooks/useDebounce";
import { ReactComponent as SearchIcon } from "../assets/icons/looking-glass-icon.svg";
import useModal from "../hooks/useModal";
import { OnlineContext } from "../context/OnlineContext";
import SendMessageModal from "../components/SendMessageModal";

const Wrapper = styled.div`
  min-height: 550px;
  width: 550px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const InputWrapper = styled.div`
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    left: 14px;
    transform: translateY(-50%);
  }
`;

const CustomLinkButton = styled.button`
  color: var(--color-primary);
  background: none;
  font-weight: 600;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const UserCardWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
`;

export const UserCardInfo = styled.div``;

const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const [inputText, setInputText] = useState<string>("");
  const { request, loading } = useHttp();
  const { meUserData } = useContext(AuthContext);

  const debouncedText = useDebounce(inputText, 250);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    request(`/api/search/users?search=${debouncedText}`, "GET")
      .then((res) => {
        console.log("search res", res);
        const resUsers = res.users.filter((el) => el._id !== meUserData?._id);
        setUsers(resUsers);
      })
      .catch((err) => console.log(err));
  }, [debouncedText, request, meUserData?._id]);

  return (
    <Wrapper>
      <ContentBox style={{ minHeight: 500 }}>
        <ContentBoxContainer>
          Users{" "}
          <span style={{ color: "var(--text-color-secondary)" }}>
            {users.length}
          </span>
        </ContentBoxContainer>
        <Separator />
        <InputWrapper>
          <SearchIcon />
          <Input
            style={{
              fontSize: "var(--text-size-secondary)",
              border: "none",
              padding: "14px 35px",
            }}
            placeholder="Search..."
            value={inputText}
            onChange={handleChange}
          />
        </InputWrapper>

        <Separator />
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          <>
            {users.map((user: any) => {
              return (
                <React.Fragment key={user._id}>
                  <UserCard user={user} />
                  <Separator />
                </React.Fragment>
              );
            })}
          </>
        )}
      </ContentBox>
    </Wrapper>
  );
};

export default SearchPage;

const UserCard = ({ user }) => {
  const { online } = useContext(OnlineContext);
  const { openModal, modalIsOpen, closeModal } = useModal();
  return (
    <UserCardWrapper>
      <AvatarOnlineWrapper
        onlineType={online[user._id ? user._id : "ds"] ? true : false}
      >
        <Avatar
          size="medium"
          src={user.avatar}
          style={{ marginRight: "15px" }}
        />
      </AvatarOnlineWrapper>

      <UserCardInfo>
        <CustomLink
          style={{ marginBottom: "7px", display: "block" }}
          color="black"
          to={`/profile/${user._id}`}
        >
          {user.firstName} {user.lastName}
        </CustomLink>

        <CustomLinkButton onClick={openModal}>Send message</CustomLinkButton>

        <SendMessageModal
          openModal={openModal}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
          userData={user}
        />
      </UserCardInfo>
    </UserCardWrapper>
  );
};
