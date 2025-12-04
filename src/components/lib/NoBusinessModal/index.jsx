import React from "react";
import {
  StyledModal,
  ModalTitle,
  ModalContent,
  ModalButton,
  ModalText,
} from "./index.styles";

const BlockerModal = ({ visible, onClose, onCreateProfile }) => {
  return (
    <StyledModal
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={true}
      centered
      maskClosable={true}
    >
      <ModalTitle>Create Your Business Profile</ModalTitle>
      <ModalText>
        To enjoy the full features of Oosri, you need to create a business
        profile. This will allow you to access all our services and grow your
        business.
      </ModalText>
      <ModalButton onClick={onCreateProfile}>
        Create Business Profile
      </ModalButton>
    </StyledModal>
  );
};

export default BlockerModal;
