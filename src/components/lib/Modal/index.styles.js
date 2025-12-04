import styled from "styled-components";
import { Modal } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 0;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-footer {
    border-top: none;
    padding: 0 24px 24px;
  }

  @media (max-width: 768px) {
    .ant-modal-body {
      padding: 18px;
    }

    width: 90% !important;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    .ant-modal-body {
      padding: 14px;
    }

    width: 95% !important;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const ModalText = styled.p`
  font-size: 16px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const ModalContent = styled.p`
  font-size: 14px;
  color: #4d4d4d;
  margin-bottom: 24px;
`;

export const ModalButton = styled.button`
  background-color: var(--oosriPrimary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: white;
    color: var(--oosriPrimary);
    border: 1px solid var(--oosriPrimary);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;
