import React, { useState, useRef, useContext } from "react";
import {
  Button,
  ContentBoxContainer,
  Separator,
  svgPrimaryStyle,
  TextArea,
} from "../../../../styled-components/global";
import { ReactComponent as Cross } from "../../../../assets/icons/cross-icon.svg";
import { ReactComponent as ImageUploadIcon } from "../../../../assets/icons/image-upload-icon.svg";
import { useHttp } from "../../../../hooks/useHttp";
import { IUserData } from "../../../../interfaces/IUserData";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import { AuthContext } from "../../../../context/AuthContext";
import { useUploadImages } from "../../../../hooks/useUploadImages";
import Emojis from "../../../Emojis";
import useNotistack from "../../../../hooks/useNotistack";

import SendMessageModal from "../../../SendMessageModal";
import useModal from "../../../../hooks/useModal";

const Wrapper = styled.div``;

const SendMessagePopup = styled.div`
  min-width: 450px;
  position: relative;
`;

const ButtonsWrapper = styled.div`
  margin-left: auto;
`;

const CrossIcon = styled(Cross)`
  fill: var(--icon-color-secondary);
  position: absolute;
  top: 15px;
  right: 15px;
  :hover {
    cursor: pointer;
  }
`;

const ImageUpload = styled.div`
  position: absolute;
  top: 18px;
  right: 55px;
  svg {
    ${svgPrimaryStyle}
  }
`;

const PreviewImagesWrapper = styled.div`
  display: flex;
  margin-left: 15px;
  margin-bottom: 13px;

  /* margin-top: 1px; */
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 100px;
`;

const DeleteImageIcon = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }
  svg {
    width: 20px;
    fill: white;
  }
`;

const PreviewImage = styled.img<{ count?: number }>`
  width: 100%;
  height: 100px;
  object-fit: cover;
  margin-right: 5px;
  ${(props) =>
    props.count === 2 &&
    `
    width: 50%;
    height: auto;
  `}
`;

type Props = {
  userData: IUserData | null;
};

const SendMessageButton: React.FC<Props> = ({ userData }) => {
  const { openModal, closeModal, modalIsOpen } = useModal();

  return (
    <Wrapper>
      <Button marginBottom="10px" width="fullwidth" onClick={openModal}>
        Send a message
      </Button>
      <SendMessageModal
        modalIsOpen={modalIsOpen}
        openModal={openModal}
        closeModal={closeModal}
        userData={userData}
      />
    </Wrapper>
  );
};

export default SendMessageButton;
