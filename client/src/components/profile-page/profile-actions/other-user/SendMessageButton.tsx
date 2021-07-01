import React from "react";
import { Button } from "../../../../styled-components/global";

import { IUserData } from "../../../../interfaces/IUserData";
import "react-responsive-modal/styles.css";

import styled from "styled-components";

import SendMessageModal from "../../../SendMessageModal";
import useModal from "../../../../hooks/useModal";

const Wrapper = styled.div``;

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
