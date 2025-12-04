import React, { useState } from "react";
import styled from "styled-components";
import TextField from "../TextField";
import Button from "../Button";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  user-select: none;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;

  .sub__text {
    font-size: 0.9rem;
  }

  .text__field__otp {
    margin: 10px 0 5px 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

export const VerifyModal = ({ isOpen, onClose, onVerify, loadingBtn }) => {
  const [otp, setOTP] = useState("");

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Two-Factor Authentication</h2>
        <p className="sub__text">
          To complete your login, please enter the 6-digit verification code
          sent to your registered email.
        </p>
        <TextField
          className="text__field__otp"
          type="number"
          name="otp"
          maxLength={4}
          value={otp}
          onChange={(e) => setOTP(e?.target?.value)}
          placeholder="Enter OTP"
        />
        <Button
          backgroundColor="var(--oosriPrimary)"
          color="#fff"
          loading={loadingBtn}
          onClick={() => onVerify(otp)}
        >
          Proceed to Dashboard
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};
