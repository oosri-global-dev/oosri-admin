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

  const isComplete = otp.length === 4;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Two-Factor Authentication</h2>
        <p className="sub__text">
          To complete your login, please enter the 4-digit verification code
          sent to your registered email. Always use the <strong>most recent</strong> code.
        </p>
        <div style={{ position: "relative", width: "100%" }}>
          <TextField
            className="text__field__otp"
            type="number"
            name="otp"
            maxLength={4}
            value={otp}
            onChange={(e) => setOTP(e?.target?.value ?? "")}
            placeholder="Enter 4-digit code"
          />
          <span style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            fontSize: ".75rem", color: isComplete ? "#16a34a" : "#9ca3af", pointerEvents: "none",
          }}>
            {otp.length}/4
          </span>
        </div>
        <Button
          backgroundColor="var(--oosriPrimary)"
          color="#fff"
          loading={loadingBtn}
          disabled={!isComplete || loadingBtn}
          onClick={() => isComplete && onVerify(otp)}
        >
          Proceed to Dashboard
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};
