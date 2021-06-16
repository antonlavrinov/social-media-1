import React, { memo, useEffect, useContext } from "react";
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

import Info from "./../components/profile-page/Info";
const Avatar = styled.img`
  width: 100%;
  /* margin-right: 15px; */
  margin-bottom: 10px;
  /* object-fit: contain; */
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
`;

// export const ContentBox = styled.div`
//   background: white;
//   padding: 20px;
//   box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
//   border-radius: 5px;
// `;

const AvatarWrapper = styled.div``;

const PersonalProfilePage = () => {
  const { id: slugId } = useParams<any>();
  const {
    userData,
    setUserData,
    isPersonal,
    loading,
    meUserData,
    setMeUserData,
  } = useLoadUser(slugId);

  if (!userData || loading) {
    return (
      <div style={{ minHeight: "550px" }}></div>
      // <SpinnerWrapper>
      //   <Spinner />
      // </SpinnerWrapper>
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
  const { firstName, lastName, avatar, wall } = userData!;
  console.log("user data", userData);
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
          {/* <ContentBoxContainer> */}
          <Friends
            isPersonal={isPersonal}
            friends={userData?.friends}
            _id={userData?._id!}
          />
          {/* </ContentBoxContainer> */}
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
              </>
            ) : (
              <>
                <div>Empty wall...</div>
                <span>
                  You can make this wall alive by posting somethin on it!
                </span>
              </>
            )}
          </NoPosts>
        )}
        {/* {!isPersonal && renderFriendRequestButton(relationToMe)} */}
      </RightSide>
    </div>
  );
};
