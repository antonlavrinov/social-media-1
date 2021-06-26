import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { IUserData } from "../../interfaces/IUserData";
import Tippy from "@tippyjs/react";
import { useTippyVisibility } from "../../hooks/useTippyVisibility";
import {
  Avatar,
  AvatarOnlineWrapper,
  ContentBox,
  CustomLink,
} from "../../styled-components/global";
import { ReactComponent as CogwheelIcon } from "../../assets/icons/cogwheel-icon.svg";
import {
  OptionsPopup,
  OptionsPopupSelect,
} from "../../styled-components/global";
import { useHttp } from "../../hooks/useHttp";
import { FriendCardInfo, FriendCardWrapper, Options } from "./styles";
import { OnlineContext } from "../../context/OnlineContext";
import styled from "styled-components";
import SendMessageModal from "../SendMessageModal";
import useModal from "../../hooks/useModal";

const CustomLinkButton = styled.button`
  color: var(--color-primary);
  background: none;
  font-weight: 600;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

type Props = {
  friend: IUserData;
  isPersonal?: boolean;
};

const FriendCard: React.FC<Props> = ({ friend, isPersonal }) => {
  //   const { relationToMe, setRelationToMe } = useCheckRelationToMe(friend);
  const { meUserData, setMeUserData } = useContext(AuthContext);
  const { online } = useContext(OnlineContext);
  const { request } = useHttp();
  const { visible, show, hide } = useTippyVisibility();
  const { openModal, modalIsOpen, closeModal } = useModal();
  // console.log("IS PERSONAL", isPersonal);
  const handleDeleteFriend = async () => {
    const friendRequest = meUserData?.friendRequests?.find(
      (req) => req.recipient === friend._id || req.requester === friend._id
    );
    try {
      await request(
        `/api/friend-request/unfriend/${friendRequest?._id}`,
        "PUT",
        { userId: friend._id }
      );
      setMeUserData((prevState: IUserData) => {
        const newFriendsArr = prevState.friends.filter(
          (el: IUserData) => el._id !== friend._id
        );
        return {
          ...prevState,
          friends: newFriendsArr,
        };
      });
    } catch (e) {
      console.log(e);
    }
  };

  const optionsPopup = (
    <ContentBox onClick={hide}>
      <OptionsPopup>
        <OptionsPopupSelect onClick={handleDeleteFriend}>
          Unfriend
        </OptionsPopupSelect>
      </OptionsPopup>
    </ContentBox>
  );

  return (
    <FriendCardWrapper>
      <AvatarOnlineWrapper
        onlineType={online[friend._id ? friend._id : "ds"] ? true : false}
      >
        <Avatar
          size="medium"
          src={friend.avatar}
          style={{ marginRight: "15px" }}
        />
      </AvatarOnlineWrapper>

      <FriendCardInfo>
        <CustomLink
          style={{ marginBottom: "7px", display: "block" }}
          color="black"
          to={`/profile/${friend._id}`}
        >
          {friend.firstName} {friend.lastName}
        </CustomLink>
        <CustomLinkButton onClick={openModal}>Send message</CustomLinkButton>
        <SendMessageModal
          openModal={openModal}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
          userData={friend}
        />
      </FriendCardInfo>

      {isPersonal && (
        <Tippy
          content={optionsPopup}
          interactive={true}
          placement={"bottom-end"}
          trigger="click"
          duration={0}
          offset={[0, 5]}
          visible={visible}
          onClickOutside={hide}
        >
          <Options onClick={visible ? hide : show}>
            <CogwheelIcon />
          </Options>
        </Tippy>
      )}
    </FriendCardWrapper>
  );
};

export default FriendCard;
