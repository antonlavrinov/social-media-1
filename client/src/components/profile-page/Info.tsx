import React, { useContext } from "react";
import styled from "styled-components";
import { OnlineContext } from "../../context/OnlineContext";
import { IUserData } from "../../interfaces/IUserData";
import { ContentBoxContainer, Separator } from "../../styled-components/global";
import { DateTime } from "luxon";

const Wrapper = styled.div``;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const UserName = styled.div`
  font-size: 18px;
  color: var(--color-black);
`;
const UserStatus = styled.div`
  color: var(--text-color-secondary);
`;

const AdditionalInfo = styled.div``;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const InfoItemTitle = styled.div`
  min-width: 130px;
  color: var(--text-color-secondary);
  font-size: var(--text-size-primary);
`;

const InfoItemContent = styled.div``;

type Props = {
  userData: IUserData;
};

const ProfileInfo: React.FC<Props> = ({ userData }) => {
  const { online } = useContext(OnlineContext);

  return (
    <Wrapper>
      <ContentBoxContainer>
        <InfoHeader>
          <UserName>{userData.firstName + " " + userData.lastName}</UserName>
          {online[userData?._id ? userData?._id : "d"] && (
            <UserStatus>online</UserStatus>
          )}
        </InfoHeader>
      </ContentBoxContainer>
      <Separator />
      <ContentBoxContainer>
        <AdditionalInfo>
          {userData.city && (
            <InfoItem>
              <InfoItemTitle>City:</InfoItemTitle>
              <InfoItemContent>{userData.city}</InfoItemContent>
            </InfoItem>
          )}

          {userData.dateOfBirth && (
            <InfoItem>
              <InfoItemTitle>Date of birth:</InfoItemTitle>
              <InfoItemContent>
                {DateTime.fromISO(String(userData.dateOfBirth)).toLocaleString({
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </InfoItemContent>
            </InfoItem>
          )}
          {userData.aboutMe && (
            <InfoItem>
              <InfoItemTitle>About me:</InfoItemTitle>
              <InfoItemContent>{userData.aboutMe}</InfoItemContent>
            </InfoItem>
          )}
        </AdditionalInfo>
      </ContentBoxContainer>
    </Wrapper>
  );
};

export default ProfileInfo;
