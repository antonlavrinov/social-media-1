import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Friends from "../components/profile-page/Friends";
import OtherUserActions from "../components/profile-page/profile-actions/other-user/OtherUserActions";
import PersonalActions from "../components/profile-page/profile-actions/personal/PersonalActions";
import SubmitPostBox from "../components/profile-page/SubmitPostBox";
import Wall from "../components/profile-page/Wall";
import Spinner from "../components/Spinner";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { useLoadUser } from "../hooks/useLoadUser";
import { ContentBox, ContentBoxContainer } from "../styled-components/global";
import { ReactComponent as SpiderWeb } from "../assets/icons/spider-web.svg";

import Info from "./../components/profile-page/Info";
const Avatar = styled.img`
  width: 100%;
  margin-bottom: 10px;
`;

const LeftSide = styled.div`
  width: 35%;
  margin-right: 15px;
`;

const RightSide = styled.div`
  width: 65%;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const NoPosts = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 25px;
  div {
    display: block;
    font-size: 18px;
    color: var(--text-color-secondary);
  }
  span {
    color: var(--text-color-secondary);
  }
  svg {
    fill: var(--text-color-secondary);
    width: 100px;
    margin-top: 20px;
    opacity: 0.6;
  }
`;

const AvatarWrapper = styled.div``;

const PersonalProfilePage = () => {
  const { id: slugId } = useParams<any>();
  const { userData, setUserData, isPersonal, loading } = useLoadUser(slugId);

  if (!userData || loading) {
    return (
      <div style={{ minHeight: "550px" }}>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, isPersonal }}>
      <Page />
    </UserContext.Provider>
  );
};

export default PersonalProfilePage;

const Page = () => {
  const { userData, setUserData, isPersonal } = useContext(UserContext);
  const { meUserData, setMeUserData } = useContext(AuthContext);
  const { avatar, wall } = userData!;

  return (
    <div className="profile" style={{ minHeight: "700px" }}>
      <LeftSide>
        <ContentBox marginBottom="15px">
          <ContentBoxContainer>
            <AvatarWrapper>
              <Avatar src={avatar} />
              {isPersonal ? <PersonalActions /> : <OtherUserActions />}
            </AvatarWrapper>
          </ContentBoxContainer>
        </ContentBox>
        <ContentBox>
          <Friends
            isPersonal={isPersonal}
            friends={userData?.friends}
            _id={userData?._id!}
          />
        </ContentBox>
      </LeftSide>
      <RightSide>
        <ContentBox marginBottom="15px">
          <Info userData={userData!} />
        </ContentBox>
        <ContentBox marginBottom="15px">
          <SubmitPostBox
            userData={userData}
            setUserData={setUserData}
            isPersonal={isPersonal}
            meUserData={meUserData}
            setMeUserData={setMeUserData}
          />
        </ContentBox>
        {wall.length > 0 ? (
          <Wall data={wall} />
        ) : (
          <NoPosts>
            {isPersonal ? (
              <>
                <div>Empty wall...</div>
                <span>
                  Post something on your wall by writing in a text field above!
                </span>
                <SpiderWeb />
              </>
            ) : (
              <>
                <div>Empty wall...</div>
                <SpiderWeb />
              </>
            )}
          </NoPosts>
        )}
      </RightSide>
    </div>
  );
};
